/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable fp/no-unused-expression */
/* eslint-disable fp/no-get-set */
/* eslint-disable fp/no-class */
/* eslint-disable brace-style */
/* eslint-disable no-unused-expressions */
/* eslint-disable fp/no-rest-parameters */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable fp/no-mutation */
/* eslint-disable fp/no-loops */

import { stdNumber } from "./number"

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

/*
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
}
*/

/** Lazy collection of elements accessed sequentially, not known in advance */
export class stdSequence<X> implements Iterable<X> {
	// eslint-disable-next-line fp/no-nil
	constructor(iterable: Iterable<X>) { this._iterable = iterable }
	protected _iterable: Iterable<X>
	protected ctor(iterable: Iterable<X>): this { return new stdSequence(iterable) as this }

	[Symbol.iterator](): Iterator<X> { return this._iterable[Symbol.iterator]() }

	/** Convert to another iterable container type */
	to<C extends Iterable<X>>(container: { (items: Iterable<X>): C }) { return container([...this]) }

	take(n: number) { return this.ctor(take(this, n)) }
	skip(n: number) { return this.ctor(skip(this, n)) }

	first(): X | undefined { return first(this) }
	last(): X | undefined { return last(this) }

	filter(predicate: Predicate<X>) { return this.ctor(filter(this, predicate)) }
	map<Y>(projector: Projector<X, Y>) { return new stdSequence(map(this, projector)) }
	reduce<Y>(initial: Y, reducer: Reducer<X, Y>) { return new stdSequence(reduce(this, initial, reducer)) }
	forEach(action: Projector<X>) { return forEach(this, action) }

	/** Generate sequence of integers */
	static integers(args: { from: number, to: number } | { from: number, direction: "upwards" | "downwards" }) {
		return new stdSequence((function* () {
			// eslint-disable-next-line fp/no-let
			let num = args.from
			do {
				yield ("to" in args ? args.to >= args.from : args.direction === "upwards") ? num++ : num--
			}
			while ("direction" in args || args.from !== args.to)

		})())
	}
}
export class stdTupleSequence<T> extends stdSequence<[string, T]> {
	toDictionary<X>() {
		return stdObject.fromKeyValues([...this])
	}
}
/** Set of elements, known in advance, without any order */
export class stdSet<X> extends stdSequence<X> {
	constructor(elements: Iterable<X>/*, protected opts?: { comparer?: Comparer<X>, ranker?: Ranker<X> }*/) {
		super(elements)
	}
	protected _set?: globalThis.Set<X> = undefined
	protected readonly core = ((me: this) => {
		return {
			get set() {
				if (me._set === undefined) {
					// set is created from array for performance reasons
					me._set = new global.Set(global.Array.isArray(me._iterable)
						? me._iterable
						: [...me._iterable]
					)
				}
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				return me._set!
			},
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			get iterable() { return me._iterable! },
		}
	})(this)
	protected ctor(iterable: Iterable<X>): this { return new stdSet(iterable) as this }


	get size(): number { return this.core.set.size }
	get length(): number { return this.size }

	/** Synonym of this.contains */
	has(value: X): boolean { return this.contains(value) }
	/** Synonym of this.contains */
	includes(value: X) { return this.contains(value) }
	/** Returns true if this array contains an element equal to value */
	contains(value: X) { return this.core.set.has(value) }

	some(predicate: Predicate<X>): boolean { return some(this, predicate) }
	every(predicate: Predicate<X>): boolean { return every(this, predicate) }

	map<Y>(projector: Projector<X, Y>) { return new stdSet<Y>(map(this, projector)) }

	/** Get unique items in this array
	 * ToDo: Implement use of comparer in the include() call
	 */
	unique(comparer?: Comparer<X>) { return this.ctor(unique(this)) }
	union(collections: Iterable<X>[]) { return this.ctor(union([this, ...collections])) }
	intersection(collections: globalThis.Array<X>[]) { return this.ctor(intersection(collections)) }
	except(collections: globalThis.Array<X>[]): Iterable<X> { return this.ctor(except(this, collections)) }
	complement(universe: Iterable<X>): Iterable<X> { return complement([...this], universe) }

	// eslint-disable-next-line fp/no-mutating-methods
	sort(comparer?: Ranker<X>) { return new stdArray([...this].sort(comparer)) }
	// eslint-disable-next-line fp/no-mutating-methods
	sortDescending(comparer?: Ranker<X>) { return new stdArray([...this].sort(comparer).reverse()) }
}

/** Eager, ordered, material collection */
export class stdArray<X> extends stdSet<X> {
	constructor(elements: Iterable<X>) { super(elements) }
	private _array?: globalThis.Array<X> = undefined
	private _map?: globalThis.Map<number, X> = undefined

	ctor(elements: Iterable<X>): this { return new stdArray(elements) as this }
	protected readonly core = ((me: this) => {
		return {
			...super.core,
			get map() {
				if (me._map === undefined) {
					me._map = new global.Map([...me._iterable].entries())
				}
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				return me._map!
			},
			get array() {
				if (me._array === undefined) {
					me._array = global.Array.from([...me._iterable])
				}
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				return me._array!
			}
		}
	})(this)

