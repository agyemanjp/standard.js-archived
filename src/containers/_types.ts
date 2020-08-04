/* eslint-disable brace-style */
type UnwrapIterable1<T> = T extends Iterable<infer X> ? X : T
type UnwrapIterable2<T> = T extends Iterable<infer X> ? UnwrapIterable1<X> : T
type UnwrapIterable3<T> = T extends Iterable<infer X> ? UnwrapIterable2<X> : T
export type UnwrapNestedIterable<T> = T extends Iterable<infer X> ? UnwrapIterable3<X> : T

export type Tuple<X, Y> = [X, Y]
export const Tuple = class <X, Y>  { constructor(x: X, y: Y) { return [x, y] as Tuple<X, Y> } } as { new <X, Y>(x: X, y: Y): [X, Y] }

export type Zip<A extends ReadonlyArray<unknown>> = { [K in keyof A]: A[K] extends Iterable<infer T> ? T : never }

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
		// eslint-disable-next-line fp/no-rest-parameters
		union(...collections: Material<X>[]): Material<X>
		// eslint-disable-next-line fp/no-rest-parameters
		intersection(...collections: Material<X>[]): Material<X>
		// eslint-disable-next-line fp/no-rest-parameters
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
		// eslint-disable-next-line fp/no-rest-parameters
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
