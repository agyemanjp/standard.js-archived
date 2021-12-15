/* eslint-disable fp/no-rest-parameters */
/* eslint-disable fp/no-let */
/* eslint-disable fp/no-mutation */
/* eslint-disable fp/no-loops */
/* eslint-disable fp/no-unused-expression */
/* eslint-disable brace-style */


import { Ranker, RankerAsync, Reducer, ReducerAsync, Projector, ProjectorAsync, Predicate, PredicateAsync } from "../functional"
import { Obj, Primitive, Tuple, Collection, TypeGuard, ExtractByType, hasValue } from "../utility"
import { entries, objectFromTuples, objectFromTuplesAsync } from "../object"
import { Zip, ZipAsync } from "./types"

type UnwrapIterable1<T> = T extends Iterable<infer X> ? X : T
type UnwrapIterable2<T> = T extends Iterable<infer X> ? UnwrapIterable1<X> : T
type UnwrapIterable3<T> = T extends Iterable<infer X> ? UnwrapIterable2<X> : T
export type UnwrapNestedIterable<T> = T extends Iterable<infer X> ? UnwrapIterable3<X> : T

/** Iterable type guard */
export function isIterable<T, _>(val: Iterable<T> | _): val is _ extends Iterable<infer X> ? never : Iterable<T> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return hasValue(val) && typeof (val as any)[Symbol.iterator] === "function"
}
/** AsyncIterable type guard */
export function isAsyncIterable<T, _>(val: AsyncIterable<T> | _): val is _ extends AsyncIterable<infer X> ? never : AsyncIterable<T> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return hasValue(val) && typeof (val as any)[Symbol.asyncIterator] === "function"
}
/** General collection type guard */
export function isCollection<T, _>(val: Collection<T> | _): val is _ extends Collection<infer X> ? never : Collection<T> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return hasValue(val) && (isIterable(val) || isAsyncIterable(val))
}

/** Generate a sequence of integers */
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

/** Turns n iterables into an iterable of n-tuples
 * The shortest iterable determines the length of the result
 */