	get length() { return this.core.array.length }
	get size() { return this.length }

	get(index: number): X | undefined
	get(indices: Iterable<number>): (X | undefined)[]
	get(...indices: number[]): (X | undefined)[]
	get(selection: number | Iterable<number>) {
		if (typeof selection === "number") {
			return this.core.array[selection] as (X | undefined)
		}
		else {
			console.warn(`Array get() selection arg type: ${typeof selection}`)
			//console.assert(Object__.isIterable(selection), `Array get() selection arg not iterable`)
			return [...selection].map(index => this.core.array[index] as (X | undefined))
		}
	}

	/** Get the indexes where a value occurs or a certain predicate/condition is met */
	indexesOf(args: ({ value: X } | { predicate: Predicate<X> })) {
		return 'value' in args
			? this.entries().filter(kv => kv[1] === args.value).map(kv => kv[0])
			: this.entries().filter(kv => args.predicate(kv[1]) === true).map(kv => kv[0])
	}

	entries() { return new stdArray(this.core.array.entries()) }

	/** Returns new array containing this array's elements in reverse order */
	// eslint-disable-next-line fp/no-mutating-methods
	reverse() { return this.ctor([...this].reverse()) }

	/** Get last element (or last element to satisfy an optional predicate) of this collection
	 * @param func Optional predicate to filter elements
	 * @returns Last element as defined above, or <undefined> if such an element is not found
	 */
	last(predicate?: Predicate<X>): X | undefined {
		const arr = this.core.array
		if (!predicate)
			return arr[this.size - 1]
		else
			// eslint-disable-next-line fp/no-mutating-methods
			return arr.reverse().find(predicate)
	}

	map<Y>(projector: Projector<X, Y>) { return new stdArray<Y>(map(this, projector)) }

}

export class stdArrayNumeric extends stdArray<number> {
	ctor(iterable: Iterable<number>): this { return new stdArrayNumeric(iterable) as this }

	static fromRange(from: number, to: number, opts?: { mode: "width", width: number } | { mode: "count", count: number }): stdArrayNumeric {
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

		const arr = new global.Array<number>()
		// eslint-disable-next-line fp/no-let
		for (let value = from; arr.length < length; value += delta) {
			// eslint-disable-next-line fp/no-mutating-methods
			arr.push(value)
		}

		return new stdArrayNumeric(arr)
	}

	/*static fromRange(from: number, to: number): ArrayNumeric {
		let _difference = to - from;
		let _length = Math.abs(_difference);
		let _sign = _difference / _length;
		let _index = 0;
		let _value = from;
		let _arr = new Vector<number>([_length])
		while (true) {
			_arr[_index++] = _value;
			if (_value === to)
				break;
			_value += _sign;
		}
		return new ArrayNumeric(_arr)
	}*/

	min(): number | undefined {
		// eslint-disable-next-line fp/no-let
		let _min: number | undefined = undefined
		for (const element of this) {
			if (_min === undefined || (_min !== element && element < _min))
				_min = element
		}
		return _min
	}
	max(): number | undefined {
		// eslint-disable-next-line fp/no-let
		let _min: number | undefined = undefined
		for (const element of this) {
			if (_min === undefined || (_min !== element && element > _min))
				_min = element
		}
		return _min
	}

	map(projector: Projector<number, number>): stdArrayNumeric
	map<Y>(projector: Projector<number, Y>): stdArray<Y>
	map<Y>(projector: Projector<number, number> | Projector<number, Y>): stdArrayNumeric | stdArray<Y> {
		// eslint-disable-next-line fp/no-let
		let notNumeric = false
		const newArr = map<number, number | Y>(this, val => {
			const newVal = projector(val)
			if (typeof newVal !== "number" && typeof newVal !== "bigint")
				notNumeric = true
			return newVal
		})

		return notNumeric
			? new stdArray(newArr as Iterable<Y>)
			: new stdArrayNumeric(newArr as Iterable<number>)
	}

