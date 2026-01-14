from enum import Enum, StrEnum
from typing import Callable


class Signal(Enum):
    BREAK = 0
    PASS = 1


class Operation(StrEnum):
    ACC = 'acc'
    JMP = 'jmp'
    NOP = 'nop'


class Instruction:
    def __init__(self, op: Operation, arg: int):
        self.op = op
        self.arg = arg
        self.executed = False


class Context:
    def __init__(self, program: list[Instruction]):
        self.program = program
        self.acc = self.idx = 0
        self.stacktrace = []


def part1(data: str) -> int:
    program = parse_input(data)
    return run_program(program, break_before_loop)


def part2(data: str) -> int:
    program = parse_input(data)
    return run_program(program, backtrack_before_loop)


def parse_input(data: str) -> list[Instruction]:
    return [Instruction(Operation(op), int(arg)) for op, arg in (line.split() for line in data.splitlines())]


def break_before_loop(context: Context) -> Signal:
    return Signal.BREAK if context.program[context.idx].executed else Signal.PASS


def backtrack_before_loop(context: Context) -> Signal:
    instr = context.program[context.idx]

    if instr.executed:
        context.idx, instr, context.acc = context.stacktrace.pop()
        instr.op = Operation.NOP if instr.op == Operation.JMP else Operation.JMP
    elif instr.op in {Operation.JMP, Operation.NOP}:
        context.stacktrace.append((context.idx, instr, context.acc))

    return Signal.PASS


def run_program(program: list[Instruction], callback: Callable[[Context], Signal]) -> int:
    context = Context(program)

    while context.idx < len(program) and callback(context) is Signal.PASS:
        instr = program[context.idx]
        context.acc += instr.arg if instr.op is Operation.ACC else 0
        context.idx += instr.arg if instr.op is Operation.JMP else 1
        instr.executed = True

    return context.acc
