/* eslint-disable indent */
/* eslint-disable fp/no-rest-parameters */
/* eslint-disable fp/no-mutation */
/* eslint-disable fp/no-unused-expression */
/* eslint-disable brace-style */
/* eslint-disable fp/no-loops */

import { Tuple } from "./types"

/** Returns -1 if a is smaller than b; 0 if a & b are equal, and 1 if a is bigger than b */
export type Ranker<X = unknown> = (a: X, b: X) => number
/** Returns true if a and b are equal, otherwise returne false */
export type Comparer<X = unknown> = (a: X, b: X) => boolean
export type Hasher<X = unknown, Y extends string | number | symbol = number> = (a?: X) => Y
export type Projector<X = unknown, Y = unknown> = (value: X) => Y
export type ProjectorIndexed<X = unknown, Y = unknown, I = unknown> = (value: X, indexOrKey: I) => Y
export type Predicate<X = unknown> = (value: X) => boolean
export type Reducer<X = unknown, Y = unknown> = (prev: Y, current: X) => Y
export type ReducerIndexed<X = unknown, Y = unknown, I = unknown> = (prev: Y, current: X, indexOrKey: I) => Y


/* eslint-disable brace-style */
type UnwrapIterable1<T> = T extends Iterable<infer X> ? X : T
type UnwrapIterable2<T> = T extends Iterable<infer X> ? UnwrapIterable1<X> : T
type UnwrapIterable3<T> = T extends Iterable<infer X> ? UnwrapIterable2<X> : T
export type UnwrapNestedIterable<T> = T extends Iterable<infer X> ? UnwrapIterable3<X> : T

export type Zip<A extends ReadonlyArray<unknown>> = { [K in keyof A]: A[K] extends Iterable<infer T> ? T : never }

//#region Iterable/Collection functions
export function* take<T>(iterable: Iterable<T>, n: number): Iterable<T> {
	if (typeof n !== "number") throw new Error(`Invalid type ${typeof n} for argument "n"\nMust be number`)
	if (n < 0) {
		console.warn(`Warning: Negative value ${n} passed to argument <n> of take()`)
		return
	}

	if (n > 0) {
		for (const element of iterable) {
			yield element
			if (--n <= 0) break
		}
	}
}

export function* skip<T>(iterable: Iterable<T>, n: number): Iterable<T> {
	if (typeof n !== "number")
		throw new Error(`Invalid type ${typeof n} for argument "n"\nMust be number`)
	if (n < 0) {
		console.warn(`Warning: Negative value ${n} passed to argument <n> of skip()`)
		return
	}

	for (const element of iterable) {
		if (n === 0)
			yield element
		else
			n--
	}
}

export function* reduce<X, Y>(iterable: Iterable<X>, initial: Y, reducer: Reducer<X, Y>): Iterable<Y> {
	for (const element of iterable) {
		initial = reducer(initial, element)
		yield initial
	}
}

export function* map<X, Y>(iterable: Iterable<X>, projector: Projector<X, Y>): Iterable<Y> {
	for (const element of iterable) {
		yield projector(element)
	}
}

// eslint-disable-next-line require-yield
export function filter<T>(iterable: Iterable<T>, predicate: Predicate<T>) {
	return ({
		*[Symbol.iterator]() {
			for (const element of iterable) {
				if (predicate(element))
					yield element
				else
					continue
			}
		}
	})
}


export function* unique<T>(iterable: Iterable<T>): Iterable<T> {
	const seen = new Set()

	outer:
	for (const element of iterable) {
		if (seen.has(element))
			continue outer
		else {
			// eslint-disable-next-line fp/no-unused-expression
			seen.add(element)
		}
		// eslint-disable-next-line fp/no-unused-expression
		yield element

	}

}

export function* chunk<T>(iter: Iterable<T>, chunkSize: number): Iterable<T[]> {
	// console.log(`\n\tStarting chunk()`)

	const batch = [...take(iter, chunkSize)]
	// console.assert(batch.length === Math.min([...iter].length, chunkSize))
	// console.log(`\n\tBatch length ${batch.length}`)

	if (batch.length > 0) {
		// console.log(`\n\tYielding batch of length ${batch.length}`)
		// eslint-disable-next-line fp/no-unused-expression
		yield batch
		// eslint-disable-next-line fp/no-unused-expression
		yield* chunk(skip(iter, chunkSize), chunkSize)
	}
}

