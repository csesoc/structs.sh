from pprint import pp
from tempfile import mkstemp
from pathlib import Path
import logging
import os

from uvicorn import run
from socketio import AsyncServer
from socketio import ASGIApp

from debugger import Debugger, compile

logging.basicConfig(level=logging.INFO)
debug = logging.debug
info = logging.info
warning = logging.warning
error = logging.error
exception = logging.exception
critical = logging.critical


server = AsyncServer(async_mode="asgi", cors_allowed_origins="*")


class State:
    async def init(self, code: str):
        fd, path = mkstemp(suffix=".c")
        os.close(fd)
        self.source = Path(path)

        fd, path = mkstemp()
        os.close(fd)
        self.exe = Path(path)

        self.debugger = Debugger()

        self.source.write_text(code)
        await compile(self.source, self.exe)
        await self.debugger.init(self.exe)
        return self

    async def deinit(self):
        await self.debugger.deinit()
        self.exe.unlink()
        self.source.unlink()


state = dict[str, State]()


@server.event
async def connect(sid: str, environ: dict) -> None:
    info(f"[{sid}] connected")


@server.event
async def disconnect(sid: str) -> None:
    if sid in state:
        await state[sid].deinit()
        del state[sid]

    info(f"[{sid}] disconnected")


@server.event
async def echo(sid: str, data: any) -> None:
    info(f"[{sid}] received message '{data}', echoing back to client")
    await server.emit("echo", data=data, to=sid)


@server.event
async def mainDebug(sid: str, code: str) -> None:
    if sid in state:
        await state[sid].deinit()
        del state[sid]

    try:
        state[sid] = State()
        await state[sid].init(code)
    except AssertionError as e:
        info(f"[{sid}] failed to compile code")
        await server.emit("compileError", e.args[0][1].decode(), to=sid)
        return

    for func in await state[sid].debugger.functions():
        await state[sid].debugger.breakpoint(func)
    await state[sid].debugger.run()

    info(f"[{sid}] compiled code")
    await server.emit(
        "mainDebug", "Finished mainDebug event on server", to=sid
    )


@server.event
async def executeNext(sid: str) -> None:
    assert sid in state
    debugger = state[sid].debugger

    await debugger.next()
    info(f"[{sid}] run 'executeNext'")
    await server.emit(
        "executeNext", "Finished executeNext event on server-side", to=sid
    )

    # try to construct something that the frontend can understand
    result = dict[str, any]()
    frame = (await debugger.frames())[0]
    result["frame_info"] = {
        "file": frame.file,
        "function": frame.func,
        "line_num": frame.line,
    }
    frames, memory = await debugger.trace()
    result["stack_data"] = {
        k: {"addr": v.address, "typeName": v.type, "value": v.value}
        for k, v in next(iter(frames.values())).items()
    }
    result["heap_data"] = {
        addr: {"addr": addr, "typeName": v.type, "value": v.value}
        for (addr, _), v in reversed(memory.items())
        if "*" not in v.type and "struct" in v.type
    }
    await server.emit("sendBackendStateToUser", result, to=sid)


@server.event
async def EOF(sid: str) -> None:
    error("event 'EOF' not implemented")


@server.event
async def SIGINT(sid: str) -> None:
    error("event 'SIGINT' not implemented")


@server.event
async def send_stdin(sid: str) -> None:
    error("event 'send_stdin' not implemented")


app = ASGIApp(server)

if __name__ == "__main__":
    host = "0.0.0.0"
    port = 8000

    info(" /\\_/\\ ")
    info("( ^.^ )")
    info(" > ^ < ")
    info(f"Server is available at [http://{host}:{port}]")

    run("server:app", port=port, host=host, log_level="error")
