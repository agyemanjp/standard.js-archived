/* eslint-disable fp/no-rest-parameters */
/* eslint-disable fp/no-mutation */
/* eslint-disable fp/no-unused-expression */
/* eslint-disable brace-style */
/* eslint-disable fp/no-loops */

export type Primitive = number | string | bigint | boolean | symbol
export type ObjectLiteral<TValue = unknown, TKey extends string = string> = { [key in TKey]: TValue }
export type RecursivePartial<T> = { [P in keyof T]?: T[P] extends Record<string, unknown> ? RecursivePartial<T[P]> : T[P] }
export type ArrayElementType<T> = T extends (infer U)[] ? U : T

type UnwrapIterable1<T> = T extends Iterable<infer X> ? X : T
type UnwrapIterable2<T> = T extends Iterable<infer X> ? UnwrapIterable1<X> : T
type UnwrapIterable3<T> = T extends Iterable<infer X> ? UnwrapIterable2<X> : T
export type UnwrapNestedIterable<T> = T extends Iterable<infer X> ? UnwrapIterable3<X> : T

export type Tuple<X, Y> = [X, Y]
export const Tuple = class <X, Y>  {
	constructor(x: X, y: Y) {
		return [x, y] as Tuple<X, Y>
	}
} as { new <X, Y>(x: X, y: Y): [X, Y] }

export type Zip<A extends ReadonlyArray<unknown>> = { [K in keyof A]: A[K] extends Iterable<infer T> ? T : never }

/** Returns -1 if a is smaller than b; 0 if a & b are equal, and 1 if a is bigger than b */
export type Ranker<X = unknown> = (a: X, b: X) => number
/** Returns true if a and b are equal, otherwise returne false */
export type Comparer<X = unknown> = (a: X, b: X) => boolean
export type Projector<X = unknown, Y = unknown> = (value: X) => Y
export type ProjectorIndexed<X = unknown, Y = unknown, I = unknown> = (value: X, indexOrKey: I) => Y
export type Predicate<X = unknown> = (value: X) => boolean
export type Reducer<X = unknown, Y = unknown> = (prev: Y, current: X) => Y
export type ReducerIndexed<X = unknown, Y = unknown, I = unknown> = (prev: Y, current: X, indexOrKey: I) => Y


// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Collection {
	export interface Enumerable<X> extends Iterable<X> {
		take: (n: number) => Enumerable<X>
		skip: (n: number) => Enumerable<X>
		filter: (predicate: Predicate<X>) => Enumerable<X>

		map<Y extends [S, Z], Z, S extends string>(projector: Projector<X, Y>): Enumerable<[S, Z]>
		map<Y>(projector: Projector<X, Y>): Enumerable<Y> //Y extends [string, infer Z] ? Enumerable<[string, Z]> : Enumerable<Y>

		reduce: <Y>(initial: Y, reducer: Reducer<X, Y>) => Enumerable<Y>
		forEach: (action: Projector<X>) => void

		first(): X | undefined

		materialize(): MaterialExtended<X>
	}
	export interface Material<X> extends Enumerable<X> {
		size: number
		some(predicate: Predicate<X>): boolean
		every(predicate: Predicate<X>): boolean
	}
	export interface MaterialExtended<X> extends Material<X> {
		unique(comparer: Comparer<X>): Material<X>
		union(...collections: Material<X>[]): Material<X>
		intersection(...collections: Material<X>[]): Material<X>
		except(...collections: Material<X>[]): Material<X>
		complement(universe: Iterable<X>): Material<X>

		sort(comparer?: Ranker<X>): Ordered<X>
		sortDescending(comparer?: Ranker<X>): Ordered<X>

		//has(value: X): boolean
		contains(value: X): boolean
		//includes(value: X): boolean
	}
	export interface Indexed<K, V> {
		get(index: K): V | undefined
		get(indices: K[]): (V | undefined)[]
		get(...indices: K[]): (V | undefined)[]
		get(selector: K | K[]): undefined | V | V[]

		indexesOf(value: V): Enumerable<K>
		indexesOf(value: V, mode: "as-value"): Enumerable<K>
		indexesOf(value: Predicate<V>, mode: "as-predicate"): Enumerable<K>
	}
	export interface IndexedExtended<K, V> extends Indexed<K, V> {
		keys(): Material<K>
		hasKey(key: K): boolean

		values(): Material<V>
		hasValue(value: V): boolean

		//indexOf(args: ({ value: V } | { block: Iterable<V> } | { predicate: Predicate<V> }) & { fromIndex?: number, fromEnd?: boolean }): K
	}
	export interface Ordered<T> extends MaterialExtended<T>, Indexed<number, T> {
		last(): T | undefined
		reverse(): Ordered<T>

		//indexOfRange(range: Iterable<number>, fromIndex?: number, fromEnd?: boolean): number
	}
	export interface ArrayLike<T> extends Iterable<T> {
		length: number,
		get(index: number): T
	}
}


//#region Iterable/Collection functions
export function* take<T>(iterable: Iterable<T>, n: number): Iterable<T> {
	if (typeof n !== "number") throw new Error(`Invalid type ${typeof n} for argument "n"\nMust be number`)
	if (n < 0) throw new Error(`Invalid value ${n} for argument "n"\nMust be zero or positive number`)

	if (n > 0) {
		for (const element of iterable) {
			yield element
			if (--n <= 0) break
		}
	}
}
export function* skip<T>(iterable: Iterable<T>, n: number): Iterable<T> {
	if (typeof n !== "number") throw new Error(`Invalid type ${typeof n} for argument "n"\nMust be number`)
	if (n < 0) throw new Error(`Invalid value ${n} for argument "n"\nMust be zero or positive number`)

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
export function* filter<T>(iterable: Iterable<T>, predicate: Predicate<T>): Iterable<T> {
	for (const element of iterable) {
		if (predicate(element))
			yield element
		else
			continue
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
export function forEach<T>(iterable: Iterable<T>, action: Projector<T>) {
	for (const element of iterable) {
		// eslint-disable-next-line fp/no-unused-expression
		action(element)
	}
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
export function* chunk<T>(arr: Iterable<T>, chunkSize: number): Iterable<T[]> {
	const batch = [...take(arr, chunkSize)]
	if (batch.length) {
		// eslint-disable-next-line fp/no-unused-expression
		yield batch
		// eslint-disable-next-line fp/no-unused-expression
		yield* chunk(skip(arr, chunkSize), chunkSize)
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
export function last<T>(collection: Iterable<T> | Collection.ArrayLike<T>, predicate?: Predicate<T>): T | undefined {

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

export function sum(iterable: Iterable<number>) {
	return last(reduce(iterable, 0, (prev, curr) => prev + curr)) ?? 0
}
export function* flatten<X>(nestedIterable: Iterable<X>): Iterable<UnwrapNestedIterable<X>> {
	for (const element of nestedIterable) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if (hasValue(element) && typeof (element as any)[Symbol.iterator] === 'function')
			yield* flatten(element as unknown as Iterable<X>)
		else
			yield element as UnwrapNestedIterable<X>
	}

}
//#endregion

//#region Comparison Functions
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
		_x = _x || new Date()
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
//#endregion

//#region General functions
export function hasValue(value: unknown): boolean {
	if (typeof value === "undefined") return false
	if (value === undefined) return false
	if (value === null) return false

	const str = String(value) as string
	if (str.trim().length === 0) return false
	if (/^\s*$/.test(str)) return false
	//if(str.replace(/\s/g,"") == "") return false
	return true
}
//#endregion
