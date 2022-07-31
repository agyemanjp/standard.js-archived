/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable indent */
/* eslint-disable fp/no-rest-parameters */
/* eslint-disable brace-style */


/*type IsAnyOld<T> = (T extends {} ? 1 : 0) extends (0 | 1)
	? (0 | 1) extends (T extends {} ? 1 : 0)
	? undefined extends T
	? "false"
	: "true"
	: "false"
	: "false"
*/

/** Tests for whether a type is exactly <any>. Fails for types that are extended by <unknown> */
type IsAny<T> = ((Exclude<any, T> extends (never) ? 1 : 0) extends (0 | 1)
	? (0 | 1) extends (Exclude<any, T> extends never ? 1 : 0)
	? "false"
	: "true"
	: "true"
)

const test_any_any: IsAny<(any)> = "true"
const test_any_union: IsAny<(string | undefined)> = "false"
const test_any_never: IsAny<(never)> = "false"
const test_any_undefined: IsAny<(undefined)> = "false"
const test_any_obj: IsAny<({})> = "false"
const test_any_num: IsAny<(number)> = "false"
const test_any_arr: IsAny<(Array<any>)> = "false"
const test_any_tuple: IsAny<[number, Array<any>]> = "false"
const test_any_tuple_unknown: IsAny<[unknown, any]> = "false"

// Failing
// const test_any_unknown: IsAny<(unknown)> = "false"
// const test_any_unknown_union: IsAny<(number | unknown)> = "false"


export type TypeAssert<T1, T2> = (
	"true" extends IsAny<T1>
	? "true" extends IsAny<T2>
	? "true"
	: "false"
	: "true" extends IsAny<T2>
	? "false"
	: [T1, T2] extends [T2, T1]
	? "true"
	: "false"
)

export type Fx<Ret, Args extends any[]> = (...args: Args) => Ret
export type ArgsType<F extends (...x: any[]) => any> = F extends (...x: infer A) => any ? A : never
export type Primitive = number | string | bigint | boolean | symbol
export type Obj<TValue = unknown, TKey extends string | number = string> = { [key in TKey]: TValue }
export type ValueOf<O> = O[keyof O]
export type RecursivePartial<T> = { [P in keyof T]?: T[P] extends Record<string, unknown> ? RecursivePartial<T[P]> : T[P] }
export type RecursiveRequired<T> = { [P in keyof T]-?: Required<T[P]> }
export type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T]

export type OptionalKeys<T> = { [k in keyof T]: undefined extends T[k] ? k : never }[keyof T]
export type ExtractOptional<T> = { [k in OptionalKeys<T>]?: T[k] }
export type KeysByType<T, K> = { [k in keyof T]: K extends T[k] ? k : never }[keyof T]
export type ExtractByType<T, K> = { [k in KeysByType<T, K>]: T[k] }

export type UnwrapArray<T> = T extends Array<infer X> ? X : T
export type UnwrapArrayRecursive<A> = A extends unknown[] ? UnwrapArrayRecursive<A[number]> : A;

export type UnwrapPromise<P> = P extends Promise<infer T> ? T : P
export type UnwrapPromiseRecursive<P> = P extends Promise<infer T> ? UnwrapPromiseRecursive<T> : P

const test_UnwrapArrayRecursive: TypeAssert<UnwrapArrayRecursive<number[][][]>, number> = "true"
const test_UnwrapPromiseRecursive: TypeAssert<UnwrapPromiseRecursive<Promise<Promise<number>>>, number> = "true"


/** Checks and asserts checks that a value is of a type. */
export type TypeGuard<A, B extends A> = (value: A) => value is B

export type ArrayRecursive<T> = Array<T | ArrayRecursive<T>>
export type ArrayElementType<T> = T extends (infer U)[] ? U : T

export type Tuple<X, Y> = [X, Y]
export const Tuple = class <X, Y>  {
	constructor(x: X, y: Y) { return [x, y] as Tuple<X, Y> }
} as { new <X, Y>(x: X, y: Y): [X, Y] }

export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type DigitNonZero = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

// export type Collection<T> = Iterable<T> | Generator<T>
// export type CollectionAsync<T> = AsyncIterable<T> | AsyncGenerator<T> | Iterable<T> | Generator<T>

