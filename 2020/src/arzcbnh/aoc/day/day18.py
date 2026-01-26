def part1(data: str) -> int:
    return answer_homework(data, False)


def part2(data: str) -> int:
    return answer_homework(data, True)


def answer_homework(data: str, precede_addition: bool) -> int:
    expressions = (tokenize(line) for line in data.splitlines())
    postfixes = (get_postfix(expression, {'*': 0, '+': int(precede_addition)}) for expression in expressions)
    results = (eval_postfix(postfix) for postfix in postfixes)

    return sum(results)


def tokenize(line: str) -> list[int | str]:
    tokens = []
    i = 0

    while i < len(line):
        if line[i].isdigit():
            num = ''

            while i < len(line) and line[i].isdigit():
                num += line[i]
                i += 1

            tokens.append(int(num))
        elif line[i] in '+*()':
            tokens.append(line[i])
            i += 1
        else:
            i += 1

    return tokens


def get_postfix(expression: list[int | str], precedence: dict[str, int]) -> list[int | str]:
    out, ops = [], []

    for token in expression:
        if isinstance(token, int):
            out.append(token)
        elif len(ops) > 0 and token in '+*' and ops[-1] in '+*' and precedence[token] <= precedence[ops[-1]]:
            while len(ops) > 0 and ops[-1] in '+*' and precedence[token] <= precedence[ops[-1]]:
                out.append(ops.pop())
            ops.append(token)
        elif token == ')':
            while (op := ops.pop()) != '(':
                out.append(op)
        else:
            ops.append(token)

    ops.reverse()

    return out + ops


def eval_postfix(expression: list[int | str]) -> int:
    result = []

    for token in expression:
        if isinstance(token, int):
            result.append(token)
        elif token == '+':
            result.append(result.pop() + result.pop())
        else:
            result.append(result.pop() * result.pop())

    return result[0]
