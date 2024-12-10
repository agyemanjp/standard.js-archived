import { entries, objectFromTuples, objectFromTuplesAsync } from "../object"
import { isAsyncIterable, type Rec, isIterable, Tuple, type TypeGuard, type Primitive, hasValue, type IterableRecursive, type ArrayRecursive } from "../common"
import type { Zip, ZipAsync, Predicate, PredicateAsync, Projector, ProjectorAsync, Reducer, ReducerAsync, Ranker, CollectionIndexed, CollectionFinite } from "./types"

type UnwrapIterable1<T> = T extends Iterable<infer X> ? X : T
type UnwrapIterable2<T> = T extends Iterable<infer X> ? UnwrapIterable1<X> : T
type UnwrapIterable3<T> = T extends Iterable<infer X> ? UnwrapIterable2<X> : T
export type UnwrapNestedIterable<T> = T extends Iterable<infer X> ? UnwrapIterable3<X> : T


/** Generate a sequence of integers */
export function* integers(args: { from: number, to: number } | { from: number, direction: "upwards" | "downwards" }) {
	let num = args.from
	do {
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

	for (let i = 0; i < length; i++) {
		yield (from + (i * delta))
	}
}

/** Turns n iterables into an iterable of n-tuples
 * The shortest iterable determines the length of the result
 */
export function zip<T extends readonly Iterable<unknown>[]>(...iterables: T): IterableIterator<Zip<T>> {
	console.assert(iterables.every(iter => typeof iter[Symbol.iterator] === "function"))

	const iterators = iterables.map(i => i[Symbol.iterator]())
	let done = false
	return {
		[Symbol.iterator]() { return this },
		next() {
			if (!done) {
				const items = iterators.map(i => i.next())
				done = items.some(item => item.done)
				if (!done) {
					return { value: items.map(i => i.value) as unknown as Zip<T>, done: false }
				}
				// Done for the first time: close all iterators
				for (const iterator of iterators) {
					if (iterator.return) { iterator.return() }
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
	const iters = iterables.map(arg => isAsyncIterable(arg) ? arg[Symbol.asyncIterator]() : arg[Symbol.iterator]())
	const itersDone = iters.map(iter => ({ done: false as boolean | undefined, iter }))

	try {
		while (true) {
			const results = map(iters, iter => iter.next())
			const syncResults = await Promise.all(results)

			const zipped = new Array(iters.length)

			let i = 0
			let allDone = true as boolean | undefined
			let done = false as boolean | undefined
			for (const result of syncResults) {
				allDone = allDone === true && result.done
				done = done === true || result.done
				const thisItersDone = itersDone[i]
				if (thisItersDone) thisItersDone.done = result.done
				zipped[i] = result.value
				i++
			}

			if (done === true) break
			yield zipped as unknown as ZipAsync<T>
			if (allDone === true) break
		}
	}
	finally {
		for (const { iter, done } of itersDone) {
			if (!(done === true) && typeof iter.return === 'function') await iter.return()
		}
	}
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
export async function* indexedAsync<T>(items: Iterable<T> | AsyncIterable<T>, from = 0) {
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
export async function* takeAsync<T>(collection: Iterable<T> | AsyncIterable<T>, n: number): AsyncIterable<T> {
	if (typeof n !== "number") { throw new Error(`take(): Invalid type ${typeof n} for argument "n"\nMust be number`) }
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
		if (predicate(element[1], element[0])) { yield element[1] }
		else { break }
	}
}
export async function* takeWhileAsync<X>(iterable: Iterable<X> | AsyncIterable<X>, predicate: PredicateAsync<X, number | void>): AsyncIterable<X> {
	if (typeof predicate !== "function") { throw new Error(`Invalid type ${typeof predicate} for 2nd argument "predicate"\nMust be function`) }
	for await (const element of indexedAsync(iterable)) {
		if (await predicate(element[1], element[0])) { yield element[1] }
		else { break }
	}
}

/** Skip n elements from start of collection
 * If n is negative, no items are skipped
 * If n equals or exceeds the length of the collection, all items are skipped
 */
export function* skip<T>(iterable: Iterable<T>, n: number): Iterable<T> {
	if (typeof n !== "number") { throw new Error(`Invalid type ${typeof n} for argument "n"\nMust be number`) }

	for (const element of iterable) {
		if (n <= 0) { yield element }
		else { n-- }
	}
}
export async function* skipAsync<T>(iterable: Iterable<T> | AsyncIterable<T>, n: number): AsyncIterable<T> {
	if (typeof n !== "number") { throw new Error(`Invalid type ${typeof n} for argument "n"\nMust be number`) }
	if (n < 0) {
		// console.warn(`Warning: Negative value ${n} passed to argument <n> of skip()`)
		return
	}

	for await (const element of iterable) {
		if (n === 0) { yield element }
		else { n-- }
	}
}

/** Return all remaining elements beginning from when condition is violated */
export function* skipWhile<T>(iterable: Iterable<T>, predicate: Predicate<T, number | void>): Iterable<T> {
	if (typeof predicate !== "function") throw new Error(`Invalid type ${typeof predicate} for 2nd argument "predicate"\nMust be function`)

	for (const element of indexed(iterable)) {
		if (predicate(element[1], element[0])) { continue }
		else { yield element[1] }
	}
}
export async function* skipWhileAsync<T>(iterable: Iterable<T> | AsyncIterable<T>, predicate: PredicateAsync<T, number | void>): AsyncIterable<T> {
	if (typeof predicate !== "function") { throw new Error(`Invalid type ${typeof predicate} for 2nd argument "predicate"\nMust be function`) }

	for await (const element of indexedAsync(iterable)) {
		if (await predicate(element[1], element[0])) { continue }
		else { yield element[1] }
	}
}

export function map<X, Y>(collection: Iterable<X>, projector: Projector<X, Y, number>): Iterable<Y>
export function map<X, Y, K extends string = string>(collection: Rec<X, K>, projector: Projector<X, Y, K>): Rec<Y, K>
export function map<X, Y>(collection: Rec<X>, projector: Projector<X, Y, string>): Rec<Y>
export function map<X, Y>(collection: Iterable<X> | Rec<X>, projector: Projector<X, Y, any>) {
	if (isIterable(collection)) {
		return (function* () {
			for (const tuple of indexed(collection)) {
				yield projector(tuple[1], tuple[0])
			}
		})()
	}
	else {
		// console.log(`Map(): Collection ${JSON.stringify(collection)} is not iterable`)
		return objectFromTuples(entries(collection).map(kv =>
			new Tuple(kv[0], projector(kv[1], kv[0])))
		)
	}
}

export function mapAsync<X, Y>(collection: Rec<X>, projector: ProjectorAsync<X, Y, string>): Promise<Rec<Y>>
export function mapAsync<X, Y>(collection: Rec<X>, projector: ProjectorAsync<X, Y, void>): Promise<Rec<Y>>
export function mapAsync<X, Y>(collection: Iterable<X> | AsyncIterable<X>, projector: ProjectorAsync<X, Y, number>): AsyncIterable<Y>
export function mapAsync<X, Y>(collection: Iterable<X> | AsyncIterable<X>, projector: ProjectorAsync<X, Y, void>): AsyncIterable<Y>
export function mapAsync<X, Y>(collection: Iterable<X> | AsyncIterable<X> | Rec<X>, projector: ProjectorAsync<X, Y, any>): Promise<Rec<Y>> | AsyncIterable<Y> {
	if (isIterable(collection) || isAsyncIterable(collection)) {
		return (async function* () {
			for await (const tuple of indexedAsync(collection)) {
				yield projector(tuple[1], tuple[0])
			}
		})()
	}
	else {
		return objectFromTuplesAsync(mapAsync(entries(collection), async kv => new Tuple(kv[0], await projector(kv[1], kv[0]))))
	}
}

export function* reduce<X, Y>(iterable: Iterable<X>, initial: Y, reducer: Reducer<X, Y>): Iterable<Y> {
	yield initial
	for (const tuple of indexed(iterable)) {
		initial = reducer(initial, tuple[1], tuple[0])
		yield initial
	}
}
export async function* reduceAsync<X, Y>(iterable: Iterable<X> | AsyncIterable<X>, initial: Y, reducer: ReducerAsync<X, Y>): AsyncIterable<Y> {
	yield initial
	for await (const tuple of indexedAsync(iterable)) {
		initial = await reducer(initial, tuple[1], tuple[0])
		yield initial
	}
}

// const x = filter(process.env, "by-typeguard", (_): _ is string => true)

/** Filter iterable data based on a type-guards (for proper typing of the result) or predicate. */
export function filter<X, X1 extends X>(collection: Iterable<X>, guard: ["by-typeguard", TypeGuard<X, X1>]): Iterable<X1>
export function filter<X>(collection: Iterable<X>, predicate: Predicate<X, number>): Iterable<X>
export function filter<X, X1 extends X>(elements: Iterable<X>, predicate: ["by-typeguard", TypeGuard<X, X1>] | Predicate<X, any>) {
	const predEffective = (tuple: Tuple<string | number, X>) => (
		(typeof predicate === "function" && predicate(tuple[1], tuple[0])) ||
		(typeof predicate !== "function" && predicate[1](tuple[1]))
	)

	// console.log(`Filter data ${elements} is iterable; treating as collection`)
	return (function* _() {
		for (const tuple of indexed(elements)) {
			if (predEffective(tuple))
				yield tuple[1]
			else
				continue
		}
	})()
}

/** Filter async iterable data based on a type-guard (for proper typing of the result) or predicate. */
export function filterAsync<X, X1 extends X>(obj: Rec<X>, predicate: TypeGuard<X, X1>): Partial<Rec<X>>
export function filterAsync<X, X1 extends X>(iterable: Iterable<X> | AsyncIterable<X>, predicate: TypeGuard<X, X1>): AsyncIterable<X1>
export function filterAsync<T extends Rec>(obj: T, predicate: PredicateAsync<T[keyof T], keyof T>): Partial<T>
export function filterAsync<X>(obj: Rec<X>, predicate: PredicateAsync<X, string>): Partial<Rec<X>>
export function filterAsync<X>(iterable: Iterable<X> | AsyncIterable<X>, predicate: Predicate<X, number> | PredicateAsync<X, number>): AsyncIterable<X>
export async function* filterAsync<X, X1 extends X>(elements: Iterable<X> | AsyncIterable<X> | Rec<X>, predicate: Predicate<X, any> | PredicateAsync<X, any> | TypeGuard<X, X1>) {
	if (isIterable(elements) || isAsyncIterable(elements)) {
		for await (const tuple of indexedAsync(elements)) {
			if ((await predicate(tuple[1], tuple[0])) === true) {
				yield tuple[1]
			}
			else {
				continue
			}
		}
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
export async function containsAsync<T>(iterable: Iterable<T> | AsyncIterable<T>, value: T) {
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
		if (seen.has(elt)) { continue outer }
		else {
			seen.add(elt)
		}
		yield element

	}
}
export async function* uniqueAsync<T>(iterable: Iterable<T> | AsyncIterable<T>, projector?: ProjectorAsync<T, Primitive, void>): AsyncIterable<T> {
	const seen = new globalThis.Set()

	outer:
	for await (const element of iterable) {
		const elt = projector ? await projector(element) : element
		if (seen.has(elt)) { continue outer }
		else {
			seen.add(elt)
		}
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
		yield batch
		yield* chunk(skip(iter, chunkSize), chunkSize)
	}
}
export async function* chunkAsync<T>(iter: Iterable<T> | AsyncIterable<T>, chunkSize: number): AsyncIterable<T[]> {
	const batch = [...(await toArrayAsync(takeAsync(iter, chunkSize)))]
	if (batch.length > 0) {
		yield batch
		yield* chunkAsync(skipAsync(iter, chunkSize), chunkSize)
	}
}

export function sort<T>(items: Iterable<T>, ranker?: Ranker<T>) { return [...items].sort(ranker) }
export async function sortAsync<T>(data: Iterable<T> | AsyncIterable<T>, ranker?: Ranker<T> /*| RankerAsync<T>*/) {
	return (await toArrayAsync(data)).sort(ranker)
}

export function* flatten<X>(nestedIterable: Iterable<X>): Iterable<UnwrapNestedIterable<X>> {
	// console.log(`\nInput to flatten: ${JSON.stringify(nestedIterable)}`)
	// if (nestedIterable) {
	for (const element of nestedIterable) {
		if (hasValue(element) && typeof element !== "string" && typeof (element as any)[Symbol.iterator] === 'function') {
			//console.log(`flatten: element <${JSON.stringify(element)}> is iterable; flattening it *`)
			yield* flatten(element as unknown as Iterable<X>)
		}
		else {
			//console.log(`flatten: element <${JSON.stringify(element)}> is not iterable; yielding it *`)
			yield element as UnwrapNestedIterable<X>
		}
	}
	// }
}
export function* flat<X>(input: IterableRecursive<X> | ArrayRecursive<X>): Iterable<X> {
	// console.log(`\nInput to flatten: ${JSON.stringify(input)}`)

	for (const element of input) {
		if (isIterable(element)) {
			// console.log(`flatten: element <${JSON.stringify(element)}> is iterable; flattening it`)
			yield* flat(element)
		}
		else {
			// console.log(`flatten: element <${JSON.stringify(element)}> is not iterable; yielding it`)
			yield element
		}
	}
}

export function forEach<T>(iterable: Iterable<T>, action: Projector<T>) {
	for (const tuple of indexed(iterable)) {
		action(tuple[1], tuple[0])
	}
}
export async function forEachAsync<T>(items: Iterable<T> | Generator<T> | AsyncIterable<T> | AsyncGenerator<T>, action: Projector<T>): Promise<void>
export async function forEachAsync<T>(items: Iterable<T> | Generator<T> | AsyncIterable<T> | AsyncGenerator<T>, action: ProjectorAsync<T>): Promise<void>
export async function forEachAsync<T>(iterable: Iterable<T> | Generator<T> | AsyncIterable<T> | AsyncGenerator<T>, action: Projector<T> | ProjectorAsync<T>) {
	for await (const tuple of indexedAsync(iterable)) {
		action(tuple[1], tuple[0])
	}
}

/** Get first element (or first element to satisfy a predicate, if supplied) of some data
 * @param data The input data, as an iterable collection
 * @param predicate Optional predicate applied to the data
 * @returns First element (as defined above) of data 
 * @throws An error if such a first element cannot found
 */
export function first<T>(data: Iterable<T>, predicate?: Predicate<T>): T {
	const _first = firstOrDefault(data, { predicate })
	if (_first) { return _first }
	else { throw new Error(`First element not found`) }
}
/** Get first element (or first element to satisfy a predicate, if supplied) of iterable data
 * @param data The input data, as an iterable collection
 * @param predicate Optional predicate applied to the data
 * @param defaultValue Optional default value to return if first element is not found (defaults to <undefined>)
 * @returns First element (as defined above) of data, or the defaultValue argument, if not found
 */
export function firstOrDefault<T>(data: Iterable<T>): T | undefined
export function firstOrDefault<T, D extends T | null | undefined>(data: Iterable<T>, options: { predicate?: Predicate<T>, defaultValue?: D }): T | D
export function firstOrDefault<T>(data: Iterable<T>, options?: { predicate?: Predicate<T>, defaultValue?: T }) {
	const { predicate, defaultValue } = options ?? {}
	for (const tuple of indexed(data)) {
		if (predicate === undefined || predicate(tuple[1], tuple[0])) { return tuple[1] }
	}
	return (typeof defaultValue === "undefined") ? undefined : defaultValue
}
/** Get first element (or first element to satisfy a predicate, if supplied) of (possibly async) iterable data
 * @param data The iterable data to process
 * @param predicate Optional predicate applied to the data
 * @returns First element (as defined above) of data 
 * @throws An error if such a first element cannot found
 */
export async function firstAsync<T>(data: Iterable<T> | AsyncIterable<T>, predicate?: Predicate<T> | PredicateAsync<T>): Promise<T> {
	const _first = await firstOrDefaultAsync(data, { predicate })
	if (_first) { return _first }
	else { throw new Error(`Last element not found`) }
}

/** Get first element (or first element to satisfy a predicate, if supplied) of (possibly async) iterable data
 * @param data The iterable data to process
 * @param predicate Optional predicate applied to the data
 * @param defaultValue Optional default value to return if first element is not found (defaults to <undefined>)
 * @returns First element (as defined above) of data, or the defaultValue argument, if not found
 */
export async function firstOrDefaultAsync<T>(data: Iterable<T> | AsyncIterable<T>): Promise<T | undefined>
export async function firstOrDefaultAsync<T, D extends null | undefined | T>(data: Iterable<T> | AsyncIterable<T>, options: { predicate?: Predicate<T> | PredicateAsync<T>, defaultValue?: D }): Promise<T | D>
export async function firstOrDefaultAsync<T>(data: Iterable<T> | AsyncIterable<T>, options?: { predicate?: Predicate<T> | PredicateAsync<T>, defaultValue?: T }) {
	const { predicate, defaultValue } = options ?? {}
	for await (const tuple of indexedAsync(data)) {
		if (predicate === undefined || predicate(tuple[1], tuple[0])) { return tuple[1] }
	}
	return (typeof defaultValue === "undefined") ? undefined : defaultValue
}

/** Get last element (or last element to satisfy a predicate, if supplied) of some data
 * @param data The input data, as an iterable (ensure it is finite) or finite, indexed-access collection
 * @param predicate Optional predicate applied to the data
 * @returns Last element (as defined above) of data 
 * @throws An error if such a last element cannot found
 */
export function last<T>(data: Iterable<T> | (CollectionIndexed<T> & CollectionFinite), predicate?: Predicate<T>): T {
	if ("size" in data || "length" in data) {
		// materialized-collection-specific implementation for better performance using direct elements access
		const accessor = (i: number) => ("get" in data) ? data.get(i) : data[i]
		const size = "size" in data ? data.size : data.length
		for (let i = size - 1; i >= 0; i--) {
			const element = accessor(i)!
			if (predicate === undefined || predicate(element, i)) { return element }
		}
		throw (`Last element not found`)
	}
	else {
		console.assert(isIterable(data))
		let _found = false
		let _last = undefined
		for (const element of (predicate === undefined ? data : filter(data, predicate))) {
			_last = element
			_found = true
		}
		if (_found) { return _last as T }
		else { throw (`Last element not found`) }
	}
}
/** Get last element (or last element to satisfy a predicate, if supplied) of some data
 * @param data The input data, as an iterable collection
 * @param predicate Optional predicate applied to the data
 * @param defaultValue Optional default value to return if last element is not found (defaults to <undefined>)
 * @returns Last element (as defined above) of data, or the defaultValue argument, if not found
 */
export function lastOrDefault<T>(data: Iterable<T> | (CollectionIndexed<T> & CollectionFinite)): T | undefined
export function lastOrDefault<T, D extends T | null | undefined>(data: Iterable<T> | (CollectionIndexed<T> & CollectionFinite), options: { predicate?: Predicate<T>, defaultValue?: D }): T | D
export function lastOrDefault<T>(data: Iterable<T> | (CollectionIndexed<T> & CollectionFinite), options?: { predicate?: Predicate<T>, defaultValue?: T }) {
	try {
		return last(data, options?.predicate)
	}
	catch (e) {
		return options?.defaultValue
	}
}

export async function lastAsync<T>(data: AsyncIterable<T> | Iterable<T> | (CollectionIndexed<T> & CollectionFinite), predicate?: Predicate<T> | PredicateAsync<T>): Promise<T> {
	if ("size" in data || "length" in data) {
		// materialized-collection-specific implementation for better performance using direct elements access
		const accessor = (i: number) => ("get" in data) ? data.get(i) : data[i]
		const size = "size" in data ? data.size : data.length
		for (let i = size - 1; i >= 0; i--) {
			const element = accessor(i)!
			if (predicate === undefined || (await predicate(element, i)) === true) { return element }
		}
		throw (`Last element not found`)
	}
	else {
		// console.assert(isIterable(data))
		let _found = false
		let _last = undefined
		for await (const element of (predicate === undefined ? data : filterAsync(data, predicate))) {
			_last = element
			_found = true
		}
		if (_found) { return _last as any as Promise<T> }
		else { throw (`Last element not found`) }
	}
}

/** Get first element (or first element to satisfy a predicate, if supplied) of (possibly async) iterable data
 * @param data The iterable data to process
 * @param predicate Optional predicate applied to the data
 * @param defaultValue Optional default value to return if first element is not found (defaults to <undefined>)
 * @returns First element (as defined above) of data, or the defaultValue argument, if not found
 */
export async function lastOrDefaultAsync<T>(data: AsyncIterable<T> | Iterable<T> | (CollectionIndexed<T> & CollectionFinite)): Promise<T | undefined>
export async function lastOrDefaultAsync<T, D extends null | undefined | T>(data: AsyncIterable<T> | Iterable<T> | (CollectionIndexed<T> & CollectionFinite), options: { predicate?: Predicate<T> | PredicateAsync<T>, defaultValue?: D }): Promise<T | D>
export async function lastOrDefaultAsync<T>(data: AsyncIterable<T> | Iterable<T> | (CollectionIndexed<T> & CollectionFinite), options?: { predicate?: Predicate<T> | PredicateAsync<T>, defaultValue?: T }): Promise<T | undefined> {
	try {
		return lastAsync(data, options?.predicate)
	}
	catch (e) {
		return options?.defaultValue
	}
}

/**  */
export function some<T>(iterable: Iterable<T>, predicate: Predicate<T, number>): boolean {
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
export function every<T>(iterable: Iterable<T>, predicate: Predicate<T, number>) {
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

/** All items that are present in all the input collections */
export function intersection<T>(collections: (Iterable<T> & CollectionFinite)[]): Iterable<T> {
	throw new Error(`Not Implemented`)
}

/** All items in <src>, except those in any of the <exclusions> collections 
 * @argument src The source iterable collection
 * @argument excluded An array of (finite) collections whose elements are to be excluded from the result
 */
export function except<T>(src: Iterable<T>, ...excluded: (Iterable<T> & CollectionFinite)[]): Iterable<T> {
	const s = new Set(union(excluded))
	return filter(src, item => !s.has(item))
}

/** All items in <universe> but not in <target> collection */
export function complement<T>(src: Iterable<T> & CollectionFinite, universe: Iterable<T>): Iterable<T> {
	const s = new Set(src)
	return filter(universe, item => !s.has(item))
}

/** */
export function indexesOf<K, V>(collection: Iterable<Tuple<K, V>>, target: ({ value: V } | { predicate: Predicate<V, K> })) {
	return 'value' in target
		? map(filter(collection, kv => kv[1] === target.value), kv => kv[0])
		: map(filter(collection, kv => target.predicate(kv[1], kv[0])), kv => kv[0])
}

export function* removeWhere<T>(items: Iterable<T>, predicate: Predicate<T>) {
	for (const tuple of indexed(items)) {
		if (predicate(tuple[1], tuple[0]) === false) yield tuple[1]
	}
}

export function* repeat(val: unknown, count?: number) {
	while (count === undefined || (--count >= 0)) {
		yield val
	}
}

export function group<T, G>(collection: Iterable<T>, grouper: Projector<T, G>) {
	return last(reduce(indexed(collection), {} as Map<G, Set<T>>, (prev, curr, index) => {
		const group = grouper(curr[1], curr[0])
		return (prev.has(group))
			? prev.set(group, prev.get(group)!.add(curr[1]))
			: prev.set(group, new Set([curr[1]]))
	}))
}

export function toArray<T>(iterable: Iterable<T>) {
	const arr = [] as Array<T>
	for (const element of iterable) {
		arr.push(element)
	}
	return arr
}
export async function toArrayAsync<T>(iterable: Iterable<T> | AsyncIterable<T>) {
	const arr = [] as Array<T>
	for await (const element of iterable) {
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

/*export function simplifyMaterialized<T>(collection: Partial<Finite & IndexedAccess<T> & Container<T>>) {
	return Object.assign([...collection], {
		contains: "contains" in collection
			? collection.contains
			: "includes" in collection
				? collection.includes
				: collection.has,
		size: "size" in collection
			? collection.size
			: collection.length
	})
}*/

