/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable indent */
/* eslint-disable fp/no-rest-parameters */
/* eslint-disable brace-style */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Arr = any[]
export type Fx<Ret, Args extends Arr> = (...args: Args) => Ret
export type Primitive = number | string | bigint | boolean | symbol
export type Obj<TValue = unknown, TKey extends string = string> = { [key in TKey]: TValue }
// export type Obj<TKey extends string = string, TValue = unknown> = { [key in TKey]: TValue }
export type RecursivePartial<T> = { [P in keyof T]?: T[P] extends Record<string, unknown> ? RecursivePartial<T[P]> : T[P] }
export type RecursiveRequired<T> = { [P in keyof T]-?: Required<T[P]> }
export type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T]
export type ArrayElementType<T> = T extends (infer U)[] ? U : T
export type OptionalKeys<T> = { [k in keyof T]: undefined extends T[k] ? k : never }[keyof T]
export type ExtractOptional<T> = { [k in OptionalKeys<T>]?: T[k] }
export type KeysByType<T, K> = { [k in keyof T]: K extends T[k] ? k : never }[keyof T]
export type ExtractByType<T, K> = { [k in KeysByType<T, K>]: T[k] }
// const obj = { str: "" as string | undefined, num: 1, b: true, arr: [1, 2, 3], o: { x: null } }
// const extract: ExtractByType<typeof obj, string> = {str: "", num:1}
export type ArrayRecursive<T> = Array<T | ArrayRecursive<T>>
export type Tuple<X, Y> = [X, Y]
export const Tuple = class <X, Y>  { constructor(x: X, y: Y) { return [x, y] as Tuple<X, Y> } } as { new <X, Y>(x: X, y: Y): [X, Y] }

export type Int = number & { __int__: void }
export type Float = number & { __int__: void }

/** `Guard` checks if a value is of a type. */
export type TypeGuard<A, B extends A> = (value: A) => value is B

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

/** Returns the object type of the given payload
 * @param {*} payload
 * @returns {string}
 */
export function getType(payload: any): string {
	return Object.prototype.toString.call(payload).slice(8, -1)
}

//#region Number functions
export function isIntegerString(value: string): boolean {
	const numberReSnippet = "(?:NaN|-?(?:(?:\\d+|\\d*\\.\\d+)(?:[E|e][+|-]?\\d+)?|Infinity))"
	const matchOnlyNumberRe = new RegExp("^(" + numberReSnippet + ")$")

	return matchOnlyNumberRe.test(value)
}
export const roundToInt = (num: number): Int => Math.round(num) as Int
// const a: Int = 440 as Int
// const b: Int = 6 as Int
// const c: Int = 11 as Int
// const result: Int = roundToInt(a * (b / c))
//#endregion


export function parseNumber(value: unknown): number | undefined {
	const parsed = typeof value === "number"
		? value
		: Number.parseFloat(String(value))
	return (!Number.isNaN(parsed)) ? parsed : undefined
}

//#region Type Guards

export function isInteger(value: number): value is Int {
	return Number.isInteger(value)
}
export function isFloat(value: unknown): value is Float {
	const parsed = typeof value === "number"
		? value : Number.parseFloat(String(value))
	return (!Number.isNaN(parsed)) && (!Number.isInteger(parsed))
}

/** Returns whether the payload is undefined
 * @param {*} payload
 * @returns {payload is undefined}
 */
export function isUndefined(payload: any): payload is undefined {
	return getType(payload) === 'Undefined'
}

/** Returns whether the payload is null
 * @param {*} payload
 * @returns {payload is null}
 */
export function isNull(payload: any): payload is null {
	return getType(payload) === 'Null'
}

/** Returns whether the payload is a plain JavaScript object (excluding special classes or objects with other prototypes)
 * @param {*} payload
 * @returns {payload is {[key: string]: any}}
 */
export function isObject(payload: any): payload is { [key: string]: any } {
	if (getType(payload) !== 'Object') return false
	return payload.constructor === Object && Object.getPrototypeOf(payload) === Object.prototype
}

/** Returns whether the payload is a an empty object (excluding special classes or objects with other prototypes)
 * @param {*} payload
 * @returns {payload is {}}
 */
export function isEmptyObject(payload: any): payload is {} {
	return isObject(payload) && Object.keys(payload).length === 0
}

/** Returns whether the payload is an object like a type passed in < >
 * Usage: isObjectLike<{id: any}>(payload) // will make sure it's an object and has an `id` prop.
 * @template T this must be passed in < >
 * @param {*} payload
 * @returns {payload is T}
 */
export function isObjectLike<T extends Object>(payload: any): payload is T {
	return isObject(payload)
}

/** Returns whether the payload is a function
 * @param {*} payload
 * @returns {payload is Function}
 */
export function isFunction(payload: any): payload is Function {
	return getType(payload) === 'Function'
}

/** Returns whether the payload is an array
 * @param {*} payload
 * @returns {payload is undefined}
 */
export function isArray(payload: any): payload is any[] {
	return getType(payload) === 'Array'
}
export function isArrayLike(val: any): val is typeof val extends Array<infer X> ? Array<X> : Array<unknown> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return hasValue(val)
		&& "length" in val
		&& typeof val.length === 'number'
		&& val.length >= 0
		&& val.length % 1 === 0
}

/** Returns whether the payload is a an empty array
 * @param {*} payload
 * @returns {payload is []}
 */
