/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable fp/no-class */

export class stdNumber extends global.Number {
	constructor(num: number) {
		// eslint-disable-next-line fp/no-unused-expression
		super(num)
	}

	static isFloat(value: unknown): boolean {
		const parsed = typeof value === "number"
			? value : Number.parseFloat(String(value))
		return (!Number.isNaN(parsed)) && (!Number.isInteger(parsed))
	}

	static isInteger(value: unknown): boolean {
		const parsed = typeof value === "number"
			? value : Number.parseFloat(String(value))
		return (!Number.isNaN(parsed)) && (Number.isInteger(parsed))
	}

	static isNumber(x: unknown) {
		return typeof x === "number" && !isNaN(x)
	}

	static parse(value: unknown): number | undefined {
		const parsed = typeof value === "number"
			? value
			: Number.parseFloat(String(value))
		return (!Number.isNaN(parsed)) ? parsed : undefined
	}
}
