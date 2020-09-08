
export * from "./object"
export * from "./iterable-async"
export * from "./iterable"
export * from "./containers"

/* export namespace Collection {
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
*/