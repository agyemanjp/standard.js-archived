/* eslint-disable indent */
/* eslint-disable fp/no-rest-parameters */
/* eslint-disable fp/no-mutation */
/* eslint-disable fp/no-unused-expression */
/* eslint-disable brace-style */
/* eslint-disable fp/no-loops */
/* eslint-disable brace-style */

import { Tuple, TypeGuard, hasValue } from "../utility"
import { Reducer, Projector, Predicate } from "../functional"

type UnwrapIterable1<T> = T extends Iterable<infer X> ? X : T
type UnwrapIterable2<T> = T extends Iterable<infer X> ? UnwrapIterable1<X> : T
type UnwrapIterable3<T> = T extends Iterable<infer X> ? UnwrapIterable2<X> : T
export type UnwrapNestedIterable<T> = T extends Iterable<infer X> ? UnwrapIterable3<X> : T
export type Zip<A extends ReadonlyArray<unknown>> = { [K in keyof A]: A[K] extends Iterable<infer T> ? T : never }

/** Iterable type guard */
export function isIterable<T, _>(val: Iterable<T> | _): val is _ extends Iterable<infer X> ? never : Iterable<T> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return hasValue(val) && typeof (val as any)[Symbol.iterator] === "function"
}

/**  */
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
	for (const tuple of indexed(iterable)) {
		initial = reducer(initial, tuple[1], tuple[0])
		yield initial
	}
}

export function* map<X, Y>(iterable: Iterable<X>, projector: Projector<X, Y>): Iterable<Y> {
	for (const tuple of indexed(iterable)) {
		yield projector(tuple[1], tuple[0])
	}
}

export function filter<X>(iterable: Iterable<X>, predicate: Predicate<X, number>): Iterable<X>
export function filter<X, X1 extends X>(iterable: Iterable<X>, predicate: TypeGuard<X, X1>): Iterable<X1>
export function* filter<X, X1 extends X>(iterable: Iterable<X>, predicate: Predicate<X> | TypeGuard<X, X1>) {
	for (const tuple of indexed(iterable)) {
		if (predicate(tuple[1], tuple[0]))
			yield tuple[1]
		else
			continue
	}
}
/* export function filter<T>(iterable: Iterable<T>, predicate: Predicate<T>) {
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
}*/