export function zip<T extends readonly Iterable<unknown>[]>(...iterables: T): IterableIterator<Zip<T>> {
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
/** Turns n (possible async) iterables into an async iterable of n-tuples
 * The shortest iterable determines the length of the resulting iterable
 */
export async function* zipAsync<T extends readonly (AsyncIterable<unknown> | Iterable<unknown>)[]>(...iterables: T): AsyncIterable<ZipAsync<T>> {
	// console.assert(iterables.every(iter => isAsyncIterable(iter)))

	//const iterators = iterables.map(i => i[Symbol.asyncIterator]() as AsyncIterator<unknown>)
	const iters = iterables.map(arg =>
		isIterable(arg)
			? arg[Symbol.iterator]()
			: arg[Symbol.asyncIterator]())
	const itersDone = iters.map(iter => ({ done: false as boolean | undefined, iter }))

	try {
		while (true) {
			const results = map(iters, iter => iter.next())
			// eslint-disable-next-line no-await-in-loop
			const syncResults = await Promise.all(results)

			const zipped = new Array(iters.length)

			let i = 0
			let allDone = true as boolean | undefined
			let done = false as boolean | undefined
			for (const result of syncResults) {
				allDone = allDone && result.done
				done = done || result.done
				itersDone[i].done = result.done
				zipped[i] = result.value
				i++
			}

			if (done) break
			yield zipped as unknown as ZipAsync<T>
			if (allDone) break
		}
	}
	finally {
		for (const { iter, done } of itersDone) {
			// eslint-disable-next-line no-await-in-loop
			if (!done && typeof iter.return === 'function') await iter.return()
		}
	}
	// eslint-disable-next-line fp/no-let
	/*let done = false
	return {
		[Symbol.asyncIterator]() { return this },
		async next() {
			if (!done) {
				const items = await Promise.all(iterators.map(i => i.next()))
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
	}*/
}

/** Transform an iterable into another of tuples containing the a sequential index and the orginal values */
export function* indexed<T>(items: Iterable<T>, from = 0) {
	yield* zip(integers({ from, direction: "upwards" }), items)
}
export async function* indexedAsync<T>(items: Collection<T>, from = 0) {
	yield* zipAsync(integers({ from, direction: "upwards" }), items)
}

/** Take n elements from start of sequence */
export function* take<T>(iterable: Iterable<T>, n: number): Iterable<T> {
	if (typeof n !== "number") throw new Error(`Invalid type ${typeof n} for argument "n"\nMust be number`)
	if (n < 0) {
		// console.warn(`Warning: Negative value ${n} passed to argument <n> of take()`)
		return
	}

	if (n > 0) {
		for (const element of iterable) {
			yield element
			if (--n <= 0) break
		}
	}
}
export async function* takeAsync<T>(collection: Collection<T>, n: number): AsyncIterable<T> {
	if (typeof n !== "number")
		throw new Error(`take(): Invalid type ${typeof n} for argument "n"\nMust be number`)
	if (n < 0) {
		console.warn(`Warning: Negative value ${n} passed to argument <n> of take()`)
		return
	}

	if (n > 0) {
		for await (const element of collection) {
			yield element
			if (--n <= 0) break
		}
	}
}
/** Return all elements while a condition is not violated */
export function* takeWhile<X>(iterable: Iterable<X>, predicate: Predicate<X, number | void>): Iterable<X> {
	if (typeof predicate !== "function") throw new Error(`Invalid type ${typeof predicate} for 2nd argument "predicate"\nMust be function`)

	for (const element of indexed(iterable)) {
		if (predicate(element[1], element[0]))
			yield element[1]
		else
			break
	}
}

/** Skip n elements from start of collection
 * If n is negative, no items are skipped
 * If n equals or exceeds the length of the collection, all items are skipped
 */
export function* skip<T>(iterable: Iterable<T>, n: number): Iterable<T> {
	if (typeof n !== "number")
		throw new Error(`Invalid type ${typeof n} for argument "n"\nMust be number`)

	for (const element of iterable) {
		if (n <= 0)
			yield element
		else
			n--
	}
}
export async function* skipAsync<T>(iterable: Collection<T>, n: number): AsyncIterable<T> {
	if (typeof n !== "number")
		throw new Error(`Invalid type ${typeof n} for argument "n"\nMust be number`)
	if (n < 0) {
		// console.warn(`Warning: Negative value ${n} passed to argument <n> of skip()`)
		return
	}

	for await (const element of iterable) {
		if (n === 0)
			yield element
		else
			n--
	}
}
/** Return all remaining elements beginning from when condition is violated */
export function* skipWhile<T>(iterable: Iterable<T>, predicate: Predicate<T, number | void>): Iterable<T> {
	if (typeof predicate !== "function") throw new Error(`Invalid type ${typeof predicate} for 2nd argument "predicate"\nMust be function`)

	for (const element of indexed(iterable)) {
		if (predicate(element[1], element[0]))
			continue
		else
			yield element[1]
	}
}

export function map<X, Y>(collection: Obj<X>, projector: Projector<X, Y, string>): Obj<Y>
export function map<X, Y>(collection: Iterable<X>, projector: Projector<X, Y, number>): Iterable<Y>
export function* map<X, Y>(collection: Iterable<X> | Obj<X>, projector: Projector<X, Y, any>) {
	if (isIterable(collection))
		// yield* zip(integers({ from, direction: "upwards" }), items)
		for (const tuple of indexed(collection)) {
			yield projector(tuple[1], tuple[0])
		}
	else {
		return objectFromTuples(entries(collection).map(kv =>
			new Tuple(kv[0], projector(kv[1], kv[0])))
		)
	}
}

export function mapAsync<X, Y>(collection: Obj<X>, projector: ProjectorAsync<X, Y, string>): Promise<Obj<Y>>
export function mapAsync<X, Y>(collection: Collection<X>, projector: ProjectorAsync<X, Y, number>): AsyncIterableIterator<Y>
export async function* mapAsync<X, Y>(collection: Collection<X> | Obj<X>, projector: ProjectorAsync<X, Y, any>): AsyncIterableIterator<Y> | Promise<Obj<Y>> {
	if (isCollection(collection)) {
		for await (const tuple of indexedAsync(collection)) {
			yield projector(tuple[1], tuple[0])
		}
	}
	else {
		return objectFromTuplesAsync(mapAsync(entries(collection), async kv => new Tuple(kv[0], projector(kv[1], kv[0]))))
	}
}

export function* reduce<X, Y>(iterable: Iterable<X>, initial: Y, reducer: Reducer<X, Y>): Iterable<Y> {
	for (const tuple of indexed(iterable)) {
		initial = reducer(initial, tuple[1], tuple[0])
		yield initial
	}
}
export async function* reduceAsync<X, Y>(iterable: Collection<X>, initial: Y, reducer: ReducerAsync<X, Y>): AsyncIterable<Y> {
	for await (const tuple of indexedAsync(iterable)) {
		initial = await reducer(initial, tuple[1], tuple[0])
		yield initial
	}
}

export function filter<T extends Obj>(obj: T, predicate: Predicate<T[keyof T], keyof T>): Partial<T>
export function filter<T extends Obj<V>, V, V1 extends V>(obj: T, predicate: TypeGuard<V, V1>): ExtractByType<T, V1>

export function filter<X>(object: Obj<X>, predicate: Predicate<X, string>): Partial<Obj<X>>
export function filter<X>(collection: Iterable<X>, predicate: Predicate<X, number>): Iterable<X>
export function filter<X, X1 extends X>(collection: Iterable<X>, predicate: TypeGuard<X, X1>): Iterable<X1>
export function* filter<X, X1 extends X>(elements: Iterable<X> | Obj<X>, predicate: Predicate<X, any> | TypeGuard<X, X1>) {
	if (isIterable(elements)) {
		for (const tuple of indexed(elements)) {
			if (predicate(tuple[1], tuple[0]))
				yield tuple[1]
			else
				continue
		}
	}
	else {
		return objectFromTuples(entries(elements).filter(entry => predicate(entry[1], entry[0])))
	}
}

export function filterAsync<T extends Obj>(obj: T, predicate: PredicateAsync<T[keyof T], keyof T>): Partial<T>
export function filterAsync<X>(obj: Obj<X>, predicate: PredicateAsync<X, string>): Partial<Obj<X>>
export function filterAsync<X, X1 extends X>(obj: Obj<X>, predicate: TypeGuard<X, X1>): Partial<Obj<X>>
export function filterAsync<X>(iterable: Collection<X>, predicate: PredicateAsync<X, number>): AsyncIterable<X>
export function filterAsync<X, X1 extends X>(iterable: Collection<X>, predicate: TypeGuard<X, X1>): AsyncIterable<X1>
export async function* filterAsync<X, X1 extends X>(elements: Collection<X> | Obj<X>, predicate: PredicateAsync<X, any> | TypeGuard<X, X1>) {
	if (isCollection(elements))
		for await (const tuple of indexedAsync(elements)) {
			if (await predicate(tuple[1], tuple[0]))
				yield tuple[1]
			else
				continue
		}
	else {
		return objectFromTuplesAsync(filterAsync(entries(elements), async entry => predicate(entry[1], entry[0])))
	}
}

export function contains<A>(iterable: Iterable<A>, value: A) {
	for (const x of iterable) {
		if (x === value) {
			return true
		}
	}

	return false
}
export async function containsAsync<T>(iterable: Collection<T>, value: T) {
	for await (const x of iterable) {
		if (x === value) return true
	}
	return false
}

export function* unique<T>(iterable: Iterable<T>, projector?: Projector<T, Primitive, void>): Iterable<T> {
	const seen = new globalThis.Set()

	outer:
	for (const element of iterable) {
		const elt = projector ? projector(element) : element
		if (seen.has(elt))
			continue outer
		else {
			// eslint-disable-next-line fp/no-unused-expression
			seen.add(elt)
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

// eslint-disable-next-line fp/no-mutating-methods
export function sort<T>(items: Iterable<T>, comparer?: Ranker<T>) { return [...items].sort(comparer) }

export function* flatten<X>(nestedIterable: Iterable<X>): Iterable<UnwrapNestedIterable<X>> {
	// console.log(`\nInput to flatten: ${JSON.stringify(nestedIterable)}`)
	if (nestedIterable) {
		for (const element of nestedIterable) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			if (hasValue(element) && typeof element !== "string" && typeof (element as any)[Symbol.iterator] === 'function') {
				//console.log(`flatten: element <${JSON.stringify(element)}> is iterable; flattening it *`)
				yield* flatten(element as unknown as Iterable<X>)
			}
			else {
				//console.log(`flatten: element <${JSON.stringify(element)}> is not iterable; yielding it *`)
				yield element as UnwrapNestedIterable<X>
			}
		}
	}
}

export function forEach<T>(iterable: Iterable<T>, action: Projector<T>) {
	for (const tuple of indexed(iterable)) {
		// eslint-disable-next-line fp/no-unused-expression
		action(tuple[1], tuple[0])
	}
}
export async function forEachAsync<T>(items: Iterable<T> | Generator<T> | AsyncIterable<T> | AsyncGenerator<T>, action: Projector<T>): Promise<void>
export async function forEachAsync<T>(items: Iterable<T> | Generator<T> | AsyncIterable<T> | AsyncGenerator<T>, action: ProjectorAsync<T>): Promise<void>
export async function forEachAsync<T>(iterable: Iterable<T> | Generator<T> | AsyncIterable<T> | AsyncGenerator<T>, action: Projector<T> | ProjectorAsync<T>) {
	for await (const tuple of indexedAsync(iterable)) {
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
export async function firstAsync<T>(items: Iterable<T> | Generator<T> | AsyncIterable<T> | AsyncGenerator<T>, predicate?: Predicate<T>): Promise<T | undefined>
export async function firstAsync<T>(items: Iterable<T> | Generator<T> | AsyncIterable<T> | AsyncGenerator<T>, predicate?: PredicateAsync<T>): Promise<T | undefined>
export async function firstAsync<T>(items: Iterable<T> | Generator<T> | AsyncIterable<T> | AsyncGenerator<T>, predicate?: Predicate<T> | PredicateAsync<T>): Promise<T | undefined> {
	for await (const tuple of indexedAsync(items)) {
		if (predicate === undefined || predicate(tuple[1], tuple[0]))
			return tuple[1]
	}
	return undefined
}

/** Get last element (or last element to satisfy optional predicate argument) of this sequence
 * @param getter Optional direct access getter, for improved performance for array-like collections
 * @param predicate Optional predicate to filter elements
 * @returns Last element as defined, or <undefined> if such an element is not found
 */
export function last<T>(collection: Iterable<T> | ArrayLike<T> | { length: number, get: (index: number) => T }, predicate?: Predicate<T>): T | undefined {
	if ("length" in collection) { // Arraylike-specific implementation of last() for better performance using direct elements access
		const accessor = (i: number) => ("get" in collection) ? collection.get(i) : collection[i]
		for (let i = collection.length - 1; i >= 0; i--) {
			const element = accessor(i)
			if (predicate === undefined || predicate(element, i))
				return element
		}
		return undefined
	}
	else {
		console.assert(isIterable(collection))
		// eslint-disable-next-line fp/no-let
		let _last = undefined as T | undefined
		const iterable = predicate === undefined ? collection : filter(collection, predicate)
		for (const element of iterable) {
			_last = element
		}
		return _last
	}
}
export async function lastAsync<T>(collection: AsyncIterable<T> | Iterable<T> | ArrayLike<T> | { length: number, get: (index: number) => T }, predicate?: Predicate<T, number>): Promise<T | undefined>
export async function lastAsync<T>(collection: AsyncIterable<T> | Iterable<T> | ArrayLike<T> | { length: number, get: (index: number) => T }, predicate?: PredicateAsync<T, number>): Promise<T | undefined>
export async function lastAsync<T>(collection: AsyncIterable<T> | Iterable<T> | ArrayLike<T> | { length: number, get: (index: number) => T }, predicate?: Predicate<T, number> | PredicateAsync<T, number>): Promise<T | undefined> {
	if ("length" in collection) { // Array-like-specific implementation of last() for better performance using direct elements access
		const accessor = (i: number) => ("get" in collection) ? collection.get(i) : collection[i]
		for (let i = collection.length - 1; i >= 0; i--) {
			const element = accessor(i)
			if (predicate === undefined || predicate(element, i))
				return element
		}
		return undefined
	}
	else {
		console.assert(isAsyncIterable(collection))
		// eslint-disable-next-line fp/no-let
		let _last = undefined as T | undefined
		const iterable = predicate === undefined ? collection : filterAsync(collection, predicate as any)
		for await (const element of iterable) {
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
export async function someAsync<T>(iter: Iterable<T> | Generator<T> | AsyncIterable<T> | AsyncGenerator<T>, predicate: Predicate<T>): Promise<boolean>
export async function someAsync<T>(iter: Iterable<T> | Generator<T> | AsyncIterable<T> | AsyncGenerator<T>, predicate: PredicateAsync<T>): Promise<boolean>
export async function someAsync<T>(iter: Iterable<T> | Generator<T> | AsyncIterable<T> | AsyncGenerator<T>, predicate: Predicate<T> | PredicateAsync<T>) {
	for await (const tuple of indexedAsync(iter)) {
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

export async function everyAsync<T>(items: Iterable<T> | Generator<T> | AsyncIterable<T> | AsyncGenerator<T>, predicate: Predicate<T>): Promise<boolean>
export async function everyAsync<T>(items: Iterable<T> | Generator<T> | AsyncIterable<T> | AsyncGenerator<T>, predicate: PredicateAsync<T>): Promise<boolean>
export async function everyAsync<T>(items: Iterable<T> | Generator<T> | AsyncIterable<T> | AsyncGenerator<T>, predicate: Predicate<T> | PredicateAsync<T>) {
	for await (const tuple of indexedAsync(items)) {
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

/** */
export function complement<T>(target: ArrayLike<T>, universe: Iterable<T>): Iterable<T> {
	throw new Error(`Not Implemented`)
}

/** */
export function indexesOf<K, V>(collection: Iterable<Tuple<K, V>>, target: ({ value: V } | { predicate: Predicate<V, K> })) {
	return 'value' in target
		? map(filter(collection, kv => kv[1] === target.value), kv => kv[0])
		: map(filter(collection, kv => target.predicate(kv[1], kv[0])), kv => kv[0])
}

export function* repeat(val: unknown, count?: number) {
	while (count === undefined || (--count >= 0)) {
		yield val
	}
}

export async function toArrayAsync<T>(iterable: Collection<T>) {
	const arr = [] as Array<T>
	for await (const element of iterable) {
		// eslint-disable-next-line fp/no-mutating-methods
		arr.push(element)
	}
	return arr
}

/*async function mapDictAsync<X, Y, I>(projection: AsyncProjector<X, Y, I>) {
	var _map = new Dictionary<T>()
	let promisesArr = this.entries()
		.map(entry => projection(entry[1]!, entry[0]))

	let resolvedArr = await Promise.all(promisesArr)
	return new Dictionary(resolvedArr);
}*/

/* export async function* filterAsync<T>(iterable: AsyncIterable<T>, predicate: PredicateAsync<T>, options: { concurrency: number }) {
	let c = 0

	const mapped = new ParallelRunner(
		iterable[Symbol.asyncIterator](),
		async item => ({ item, value: await func(item, c++) }),
		concurrency,
	)

	for await (const item of mapped) {
		if (item.value) {
			yield item.item
		}
	}
}
*/
