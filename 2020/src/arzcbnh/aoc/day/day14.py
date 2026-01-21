def part1(data: str) -> int:
    program = parse_input(data)
    mem = run_program_v1(program)
    return sum(mem.values())


def part2(data: str) -> int:
    program = parse_input(data)
    mem = run_program_v2(program)
    return sum(mem.values())


def parse_input(data: str) -> list[tuple[str, str, None] | tuple[str, int, int]]:
    program = []

    for line in data.splitlines():
        if line[:3] == 'mem':
            bracket_end_i = line.index(']')
            mem_addr = int(line[4:bracket_end_i])
            value = int(line[bracket_end_i + 4 :])
            program.append(('mem', mem_addr, value))
        else:
            program.append(('mask', line[7:], None))

    return program


def run_program_v1(program: list[tuple[str, str, None] | tuple[str, int, int]]) -> dict[int, int]:
    mem = {}
    or_mask = 0
    and_mask = 1

    for inst in program:
        if inst[0] == 'mem':
            _, addr, value = inst
            mem[addr] = value & and_mask | or_mask
        else:
            _, mask, _ = inst
            or_mask = int(mask.replace('X', '0'), base=2)
            and_mask = int(mask.replace('X', '1'), base=2)

    return mem


def run_program_v2(program: list[tuple[str, str, None] | tuple[str, int, int]]) -> dict[int, int]:
    mem = {}
    mask = '0' * 36

    for inst in program:
        if inst[0] == 'mem':
            _, addr, value = inst
            for decoded in decode_address(addr, mask):
                mem[decoded] = value
        else:
            _, mask, _ = inst

    return mem


def decode_address(addr: int, mask: str) -> list[int]:
    decoded = [addr]

    for i, char in enumerate(reversed(mask)):
        if char == 'X':
            for j in range(len(decoded)):
                decoded[j] |= 1 << i
                decoded.append(decoded[j] & ~(1 << i))
        elif char == '1':
            for j in range(len(decoded)):
                decoded[j] |= 1 << i

    return decoded
