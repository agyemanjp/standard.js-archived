/* eslint-disable brace-style */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable fp/no-class */


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