	mean(exclusions?: { excludedIndices: number[], meanOriginal?: number }): number {
		if (exclusions) {
			if (exclusions.meanOriginal) {
				const len = this.size
				const validExcludedValues = new stdArrayNumeric(exclusions.excludedIndices.filter(index => stdNumber.isNumber(this.get(index))))
				const excludedSum = validExcludedValues.sum()
				const excludedLen = validExcludedValues.size
				return (exclusions.meanOriginal - (1.0 * excludedSum / len)) * (1.0 * len / (len - excludedLen))
			}
			else {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const arr = [...this].filter((item, index) => !exclusions.excludedIndices.includes(index!))
				return new stdArrayNumeric(arr).mean()
			}
		}
		else {
			return this.sum() / this.size
		}
	}
	variance(mean?: number, forSample = true): number | undefined {
		if (this.size === 1)
			return 0

		const _mean = mean || this.mean()
		if (_mean === undefined)
			return undefined

		return this.map(datum => Math.pow(datum - _mean, 2)).sum() / (this.size - (forSample ? 1 : 0))
	}
	deviation(args?: { mean?: number | { excludeIndices: number[] }, forSample: boolean }): number | undefined {
		const forSample = args && args.forSample === false ? false : true
		const excludedIndices = args && typeof args.mean === "object"
			? args.mean.excludeIndices
			: undefined
		const mean = args && typeof args.mean === "number"
			? args.mean
			: this.mean(excludedIndices ? { excludedIndices: excludedIndices } : undefined)

		const variance = this.variance(mean, forSample)
		return variance ? Math.sqrt(variance) : undefined
	}
	// eslint-disable-next-line fp/no-nil
	median(): number | undefined {
		// eslint-disable-next-line fp/no-mutating-methods
		const _ordered = this.sort()
		if (_ordered.size % 2 === 1) {
			return _ordered.get(Math.floor(this.size / 2))
		}
		else {
			// eslint-disable-next-line no-shadow, @typescript-eslint/no-non-null-assertion
			const first = _ordered.get(Math.floor(_ordered.size / 2) - 1)!
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const second = _ordered.get(Math.floor(_ordered.size / 2))!
			return (first + second) / 2
		}
	}
	interQuartileRange() {
		// eslint-disable-next-line fp/no-mutating-methods
		const sortedList = this.sort()
		const percentile25 = sortedList.get(Math.floor(0.25 * sortedList.size))
		const percentile75 = sortedList.get(Math.ceil(0.75 * sortedList.size))
		return percentile25 && percentile75 ? percentile75 - percentile25 : undefined
	}
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	sum() { return this.reduce(0, (x, y) => x + y).last()! }

}

/** Eager, un-ordered, material, indexed associative collection */
export class stdObject<T extends Record<string, unknown>> implements Iterable<Tuple<keyof T, T[keyof T]>> {
	private readonly obj: Readonly<T>
	constructor(obj: T) { this.obj = Object.freeze({ ...obj }) }

	static fromKeyValues<K extends string, V>(keyValues: Iterable<Tuple<K, V>>) {
		const obj = {} as Record<K, V>
		for (const kv of keyValues) obj[kv[0]] = kv[1]
		return new stdObject(obj)
	}
	static fromArray<X>(arr: X[]) {
		return stdObject.fromKeyValues(arr.map((elt, i) => new Tuple(i.toString(), elt)))
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

	pick<K extends keyof T>(...keys: K[]) {
		const result = {} as Pick<T, K>
		keys.forEach(k => result[k] = this.obj[k])

		return new stdObject(result)
	}
	omit<K extends keyof T>(...keys: K[]) {
		const result = this.asObject()
		// eslint-disable-next-line fp/no-delete
		keys.forEach(k => delete result[k])
		return new stdObject(result as Omit<T, K>)
	}
	map<Y>(projector: ProjectorIndexed<T[keyof T], Y, keyof T>) {
		const keyValues = this.entries().map(kv => new Tuple(String(kv[0]), projector(kv[1], kv[0])))
		return stdObject.fromKeyValues(keyValues)
	}
	reduce<Y>(initial: Y, reducer: ReducerIndexed<T[keyof T], Y, keyof T>) {
		return this.entries().reduce((prev, curr) => reducer(prev, curr[1], curr[0]), initial)
	}

	get(selector: keyof T) { return this.obj[selector] }
	getAll(selector: Iterable<keyof T>) { return new stdSet(map(selector as Iterable<keyof T>, index => this.obj[index])) }

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
		action(element)
	}
}
export function unique<T>(iterable: Iterable<T>): Iterable<T> {
	return (function* (iter: Iterable<T>) {
		const arr: T[] = []
		for (const element of iter) {
			if (!arr.includes(element)) {
				// eslint-disable-next-line fp/no-mutating-methods
				arr.push(element)
				yield element
			}
		}
	})(iterable)
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
export function intersection<T>(collections: ArrayLike<T>[]): Iterable<T> {
	throw new Error(`Not Implemented`)
}
export function except<T>(src: Iterable<T>, exclusions: ArrayLike<T>[]): Iterable<T> {
	throw new Error(`Not Implemented`)
}
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
		yield batch
		yield* chunk(skip(arr, chunkSize), chunkSize)
	}
}
export function first<T>(iterable: Iterable<T>): T | undefined {
	for (const element of iterable) {
		return element
	}
}
export function last<T>(iterable: Iterable<T>): T | undefined {
	// eslint-disable-next-line fp/no-let
	let result: T | undefined = undefined
	for (const element of iterable) {
		result = element
	}
	return result
}
export function sum(iterable: Iterable<number>) {
	return last(reduce(iterable, 0, (prev, curr) => prev + curr)) ?? 0
}
export function* flatten<X>(target: Iterable<X>): Iterable<UnwrapNestedIterable<X>> {
	for (const element of target) {
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
export function getComparer<T>(projector: Projector<T, unknown>, tryNumeric = false, reverse = false): Comparer<T> {
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
