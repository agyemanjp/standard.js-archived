import {
	camelCase, dashCase, snakeCase,
	type KeysToCamelCase, type KeysToDashCase, type KeysToSnakeCase,
	type TrimEnd, type TrimStart
} from "../ascii"
import type { Predicate } from "../collections"
import { Tuple, type Rec, isObject, type TypeGuard, type KeyOf } from "../common"

export function keys<T extends Rec>(obj: T): (keyof T)[]
export function keys<K extends string, V>(obj: Record<K, V>): string[]
export function keys(obj: unknown) {
	// if (typeof obj === "object") throw new Error
	return Object.keys(obj as Rec)
}

export function objectFromTuples<T, K extends string = string>(keyValues: Tuple<K, T>[]) {
	const obj = {} as Rec<T, K> // Record<K, T>
	for (const kvp of keyValues) { obj[kvp[0]] = kvp[1] }
	return obj
}
export async function objectFromTuplesAsync<T, K extends string = string>(keyValues: Iterable<Tuple<K, T>> | AsyncIterable<Tuple<K, T>>) {
	const obj = {} as Rec<T, K>
	for await (const kv of keyValues) {
		obj[kv[0]] = kv[1]
	}
	return obj
}

export function values<V, K extends string>(obj: Record<K, V>): V[]
export function values<V, K extends string, T extends Record<K, V>>(obj: T): V[]
export function values(obj: Rec) { return Object.values(obj) }

export function entries<V, K extends string>(obj: Record<K, V>): Tuple<K, V>[]
export function entries<V, K extends string, T extends Record<K, V>>(obj: T): Tuple<K, V>[]
export function entries(obj: Rec) { return keys(obj).map(key => new Tuple(key, obj[key])) }

/** Filter iterable data based on a type-guards (for proper typing of the result) or predicate. */
export function filterRecord<T extends Rec<V>, V, V1 extends V>(obj: T, guard: ["by-typeguard", TypeGuard<V, V1>]): Rec<V1, KeyOf<T>>
export function filterRecord<T extends Rec<V, K>, V, K extends string>(obj: T, predicate: Predicate<V, K>): Partial<T>
export function filterRecord<X, X1 extends X>(elements: Rec<X>, predicate: ["by-typeguard", TypeGuard<X, X1>] | Predicate<X, unknown>) {
	const predEffective = (tuple: Tuple<string | number, X>) => (
		(typeof predicate === "function" && predicate(tuple[1], tuple[0])) ||
		(typeof predicate !== "function" && predicate[1](tuple[1]))
	)

	const filteredEntries = entries(elements).filter(tuple => predEffective(tuple))
	// console.log(`Filtered entries: ${stringify(filteredEntries)}`)

	const obj = objectFromTuples(filteredEntries)
	// console.log(`objectFromTuples(filteredEntries): ${stringify(obj)}`)

	return obj
}

/** Pick a subset of properties of input record */
export function pick<T extends Rec, K extends keyof T>(obj: T, ..._keys: K[]): Pick<T, K> {
	const result = {} as Pick<T, K>
	for (const k of _keys) { result[k] = obj[k] }
	return result
}

/** Omit certain properties of input record */
export function omit<T extends Rec<unknown>, K extends keyof T>(obj: T, ..._keys: K[]): OmitX<T, K> {
	const result = obj
	for (const k of _keys) { delete result[k] }
	return result
}
export type OmitX<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

/** Return input object literal with properties keys converted to camel case */
export function keysToCamelCase<T extends Rec<unknown, string>>(obj: T): KeysToCamelCase<T> {
	return objectFromTuples(entries(obj).map(keyVal =>
		new Tuple(camelCase(keyVal[0]), keyVal[1]))
	) as KeysToCamelCase<T>
}

/** Return input object literal with properties keys converted to dash case */
export function keysToDashCase<T extends Rec<unknown, string>>(obj: T): KeysToDashCase<T> {
	return objectFromTuples(entries(obj).map(keyVal =>
		new Tuple(dashCase(keyVal[0]), keyVal[1]))
	) as KeysToDashCase<T>
}
/** Return input object literal with properties keys converted to snake case */
export function keysToSnakeCase<T extends Rec<unknown, string>>(obj: T): KeysToSnakeCase<T> {
	return objectFromTuples(entries(obj).map(keyVal =>
		new Tuple(snakeCase(keyVal[0]), keyVal[1]))
	) as KeysToSnakeCase<T>
}

export function prefixKeys<Objct extends Rec<unknown, string>, Pref extends string>(obj: Objct, prefix: Pref) {
	return objectFromTuples(entries(obj).map(kv =>
		new Tuple(`${prefix}${kv[0]}`, kv[1])
	)) as unknown as { [key in `${Pref}${StringKeys<Objct>}`]: Objct[TrimStart<key, Pref>] }
}
export function suffixKeys<Objct extends Rec<unknown, string>, Suff extends string>(obj: Objct, suffix: Suff) {
	return objectFromTuples(entries(obj).map(kv =>
		new Tuple(`${kv[0]}${suffix}`, kv[1])
	)) as unknown as { [key in `${StringKeys<Objct>}${Suff}`]: Objct[TrimEnd<key, Suff>] }
}
type StringKeys<O> = keyof O extends string ? keyof O : never

// const pref = prefixKeys({ bool: true, num: 1, str: "" }, "prefix_")
// const suff = suffixKeys({ bool: true, num: 1, str: "" }, "_suffix")

// type X = StringKeys<{ x: 1, 2: 3 }>
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

export function shallowEquals<T extends Rec>(a: T, b: T): boolean {
	const keysA = keys(a)
	const keysB = keys(b)
	return keysA.length === keysB.length && keysA.every(k => a[k] === b[k])
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

export const mergeDeep = (options?: { mergeArrays: boolean, undefinedOverwrites: boolean }) =>
	<T extends IObject[]>(...objects: T) =>
		objects.reduce((result, current) => {
			for (const key of Object.keys(current)) {
				if (Array.isArray(result[key]) && Array.isArray(current[key])) {
					result[key] = (options?.mergeArrays ?? false)
						? Array.from(new Set((result[key] as unknown[]).concat(current[key])))
						: current[key]
				}
				else if (isObject(result[key]) && isObject(current[key])) {
					result[key] = mergeDeep(options)(result[key] as IObject, current[key] as IObject)
				}
				else {
					if ((options?.undefinedOverwrites ?? false) || typeof current[key] !== "undefined") { result[key] = current[key] }
				}
			}

			return result
		}, {}) as TUnionToIntersection<T[number]>

interface IObject { [key: string]: unknown; length?: never }
type TUnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

