
/** Tests for whether a type is exactly <any>. Fails for types that are extended by <unknown> */
export type IsAny<T> = ((Exclude<any, T> extends (never) ? 1 : 0) extends (0 | 1)
	? (0 | 1) extends (Exclude<any, T> extends never ? 1 : 0)
	? "false"
	: "true"
	: "true"
)
/** Tests for whether a type is the same as another type. Fails for types that are extended by <unknown> */
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

export type Fx<Ret, Args extends unknown[]> = (...args: Args) => Ret
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type ArgsType<F extends (...x: any[]) => any> = F extends (...x: infer A) => unknown ? A : never

export type Atomic = PrimitiveX | Function
export type PrimitiveX = Primitive | bigint | symbol
// export type NullablePrimitive = Primitive | null
export type Primitive = string | number | boolean

/** Record of primitive values with string keys  */
export type Rec<TValue = unknown, TKey extends string = string> = { [key in TKey]: TValue }
/** Mapped record */
export type RecordMap<V, T extends Rec> = { [k in keyof T]: V }
/** Empty record */
export type RecEmpty = { [k in never]: never }

export type KeyOf<O> = O extends Rec<unknown, infer K> ? K : unknown
export type ValueOf<O> = O[keyof O]

export type RecursivePartial<T> = { [P in keyof T]?: T[P] extends Record<string, unknown> ? RecursivePartial<T[P]> : T[P] }
export type ReadonlyRecursive<T> = T extends Rec ? Readonly<{ [key in keyof T]: ReadonlyRecursive<T[key]> }> : Readonly<T>
export type RecursiveRequired<T> = { [P in keyof T]-?: Required<T[P]> }
export type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T]

export type OptionalKeys<T> = { [k in keyof T]: undefined extends T[k] ? k : never }[keyof T]
export type ExtractOptional<T> = { [k in OptionalKeys<T>]?: T[k] }
export type KeysByType<T, K> = { [k in keyof T]: K extends T[k] ? k : never }[keyof T]

/** Constructs a Record type that only includes shared properties between `A` and
 * `B`. If the value of a key is different in `A` and `B`, `SharedProperties<A,
 * B>` attempts to choose a type that is assignable to the types of both values.
 *
 * Note that this is NOT equivalent to `A & B`.
 *
 * @example
 * ```ts
 * type A = { x: string; y: string; }
 * type B = { y: string; z: string }
 * type C = { y: string | number; }
 *
 * A & B                  // => { x: string; y: string; z: string; }
 * SharedProperties<A, B> // => { y: string; }
 * SharedProperties<B, C> // => { y: string | number; }
 * ```
 */
export type SharedProperties<A, B> = OmitNever<Pick<A & B, keyof A & keyof B>>
/** Omits properties that have type `never`. Utilizes key-remapping introduced in
 * TS4.1.
 *
 * @example
 * ```ts
 * type A = { x: never; y: string; }
 * OmitNever<A> // => { y: string; }
 * ```
 */
type OmitNever<T extends Record<string, unknown>> = { [K in keyof T as T[K] extends never ? never : K]: T[K] }

/** Extracts a part of a record type that has values matching a specific type
 * @argument T The original record type
 * @argument K The type of values to extract
 */
export type ExtractByType<T, K> = { [k in KeysByType<T, K>]: T[k] }

export type UnwrapArray<T> = T extends Array<infer X> ? X : T
export type UnwrapArrayRecursive<A> = A extends unknown[] ? UnwrapArrayRecursive<A[number]> : A
const test_UnwrapArrayRecursive: TypeAssert<UnwrapArrayRecursive<number[][][]>, number> = "true"

export type UnwrapPromise<P> = P extends Promise<infer T> ? T : P
export type UnwrapPromiseRecursive<P> = P extends Promise<infer T> ? UnwrapPromiseRecursive<T> : P
const test_UnwrapPromiseRecursive: TypeAssert<UnwrapPromiseRecursive<Promise<Promise<number>>>, number> = "true"

/** Checks and asserts checks that a value is of a type. */
export type TypeGuard<A, B extends A> = (value: A) => value is B

