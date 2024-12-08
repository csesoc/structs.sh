from pathlib import Path

from debugger import Debugger, compile, Frame

here = Path(__file__).parent


async def test_fibonacci():
    source = here / "test_fibonacci.c"
    exe = here / "exe"
    assert source.exists()
    await compile(source, exe)

    debug = Debugger()

    inferior_output = list[str]()

    @debug.on_inferior
    def _(message: any) -> None:
        inferior_output.append(message)

    try:
        await debug.init(exe)
        assert await debug.functions() == ["fibonacci", "main"]

        await debug.breakpoint("main")
        await debug.breakpoint("fibonacci")
        await debug.run()
        assert await debug.frames() == [Frame("main", str(source), 16)]
        assert (await debug.variables()).keys() == {"n"}

        await debug.cont()
        assert [frame.func for frame in await debug.frames()] == [
            "fibonacci",
            "main",
        ]
        assert (await debug.variables()).keys() == {"n", "a", "b", "next"}

        await debug.next()
        await debug.next()
        await debug.next()
        assert (await debug.variables()).keys() == {"n", "a", "b", "next", "i"}

        frames, memory = await debug.trace()
        assert len(frames) == 2
        assert len(memory) == 6

        fibonacci = frames[(0, "fibonacci")]
        assert len(fibonacci) == 5
        assert fibonacci["i"].type == "int"
        assert fibonacci["i"].value == 1
        assert fibonacci["n"].type == "int"
        assert fibonacci["n"].value == 10
        assert fibonacci["a"].type == "int"
        assert fibonacci["a"].value == 0
        assert fibonacci["b"].type == "int"
        assert fibonacci["b"].value == 1
        assert fibonacci["next"].type == "int"
        assert fibonacci["next"].value == 0xBEEF

        main = frames[(1, "main")]
        assert len(main) == 1
        assert main["n"].type == "int"

        assert memory[fibonacci["i"].address, "int"].value == 1
        assert memory[fibonacci["n"].address, "int"].value == 10
        assert memory[fibonacci["a"].address, "int"].value == 0
        assert memory[fibonacci["b"].address, "int"].value == 1
        assert memory[fibonacci["next"].address, "int"].value == 0xBEEF
        assert memory[main["n"].address, "int"].value == 10

        await debug.finish()

    finally:
        await debug.deinit()
        exe.unlink()

    assert (
        "".join(inferior_output)
        == "Fibonacci sequence up to 10 terms:\r\n0 1 1 2 3 5 8 13 21 34 \r\n"
    )
