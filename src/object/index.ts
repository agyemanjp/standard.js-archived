/* eslint-disable fp/no-unused-expression */
/* eslint-disable fp/no-mutation */
/* eslint-disable indent */
/* eslint-disable brace-style */
/* eslint-disable fp/no-rest-parameters */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { toCamelCase } from "../text"
import { Tuple, Obj, Merge, isObject, isSymbol, ToCamel, KeysToCamelCase } from "../utility"

export function keys<T extends Obj>(obj: T): (keyof T)[]
export function keys<K extends string | number | symbol, V>(obj: Record<K, V>): K[]
export function keys(obj: any) {
	// if (typeof obj === "object") throw new Error
	return Object.keys(obj)
}

export function objectFromTuples<T, K extends string = string>(keyValues: Tuple<K, T>[]) {
	const obj = {} as Record<K, T>
	// eslint-disable-next-line fp/no-unused-expression
	keyValues.forEach(kvp => {
		// eslint-disable-next-line fp/no-mutation
		obj[kvp[0]] = kvp[1]
	})
	return obj
}
export async function objectFromTuplesAsync<T, K extends string = string>(keyValues: Iterable<Tuple<K, T>> | AsyncIterable<Tuple<K, T>>) {
	const obj = {} as Obj<T, K>
	// eslint-disable-next-line fp/no-loops
	for await (const kv of keyValues) {
		// eslint-disable-next-line fp/no-mutation
		obj[kv[0]] = kv[1]
	}
	return obj
}

export function values<V, K extends string | number>(obj: Record<K, V>): V[]
export function values<V, K extends string | number, T extends Record<K, V>>(obj: T): V[]
export function values(obj: Obj) { return Object.values(obj) }

export function entries<V, K extends string | number>(obj: Record<K, V>): Tuple<K, V>[]
export function entries<V, K extends string | number, T extends Record<K, V>>(obj: T): Tuple<K, V>[]
export function entries(obj: Obj) { return keys(obj).map(key => new Tuple(key, obj[key])) }

/** Return object consisting of only certain properties from onput object certain properties excluded */
export function pick<T extends Obj, K extends keyof T>(obj: T, ..._keys: K[]): Record<K, T[K]> {
	const result = {} as Pick<T, K>
	// eslint-disable-next-line fp/no-unused-expression, fp/no-mutation
	_keys.forEach(k => result[k] = obj[k])
	return result
}

/** Return input object literal with certain properties excluded */
export function omit<T extends Obj, K extends keyof T>(obj: T, ..._keys: K[]): Omit<T, K> {
	const result = obj
	// eslint-disable-next-line fp/no-unused-expression, fp/no-mutation, fp/no-delete
	_keys.forEach(k => delete result[k])
	return result
}

/** Return input object literal with properties keys converted to camel case */
export function camelize<T extends Obj<any, string>>(obj: T): KeysToCamelCase<T> {
	return objectFromTuples(entries(obj).map(keyVal =>
		new Tuple(toCamelCase(keyVal[0]), keyVal[1]))
	) as any
}
// const test = camelize({
// 	S3_CLOUDFRONT_URL: "",
// 	DEV_EMAIL_ADDRESSES: "",
// 	APP_NAME: "string",
// 	NODE_ENV: 1,
// 	areGood: []
// })

/** Return a shallow clone of an object literal */
export function shallowClone<T>(val: T): T {
	return Object.assign({}, val)
}

export function shallowEquals<T extends Obj>(a: T, b: T): boolean {
	const keysA = keys(a)
	const keysB = keys(b)
	return keysA.length === keysB.length && keysA.every(k => a[k] === b[k])
}

/** Merge anything recursively. Objects get merged, special objects (classes etc.) are re-assigned "as is". Basic types overwrite objects or other basic types.
 * @param {T} origin
 * @param {...Tn} newComers
 * @returns {Assigned<T, Tn>}
 */
