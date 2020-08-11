/* eslint-disable brace-style */
import { Tuple, ProjectorIndexed, ReducerIndexed, Predicate } from "./_types"
import { map } from "./combinators"
import { Set } from "./set"

/** Eager, un-ordered, material, indexed associative collection */
export class Dictionary<T extends Record<string, unknown>> implements Iterable<Tuple<keyof T, T[keyof T]>> {
	private readonly obj: Readonly<T>
	// eslint-disable-next-line brace-style
	// eslint-disable-next-line fp/no-mutation
	constructor(obj: T) { this.obj = Object.freeze({ ...obj }) }

	static fromKeyValues<K extends string, V>(keyValues: Iterable<Tuple<K, V>>) {
		const obj = {} as Record<K, V>
		// eslint-disable-next-line fp/no-mutation, fp/no-loops
		for (const kv of keyValues) obj[kv[0]] = kv[1]
		return new Dictionary(obj)
	}
	static fromArray<X>(arr: X[]) {
		return Dictionary.fromKeyValues(arr.map((elt, i) => new Tuple(i.toString(), elt)))
	}

	[Symbol.iterator]() { return this.entries()[Symbol.iterator]() }

	asObject() { return { ...this.obj } }

	get size() { return this.keys().length }

	/** TODO: Memoize this method? */
	keys() { return Object.keys(this.obj) as (keyof T)[] }

	/** TODO: Memoize this method? */
	values() { return Object.values(this.obj) as T[keyof T][] }

	/** Check whether this dictionary contains a specific key or value */
	has(arg: { key: keyof T } | { value: T[keyof T] }) {
		return "key" in arg
			? this.keys().includes(arg.key)
			: this.values().includes(arg.value)
	}

	/** TODO: Memoize this method? */
	entries() { return Object.entries(this.obj) as Tuple<keyof T, T[keyof T]>[] }

	pick<K extends keyof T>(keys: K[]) {
		const result = {} as Pick<T, K>
		// eslint-disable-next-line fp/no-unused-expression, fp/no-mutation
		keys.forEach(k => result[k] = this.obj[k])

		return new Dictionary(result)
	}
	omit<K extends keyof T>(keys: K[]) {
		const result = this.asObject()
		// eslint-disable-next-line fp/no-unused-expression, fp/no-delete
		keys.forEach(k => delete result[k])
		return new Dictionary(result as Omit<T, K>)
	}
	map<Y>(projector: ProjectorIndexed<T[keyof T], Y, keyof T>) {
		const keyValues = this.entries().map(kv => new Tuple(String(kv[0]), projector(kv[1], kv[0])))
		return Dictionary.fromKeyValues(keyValues)
	}
	reduce<Y>(initial: Y, reducer: ReducerIndexed<T[keyof T], Y, keyof T>) {
		return this.entries().reduce((prev, curr) => reducer(prev, curr[1], curr[0]), initial)
	}

	get(selector: keyof T) { return this.obj[selector] }
	getAll(selector: Iterable<keyof T>) { return new Set(map(selector, index => this.obj[index])) }

	/** Get the indexes where a value occurs or a certain predicate/condition is met */
	indexesOf(args: ({ value: T[keyof T] } | { predicate: Predicate<T[keyof T]> })) {
		return 'value' in args
			? this.entries().filter(kv => kv[1] === args.value).map(kv => kv[0])
			: this.entries().filter(kv => args.predicate(kv[1]) === true).map(kv => kv[0])
	}

	/*static equals(obj1: unknown, obj2: unknown, ignoreUnmatchedProps = false) {

		if (typeof obj1 !== typeof obj2) {
			return false
		}
		else if (typeof obj1 === "function") {
			return obj1.toString() === String(obj2)
		}
		else if (typeof obj1 !== "object") {
			return obj1 === obj2
		}
		else {
			if (obj1 === null || obj2 === null) {
				throw new Error()
			}
			const keysToCheck = ignoreUnmatchedProps
				? intersection([Object.keys(obj1), Object.keys(obj2)])
				: union([Object.keys(obj1), Object.keys(obj2)])

			return [...keysToCheck].every(key => obj1[key] === obj2[key])
		}
	}*/
}