/** Type of tail of array */
export type Tail<L extends ReadonlyArray<any>> = ((...t: L) => any) extends ((head: any, ...tail: infer LTail) => any) ? LTail : never
export type Head<L extends ReadonlyArray<any>> = L extends [...(infer head), infer tail] ? head : never

/** Type of last element of array */
export type Last<Arr extends Array<any>> = Arr[Tail<Arr>["length"]]
/** Type of first element of array */
export type First<Arr extends Array<any>> = Arr[0]

export type ToCamel<S extends string> = S extends `${infer head}_${infer tail}` ? `${head}${Capitalize<ToCamel<tail>>}` : S;
export type Concat<A extends string, B extends string> = `${A}${B}`
const test_concat: TypeAssert<Concat<"auth.com/:cat/api", "/:app/verify">, "auth.com/:cat/api/:app/verify"> = "true"

export type Merge<A, B> = (
	undefined extends A
	? B
	: undefined extends B
	? A
	: null extends A
	? B
	: null extends B
	? A
	: A extends Primitive
	? B
	: B extends Primitive
	? A
	: _Merge<A, B>
)
type _Merge<T, U> = { [K in (keyof T) | (keyof U)]: Merge<K extends keyof T ? T[K] : undefined, K extends keyof U ? U[K] : undefined> };

export type Merge1<A> = A
export type Merge2<A, B> = Merge<A, B>
export type Merge3<A, B, C> = Merge<A, Merge<B, C>>
export type Merge4<A, B, C, D> = Merge<A, Merge<B, Merge<C, D>>>
export type Merge5<A, B, C, D, E> = Merge<A, Merge<B, Merge<C, Merge<D, E>>>>
// export type MergeReduce<A extends ReadonlyArray<any> = any[]> = Array<A["length"] extends 1 ? A[0] : Merge<A[0], MergeReduce<A>>>
// type M<a extends ReadonlyArray<any>> = Unwrap<MergeReduce<a>>
// type test = M<[1, 2]>


/** Determines if input argument has a value */
export function hasValue<T>(value?: T | null | undefined): value is T {
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
			return (value !== null && !isNaN(value) && !Number.isNaN(value) /*&& value !== Number.NaN*/)
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

/** Assert that input key argument is a key of input obj arguments */
export function isKeyOf(key: any, obj: Obj, caseSensitive = true): key is keyof typeof obj {
	if (isString(key))
		return caseSensitive
			? Object.keys(obj).includes(key)
			: Object.keys(obj).map(k => k.toUpperCase()).includes(key.toUpperCase())
	else
		return false
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
	//if (getType(payload) !== 'Object') return false
	//return payload.constructor === Object && Object.getPrototypeOf(payload) === Object.prototype

	// eslint-disable-next-line no-unreachable
	if (typeof payload === "object" && payload !== null) {
		if (typeof Object.getPrototypeOf === "function") {
			const prototype = Object.getPrototypeOf(payload)
			return prototype === Object.prototype || prototype === null
		}

		return Object.prototype.toString.call(payload) === "[object Object]"
	}
	return false

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

// type Iter<X> = Iterable<X> | AsyncIterable<X>

/** Iterable (or async iterable) type guard */
export function isIterable<T>(value: T): value is T extends Iterable<any> | AsyncIterable<any> ? T : never {
	try {
		return isAsyncIterable(value) || (typeof (value as any)[Symbol.iterator] === 'function')
	}
	catch {
		return false
	}
}

/** AsyncIterable type guard */
export function isAsyncIterable<T>(val: T): val is T extends AsyncIterable<any> ? T : never {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	try {
		return typeof (val as any)[Symbol.asyncIterator] === "function"
	}
	catch {
		return false
	}
}

/** Generator type guard */
export function isGenerator<T>(val: T): val is T extends Generator<any> | AsyncGenerator<any> ? T : never {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	try {
		return isAsyncGenerator(val) || ((isIterable(val) && "next" in val && typeof (val as any).next === "function"))
	}
	catch {
		return false
	}
}

/** AsyncIterable type guard */
export function isAsyncGenerator<T>(val: T): val is T extends AsyncGenerator<any> ? T : never {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	try {
		return isAsyncIterable(val) && ("next" in val) && (typeof (val as any).next === "function")
	}
	catch {
		return false
	}
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

/** Returns whether the payload is an empty array
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

export const stringify = (x: unknown) => JSON.stringify(x, (_, val) => typeof val === "function" ? `[Function ${val.name}]` : val, 2)