/** Turns n iterables into an iterable of n-tuples
 * The shortest iterable determines the length of the result
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, fp/no-rest-parameters, @typescript-eslint/no-explicit-any
export function zip<T extends readonly any[]>(...iterables: T): IterableIterator<Zip<T>> {
	console.assert(iterables.every(iter => typeof iter[Symbol.iterator] === "function"))

	const iterators = iterables.map(i => i[Symbol.iterator]() as Iterator<unknown>)
	// eslint-disable-next-line fp/no-let
	let done = false
	return {
		[Symbol.iterator]() { return this },
		next() {
			if (!done) {
				const items = iterators.map(i => i.next())
				// eslint-disable-next-line fp/no-mutation
				done = items.some(item => item.done)
				if (!done) {
					return { value: items.map(i => i.value) as unknown as Zip<T>, done: false }
				}
				// Done for the first time: close all iterators
				for (const iterator of iterators) {
					if (iterator.return)
						iterator.return()
				}
			}
			// We are done
			return { done: true, value: [] as unknown as T }
		}
	}
}

export function* flatten<X>(nestedIterable: Iterable<X>): Iterable<UnwrapNestedIterable<X>> {
	//console.log(`\nInput to flatten: ${JSON.stringify(nestedIterable)}`)

	for (const element of nestedIterable) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if (typeof element !== "string" && typeof (element as any)[Symbol.iterator] === 'function') {
			//console.log(`flatten: element <${JSON.stringify(element)}> is iterable; flattening it *`)
			yield* flatten(element as unknown as Iterable<X>)
		}
		else {
			//console.log(`flatten: element <${JSON.stringify(element)}> is not iterable; yielding it *`)
			yield element as UnwrapNestedIterable<X>
		}
	}

}

export function forEach<T>(iterable: Iterable<T>, action: Projector<T>) {
	for (const element of iterable) {
		// eslint-disable-next-line fp/no-unused-expression
		action(element)
	}
}

/** Get first element (or first element to satisfy a predicate, if supplied) of this sequence
 * @param predicate Optional predicate to filter elements
 * @returns First element, or <undefined> if such an element is not found
 */
export function first<T>(iterable: Iterable<T>, predicate?: Predicate<T>): T | undefined {
	for (const element of iterable) {
		if (predicate === undefined || predicate(element))
			return element
	}
	return undefined
}

/** Get last element (or last element to satisfy optional predicate argument) of this sequence
 * @param predicate Optional predicate to filter elements
 * @returns Last element as defined, or <undefined> if such an element is not found
 */
export function last<T>(collection: Iterable<T> | { length: number, get(index: number): T }, predicate?: Predicate<T>): T | undefined {

	// eslint-disable-next-line fp/no-let
	if ('length' in collection) {
		// Array-specific implementation of last() for better performance using direct elements access

		// eslint-disable-next-line fp/no-let
		for (let i = collection.length - 1; i >= 0; i--) {
			const element = collection.get(i)
			if (predicate === undefined || predicate(element))
				return element
		}
		return undefined
	}
	else {
		// eslint-disable-next-line fp/no-let
		let _last = undefined as T | undefined
		const iterable = predicate === undefined ? collection : filter(collection, predicate)
		for (const element of iterable) {
			_last = element
		}
		return _last
	}
}

export function some<T>(iterable: Iterable<T>, predicate: Predicate<T>): boolean {
	for (const elt of iterable) {
		if (predicate(elt) === true) return true
	}
	return false
}

export function every<T>(iterable: Iterable<T>, predicate: Predicate<T>) {
	for (const elt of iterable) {
		if (predicate(elt) === false) return false
	}
	return true
}