export function deepMerge<T1>(args: T1): T1
export function deepMerge<T1, T2>(a1: T1, a2: T2): Merge<T1, T2>
export function deepMerge<T1, T2, T3>(a1: T1, a2: T2, a3: T3): Merge<T1, Merge<T2, T3>>
export function deepMerge<T1, T2, T3, T4>(a1: T1, a2: T2, a3: T3, a4: T4): Merge<T1, Merge<T2, Merge<T3, T4>>>
export function deepMerge<T1, T2, T3, T4, T5>(a1: T1, a2: T2, a3: T3, a4: T4, a5: T5): Merge<T1, Merge<T2, Merge<T3, Merge<T4, T5>>>>
export function deepMerge<T1, T2, T3, T4, T5, T6>(a1: T1, a2: T2, a3: T3, a4: T4, a5: T5, a6: T6): Merge<T1, Merge<T2, Merge<T3, Merge<T4, Merge<T5, T6>>>>>
export function deepMerge(...args: any[]) {
	function assignProp(carry: Obj, key: string, newVal: any, originalObject: Obj): void {
		const propType = {}.propertyIsEnumerable.call(originalObject, key) ? 'enumerable' : 'nonenumerable'
		// eslint-disable-next-line fp/no-mutation
		if (propType === 'enumerable') carry[key] = newVal
		if (propType === 'nonenumerable') {
			// eslint-disable-next-line fp/no-unused-expression, fp/no-mutating-methods
			Object.defineProperty(carry, key, { value: newVal, enumerable: false, writable: true, configurable: true })
		}
	}
	function mergeRecursively<T1 extends Obj | any, T2 extends Obj | any>(origin: T1, newComer: T2, compareFn?: (prop1: any, prop2: any, propName: string) => any): (T1 & T2) | T2 {
		// always return newComer if its not an object
		if (!isObject(newComer)) return newComer

		// define newObject to merge all values upon
		// eslint-disable-next-line fp/no-let
		let newObject = {} as (T1 & T2) | T2
		if (isObject(origin)) {
			const props = Object.getOwnPropertyNames(origin)
			const symbols = Object.getOwnPropertySymbols(origin)
			// eslint-disable-next-line fp/no-mutation
			newObject = [...props, ...symbols].reduce((carry, key) => {
				const targetVal = origin[key as string]
				if (
					(!isSymbol(key) && !Object.getOwnPropertyNames(newComer).includes(key)) ||
					(isSymbol(key) && !Object.getOwnPropertySymbols(newComer).includes(key))
				) {
					// eslint-disable-next-line fp/no-unused-expression
					assignProp(carry as Obj, key as string, targetVal, origin)
				}
				return carry
			}, {} as (T1 & T2) | T2)
		}
		// newObject has all properties that newComer hasn't
		const props = Object.getOwnPropertyNames(newComer)
		const symbols = Object.getOwnPropertySymbols(newComer)
		const result = [...props, ...symbols].reduce((carry, key) => {
			// re-define the origin and newComer as targetVal and newVal
			// eslint-disable-next-line fp/no-let
			let newVal = newComer[key as string]
			const targetVal = isObject(origin) ? origin[key as string] : undefined
			// When newVal is an object do the merge recursively
			if (targetVal !== undefined && isObject(newVal)) {
				// eslint-disable-next-line fp/no-mutation
				newVal = mergeRecursively(targetVal, newVal, compareFn)
			}
			const propToAssign = compareFn ? compareFn(targetVal, newVal, key as string) : newVal
			// eslint-disable-next-line fp/no-unused-expression
			assignProp(carry as Obj, key as string, propToAssign, newComer)
			return carry
		}, newObject)
		return result
	}

	return args.slice(1).reduce((result, newComer) => {
		return mergeRecursively(result, newComer)
	}, args[0]) //as O.Compact<T, Tn, 'deep'>
}

/*export const mergeDeep = (options?: { mergeArrays: boolean, undefinedOverwrites: boolean }) => (
	<T extends any[]>(...objects: T) => objects.reduce((result, current) => {
		if (!isObject(current) || !isObject(result))
			return current
		// eslint-disable-next-line fp/no-unused-expression
		Object.keys(current).forEach((key) => {
			if (Array.isArray(result[key]) && Array.isArray(current[key])) {
				// eslint-disable-next-line fp/no-mutation
				result[key] = (options?.mergeArrays ?? false)
					? Array.from(new Set((result[key] as unknown[]).concat(current[key])))
					: current[key]
			}
			else if (isObject(result[key]) && isObject(current[key])) {
				// eslint-disable-next-line fp/no-mutation
				result[key] = mergeDeep(options)(result[key] as IObject, current[key] as IObject)
			}
			else {
				if ((options?.undefinedOverwrites ?? false) || typeof current[key] !== "undefined")
					result[key] = current[key]
			}
		})
		return result
	}, {}) as TUnionToIntersection<T[number]>
)*/

export const mergeDeep = (options?: { mergeArrays: boolean, undefinedOverwrites: boolean }) => <T extends IObject[]>(...objects: T) => objects.reduce((result, current) => {
	Object.keys(current).forEach((key) => {
		if (Array.isArray(result[key]) && Array.isArray(current[key])) {
			result[key] = (options?.mergeArrays ?? false)
				? Array.from(new Set((result[key] as unknown[]).concat(current[key])))
				: current[key]
		}
		else if (isObject(result[key]) && isObject(current[key])) {
			result[key] = mergeDeep(options)(result[key] as IObject, current[key] as IObject)
		}
		else {
			if ((options?.undefinedOverwrites ?? false) || typeof current[key] !== "undefined")
				result[key] = current[key]
		}
	})

	return result
}, {}) as TUnionToIntersection<T[number]>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface IObject { [key: string]: any; length?: never; }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TUnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

