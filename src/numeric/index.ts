/* eslint-disable brace-style */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable fp/no-class */

export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type DigitNonZero = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type Increment<N extends Digit> = (
	N extends 0 ? 1
	: N extends 1 ? 2
	: N extends 2 ? 3
	: N extends 3 ? 4
	: N extends 4 ? 5
	: N extends 5 ? 6
	: N extends 6 ? 7
	: N extends 7 ? 8
	: N extends 8 ? 9
	: 9
)
export type Decrement<N extends Digit> = (
	N extends 9 ? 8
	: N extends 8 ? 7
	: N extends 7 ? 6
	: N extends 6 ? 5
	: N extends 5 ? 4
	: N extends 4 ? 3
	: N extends 3 ? 2
	: N extends 2 ? 1
	: N extends 1 ? 0
	: 0
)
export type DecrementNonZero<N extends DigitNonZero> = (N extends 9 ? 8
	: N extends 8 ? 7
	: N extends 7 ? 6
	: N extends 6 ? 5
	: N extends 5 ? 4
	: N extends 4 ? 3
	: N extends 3 ? 2
	: N extends 2 ? 1
	: 1
)

export type Int = number & { __int__: void }
export type Float = number & { __int__: void }

export function isIntegerString(value: string): boolean {
	const numberReSnippet = "(?:NaN|-?(?:(?:\\d+|\\d*\\.\\d+)(?:[E|e][+|-]?\\d+)?|Infinity))"
	const matchOnlyNumberRe = new RegExp("^(" + numberReSnippet + ")$")

	return matchOnlyNumberRe.test(value)
}

export function roundToInt(num: number): Int { return Math.round(num) as Int }
// const a: Int = 440 as Int
// const b: Int = 6 as Int
// const c: Int = 11 as Int
// const result: Int = roundToInt(a * (b / c))


export function isInteger(value: number): value is Int {
	return Number.isInteger(value)
}

export function isFloat(value: unknown): value is Float {
	const parsed = typeof value === "number"
		? value : Number.parseFloat(String(value))
	return (!Number.isNaN(parsed)) && (!Number.isInteger(parsed))
}

export function parseNumber(value: unknown): number | undefined {
	const parsed = typeof value === "number"
		? value
		: Number.parseFloat(String(value))
	return (!Number.isNaN(parsed)) ? parsed : undefined
}


