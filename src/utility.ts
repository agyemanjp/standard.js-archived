/* eslint-disable indent */
/* eslint-disable fp/no-rest-parameters */
/* eslint-disable brace-style */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Arr = any[]
export type Fx<Ret, Args extends Arr> = (...args: Args) => Ret
export type Primitive = number | string | bigint | boolean | symbol
export type Obj<TKey extends string = string, TValue = unknown> = { [key in TKey]: TValue }
export type RecursivePartial<T> = { [P in keyof T]?: T[P] extends Record<string, unknown> ? RecursivePartial<T[P]> : T[P] }
export type RecursiveRequired<T> = { [P in keyof T]-?: Required<T[P]> }
export type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T]
export type ArrayElementType<T> = T extends (infer U)[] ? U : T
export type ExtractByType<TObj, TType> = Pick<TObj, { [k in keyof TObj]-?: TObj[k] extends TType ? k : never }[keyof TObj]>
export type OptionalKeys<T extends Record<string, unknown>> = Exclude<{ [K in keyof T]: T extends Record<K, T[K]> ? never : K }[keyof T], undefined>
export type ExtractOptional<T extends Record<string, unknown>, K extends OptionalKeys<T> = OptionalKeys<T>> = Record<K, T[K]>
export type ArrayRecursive<T> = Array<T | ArrayRecursive<T>>
export type Tuple<X, Y> = [X, Y]
export const Tuple = class <X, Y>  { constructor(x: X, y: Y) { return [x, y] as Tuple<X, Y> } } as { new <X, Y>(x: X, y: Y): [X, Y] }

export type Int = number & { __int__: void }

/** `Guard` checks if a value is of a type. */
export type Guard<A, B extends A> = (value: A) => value is B

/** Option is a container, which is generic.
 * It has two sub - class, one is Some[T], the other is None.
 * You see its interface and will know everything.*/
type Option<T> = { isDefined: boolean; get: T; getOrElse(t: T): T; }

/** Determines if input argument has a value */
export function hasValue<T>(value?: T): value is T {
	switch (typeof value) {
		case "function":
		case "boolean":
		case "bigint":
		case "object":
		case "symbol":
			return (value !== null)
		case "undefined":
			return false
		case "number":
			return (value !== null && !isNaN(value) && !Number.isNaN(value) && value !== Number.NaN)
		case "string":
			return value !== undefined && value !== null && value.trim().length > 0 && !/^\s*$/.test(value)
		/*if(str.replace(/\s/g,"") == "") return false*/

		default:
			return Boolean(value)
	}
}

export function isFloat(value: unknown): boolean {
	const parsed = typeof value === "number"
		? value : Number.parseFloat(String(value))
	return (!Number.isNaN(parsed)) && (!Number.isInteger(parsed))
}

export function isIntegerString(value: string): boolean {
	const numberReSnippet = "(?:NaN|-?(?:(?:\\d+|\\d*\\.\\d+)(?:[E|e][+|-]?\\d+)?|Infinity))"
	const matchOnlyNumberRe = new RegExp("^(" + numberReSnippet + ")$")

	return matchOnlyNumberRe.test(value)
}
export function isIntegerStrict(value: number): value is Int {
	return Number.isInteger(value)
}
export const roundToInt = (num: number): Int => Math.round(num) as Int
// const a: Int = 440 as Int
// const b: Int = 6 as Int
// const c: Int = 11 as Int
// const result: Int = roundToInt(a * (b / c))

export function isNumber(x: unknown): x is number {
	return typeof x === "number" && !isNaN(x)
}

export function parseNumber(value: unknown): number | undefined {
	const parsed = typeof value === "number"
		? value
		: Number.parseFloat(String(value))
	return (!Number.isNaN(parsed)) ? parsed : undefined
}

/** Array type guard */
export function isArray<T, _>(val: Array<T> | _): val is _ extends Array<infer X> ? never : Array<T> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return hasValue(val)
		&& "length" in val
		&& typeof val.length === 'number'
		&& val.length >= 0
		&& val.length % 1 === 0
}
export function isArr(val: any): val is typeof val extends Array<infer X> ? Array<X> : Array<unknown> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return hasValue(val)
		&& "length" in val
		&& typeof val.length === 'number'
		&& val.length >= 0
		&& val.length % 1 === 0
}


// import { f1 } from "modular/module-1"
// import { m1_f1 } from "modular/module-folder"
// import { f2 } from "modular/module-folder/module-1"