export function contains<A>(iterable: Iterable<A>, value: A) {
	for (const x of iterable) {
		if (x === value) {
			return true
		}
	}

	return false
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
export function zip<T extends readonly Iterable<any>[]>(...iterables: T): IterableIterator<Zip<T>> {
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

/** Transform an iterable into another of tuples containing the a sequential index and the orginal values */
export function* indexed<T>(items: Iterable<T>, from = 0) {
	yield* zip(integers({ from, direction: "upwards" }), items)
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
	for (const tuple of indexed(iterable)) {
		// eslint-disable-next-line fp/no-unused-expression
		action(tuple[1], tuple[0])
	}
}

/** Get first element (or first element to satisfy a predicate, if supplied) of this sequence
 * @param predicate Optional predicate to filter elements
 * @returns First element, or <undefined> if such an element is not found
 */
export function first<T>(iterable: Iterable<T>, predicate?: Predicate<T>): T | undefined {
	for (const tuple of indexed(iterable)) {
		if (predicate === undefined || predicate(tuple[1], tuple[0]))
			return tuple[1]
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
			if (predicate === undefined || predicate(element, i))
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

/**  */
export function some<T>(iterable: Iterable<T>, predicate: Predicate<T>): boolean {
	for (const tuple of indexed(iterable)) {
		if (predicate(tuple[1], tuple[0]) === true) return true
	}
	return false
}

/**  */
export function every<T>(iterable: Iterable<T>, predicate: Predicate<T>) {
	for (const tuple of indexed(iterable)) {
		if (predicate(tuple[1], tuple[0]) === false) return false
	}
	return true
}

/**  */
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

/**  */
export function intersection<T>(collections: ArrayLike<T>[]): Iterable<T> {
	throw new Error(`Not Implemented`)
}

/**  */
export function except<T>(src: Iterable<T>, ...exclusions: ArrayLike<T>[]): Iterable<T> {
	throw new Error(`Not Implemented`)
}

export function complement<T>(target: ArrayLike<T>, universe: Iterable<T>): Iterable<T> {
	throw new Error(`Not Implemented`)
}

export function indexesOf<K, V>(collection: Iterable<Tuple<K, V>>, target: ({ value: V } | { predicate: Predicate<V, K> })) {
	return 'value' in target
		? map(filter(collection, kv => kv[1] === target.value), kv => kv[0])
		: map(filter(collection, kv => target.predicate(kv[1], kv[0])), kv => kv[0])
}

/** Generate sequence of integers */
export function* integers(args: { from: number, to: number } | { from: number, direction: "upwards" | "downwards" }) {
	// eslint-disable-next-line fp/no-let
	let num = args.from
	// eslint-disable-next-line fp/no-loops
	do {
		// eslint-disable-next-line fp/no-mutation
		yield ("to" in args ? args.to >= args.from : args.direction === "upwards") ? num++ : num--
	}
	while ("direction" in args || args.from !== args.to)
}
/** Generate sequence of numbers */
export function* range(from: number, to: number, opts?: { mode: "width", width: number } | { mode: "count", count: number }) {
	if (opts) {
		if (opts.mode === "width" && opts.width <= 0) throw new Error("width must be positive non-zero number")
		if (opts.mode === "count" && opts.count <= 0) throw new Error("count must be positive non-zero number")
	}

	const diff = to - from
	const sign = to >= from ? 1 : -1
	const delta = opts === undefined
		? sign
		: opts.mode === "width"
			? (opts.width * sign)
			: diff / opts.count


	const length = Math.floor(diff / delta) + 1

	// eslint-disable-next-line fp/no-let, fp/no-loops, fp/no-mutation
	for (let i = 0; i < length; i++) {
		// eslint-disable-next-line fp/no-mutating-methods
		yield (from + (i * delta))
	}
}


export function* repeat(val: unknown, count?: number) {
	while (count === undefined || (--count >= 0)) {
		yield val
	}
}

/** Partition will partition List according to given function. */
// val numbers = List(1, 2, 3, 4, 5, 6)
// numbers.partition(_ % 2 == 0)
// output: (List[Int], List[Int]) = (List(2, 4, 6), List(1, 3, 5))

/*function chain<T, K extends string = string>(fns: Record<string, (val: T, ...args: any[]) => T>): From<T, K>
function chain<T, K extends string = string>(fns: Record<string, (val: T, ...args: any[]) => T>, seed: T): Chain<T, K>
function chain<T, K extends string = string>(fns: Record<string, (val: T, ...args: any[]) => T>, seed?: T) {
	return seed
		? objectMap(fns, f => (...args: any[]) => {
			const r = f(seed, ...args)
			// eslint-disable-next-line fp/no-mutating-assign
			return Object.assign(r, chain(fns, r))
		})
		: {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			from: (val: T) => chain(fns, val)
		}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Chain<T, K extends string = string> = Record<K, (...args: any[]) => T & Chain<T>>
type From<T, K extends string = string> = { from: (val: T) => Chain<T, K> }

const test = chain({ filter, skip, take })

test.from([1, 2, 3])
*/

/*
// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Iterable {
	export type AsyncGenerated<T> = AsyncIterable<T>
	export type AsyncValued<T> = Iterable<Promise<T>>
	export type AsyncDeferredValued<T> = Iterable<() => Promise<T>>
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class IterableDeferred<X> implements Iterable<Promise<X>> {
	constructor(protected items: Iterable<() => Promise<X>>) {

	}

	*[Symbol.iterator]() {
		for (const item of this.items) {
			yield item()
		}
	}
}*/