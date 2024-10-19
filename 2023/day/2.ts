export function solve(input: string) {
    const maxDie = {
	red: 12,
	green: 13,
	blue: 14
    } as const;

    const part1 = input.split("\n").filter(Boolean)
	.map(game => ({
	    id: Number(game.match(/Game (\d+):/)![1]),
	    red: Array.from(game.matchAll(/(\d+) red/g), match => Number(match[1])).reduce((max, cur) => max > cur ? max : cur),
	    blue: Array.from(game.matchAll(/(\d+) blue/g), match => Number(match[1])).reduce((max, cur) => max > cur ? max : cur),
	    green: Array.from(game.matchAll(/(\d+) green/g), match => Number(match[1])).reduce((max, cur) => max > cur ? max : cur)
	}))
	.reduce((sum, game) => {
	    const hasEnoughDie = (
		game.red <= maxDie.red &&
		game.blue <= maxDie.blue &&
		game.green <= maxDie.green
	    )

	    return sum + game.id * Number(hasEnoughDie)
	}, 0)

	return {part1}
}