export function union<T>(collections: globalThis.Array<Iterable<T>>): Iterable<T>
export function union<T>(collections: Iterable<Iterable<T>>): Iterable<T> {
	return unique((function* () {
		for (const collection of collections) {
			for (const element of collection) {
				yield element
			}
		}
	})())
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function intersection<T>(collections: ArrayLike<T>[]): Iterable<T> {
	throw new Error(`Not Implemented`)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function except<T>(src: Iterable<T>, exclusions: ArrayLike<T>[]): Iterable<T> {
	throw new Error(`Not Implemented`)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function complement<T>(target: ArrayLike<T>, universe: Iterable<T>): Iterable<T> {
	throw new Error(`Not Implemented`)
}

export function indexesOf<K, V>(collection: Iterable<Tuple<K, V>>, target: ({ value: V } | { predicate: Predicate<V> })) {
	return 'value' in target
		? map(filter(collection, kv => kv[1] === target.value), kv => kv[0])
		: map(filter(collection, kv => target.predicate(kv[1])), kv => kv[0])
}

//#endregion

//#region Object functions
export function objectPick<T extends Record<string, unknown>, K extends keyof T>(obj: T, ...keys: K[]): Record<K, T[K]> {
	const result = {} as Pick<T, K>
	keys.forEach(k => result[k] = obj[k])
	return result
}
export function objectKeys<K extends string, V>(obj: Record<K, V>): K[]
export function objectKeys<T extends Record<string, unknown>>(obj: T): (keyof T)[]
// eslint-disable-next-line @typescript-eslint/ban-types
export function objectKeys<K extends string>(obj: {} | Record<K, unknown>) {
	return Object.keys(obj) //as K[]
}

export function objectFromKeyValues<T, K extends string = string>(keyValues: Tuple<K, T>[]) {
	const obj = {} as Record<K, T>
	keyValues.forEach(kvp => {
		obj[kvp[0]] = kvp[1]
	})
	return obj
}

export function objectEntries<V, K extends string>(obj: Record<K, V>): Tuple<K, V>[]
export function objectEntries<V, K extends string, T extends Record<K, V>>(obj: T): Tuple<K, V>[] {
	return objectKeys(obj).map((key) => new Tuple(key, obj[key]) as Tuple<K, V>)
}
export function objectMap<K extends string, X, Y>(obj: Record<K, X>, projector: ProjectorIndexed<X, Y, K>): Record<K, Y>
export function objectMap<K extends string, X, Y, T extends Record<K, X>>(obj: T, projector: ProjectorIndexed<X, Y, K>): Record<K, Y> {
	const entries = objectEntries(obj)
	const mapped = entries.map(kv => new Tuple(kv[0], projector(kv[1], kv[0])))
	const newObj = objectFromKeyValues(mapped)
	return newObj
}
//#endregion


export function compare<T>(x: T, y: T, comparer?: Projector<T, unknown>, tryNumeric = false): number {
	// eslint-disable-next-line fp/no-let
	let _x: unknown = comparer ? comparer(x) : x
	// eslint-disable-next-line fp/no-let
	let _y: unknown = comparer ? comparer(y) : y

	if (typeof _x === "string" && typeof _y === "string") {

		if (tryNumeric === true) {
			const __x = parseFloat(_x)
			const __y = parseFloat(_y)
			if ((!Number.isNaN(__x)) && (!Number.isNaN(__y))) {
				return __x - __y
			}
		}

		return new Intl.Collator().compare(_x || "", _y || "")
	}
	else if (typeof _x === "number" && typeof _y === "number") {
		return (_x || 0) - (_y || 0)
	}
	else if (_x instanceof Date && _y instanceof Date) {
		// eslint-disable-next-line fp/no-mutation
		_x = _x || new Date()
		// eslint-disable-next-line fp/no-mutation
		_y = _y || new Date()
		if ((_x as Date) > (_y as Date))
			return 1
		else if (_x === _y)
			return 0
		else
			return -1
	}
	else
		return _x === _y ? 0 : 1
}
export function getRanker<T>(args: { projector: Projector<T, unknown>, tryNumeric?: boolean/*=false*/, reverse?: boolean/*=false*/ }): Ranker<T> {
	//console.log(`generating comparer, try numeric is ${tryNumeric}, reversed is ${reverse} `)
	return (x: T, y: T) => {
		return compare(x, y, args.projector, args.tryNumeric) * (args.reverse === true ? -1 : 1)
	}
}
export function getComparer<T>(projector: Projector<T, unknown>, tryNumeric = false/*, reverse = false*/): Comparer<T> {
	//console.log(`generating comparer, try numeric is ${tryNumeric}, reversed is ${reverse} `)
	return (x: T, y: T) => {
		return compare(x, y, projector, tryNumeric) === 0
	}
}
