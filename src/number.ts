/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable fp/no-class */


export function isFloat(value: unknown): boolean {
	const parsed = typeof value === "number"
		? value : Number.parseFloat(String(value))
	return (!Number.isNaN(parsed)) && (!Number.isInteger(parsed))
}

export function isInteger(value: unknown): boolean {
	const parsed = typeof value === "number"
		? value : Number.parseFloat(String(value))
	return (!Number.isNaN(parsed)) && (Number.isInteger(parsed))
}

export function isNumber(x: unknown) {
	return typeof x === "number" && !isNaN(x)
}

export function parseNumber(value: unknown): number | undefined {
	const parsed = typeof value === "number"
		? value
		: Number.parseFloat(String(value))
	return (!Number.isNaN(parsed)) ? parsed : undefined
}

