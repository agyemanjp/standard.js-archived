/* eslint-disable indent */
/* eslint-disable brace-style */
/* eslint-disable fp/no-rest-parameters */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Tuple, Obj, Collection, Merge, isObject, isSymbol } from "../utility"
import { skip } from "../collections"


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
export async function objectFromTuplesAsync<T, K extends string = string>(keyValues: Collection<Tuple<K, T>>) {
	const obj = {} as Obj<T, K>
	for await (const kv of keyValues) {
		obj[kv[0]] = kv[1]
	}
	return obj
}


export function entries<V, K extends string>(obj: Record<K, V>): Tuple<K, V>[]
export function entries<V, K extends string, T extends Record<K, V>>(obj: T): Tuple<K, V>[]
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

/** Return a shallow clone of an object literal */
export function cloneShallow<T>(val: T): T {
	return Object.assign({}, val)
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
export function deepMerge(...args: any[])/*: O.Compact<T, Tn, 'deep'>*/ {
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

	return [...skip(args, 1)].reduce((result, newComer) => {
		return mergeRecursively(result, newComer)
	}, args[0]) //as O.Compact<T, Tn, 'deep'>
}

