from collections import deque
from contextlib import suppress
from dataclasses import dataclass
from json import JSONDecodeError

from debugger import mion

from .base_debugger import BaseDebugger


@dataclass
class Frame:
    func: str
    file: str
    line: int


@dataclass
class Variable:
    type: str
    value: str
    address: str


@dataclass
class MemoryObject:
    type: str
    value: str


class Debugger(BaseDebugger):
    async def functions(self) -> list[str]:
        """
        Don't call this when the inferior process is already running,
        it returns many, many more functions than expected.
        """
        res = await self.run_command("-symbol-info-functions")
        return [sym["name"] for sym in res["symbols"]["debug"][0]["symbols"]]

    async def breakpoint(self, function: str) -> int:
        res = await self.run_command(f"-break-insert {function}")
        return int(res["bkpt"]["number"])

    async def run(self) -> None:
        await self.run_command("-exec-run")

    async def frames(self) -> list[Frame]:
        res = await self.run_command("-stack-list-frames")
        return [
            Frame(frame["func"], frame["file"], int(frame["line"]))
            for frame in res["stack"]
        ]

    async def next(self) -> None:
        await self.run_command("-exec-next")

    async def cont(self) -> None:
        await self.run_command("-exec-continue")

    async def finish(self) -> None:
        await self.run_command("-exec-finish")

    async def variables(self, frame: int = 0) -> dict[str, str]:
        res = await self.run_command(
            f"-stack-list-variables --thread 1 --frame {frame} --all-values"
        )
        return {local["name"]: local["value"] for local in res["variables"]}

    async def var_details(
        self, var: str, frame: int = 0
    ) -> tuple[str, str, str, list[tuple[str, str]]]:
        await self.run_command(f"-stack-select-frame {frame}")

        await self.run_command(f"-var-create VARIABLE * {var}")
        res = await self.run_command(f"-var-info-type VARIABLE")
        type = res["type"]

        res = await self.run_command("-var-list-children VARIABLE")
        childs = []
        if res["numchild"] != "0":
            childs.extend((c["exp"], c["type"]) for c in res["children"])
        await self.run_command("-var-delete VARIABLE")

        res = await self.run_command(f"-data-evaluate-expression {var}")
        if res.get("msg", "").startswith("Cannot access memory at address"):
            raise ValueError("Cannot access such memory. Is it initialised?")

        value = res["value"]
        with suppress(JSONDecodeError):
            value = mion.valueloads(res["value"])
        # if childs and isinstance(value, dict):
        #     # TODO: refactorme
        #     value = {
        #         k: {"value": v, "typeName": c[1]}
        #         for (k, v), c in zip(value.items(), childs)
        #     }

        res = await self.run_command(f"-data-evaluate-expression &{var}")
        # assert "value" in res, (res, variable, (type, children))
        address = res["value"].split(" ", 1)[0]

        await self.run_command(f"-stack-select-frame 0")
        return (type, value, address, childs)

    async def trace(self):
        def follow(var: str, type: str, children: list[tuple[str, str]]):
            queue = list[str]()
            for subname, subtype in children:
                if subtype == "char":
                    # Avoid insepcting each char in each string
                    continue
                if subname.startswith("*"):
                    # It is a pointer
                    queue.append(subname)
                elif subname.isdigit():
                    # It is an array index
                    queue.append(f"{var}[{subname}]")
                elif type.endswith("*"):
                    # It is a struct pointer
                    queue.append(f"(*{var})")
                else:
                    # It is a struct field
                    queue.append(f"({var}.{subname})")
            return queue

        frames: dict[tuple[int, str], dict[str, Variable]] = {}
        addresses: dict[tuple[str, str], MemoryObject] = {}

        for i, frame in enumerate(await self.frames()):
            frames[(i, frame.func)] = {}
            queue = deque()

            for var in await self.variables(i):
                type, value, address, children = await self.var_details(var, i)
                frames[(i, frame.func)][var] = Variable(type, value, address)
                addresses[(address, type)] = MemoryObject(type, value)
                if value != "0x0" and type != "void *":
                    queue.extend(follow(var, type, children))

            while queue:
                var = queue.popleft()
                try:
                    type, value, address, children = await self.var_details(
                        var, i
                    )
                except ValueError:
                    continue

                if (address, type) in addresses:
                    continue

                addresses[(address, type)] = MemoryObject(type, value)
                if value != "0x0" and type != "void *":
                    queue.extend(follow(var, type, children))

        return frames, addresses