export function isEmptyArray(payload: any): payload is [] {
	return isArray(payload) && payload.length === 0
}

/** Returns whether the payload is a string
 * @param {*} payload
 * @returns {payload is string}
 */
export function isString(payload: any): payload is string {
	return getType(payload) === 'String'
}

/** Returns whether the payload is a string, BUT returns false for ''
 * @param {*} payload
 * @returns {payload is string}
 */
export function isFullString(payload: any): payload is string {
	return isString(payload) && payload !== ''
}

/** Returns whether the payload is ''
 * @param {*} payload
 * @returns {payload is string}
 */
export function isEmptyString(payload: any): payload is string {
	return payload === ''
}

/** Returns whether the payload is a number
 * This will return false for NaN
 * @param {*} payload
 * @returns {payload is number}
 */
export function isNumber(payload: any): payload is number {
	return getType(payload) === 'Number' && !isNaN(payload)
}

/** Returns whether the payload is a boolean
 * @param {*} payload
 * @returns {payload is boolean}
 */
export function isBoolean(payload: any): payload is boolean {
	return getType(payload) === 'Boolean'
}

/** Returns whether the payload is a regular expression (RegExp)
 *
 * @param {*} payload
 * @returns {payload is RegExp}
 */
export function isRegExp(payload: any): payload is RegExp {
	return getType(payload) === 'RegExp'
}

/** Returns whether the payload is a Map
 * @param {*} payload
 * @returns {payload is Map}
 */
export function isMap(payload: any): payload is Map<any, any> {
	return getType(payload) === 'Map'
}

/** Returns whether the payload is a WeakMap
 * @param {*} payload
 * @returns {payload is WeakMap}
 */
export function isWeakMap(payload: any): payload is WeakMap<any, any> {
	return getType(payload) === 'WeakMap'
}

/** Returns whether the payload is a Set
 * @param {*} payload
 * @returns {payload is Set}
 */
export function isSet(payload: any): payload is Set<any> {
	return getType(payload) === 'Set'
}

/** Returns whether the payload is a WeakSet
 * @param {*} payload
 * @returns {payload is WeakSet}
 */
export function isWeakSet(payload: any): payload is WeakSet<any> {
	return getType(payload) === 'WeakSet'
}

/** Returns whether the payload is a Symbol
 * @param {*} payload
 * @returns {payload is symbol}
 */
export function isSymbol(payload: any): payload is symbol {
	return getType(payload) === 'Symbol'
}

/** Returns whether the payload is a Date, and that the date is valid
 * @param {*} payload
 * @returns {payload is Date}
 */
export function isDate(payload: any): payload is Date {
	return getType(payload) === 'Date' && !isNaN(payload)
}

/** Returns whether the payload is a Blob
 * @param {*} payload
 * @returns {payload is Blob}
 */
export function isBlob(payload: any): payload is Blob {
	return getType(payload) === 'Blob'
}

/** Returns whether the payload is a File
 * @param {*} payload
 * @returns {payload is File}
 */
export function isFile(payload: any): payload is File {
	return getType(payload) === 'File'
}

/** Returns whether the payload is a Promise
 * @param {*} payload
 * @returns {payload is Promise}
 */
export function isPromise(payload: any): payload is Promise<any> {
	return getType(payload) === 'Promise'
}

/** Returns whether the payload is an Error
 * @param {*} payload
 * @returns {payload is Error}
 */
export function isError(payload: any): payload is Error {
	return getType(payload) === 'Error'
}

/** Returns whether the payload is `NaN` but also a `number`
 * @param {*} payload
 * @returns {payload is typeof NaN}
 */
export function isNaNValue(payload: any): payload is typeof NaN {
	return getType(payload) === 'Number' && isNaN(payload)
}

/** Returns whether the payload is a primitive type (eg. Boolean | Null | Undefined | Number | String | Symbol)
 * @param {*} payload
 * @returns {(payload is boolean | null | undefined | number | string | symbol)}
 */
export function isPrimitive(payload: any): payload is boolean | null | undefined | number | string | symbol {
	return (
		isBoolean(payload) ||
		isNull(payload) ||
		isUndefined(payload) ||
		isNumber(payload) ||
		isString(payload) ||
		isSymbol(payload)
	)
}

/** Returns true whether the payload is null or undefined
 * @param {*} payload
 * @returns {(payload is null | undefined)}
 */
export function isNullOrUndefined(payload: any): payload is null | undefined {
	return isNull(payload) || isUndefined(payload)
}

/** Does a generic check to check that the given payload is of a given type.
 * In cases like Number, it will return true for NaN as NaN is a Number (thanks javascript!);
 * It will, however, differentiate between object and null
 * @template T
 * @param {*} payload
 * @param {T} type
 * @throws {TypeError} Will throw type error if type is an invalid type
 * @returns {payload is T}
 */
export function isType<T extends Function>(payload: any, type: T): payload is T {
	if (!(type instanceof Function)) {
		throw new TypeError('Type must be a function')
	}
	if (!Object.prototype.hasOwnProperty.call(type, 'prototype')) {
		throw new TypeError('Type is not a class')
	}
	// Classes usually have names (as functions usually have names)
	const name: string | undefined | null = (type as any).name
	return getType(payload) === name || Boolean(payload && payload.constructor === type)
}


//#endregion

