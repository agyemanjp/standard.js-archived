/* eslint-disable indent */
/* eslint-disable brace-style */
/* eslint-disable fp/no-rest-parameters */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { O } from 'ts-toolbelt'
import { Tuple, Obj, TypeGuard, ExtractByType, isObject, isSymbol } from "../utility"
import { Predicate, Projector } from "../functional"


export function keys<T extends Obj>(obj: T): (keyof T)[]
export function keys<K extends string | number | symbol, V>(obj: Record<K, V>): K[]
export function keys(obj: any) {
	// if (typeof obj === "object") throw new Error
	return Object.keys(obj)
}

export function fromKeyValues<T, K extends string = string>(keyValues: Tuple<K, T>[]) {
	const obj = {} as Record<K, T>
	// eslint-disable-next-line fp/no-unused-expression
	keyValues.forEach(kvp => {
		// eslint-disable-next-line fp/no-mutation
		obj[kvp[0]] = kvp[1]
	})
	return obj
}

export function entries<V, K extends string>(obj: Record<K, V>): Tuple<K, V>[]
export function entries<V, K extends string, T extends Record<K, V>>(obj: T): Tuple<K, V>[]
export function entries(obj: Obj) { return keys(obj).map(key => new Tuple(key, obj[key])) }

export function mapObject<K extends string, X, Y>(obj: Record<K, X>, projector: Projector<X, Y, K>): Record<K, Y>
export function mapObject<K extends string, X, Y, T extends Record<K, X>>(obj: T, projector: Projector<X, Y, K>): Record<K, Y>
export function mapObject<X, Y>(obj: Obj<X>, projector: Projector<X, Y, string>) {
	const _entries = entries(obj)
	const mapped = _entries.map(kv => new Tuple(kv[0], projector(kv[1], kv[0])))
	const newObj = fromKeyValues(mapped)
	return newObj
}

/** `filter` returns an object with fields that match the condition.
 * If condition is a type guard, the values are cast into the guarded type.
 * The type guard must return true for all values of type `B`.
 */
// export function filterObject<K extends string, V, V1 extends V>(obj: Obj<V, K>, predicate: TypeGuard<V, V1>): ExtractByType<Obj<V, K>, V1>
export function filterObject<T extends Obj<V>, V, V1 extends V>(obj: T, predicate: TypeGuard<V, V1>): ExtractByType<T, V1>
export function filterObject<K extends string, V>(obj: Obj<V, K>, predicate: Predicate<V, K>): Partial<Obj<V, K>>
export function filterObject<K extends string, V>(obj: Obj<V, K>, predicate: Predicate<V, K>): Partial<Obj<V, K>>
export function filterObject<T extends Obj>(obj: T, predicate: Predicate<T[keyof T], keyof T>): Partial<T>
export function filterObject(obj: Obj, predicate: Predicate<unknown, keyof typeof obj>) {
	return fromKeyValues(entries(obj).filter(entry => predicate(entry[1], entry[0])))
}
// const _ = filter({ str: "", num: 1 }, x => x === undefined)


export function pick<T extends Obj, K extends keyof T>(obj: T, ..._keys: K[]): Record<K, T[K]> {
	const result = {} as Pick<T, K>
	// eslint-disable-next-line fp/no-unused-expression, fp/no-mutation
	_keys.forEach(k => result[k] = obj[k])
	return result
}

export function omit<T extends Obj, K extends keyof T>(obj: T, ..._keys: K[]): Omit<T, K> {
	const result = obj
	// eslint-disable-next-line fp/no-unused-expression, fp/no-mutation, fp/no-delete
	_keys.forEach(k => delete result[k])
	return result
}


export function cloneShallow<T>(val: T): T {
	return Object.assign({}, val)
}


export interface ObjectMergeOptions {
	arrayMerge?(target: unknown[], source: unknown[], options?: ObjectMergeOptions): any[];
	clone?: boolean;
	customMerge?: (key: string, options?: ObjectMergeOptions) => ((x: any, y: any) => any) | undefined;
	isMergeableObject?(value: unknown): boolean;
}

// function merge<X>(target: X, source: Partial<X> | undefined | null): X
// function merge<X>(target: Partial<X> | undefined | null, source: X): X
// function merge<X>(target: X, source: undefined | null): X
// function merge<X>(target: undefined | null, source: X): X
// function merge<X, Y>(target: X, source: Y): X & Y

// export function deepMerge<T1>(args: [T1], options?: ObjectMergeOptions): T1
// export function deepMerge<T1, T2>(args: [T1, T2], options?: ObjectMergeOptions): T1 & T2
// export function deepMerge<T1, T2, T3>(args: [T1, T2, T3], options?: ObjectMergeOptions): T1 & T2 & T3
// export function deepMerge<T1, T2, T3, T4>(args: [T1, T2, T3, T4], options?: ObjectMergeOptions): T1 & T2 & T3 & T4

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
/** Merge anything recursively. Objects get merged, special objects (classes etc.) are re-assigned "as is". Basic types overwrite objects or other basic types.
 * @export
 * @template T
 * @template Tn
 * @param {T} origin
 * @param {...Tn} newComers
 * @returns {Assigned<T, Tn>}
 */
export function deepMerge<T extends object, Tn extends object[]>(origin: T, ...newComers: Tn): O.Compact<T, Tn, 'deep'> {
	return newComers.reduce((result, newComer) => {
		return mergeRecursively(result, newComer)
	}, origin) as O.Compact<T, Tn, 'deep'>
}

/*
export function mergeAndCompare<T extends object, Tn extends object[]>(compareFn: (prop1: any, prop2: any, propName: string | symbol) => any, origin: T, ...newComers: Tn): O.Compact<T, Tn, 'deep'> {
	return newComers.reduce((result, newComer) => {
		return mergeRecursively(result, newComer, compareFn)
	}, origin)
}
export function mergeAndConcat<T extends object, Tn extends object[]>(origin: T, ...newComers: Tn): O.Compact<T, Tn, 'deep'> {
	return newComers.reduce((result, newComer) => {
		return mergeRecursively(result, newComer, concatArrays)
	}, origin)
}
*/