export type ArrayRecursive<T> = Array<T | ArrayRecursive<T>>
export type IterableRecursive<T> = Iterable<T | IterableRecursive<T>>
export type ArrayElementType<T> = T extends (infer U)[] ? U : T

export type Tuple<X, Y> = [X, Y]
export const Tuple = class <X, Y> {
	// biome-ignore lint/correctness/noConstructorReturn: <explanation>
	constructor(x: X, y: Y) { return [x, y] as Tuple<X, Y> }
} as { new <X, Y>(x: X, y: Y): [X, Y] }

/** Type of tail of array */
export type Tail<L extends ReadonlyArray<unknown>> = ((...t: L) => unknown) extends ((head: unknown, ...tail: infer LTail) => unknown) ? LTail : never
/** Type of head of array */
export type Head<L extends ReadonlyArray<unknown>> = L extends [infer head, ...infer tail] ? head : never

/** Type of last element of array */
export type Last<Arr extends Array<unknown>> = Arr[Tail<Arr>["length"]]
/** Type of first element of array */
export type First<Arr extends Array<unknown>> = Arr[0]

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
type _Merge<T, U> = { [K in (keyof T) | (keyof U)]: Merge<K extends keyof T ? T[K] : undefined, K extends keyof U ? U[K] : undefined> }
export type Merge1<A> = A
export type Merge2<A, B> = Merge<A, B>
export type Merge3<A, B, C> = Merge<A, Merge<B, C>>
export type Merge4<A, B, C, D> = Merge<A, Merge<B, Merge<C, D>>>
export type Merge5<A, B, C, D, E> = Merge<A, Merge<B, Merge<C, Merge<D, E>>>>

/** Determines if input argument has a value */
export function hasValue<T>(value?: T | null | undefined, deep?: "deep"): value is T {
	if (deep === "deep") {
		switch (typeof value) {
			case "function":
			case "boolean":
			case "bigint":
			case "symbol":
				return true
			case "object":
				return (value !== null)
			case "undefined":
				return false
			case "number":
				return (value !== null && !Number.isNaN(value) && !Number.isNaN(value) /*&& value !== Number.NaN*/)
			case "string":
				return value !== undefined && value !== null && value.trim().length > 0 && !/^\s*$/.test(value)
			default:
				return Boolean(value)
		}
	}

	return value !== null && value !== undefined
}
/** Determines in input has non-trivial value. E.g., 
 * for strings, whether the value is not whitespace, and
 * for number, whether the value is not NaN
 */
export function hasProperValue<T>(value?: T | null | undefined | undefined): value is T {
	switch (typeof value) {
		case "number":
			return hasValue(value) && Number.isNaN(value) === false
		case "string":
			return hasValue(value) && value.trim().length > 0 && !/^\s*$/.test(value)
		default:
			return hasValue(value)
	}
}

/** Returns the object type of the given payload
 * @param {*} payload
 * @returns {string}
 */
export function getType(payload: unknown): string {
	return Object.prototype.toString.call(payload).slice(8, -1)
}

/** Assert that input key argument is a key of input obj arguments */
export function isKeyOf(key: unknown, obj: Rec, caseSensitive = true): key is keyof typeof obj {
	if (isString(key)) {
		return caseSensitive
			? Object.keys(obj).includes(key)
			: Object.keys(obj).map(k => k.toUpperCase()).includes(key.toUpperCase())
	}
	return false
}

/** Returns whether the payload is undefined
 * @param {*} payload
 * @returns {payload is undefined}
 */
export function isUndefined(payload: unknown): payload is undefined {
	return getType(payload) === 'Undefined'
}

/** Returns whether the payload is null
 * @param {*} payload
 * @returns {payload is null}
 */
export function isNull(payload: unknown): payload is null {
	return getType(payload) === 'Null'
}

/** Returns whether the payload is a plain JavaScript object (excluding special classes or objects with other prototypes)
 * @param {*} payload
 * @returns {payload is {[key: string]: any}}
 */
export function isObject(payload: unknown): payload is { [key: string]: unknown } {
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
export function isEmptyObject(payload: unknown): payload is {} {
	return isObject(payload) && Object.keys(payload).length === 0
}

/** Returns whether the payload is an object like a type passed in < >
 * Usage: isObjectLike<{id: any}>(payload) // will make sure it's an object and has an `id` prop.
 * @template T this must be passed in < >
 * @param {*} payload
 * @returns {payload is T}
 */
export function isObjectLike<T extends Object>(payload: unknown): payload is T {
	return isObject(payload)
}

/** Returns whether the payload is a function
 * @param {*} payload
 * @returns {payload is Function}
 */
export function isFunction(payload: unknown): payload is (...args: unknown[]) => unknown {
	return getType(payload) === 'Function'
}

/** Iterable type guard */
export function isIterable<T>(val?: Iterable<T> | Exclude<unknown, Iterable<T>>, excludeString = true): val is Iterable<T> {
	return hasValue(val) &&
		((excludeString === false) || (typeof val !== "string")) &&
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		(typeof (val as any)[Symbol.iterator] === 'function')
}

/** AsyncIterable type guard */
export function isAsyncIterable<T>(val?: T): val is T extends AsyncIterable<unknown> ? T : never {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return hasValue(val) && typeof (val as any)[Symbol.asyncIterator] === "function"
}

/** Generator type guard */
export function isGenerator<T>(val: T): val is T extends Generator<unknown> | AsyncGenerator<unknown> ? T : never {
	try {
		return isAsyncGenerator(val) || ((isIterable(val) && "next" in val && typeof (val as Rec)["next"] === "function"))
	}
	catch {
		return false
	}
}

/** AsyncIterable type guard */
export function isAsyncGenerator<T>(val: T): val is T extends AsyncGenerator<unknown> ? T : never {
	try {
		return isAsyncIterable(val) && ("next" in val) && (typeof (val as Rec)["next"] === "function")
	}
	catch {
		return false
	}
}

/** Returns whether the payload is an array
 * @param {*} payload
 * @returns {payload is undefined}
 */
export function isArray(payload: unknown): payload is unknown[] {
	return getType(payload) === 'Array'
}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function isArrayLike(val: any): val is { length: number } {
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
export function isEmptyArray(payload: unknown): payload is [] {
	return isArray(payload) && payload.length === 0
}

/** Returns whether the payload is a string
 * @param {*} payload
 * @returns {payload is string}
 */
export function isString(payload: unknown): payload is string {
	return getType(payload) === 'String'
}

/** Returns whether the payload is a string, BUT returns false for ''
 * @param {*} payload
 * @returns {payload is string}
 */
export function isFullString(payload: unknown): payload is string {
	return isString(payload) && payload !== ''
}

/** Returns whether the payload is ''
 * @param {*} payload
 * @returns {payload is string}
 */
export function isEmptyString(payload: unknown): payload is string {
	return payload === ''
}

/** Returns whether the payload is a number
 * This will return false for NaN
 * @param {*} payload
 * @returns {payload is number}
 */
export function isNumber(payload: unknown): payload is number {
	return getType(payload) === 'Number' && !Number.isNaN(payload)
}

/** Returns whether the payload is a boolean
 * @param {*} payload
 * @returns {payload is boolean}
 */
export function isBoolean(payload: unknown): payload is boolean {
	return getType(payload) === 'Boolean'
}

/** Returns whether the payload is a regular expression (RegExp)
 *
 * @param {*} payload
 * @returns {payload is RegExp}
 */
export function isRegExp(payload: unknown): payload is RegExp {
	return getType(payload) === 'RegExp'
}

/** Returns whether the payload is a Map
 * @param {*} payload
 * @returns {payload is Map}
 */
export function isMap(payload: unknown): payload is Map<unknown, unknown> {
	return getType(payload) === 'Map'
}

/** Returns whether the payload is a WeakMap
 * @param {*} payload
 * @returns {payload is WeakMap}
 */
export function isWeakMap<T extends WeakKey>(payload: unknown): payload is WeakMap<T, unknown> {
	return getType(payload) === 'WeakMap'
}

/** Returns whether the payload is a Set
 * @param {*} payload
 * @returns {payload is Set}
 */
export function isSet(payload: unknown): payload is Set<unknown> {
	return getType(payload) === 'Set'
}

/** Returns whether the payload is a WeakSet
 * @param {*} payload
 * @returns {payload is WeakSet}
 */
export function isWeakSet<T extends WeakKey>(payload: unknown): payload is WeakSet<T> {
	return getType(payload) === 'WeakSet'
}

/** Returns whether the payload is a Symbol
 * @param {*} payload
 * @returns {payload is symbol}
 */
export function isSymbol(payload: unknown): payload is symbol {
	return getType(payload) === 'Symbol'
}

/** Returns whether the payload is a Date, and that the date is valid
 * @param {*} payload
 * @returns {payload is Date}
 */
export function isDate(payload: unknown): payload is Date {
	return getType(payload) === 'Date' && !Number.isNaN(payload)
}

/** Returns whether the payload is a Blob
 * @param {*} payload
 * @returns {payload is Blob}
 */
export function isBlob(payload: unknown): payload is Blob {
	return getType(payload) === 'Blob'
}

/** Returns whether the payload is a Promise
 * @param {*} payload
 * @returns {payload is Promise}
 */
export function isPromise(payload: unknown): payload is Promise<unknown> {
	return getType(payload) === 'Promise'
}

/** Returns whether the payload is an Error
 * @param {*} payload
 * @returns {payload is Error}
 */
export function isError(payload: unknown): payload is Error {
	return getType(payload) === 'Error'
}

/** Returns whether the payload is `NaN` but also a `number`
 * @param {*} payload
 * @returns {payload is typeof NaN}
 */
export function isNaNValue(payload: unknown): payload is typeof NaN {
	return getType(payload) === 'Number' && Number.isNaN(payload)
}

/** Returns whether the payload is a primitive type (eg. Boolean | Null | Undefined | Number | String | Symbol)
 * @param {*} payload
 * @returns {(payload is boolean | null | undefined | number | string | symbol)}
 */
export function isPrimitive(payload: unknown): payload is boolean | null | undefined | number | string | symbol {
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
export function isNullOrUndefined(payload: unknown): payload is null | undefined {
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
export function isType<T extends Function>(payload: unknown, type: T): payload is T {
	if (!(type instanceof Function)) {
		throw new TypeError('Type must be a function')
	}
	if (!Object.prototype.hasOwnProperty.call(type, 'prototype')) {
		throw new TypeError('Type is not a class')
	}
	// Classes usually have names (as functions usually have names)
	const name: string | undefined | null = type["name"]
	return getType(payload) === name || Boolean(payload && payload.constructor === type)
}

export function assert(value: unknown, message?: string): asserts value {
	if (!value) {
		throw new Error(message)
	}
}

export function deepEquals(x: unknown, y: unknown): boolean {
	if (x === y) return true
	if (getType(x) !== getType(y)) return false
	// if (isFunction(x)) return (assert(isFunction(y)), x.name === y.name && x.toString() === y.toString())
	if (isArray(x)) return (assert(isArray(y)), x.length === y.length && x.every((val, idx) => deepEquals(val, y[idx])))
	if (isObject(x)) return (assert(isObject(y)), Object.keys(x).length === Object.keys(y).length && Object.keys(x).every(key => deepEquals(x[key], y[key])))
	if (isMap(x)) return (assert(isMap(y)), x.size === y.size && [...x.keys()].every(key => deepEquals(x.get(key), y.get(key))))
	if (isSet(x)) return (assert(isSet(y)), x.size === y.size && x.symmetricDifference(y).size === 0)
	if (isRegExp(x)) return (assert(isRegExp(y)), x.source === y.source && x.flags === y.flags)
	if (isError(x)) return (assert(isError(y)), x.name === y.name && x.message === y.message)
	if (isDate(x)) return (assert(isDate(y)), x.toString() === y.toString())
	// if (isNumber(x)) return (assert(isNumber(y)), Number.isNaN(x) && Number.isNaN(y))

	return false
}

export function getIdUnique() {
	// Get current time in milliseconds
	const timestamp = performance.now().toString().replace(".", "").substring(0, 6)

	// Generate a random 8-character string
	const randomPart = Math.random().toString(36).substring(2)

	// Combine and return the result
	return `${timestamp}${randomPart}`
}

/** Convert a record value into a JSON-like string representation, including undefined and functions */
export const stringify = (x: unknown) => JSON.stringify(x, (_, val) => val === undefined
	? "<undefined>"
	: isFunction(val)
		// ? val.toString()
		? `[Function ${val.name}]`
		: val,
	2
)

/** Convert input value to a string of a JSON-like format that permits direct 
 * values of normally forbidden types such as functions, undefined, etc 
 */
export const stringifyDirect = (val: unknown): string => {
	// Helper function to handle individual values
	const stringifyValue = (value: unknown): string => {
		if (value === undefined) {
			return 'undefined'
		}
		if (typeof value === 'function') {
			return value.toString()
		}
		if (typeof value === 'symbol') {
			return value.toString()
		}
		if (typeof value === 'bigint') {
			return `${value}n` // BigInt format with `n` suffix
		}
		if (typeof value === 'object' && value !== null) {
			return stringifyDirect(value) // Recursively handle objects
		}
		return JSON.stringify(value) // Safely handle other values
	}

	// Handle arrays
	if (Array.isArray(val)) {
		const elements = val.map((el) => stringifyValue(el))
		return `[${elements.join(', ')}]`
	}

	// Handle objects
	if (val && typeof val === 'object') {
		const entries = Object.entries(val).map(([key, value]) => {
			const serializedKey = JSON.stringify(key) // JSON keys should always be strings
			const serializedValue = stringifyValue(value)
			return `${serializedKey}: ${serializedValue}`
		})
		return `{${entries.join(', ')}}`
	}

	// Handle primitives (numbers, strings, booleans, null)
	return stringifyValue(val)
}

/** Reverse function of the stringifyDirect function */
/*export const unstringifyDirect = (str: string): unknown => {
	// Preprocess the string to handle special cases
	const preprocess = (input: string): string => {
		return input
			.replace(/\bundefined\b/g, "void 0") // Replace `undefined` with a safer equivalent
			.replace(/Symbol\((.*?)\)/g, 'Symbol.for("$1")') // Replace Symbol with Symbol.for to recreate them
			.replace(/\b(\d+)n\b/g, '$1n') // Keep BigInt format intact
	}

	const processedStr = preprocess(str)

	try {
		// Use eval to reconstruct the original object safely
		return eval(`(${processedStr})`)
	} catch (error) {
		console.error("Failed to parse the string:", error)
		return null
	}
}*/

/*export const unstringify = (str: string) => JSON.parse(str, (_, val) => {
	if (val === "<undefined>") {
		return undefined
	}

	// Regular expression to detect function strings
	const functionPattern = /^\(?\s*([a-zA-Z0-9_$,\s]*)\)?\s*=>|^function\s*\(?\s*([a-zA-Z0-9_$,\s]*)\)?/

	// Check if the value is a string that matches a function definition pattern
	if (typeof val === 'string' && functionPattern.test(val)) {
		try {
			// Reconstruct function from string safely
			return eval(`(${val})`)
		}
		catch (e) {
			console.error("Failed to parse function:", e)
			return val // Return the string as-is if parsing fails
		}
	}

	return val
})*/

// const strngfy = x => JSON.stringify(x, (_, v) => v === undefined ? `<undef>` : typeof v === "function" ? v.toString() : v, 2)


/*function invertParentChildData<C, P>(withParentData: WithParent<C, P>[]): WithChildren<P, C>[] {
	return group(withParentData, _ => _.parent)
		.entries()
		.toArray()
		.map(([parent, children]) => ({
			...parent,
			children: toArray(children).map(child => ({ ...child, parent: undefined }))
		}))
}*/

// type WithParent<C, P> = C & {
// 	parent: P
// }
// type WithChildren<P, C> = P & {
// 	children: Array<C>
// }