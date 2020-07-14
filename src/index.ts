import { cloneDeep, mergeWith } from "lodash"
import { Types } from "./types"
import * as assert from 'assert'

type Tuple<X, Y> = Types.Tuple<X, Y>
export const Tuple = class <X, Y>  { constructor(x: X, y: Y) { return [x, y] as Tuple<X, Y> } } as { new <X, Y>(x: X, y: Y): [X, Y] }

type Enumerable<T> = Types.Collection.Enumerable<T>
type Material<T> = Types.Collection.Material<T>
type Ordered<T> = Types.Collection.Ordered<T>
type IndexedExtended<K, V> = Types.Collection.IndexedExtended<K, V>

type Ranker<T> = Types.Ranker<T>
type Comparer<T> = Types.Comparer<T>
type Reducer<X, Y> = Types.Reducer<X, Y>
type Predicate<X = any> = Types.Predicate<X>
type Projector<X = any, Y = any> = Types.Projector<X, Y>

type ArrayElementType<T> = Types.ArrayElementType<T>
type Primitive = Types.Primitive
type Obj<T, K extends string = string> = Types.Obj<T, K>
export interface NestedIterable<T> extends Iterable<T | NestedIterable<T>> { }



/** Enumerable readonly sequence of values, lazy by default */
export class Sequence<T> implements Enumerable<T> {
	private values: Iterable<T>

	constructor(iterable: Iterable<T>) { this.values = iterable }
	[Symbol.iterator]() { return this.values[Symbol.iterator]() }

	materialize() { return new Array__(this) }
	toSet() { return new Set__(this) }

	first(): T | undefined { return this.take(1).materialize().get(0) }
	take(n: number): Sequence<T> { return new Sequence<T>(take(this, n)) }
	skip(n: number): Sequence<T> { return new Sequence<T>(skip(this, n)) }
	filter(predicate: Predicate<T>): Sequence<T> { return new Sequence<T>(filter(this, predicate)) }
	map<Y>(projector: Projector<T, Y>): Sequence<Y> { return new Sequence<Y>(map(this, projector)) }
	reduce<Y>(initial: Y, reducer: Reducer<T, Y>): Sequence<Y> { return new Sequence<Y>(reduce(this, initial, reducer)) }

	/** Turns n iterables into an iterable of n-tuples (encoded as arrays of length n).
	 * The shortest iterable determines the length of the result
	 */
	static zip<A, B>(a: Iterable<A>, b: Iterable<B>): IterableIterator<[A, B]>
	static zip<T extends any[]>(...iterables: Iterable<ArrayElementType<T>>[]): IterableIterator<T> {
		let iterators = iterables.map(i => i[Symbol.iterator]());
		let done = false;
		return {
			[Symbol.iterator]() { return this },
			next() {
				if (!done) {
					let items = iterators.map(i => i.next())
					done = items.some(item => item.done)
					if (!done) {
						return { value: items.map(i => i.value) as T, done: false }
					}
					// Done for the first time: close all iterators
					for (let iterator of iterators) {
						if (iterator.return)
							iterator.return()
					}
				}
				// We are done
				return { done: true, value: [] as any as T }
			}
		}
	}

	forEach(action: Projector<T>) {
		for (const element of this) {
			action(element)
		}
	}
}
export class TupleSequence<T> extends Sequence<[string, T]> {
	toDictionary<X>() {
		return new Dictionary([...this])
	}
}

/** Un-ordered and materialized read-only collection */
export class Set__<T> implements Material<T> {
	private _set: Set<T>

	constructor(items: Iterable<T>) { this._set = new Set([...items]) }
	[Symbol.iterator]() { return this._set[Symbol.iterator]() }
	ctor(iterable: Iterable<T>): this { return new Set__(iterable) as this }

	materialize() { return new Array__(this) }
	get size() { return this._set.size }

	first() { return this._set.values[0] }

	/** Sorts set in ascending order
	 * @param ranker function used to compare each elements
	 */
	sort(ranker?: Ranker<T>, options?: { tryNumeric?: boolean }) {
		return new Array__([...this].sort(ranker))
	}
	/** Sorts array in descending order
	 * @param ranker function used to compare each elements
	 */
	sortDescending(ranker?: Ranker<T>, options?: { tryNumeric?: boolean }) {
		return new Array__([...this].sort(ranker)).reverse()
	}
	some(predicate: Predicate<T>): boolean { return [...this].some(predicate) }
	every(predicate: Predicate<T>): boolean { return [...this].every(predicate) }
	unique(): Set__<T> { return new Set__(([...this] as any as Types.Collection.Material<T>)) }
	contains(value: T): boolean { return this._set.has(value) }
	union(...collections: Types.Collection.Material<T>[]): Set__<T> { throw new Error('Not implemented') }
	intersection(...collections: Types.Collection.Material<T>[]): Set__<T> { throw new Error('Not implemented') }
	except(...collections: Types.Collection.Material<T>[]): Set__<T> { throw new Error('Not implemented') }
	complement(universe: Iterable<T>): Set__<T> { throw new Error('Not implemented') }

	toSequence() { return new Sequence([...this]) }

	take(n: number): Set__<T> { return this.ctor(take(this, n)) }
	skip(n: number): Set__<T> { return this.toSequence().skip(n).toSet() }
	filter(predicate: Predicate<T>): Set__<T> { return this.toSequence().filter(predicate).toSet() }
	map<Y>(projector: Projector<T, Y>): Set__<Y> { return this.toSequence().map(projector).toSet() }
	reduce<Y>(initial: Y, reducer: Reducer<T, Y>): Set__<Y> { return this.toSequence().reduce(initial, reducer).toSet() }
	forEach(action: Projector<T>) { this.toSequence().forEach(action) }
}

/** Ordered and materialized read-only collection */
export class Array__<T> implements Ordered<T> {
	private _arr: T[]

	constructor(arg?: Iterable<T> | number) { this._arr = typeof arg === "number" ? new global.Array(arg) : [...arg || []] }
	ctor(iterable: Iterable<T>): this { return new Array__(iterable) as this }
	[Symbol.iterator]() { return this._arr[Symbol.iterator]() }

	toSequence() { return new Sequence([...this]) }
	materialize() { return new Array__(this) }

	get size() { return this._arr.length }
	get length() { return this.size }

	static equals<T>(x: Array__<T>, y: Array__<T>, comparer?: Comparer<T>): boolean | undefined {
		if (!x && !y) return true
		if (!x || !y) return false
		if (x.size !== y.size) return false

		let _comparer = comparer || ((x, y) => x === y)
		for (let index = 0; index < x.size; index++) {
			if (_comparer(x.get(index)!, y.get(index)!) === false)
				return false
		}
		return true
	}

	get(index: number): T | undefined
	get(indices: Iterable<number>): (T | undefined)[]
	get(...indices: number[]): (T | undefined)[]
	get(selection: number | Iterable<number>) {
		if (typeof selection === "number") {
			return this._arr[selection] as (T | undefined)
		}
		else {
			console.warn(`Array get() selection arg type: ${typeof selection}`)
			console.assert(Object__.isIterable(selection), `Array get() selection arg not iterable`)
			return [...selection].map(index => this._arr[index] as (T | undefined))
		}
	}

	set(...keyValues: { value: T, index: number }[]): Array__<T> {
		let arr = [...this]
		keyValues.forEach(keyValue => {
			if (arr.length > keyValue.index) {
				arr[keyValue.index] = keyValue.value
			}
		})
		return new Array__(arr)
	}
	merge(...keyValues: { value: Partial<T>, index: number }[]): Array__<T> {
		let arr = [...this]
		keyValues.forEach(keyValue => {
			if (keyValue.index >= 0 && arr.length > keyValue.index) {
				arr[keyValue.index] = Object__.merge(arr[keyValue.index], keyValue.value)
			}
		})
		return new Array__(arr)
	}
	removeItems(hasher: Projector<T, Primitive>, ...itemsToRemove: T[]): Array__<T> {
		let itemsToRemoveMapped = itemsToRemove.map(hasher)
		return this.filter(item => !itemsToRemoveMapped.includes(hasher(item)))
	}
	removeIndices(indices: number[]): Array__<T> {
		let index = 0
		return this.filter(item => !indices.includes(index++))
	}
	/** Returns a slice of the array, starting from 'index' and for 'count' element */
	removeSliceCounted(index: number, count: number) {
		if (index > this.length - 1) {
			throw new Error(`Starting index is out of bounds (array contains only ${this.length} elements)`)
		}
		return this.ctor([...this].splice(index, count))
	}

	/** Returns a slice of the array */
	removeSliceDelimited(fromIndex: number, toIndex: number): Array__<T> {
		if (fromIndex > this.length - 1) {
			throw new Error(`Starting index is out of bounds (array contains only ${this.length} elements)`)
		} else if (fromIndex > toIndex) {
			throw new Error(`end index is higher than starting index`)
		}
		return this.ctor([...this].splice(fromIndex, toIndex - fromIndex + 1))
	}

	insert(index: number, ...items: T[]): Array__<T> {
		let arr = [...this]
		return this.ctor([...arr.slice(0, index), ...items, ...arr.slice(index)])
	}

	indexesOf(value: T): Sequence<number>
	indexesOf(value: T, mode: "as-value"): Sequence<number>
	indexesOf(value: Predicate<T>, mode: "as-predicate"): Sequence<number>
	indexesOf(value: T | Predicate<T>, mode?: "as-value" | "as-predicate") {
		let _mode = mode || "as-value"
		return new Sequence(_mode === "as-value"
			? (function* (_self: Array__<T>) {
				for (let i = _self._arr.indexOf(value as T); i >= 0; i = _self._arr.indexOf(value as T, i + 1)) {
					yield i
				}

			})(this)

			: (function* (_self: Array__<T>) {
				let _length = _self._arr.length
				for (let i = 0; i < _length; i++) {
					if ((value as Predicate<T>)(_self._arr[i]))
						yield i
				}
			})(this)
		)
	}

	join(separator: string): string {
		return [...this].join(separator)
	}

	/** Get 1st element (or 1st element to satisfy an optional predicate) of collection
	 * @param func Optional predicate to filter elements
	 * @returns First element as defined above, or <undefined> if such an element is not found
	 */
	first(predicate?: Predicate<T>): T | undefined {
		if (!predicate)
			return this.get(0)
		else
			return this._arr.find(predicate)
	}

	/** Get last element (or last element to satisfy an optional predicate) of this collection
	 * @param func Optional predicate to filter elements
	 * @returns Last element as defined above, or <undefined> if such an element is not found
	 */
	last(predicate?: Predicate<T>): T | undefined {
		if (!predicate)
			return this.get(this.length - 1)
		else
			return this._arr.reverse().find(predicate)
	}

	/** Returns new array containing this array's elements in reverse order */
	reverse() { return this.ctor([...this].reverse()) }

	//hasKey(key: number): boolean { return this._arr.length > key }
	//keys(): Iterable<number> { return this._arr.keys() }
	//entries(): Array__<[number, T]> { return this.ctor(this._arr.entries()) }
	//values(): Iterable<T> { return this._arr.values() }

	some(predicate: Predicate<T>): boolean { return this._arr.some(predicate) }
	every(predicate: Predicate<T>): boolean { return this._arr.every(predicate) }
	/** Sorts array in ascending order
	 * @param comparer function used to compare each elements
	 */
	sort(comparer?: Ranker<T>, options?: { tryNumeric?: boolean }) { return this.ctor(this._arr.sort(comparer)) }

	/** Sorts array in descending order
	 * @param comparer function used to compare each elements
	 */
	sortDescending(comparer?: Ranker<T>, options?: { tryNumeric?: boolean }) { return this.sort(comparer).reverse() }
	unique(comparer?: Comparer<T>): Set__<T> {
		let arr: T[] = []
		for (let item of this) {
			if (!arr.includes(item))
				arr.push(item)
		}

		return new Set__(arr)
	}

	has(value: T): boolean { return this._arr.indexOf(value) >= 0 }
	contains(value: T): boolean { return this._arr.indexOf(value) >= 0 }
	includes(value: T): boolean { return this._arr.indexOf(value) >= 0 }

	static flatten<X>(target: NestedIterable<X>): Array__<X> {
		return new Array__((function* (iterable: NestedIterable<X>) {
			for (const element of iterable) {
				if (element !== undefined && element !== null && typeof element[Symbol.iterator] === 'function')
					yield* Array__.flatten(element as unknown as NestedIterable<X>)
				else
					yield element as X
			}
		})(target))
	}

	take(n: number) { return this.ctor(take(this, n)) }
	skip(n: number) { return this.ctor(skip(this, n)) }
	filter(predicate: Predicate<T>) { return this.ctor(filter(this, predicate)) }
	map<Y>(projector: Projector<T, Y>): Array__<Y> { return new Array__(map(this, projector)) }
	reduce<Y>(initial: Y, reducer: Reducer<T, Y>): Array__<Y> { return new Array__(reduce(this, initial, reducer)) }
	forEach(action: Projector<T>) { return forEach(this, action) }

	union(...collections: Types.Collection.Material<T>[]): Array__<T> { return new Array__([]) }
	intersection(...collections: Types.Collection.Material<T>[]): Array__<T> { return new Array__([]) }
	except(...collections: Types.Collection.Material<T>[]): Array__<T> { return new Array__([]) }
	complement(universe: Iterable<T>): Array__<T> { return new Array__([]) }

	isDuplicated(value: T): boolean {
		return this.indexesOf(value).skip(1).first() !== undefined
	}
	frequencies(): Map__<T, number> { return Map__.fromFrequencies(this) }
	frequenciesPercentScaled(): Map__<T, number> {
		return this.frequencies().map(freq => freq * 100 / this.length)
	}
	frequency(item: T): number { return this.filter(_item => _item === item).length }
	mode(): T | undefined {
		const freqs = this.frequencies().sort(x => x)
		return freqs.getArray()[freqs.length - 1][0]
	}
	median() {
		return this.sort().get(this.length / 2)
	}
	min(ranker?: Ranker<T>): T | undefined {
		const _ranker = ranker || ((a, b) => (a > b) ? 1 : a == b ? 0 : -1)
		let _min = this.first()
		if (_min !== undefined)
			for (let element of this.skip(1)) {
				if (_min !== element && _ranker(element, _min) < 0)
					_min = element
			}
		return _min
	}
	max(ranker?: Ranker<T>): T | undefined {
		const _ranker = ranker || ((a, b) => (a > b) ? 1 : a == b ? 0 : -1)
		let _min = this.first()
		if (_min !== undefined)
			for (let element of this.skip(1)) {
				if (_min !== element && _ranker(element, _min) > 0)
					_min = element
			}
		return _min
	}

	firstQuartile(): T { throw new Error(`Not implemented`) }
	thirdQuartile(): T { throw new Error(`Not implemented`) }
	indexed(): Array__<Tuple<number, T>> {
		return new Array__(zip((function* () { let counter = 0; while (true) yield counter++ })(), this))
	}
}
export class ArrayNumeric extends Array__<number> {
	ctor(iterable: Iterable<number>): this { return new ArrayNumeric(iterable) as this }

	static fromRange(from: number, to: number, opts?: { mode: "width", width: number } | { mode: "count", count: number }): ArrayNumeric {
		if (opts) {
			if (opts.mode === "width" && opts.width <= 0) throw new Error("width must be positive non-zero number")
			if (opts.mode === "count" && opts.count <= 0) throw new Error("count must be positive non-zero number")
		}

		let diff = to - from
		let sign = to >= from ? 1 : -1
		let delta = opts === undefined
			? sign
			: opts.mode === "width"
				? (opts.width * sign)
				: diff / opts.count


		let length = Math.floor(diff / delta) + 1

		let arr = new global.Array<number>()
		for (var value = from; arr.length < length; value += delta) {
			arr.push(value)
		}

		return new ArrayNumeric(arr)
	}

	/*static fromRange(from: number, to: number): ArrayNumeric {
		let _difference = to - from;
		let _length = Math.abs(_difference);
		let _sign = _difference / _length;
		let _index = 0;
		let _value = from;
		let _arr = new Array__<number>([_length])
		while (true) {
			_arr[_index++] = _value;
			if (_value === to)
				break;
			_value += _sign;
		}
		return new ArrayNumeric(_arr)
	}*/

	min(): number | undefined {
		let _min: number | undefined = undefined
		for (let element of this) {
			if (_min === undefined || (_min !== element && element < _min))
				_min = element
		}
		return _min
	}
	max(): number | undefined {
		let _min: number | undefined = undefined
		for (let element of this) {
			if (_min === undefined || (_min !== element && element > _min))
				_min = element
		}
		return _min
	}

	map(projector: Projector<number, number>): ArrayNumeric
	map<Y>(projector: Projector<number, Y>): Array__<Y>
	map<Y>(projector: Projector<number, number> | Projector<number, Y>): ArrayNumeric | Array__<Y> {
		let notNumeric = false;
		let newArr = map<number, number | Y>(this, val => {
			let newVal = projector(val)
			if (typeof newVal !== "number" && typeof newVal !== "bigint")
				notNumeric = true
			return newVal
		})

		return notNumeric
			? new Array__(newArr as Iterable<Y>)
			: new ArrayNumeric(newArr as Iterable<number>)
	}

	reduce(initial: number, reducer: Reducer<number, number>): ArrayNumeric
	reduce<Y>(initial: Y, reducer: Reducer<number, Y>): Array__<Y>
	reduce<Y>(initial: number | Y, reducer: (Reducer<number, number>) | (Reducer<number, Y>)): ArrayNumeric | Array__<Y> {
		let notNumeric = false
		let newArr = reduce<number | Y, number | Y>(this, initial, (prev, curr) => {
			let newVal = (reducer as Reducer<number | Y, number | Y>)(prev, curr)
			if (typeof newVal !== "number" && typeof newVal !== "bigint")
				notNumeric = true
			return newVal
		})

		return notNumeric
			? new Array__(newArr as Iterable<Y>)
			: new ArrayNumeric(newArr as Iterable<number>)
	}

	mean(exclusions?: { excludedIndices: number[], meanOriginal?: number }): number {
		if (exclusions) {
			if (exclusions.meanOriginal) {
				const len = this.size
				const validExcludedValues = new ArrayNumeric(exclusions.excludedIndices.filter(index => Number__.isNumber(this.get(index))))
				const excludedSum = validExcludedValues.sum()
				const excludedLen = validExcludedValues.size
				return (exclusions.meanOriginal - (1.0 * excludedSum / len)) * (1.0 * len / (len - excludedLen))
			}
			else {
				let arr = [...this].filter((item, index) => !exclusions.excludedIndices.includes(index!))
				return new ArrayNumeric(arr).mean()
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

		let variance = this.variance(mean, forSample)
		return variance ? Math.sqrt(variance) : undefined
	}
	median(): number | undefined {
		let _ordered = this.sort();
		if (_ordered.size % 2 === 1) {
			return _ordered.get(Math.floor(this.size / 2))
		}
		else {
			const first = _ordered.get(Math.floor(_ordered.size / 2) - 1)!
			const second = _ordered.get(Math.floor(_ordered.size / 2))!
			return (first + second) / 2
		}
	}
	interQuartileRange() {
		const sortedList = this.sort()
		const percentile25 = sortedList.get(Math.floor(0.25 * sortedList.size))
		const percentile75 = sortedList.get(Math.ceil(0.75 * sortedList.size))
		return percentile25 && percentile75 ? percentile75 - percentile25 : undefined
	}
	sum() {
		return this.reduce(0, (x, y) => x + y).last()!
	}

	removeRange(from: number, to: number, mapper: Projector<number, Primitive>) {
		throw new Error("removeRange() invalid operation on a general array")
	}
}

/** Un-ordered, materialized, and indexed read-only collection */
export class Dictionary<V, K extends string = string> implements Enumerable<[K, V]>, IndexedExtended<K, V> {
	private readonly _obj: Readonly<Obj<V, K>>

	constructor(kvs?: Iterable<[K, V]>) { this._obj = kvs ? Object__.fromKeyValues([...kvs]) : {} as Readonly<Obj<V, K>> }
	//ctor() {return {eager: Array,lazy: TupleSequence}}

	static fromObject<T, K extends string>(obj: Obj<T, K>): Dictionary<T, K> {
		if (!obj)
			throw new Error(`Obj argument missing in Dictionary.fromObject(...)`)
		return new Dictionary(Object.keys(obj).map((key, index) => new Tuple(key as K, (obj as any)[key])))
	}
	static fromArray<T>(arr: T[]) {
		return new Dictionary(arr.map((element, index) => new Tuple(index.toString(), element)))
	}
	static fromKeys<T>(arr: any[], defaultVal: T) {
		return new Dictionary(arr.map((element, index) => new Tuple(element.toString() as string, defaultVal)))
	}
	static fromProjection<K extends string, V, T = any>(
		items: Iterable<T>,
		keysProjector: Projector<T, K>,
		valuesProjector: Projector<T, V>) {
		return new Dictionary<V, K>([...items].map(item => {
			let key = keysProjector(item) //as K
			let value = valuesProjector(item) //as V
			return new Tuple(key, value)
		}))
	}

	// to-do
	[Symbol.iterator]() { return Object__.entries<V, K>(this._obj)[Symbol.iterator]() }

	materialize() { return this.entries() }

	get size() { return this.keys().length }

	get(index: K): V | undefined
	get(indices: K[]): (V | undefined)[]
	get(...indices: K[]): V[]
	get(selector: K | K[]): undefined | V | (V | undefined)[] {

		try {
			if (global.Array.isArray(selector))
				return selector.map(index => this.get(index))
			else
				return this._obj[selector]
		}
		catch (e) {
			console.error(`Error in Dictionary.get(); selection is: ${selector}; typeof selection is: ${typeof selector}`)
			throw e
		}
	}

	set(...keyValues: [K, V][]): Dictionary<V, K> { return new Dictionary([...this.entries(), ...keyValues]) }

	indexesOf(value: V): Sequence<K>
	indexesOf(value: V, mode: "as-value"): Sequence<K>
	indexesOf(value: Predicate<V>, mode: "as-predicate"): Sequence<K>
	indexesOf(value: V | Predicate<V>, mode?: "as-value" | "as-predicate"): Sequence<K> {
		return new Sequence((function* (_self: Dictionary<V, K>) {
			let keys = Object__.keys(_self._obj)
			let length = keys.length
			for (let i = 0; i < length; i++) {
				let canYield = mode === "as-value"
					? (value as Predicate<V>)(_self._obj[keys[i]])
					: (value as V) === _self._obj[keys[i]]
				if (canYield)
					yield keys[i]
			}
		})(this))
	}

	entries(): Array__<[K, V]> { return new Array__(Object__.entries(this._obj)) }
	hasKey(key: string) { return Object.keys(this._obj).includes(key) }
	keys() { return new Array__(Object__.keys(this._obj)) }

	hasValue(value: V) { return this.values().includes(value) }
	values() { return new Array__(Object__.values(this._obj)) }

	first() { return this.entries().first() }
	map<Y>(projector: Projector<[K, V], Y>): Y extends [infer S, infer Z] ? Dictionary<Z, S extends string ? S : never> : Array__<Y> {
		if (this.size === 0) {
			return new Dictionary(this.entries()) as any
		}
		let first = projector(this.entries().first()!)
		return (global.Array.isArray(first) && first.length === 2 && typeof first[0] === 'string')
			? new Dictionary(this.entries().map(projector as any as Projector<[string, V], [string, any]>))
			: this.entries().map(projector) as any
	}

	skip(n: number) { return new Dictionary(this.entries().skip(n)) }
	take(n: number) { return new Dictionary(this.entries().take(n)) }
	filter(predicate: Predicate<[K, V]>) { return new Dictionary(this.entries().filter(predicate)) }
	reduce<Y>(initial: Y, reducer: Reducer<[K, V], Y>) { return this.entries().reduce(initial, reducer) }
	forEach(action: Projector<[K, V], any>) { return this.entries().forEach(action) }

	asObject(): Obj<V, K> {
		let _obj = {} as Obj<V, string>
		Object__.keys(this._obj).forEach(key => {
			_obj[key] = this._obj[key] as any
		})
		return _obj
	}
}

export class Map__<K = any, V = any> extends global.Map<K, V> /*implements Collection<Tuple<TKey, TValue>>*/ {
	private _comparer?: Comparer<V>

	constructor(items?: Iterable<Tuple<K, V>>, comparer?: Comparer<V>) {
		super([...items || []].map(tuple => [tuple[0], tuple[1]] as [K, V]))
		this._comparer = comparer
	}

	static fromProjection<K, V, T = any>(items: Iterable<T>, keysProjector?: Projector<T, K>, valuesProjector?: Projector<T, V>): Map__<K, V> {
		return new Map__<K, V>([...items].map(item => {
			let key = (keysProjector ? keysProjector(item) : item) as K
			let value = (valuesProjector ? valuesProjector(item) : item) as V
			return new Tuple(key, value)
		}))
	}
	static fromKeys<T>(keys: Iterable<T>, seed?: any): Map__<T, any> {
		return new Map__<T, any>([...keys].map(_key => new Tuple(_key, seed)))
	}
	static fromObject<V, K extends string>(obj: Obj<V, K>) {
		if (!obj)
			return new Map__<K, V>()
		return Object__.keys(obj).reduce((map, key) => map.set(key, obj[key]), new Map__<K, V>());
	}
	static fromFrequencies<T>(items: Iterable<T>): Map__<T, number> {
		let freqs = new Map__<T, number>(); //semi-colon required at end of this statement
		[...items].forEach(item => {
			freqs.set(item, (freqs.get(item) || 0) + 1)
		})
		return freqs
	}

	get length(): number {
		return [...this.keys()].length;
	}

	asObject() {
		let obj = {} as Obj<V, string>
		this.forEach((value, key) => {
			if (key)
				obj[new String(key).toString()] = value
		})
		return obj
	}
	getArray() {
		return [...this.keys()].map(key => [key, this.get(key) as V] as Tuple<K, V>)
	}

	clone(): Map__<K, V> {
		return new Map__([...this.entries()], this._comparer)
	}
	deepClone() {
		throw new Error("Not implemented")
	}

	intersection(other: Map__<K, V>, valuesComparer?: Comparer<V>) {
		if (!other)
			return new Map__<K, V>()

		let _comparer = valuesComparer || this._comparer;
		return this
			.filter((value, key) =>
				other.has(key) && (_comparer
					? (_comparer(other.get(key)!, value) === true)
					: (other.get(key) === value)))
	}

	equals(
		other: Map__<K, V>,
		valuesComparer?: Comparer<V>): boolean {

		if (!other)
			return false
		let _comparer = valuesComparer || this._comparer;
		return this.length === other.length && this.intersection(other, _comparer).length === this.length
	}

	map<T>(projection: Projector<V, T>): Map__<K, T> {
		var _map = new Map__()
			; (this as any as Map<K, V>).forEach((_value, _key) => {
				_map.set(_key, projection(_value))
			})
		return _map
	}
	sort(projection: Projector<V, Primitive>): Map__<K, V> {
		return new Map__([...this]
			.sort((x, y) =>
				compare(x[1], y[1], value => projection(value))
			))
	}

	/*async mapAsync<T>(projection: AsyncProjector<V, T, K>): Promise<Map__<K, T>> {
		var _map = new Map__<K, T>();
		let promisesArr = this
			.map(entry => projection(entry[1]!, entry[0]))

		let resolvedArr = await Promise.all(promisesArr)
		return new Map__(resolvedArr);
	}*/

	filter(predicate: (value: V, key: K) => boolean): Map__<K, V> {
		let arr: Tuple<K, V>[] = [];
		for (let entry of this.entries()) {
			if (predicate(entry[1], entry[0]) === true)
				arr.push(new Tuple(entry[0], entry[1]))
		}
		return new Map__<K, V>(arr);
	}
	every(predicate: (value: V, key: K) => any): boolean {
		for (let entry of this.entries()) {
			if (predicate(entry[1], entry[0]) === false)
				return false;
		}
		return true;
	}
	some(predicate: (value: V, key: K) => any): boolean {
		for (let entry of this.entries()) {
			if (predicate(entry[1], entry[0]) === true)
				return true;
		}
		return false;
	}
}

export class Object__ extends global.Object {
	static keys<T extends object>(obj: T): (keyof T)[]
	static keys<K extends string = string>(obj: Obj<any, K>): K[]
	static keys<K extends string = string>(obj: {}): string[]
	static keys<K extends string = string>(obj: {} | Obj<any, K>) {
		return super.keys(obj) //as K[]
	}

	//static values<T extends object>(obj: T): any[]
	static values<V>(obj: Readonly<Obj<V>>): V[]
	static values<V>(obj: Obj<V>): V[] {
		return super.values(obj) //as K[]
	}

	static map<X, Y>(obj: Obj<X>, projector: Projector<[string, X], Y>) {
		return Dictionary.fromObject(obj).map(x => new Tuple(x[0], projector(x))).asObject()
	}

	static omit<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
		let result = obj
		keys.forEach(k => delete result[k])
		return result
	}

	static pick<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
		let result = {} as Pick<T, K>
		keys.forEach(k => result[k] = obj[k])
		return result
	}

	static clone<T>(value: T/*, maxDepth: number = 7, depth: number = 0*/): T {
		return cloneDeep(value)
	}

	static hasValue(value: any): boolean {
		if (typeof value === "undefined") return false;
		if (value === undefined) return false;
		if (value === null) return false;

		let str = value.toString() as string
		if (str.trim().length === 0) return false;
		if (/^\s*$/.test(str)) return false
		//if(str.replace(/\s/g,"") == "") return false
		return true
	}

	static shallowEquals(obj1: any, obj2: any, ignoreUnmatchedProps = false) {
		// let x = typeof obj1

		if (typeof obj1 !== typeof obj2) {
			return false
		}
		else if (typeof obj1 === "function") {
			return obj1.toString() === obj2.toString()
		}
		else if (typeof obj1 !== "object") {
			return obj1 === obj2
		}
		else {
			let keysToCheck = ignoreUnmatchedProps
				? new Set__(Object.keys(obj1)).intersection(new Set__(Object.keys(obj2)))
				: new Set__(Object.keys(obj1)).union(new Set__(Object.keys(obj2)))

			return keysToCheck.every(key => obj1[key] === obj2[key])
		}
	}

	static fromKeyValues<T, K extends string = string>(keyValues: Types.Tuple<K, T>[]) {
		let obj = {} as Types.Obj<T, K>
		keyValues.forEach(kvp => {
			obj[kvp[0]] = kvp[1]
		})

		return obj
	}

	static entries<V, K extends string = string>(obj: Types.Obj<V, K>) {
		return Object__.keys(obj).map((key, index) => new Tuple(key, obj[key]))
	}

	static merge<X>(target: X, source: Types.RecursivePartial<X> | undefined | null, allowMutation?: boolean): X
	static merge<X>(target: X, source: Partial<X> | undefined | null, allowMutation?: boolean): X
	static merge<X>(target: Partial<X> | undefined | null, source: X, allowMutation?: boolean): X
	static merge<X>(target: X, source: undefined | null, allowMutation?: boolean): X
	static merge<X>(target: undefined | null, source: X, allowMutation?: boolean): X
	static merge<X, Y>(target: X, source: Y, allowMutation?: boolean): X & Y
	/** Merges source onto target without modifying target; Returns new object only if resulting content different from both target and source
	 * @param allowMutation If true, the objects passed won't be cloned inside the function, and will therefore be affected by the merge. It makes the merge faster */
	static merge<X, Y>(target: X, source: Y, allowMutation?: boolean): X | Y | X & Y {
		if (target === null || target === undefined)
			return allowMutation === true
				? source
				: Object__.clone(source) as Y
		else if (source === null || source === undefined)
			return allowMutation === true
				? target
				: Object__.clone(target) as X
		else if (typeof source !== "object" || typeof target !== "object")
			return allowMutation === true
				? source
				: Object__.clone(source) as Y
		else {
			let result = allowMutation === true
				? target
				: Object__.clone(target) as X
			return mergeWith(result, source, (objValue: any, srcValue: any) => {
				if (global.Array.isArray(objValue)) {
					if (srcValue === undefined)
						return objValue
					else
						return srcValue
				}
				if (source === undefined) {
					return undefined
				}
			})

			// => { 'a': [1, 3], 'b': [2, 4] }

			// for (var srcKey in source) {
			//     let merged = false
			//     for (var tgtKey in result) {
			//         if (srcKey.toString() === tgtKey.toString()) {

			//             try {
			//                 result[tgtKey] = Object__.merge(result[tgtKey], source[srcKey])
			//                 merged = true
			//             }
			//             catch (e) {
			//                 console.error(`Object.merge: Error merging key "${tgtKey}": ${e}`)
			//                 throw e
			//             }
			//         }
			//     }

			//     if (merged === false)
			//         (result as any)[srcKey] = source[srcKey]
			// }
			// return result
		}
	}

	static mergeAll<X = any>(...objects: (Partial<X>)[]): X
	static mergeAll(...objects: any[]): any {
		return this.merge(objects[0], this.mergeAll(...objects.slice(1)))
	}

	static isIterable(val: any) {
		return val !== null && val !== undefined && typeof val[Symbol.iterator] === 'function'
	}
}

export class Number__ extends global.Number {
	constructor(num: number) {
		super(num)
	}

	static isFloat(value: any): boolean {
		let parsed = typeof value === "number"
			? value : Number.parseFloat(value);
		return (!Number.isNaN(parsed)) && (!Number.isInteger(parsed))
	}

	static isInteger(value: any): boolean {
		let parsed = typeof value === "number"
			? value : Number.parseFloat(value);
		return (!Number.isNaN(parsed)) && (Number.isInteger(parsed))
	}

	static isNumber(x: any) {
		return typeof x === "number" && !isNaN(x)
	}

	static parse(value: any): number | undefined {
		let parsed = typeof value === "number"
			? value
			: Number.parseFloat(value);
		return (!Number.isNaN(parsed)) ? parsed : undefined
	}

	static smartRounding(value: number) {
		let val: string
		if (value !== undefined && value % 1 !== 0) {
			const powers = Math.floor(Math.log(Math.abs(value)) / Math.LN10)
			const decimals = powers > -1
				? Math.max(0, 2 - powers) // Above 1, we show a decreasing number of decimal (> 100 we show none)
				: Math.max(-powers + 1) // Below 1, we show at least 2 decimals and perhaps more
			val = value.toFixed(decimals)
		}
		else {
			val = value !== undefined ? value.toString() : ""
		}

		return val //`${value !== parseFloat(val) ? "~ " : ""}${val}`
	}
}

export class String__ extends global.String {
	constructor(str: string) { super(str) }

	isWhiteSpace(): boolean {
		return this.replace(/^\s+|\s+$/g, '').length === 0
	}

	/**
	 * Transforms single or multiple consecutive white-space characters into single spaces
	 * @param chars
	 */
	cleanWhitespace(chars?: string[]) {
		if (["null", "undefined", "array"].indexOf(typeof (chars)) < 0)
			throw `String.cleanWhitespace(): Invalid chars argument type; expected 'null', 'undefined', or 'array'; found ${typeof (chars)}`;

		var _chars = !(chars) ? ["\n", "\t", "\v", "\r"] : chars;
		var result = "";

		for (var i = 0; i < this.length; i++) {
			let val = this[i];
			result += (_chars.indexOf(val) < 0 ? val : " ")
		}
		return result.split(/[ ]{2,}/g).join(" ");
	}

	isEmptyOrWhitespace() {
		return this.strip([" ", "\n", "\t", "\v", "\r"]).length === 0;
	}

	prependSpaceIfNotEmpty() {
		if (this.isEmptyOrWhitespace())
			return ""
		else return " " + this
	}

	isURL(): boolean {
		var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.+)+[a-z]{2,}|' + // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
			'(\\?[;&a-z\\d%_.~+=\\*-]*)?' + // query string
			'(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
		return pattern.test(this.toString());
	}

	getCharacters(): Array__<String__> {
		let _arr = new Array__<String__>(this.length)
		for (let index = 0; index < this.length; index++) {
			_arr = _arr.set({ index, value: new String__(this[index]) })
		}
		return _arr
	}

	trimLeft(...strings: string[]) {
		let str = this.toString()
		strings.forEach(_str => {
			if (str.toLowerCase().startsWith(_str.toLowerCase()))
				str = str.substr(_str.length)
		})

		return str
	}

	/** truncate this string by lopping a specified number of characters from the end */
	truncate(numChars: number) {
		return new String__(this.substr(0, this.length - numChars))
	}

	trimRight(...strings: string[]) {
		let str = this.toString()
		strings.forEach(_str => {
			if (str.toLowerCase().endsWith(_str.toLowerCase()))
				str = str.substr(0, str.length - _str.length)
		})

		return str
	}

	tokenizeWords(separateCaseBoundary: "upper" | "lower" | "all" | "none" = "upper", seperatorChars: string[] = ["-", "_", " ", "    ", "\t"]): Array__<String__> {
		//console.log(`starting tokenizeWords for "${this.valueOf()}"`)

		var separators = seperatorChars || [" ", "\t"]
		//console.log(`effective separators are "${separators}"`)

		var words: string[] = []
		var currentWord = ""
		var lastChar = this[0]

		let pushWord = (str: string = "") => {
			if (currentWord.length > 0) {
				words.push(currentWord)
				//console.log(`pushed ${currentWord} to words, now ${JSON.stringify(words)}`)
			}

			//console.log(`set currentWord to ${str}`)
			currentWord = str
		}

		let chars = [...this.getCharacters()]
		// console.log(`chars array: ${JSON.stringify(chars)}`)

		for (let ch of chars) {
			console.assert(ch !== undefined, `String.tokenizeWords(): ch is undefined`)
			//console.log(`testing char "${ch.valueOf()}"`)

			if (separators.includes(ch.valueOf())) {
				//console.log(`separators include char tested, will push ${currentWord} to words`)
				pushWord()
			}
			else {
				//console.log(`separators do not include char tested, testing for case boundary`)

				let nowCase = ch.getCase()
				let lastCase = new String__(lastChar).getCase()

				let test = (
					(separateCaseBoundary === "none") ||
					(separators.includes(lastChar)) ||
					(lastCase === undefined) ||
					(nowCase === undefined) ||
					(nowCase !== separateCaseBoundary) ||
					(nowCase === lastCase)
				)

				if (test === false) {
					//console.log(`case boundary test is true, pushing `)
					pushWord(ch.valueOf())
				}
				else {
					//console.log(`case boundary test is false, concatenating char to currentWord`)

					currentWord = currentWord.concat(ch.valueOf())
					//console.log(`currentWord concatenated to ${currentWord}`)
				}
			}
			// TTLoUKmidiForm
			// TTL-o-UK-midi-F-orm
			lastChar = ch.valueOf()
			//console.log(`lastChar set to ${lastChar}`)
		}

		//console.log(`Outer loop, pushing currentWord "${currentWord}" to words`)

		pushWord()

		let result = words.map(x => new String__(x))
		//console.log(`result of tokenizeWords(${this.valueOf()}) = ${words}`)

		return new Array__(words).map(x => new String__(x))
	}

	toSnakeCase() { return new String__(this.tokenizeWords().join("_")) }
	toCamelCase() { return new String__(this.tokenizeWords().map(word => word.toTitleCase).join("_")) }
	toSpace() { return new String__(this.tokenizeWords("upper", ["-", "_", " ", "    ", "\t"]).join(" ")) }
	toTitleCase() {
		let str = this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
		return new String__(str)
	}

    /**
	 * Shorten a string by placing an ellipsis at the middle of it.
     * @param maxLen is the maximum length of the new shortened string
	 */
	shorten(maxLen: number) {
		let title = this.toString()
		if (title.length <= maxLen) return new String__(title);

		let i = 0, j = title.length - 1;
		let left = "", right = "";
		let leftCount = 0, rightCount = 0;

		while (true) {
			left += title[i];
			leftCount += 1;
			i += 1;
			if (leftCount + rightCount + 3 >= maxLen) break;

			right += title[j];
			rightCount += 1;
			j -= 1;
			if (leftCount + rightCount + 3 >= maxLen) break;
		}
		right = right.split("").reverse().join("")

		return new String(left + "..." + right)
	}

	isUpperCase() { return this.toUpperCase() === this.valueOf() }
	isLowerCase() { return this.toLowerCase() === this.valueOf() }

    /**
     * returns the case of input string
     * if string contains only special characters, 'upper' is returned
     * @param str the input string
     */
	getCase(): "upper" | "lower" | undefined {
		if (this.toLowerCase() === this.toUpperCase())
			return undefined
		else if (this.isUpperCase())
			return "upper"
		else
			return "lower"
	}

	strip(chars: string[]) {
		if (!Array.isArray(chars))
			throw `String.strip(): Invalid chars argument type; expected 'Array'; found ${typeof (chars)}`;

		var result = "";
		for (var i = 0; i < this.length; i++) {
			if (chars.indexOf(this[i]) < 0) result += this[i];
		}
		return result
	}

	plural() {

		let thisLower = this.toString().toLowerCase()
		let result: string

		let singulars = ["sheep", "series", "species", "deer", "ox", "child", "goose", "man", "woman", "tooth", "foot", "mouse", "person"];
		let plurals = ["sheep", "series", "species", "deer", "oxen", "children", "geese", "men", "women", "teeth", "feet", "mice", "people"]

		let match = singulars.indexOf(this.toString().toLowerCase())
		if (match >= 0) {
			result = plurals[match]
		}
		else {
			if (this.toString() === "") {
				result = ("")
			}
			else if (thisLower.endsWith("us") && this.length > 4) {
				result = (this.truncate(2).concat("i"))
			}
			else if (thisLower.endsWith("sis")) {
				result = (this.truncate(2).concat("es"))
			}
			else if (["s", "ss", "sh", "ch", "x", "z"].some(x => thisLower.endsWith(x))) {
				result = (this.concat("es"))
			}
			else if (thisLower.endsWith("ife")) { // e.g., wife -> wives
				result = (this.truncate(3).concat("ives"))
			}
			else if (thisLower.endsWith("lf")) { // e.g., elf -> elves
				result = (this.truncate(2).concat("lves"))
			}
			else if (thisLower.endsWith("y") && new CharASCII(this.charCodeAt(this.length - 2)).isConsonant()) {
				result = this.truncate(1).concat("ies")
			}
			else if (thisLower.endsWith("y") && new CharASCII(this.charCodeAt(this.length - 2)).isVowel()) {
				result = (this.concat("s"))
			}
			else if (thisLower.endsWith("o") && !["photo", "piano", "halo"].includes(this.toString())) {
				result = (this.concat("es"))
			}
			else if (thisLower.endsWith("on") || this.toString() === ("criterion")) {
				result = (this.truncate(2).concat("a"))
			}
			else {
				result = this.concat("s")
			}
		}

		return new String__(this.isUpperCase() ? result.toUpperCase() : result)
	}

	split(arg: { [Symbol.split](string: string, limit?: number): string[]; } | string | RegExp | number) {
		if (typeof arg === "object")
			return super.split(arg)
		else if (typeof arg !== "number") {
			return super.split(arg)
		}
		else {
			const numChunks = Math.ceil(this.length / arg)
			const chunks: string[] = new Array(numChunks)
			for (let i = 0, o = 0; i < numChunks; ++i, o += arg) {
				chunks[i] = this.substr(o, arg)
			}
			return chunks
		}
	}
}

export class CharASCII {
	private char: string
	constructor(charCode: number) {
		if (charCode < 0)
			throw new Error(`Invalid argument: must be non-negative`)
		if (charCode > 128)
			throw new Error(`Invalid argument: must be less than 128`)

		this.char = String.fromCharCode(charCode)
		console.assert(this.char.length === 1)
	}

	isVowel() {
		return ["a", "e", "i", "o", "u"].includes(this.char)
	}
	isConsonant() {
		return !this.isVowel()
	}
	isDigit() {
		for (let i = 0; i < 10; i++) {
			if (this.char === i.toString()) return true
		}
		return false
	}

	static Codes = {
	}
}

//#region Core functions
function take<T>(iterable: Iterable<T>, n: number): Iterable<T> {
	return (function* (iterable: Iterable<T>) {
		for (const element of iterable) {
			if (n-- <= 0) break // closes iterable
			yield element
		}
	}(iterable))
}
function skip<T>(iterable: Iterable<T>, n: number): Iterable<T> {
	return (function* (iterable: Iterable<T>) {
		for (const element of iterable) {
			if (n-- > 0) continue
			yield element
		}
	}(iterable))
}
function filter<T>(iterable: Iterable<T>, predicate: Predicate<T>): Iterable<T> {
	return (function* (iterable: Iterable<T>) {
		for (const element of iterable) {
			if (predicate(element))
				yield element
			else
				continue
		}
	})(iterable)
}
function map<X, Y>(iterable: Iterable<X>, projector: Projector<X, Y>): Iterable<Y> {
	return (function* (iterable: Iterable<X>) {
		for (const element of iterable) {
			yield projector(element)
		}
	})(iterable)
}
function reduce<X, Y>(iterable: Iterable<X>, initial: Y, reducer: Reducer<X, Y>): Iterable<Y> {
	return (function* (iterable: Iterable<X>) {
		for (const element of iterable) {
			initial = reducer(initial, element)
			yield initial
		}
	}(iterable))
}
/** Turns n iterables into an iterable of n-tuples (encoded as arrays of length n).
 * The shortest iterable determines the length of the result
 */
function zip<A, B>(iter1: Iterable<A>, iter2: Iterable<B>): IterableIterator<Types.Tuple<A, B>>
function zip<T extends any[]>(...iterables: Iterable<ArrayElementType<T>>[]): IterableIterator<T> {
	let iterators = iterables.map(i => i[Symbol.iterator]());
	let done = false;
	return {
		[Symbol.iterator]() { return this },
		next() {
			if (!done) {
				let items = iterators.map(i => i.next())
				done = items.some(item => item.done)
				if (!done) {
					return { value: items.map(i => i.value) as T, done: false }
				}
				// Done for the first time: close all iterators
				for (let iterator of iterators) {
					if (iterator.return)
						iterator.return()
				}
			}
			// We are done
			return { done: true, value: [] as any as T }
		}
	}
}
function forEach<T>(iterable: Iterable<T>, action: Projector<T>) {
	for (const element of iterable) {
		action(element)
	}
}



function compare<T>(x: T, y: T, comparer?: Projector<T, any>, tryNumeric: boolean = false): number {
	let _x: any = comparer ? comparer(x) : x
	let _y: any = comparer ? comparer(y) : y

	if (typeof _x === "string" && typeof _y === "string") {

		if (tryNumeric === true) {
			let __x = parseFloat(_x);
			let __y = parseFloat(_y);
			if ((!Number.isNaN(__x)) && (!Number.isNaN(__y))) {
				return __x - __y
			}
		}

		return new Intl.Collator().compare(_x || "", _y || "");
	}
	else if (typeof _x === "number" && typeof _y === "number") {
		return (_x || 0) - (_y || 0);
	}
	else if (_x instanceof Date && _y instanceof Date) {
		_x = _x || new Date()
		_y = _y || new Date()
		if (_x > _y)
			return 1;
		else if (_x === _y)
			return 0;
		else
			return -1;
	}
	else
		return _x === _y ? 0 : 1
}
export function getRanker<T>(projector: Projector<T, any>, tryNumeric: boolean = false, reverse: boolean = false): Ranker<T> {
	//console.log(`generating comparer, try numeric is ${tryNumeric}, reversed is ${reverse} `)
	return (x: T, y: T) => {
		return compare(x, y, projector, tryNumeric) * (reverse === true ? -1 : 1)
	}
}
export function getComparer<T>(projector: Projector<T, any>, tryNumeric: boolean = false, reverse: boolean = false): Comparer<T> {
	//console.log(`generating comparer, try numeric is ${tryNumeric}, reversed is ${reverse} `)
	return (x: T, y: T) => {
		return compare(x, y, projector, tryNumeric) === 0
	}
}
//#endregion


//#region Tests

if (process.env.HYPOTESTING) {
	describe("Array object", () => {

		describe("constructor()", () => {
			it("should create an Array__ with the same elements as that of an input array", () => {
				const testArray = new Array__([0, 1, 1.5, 2, 2, 4, 4, 6, 14, 15, 18])
				assert.deepStrictEqual([...testArray], [0, 1, 1.5, 2, 2, 4, 4, 6, 14, 15, 18])
			})

			it("should create an empty Array__ when passed no arguments", () => {
				const testArray = new Array__()
				assert.deepStrictEqual([...testArray], [])
			})

			it("should create an Array__ whose elements have the same type as those of an input array", () => {
				const testArray = new Array__([0, 1, "blue", 3])
				assert.deepStrictEqual([...testArray], [0, 1, "blue", 3])
			})

			it("should create an Array__ with the elements contained in an iterable object", () => {
				const iterableObject = Map__.fromObject({
					first: 0,
					second: 1,
					third: 2
				})
				const testArray = new Array__(iterableObject)
				assert.deepStrictEqual([...testArray], [["first", 0], ["second", 1], ["third", 2]])
			})
		})
		describe("flatten", () => {

			it("should flatten native JS arrays", () => {
				const nestedArray = [[1, 2, 3], [4, 5, 6]]
				const flattenedArray = Array__.flatten(nestedArray)
				assert.equal(flattenedArray.length, 6);
			})

			it("should flatten Array__ objects", () => {
				const nestedArray = new Array__([new Array__([1, 2, 3]), new Array__([4, 5, 6])])
				const flattenedArray = Array__.flatten(nestedArray)
				assert.equal(flattenedArray.length, 6);
			})

			it("should flatten mixes of Array__ objects and native JS arrays", () => {
				const nestedArray = [new Array__([1, 2, 3]), new Array__([4, 5, 6])]
				const flattenedArray = Array__.flatten(nestedArray)
				assert.equal(flattenedArray.length, 6);
			})

			it("should flatten arrays nested several times, with mixes of Array__ objects and native JS arrays ", () => {
				const nestedArray = [new Array__([1, 2, 3]), new Array__([4, 5, 6]), [7, 8, new Array__([9, 10, 11])]]
				const flattenedArray = Array__.flatten(nestedArray)
				assert.equal(flattenedArray.length, 11);
			})
		})

		describe("merge()", () => {

			it("should ignore the values whose index is out of bounds", () => {
				const testArray = new Array__([0, 1, 2]).merge({ value: 34, index: 5 })
				assert.deepStrictEqual([...testArray], [0, 1, 2])
			})

			it("should enrich the array with the desired values, overriding some if their index already exists", () => {
				const testArray = new Array__([0, 1, 2]).merge({ value: 99, index: 0 })
				assert.deepStrictEqual([...testArray], [99, 1, 2])
			})
			it("should merge a passed object with an object in the array, if they are at the same index", () => {
				const testArray = new Array__<{} | number>([{ alpha: 3 }, 1, 2]).merge({ value: { omega: 5 }, index: 0 })
				assert.deepStrictEqual([...testArray], [{ alpha: 3, omega: 5 }, 1, 2])
			})
		})

		describe("removeItems()", () => {
			it("should remove the desired items if they are numbers", () => {
				const testArray = new Array__([0, 1, 2]).removeItems(v => v, 2)
				assert.deepStrictEqual([...testArray], [0, 1])
			})
			it("should remove the desired items if they are objects", () => {
				const testArray = new Array__([{ color: "blue" }, { color: "green" }, { color: "red" }]).removeItems(v => v.color, { color: "red" })
				assert.deepStrictEqual([...testArray], [{ color: "blue" }, { color: "green" }])
			})
		})

		describe("removeIndices()", () => {
			it("should remove a single index", () => {
				const testArray = new Array__([0, 1, 2]).removeIndices([2])
				assert.deepStrictEqual([...testArray], [0, 1])
			})
			it("should remove several indices at once", () => {
				const testArray = new Array__([0, 1, 2]).removeIndices([2, 1])
				assert.deepStrictEqual([...testArray], [0])
			})
		})

		describe("removeSliceCounted", () => {
			it("should throw is we want a slice that include out of bounds indices", () => {
				assert.throws(() => {
					new Array__([0, 1, 2, 3, 4, 5]).removeSliceCounted(12, 15)
				}, "Error")
			})
			it("should return a slice until the end if the count goes above the array's length", () => {
				const testArray = new Array__([0, 1, 2, 3, 4, 5]).removeSliceCounted(2, 15)
				assert.deepStrictEqual([...testArray], [2, 3, 4, 5])
			})
			it("should return the slice starting from two and containing 2 elements", () => {
				const testArray = new Array__([0, 1, 2, 3, 4, 5]).removeSliceCounted(2, 2)
				assert.deepStrictEqual([...testArray], [2, 3])
			})
		})

		describe("removeSliceDelimited", () => {
			it("should throw is we want a slice whose start index is out of bound", () => {
				assert.throws(() => {
					new Array__([0, 1, 2, 3, 4, 5]).removeSliceDelimited(9, 13)
				}, "Error")
			})
			it("should throw is the start index is bigger than the end index", () => {
				assert.throws(() => {
					new Array__([0, 1, 2, 3, 4, 5]).removeSliceDelimited(5, 2)
				}, "Error")
			})
			it("should return a slice until the end, if the end index is above the array's length", () => {
				const testArray = new Array__([0, 1, 2, 3, 4, 5, 6, 7]).removeSliceDelimited(4, 9)
				assert.deepStrictEqual([...testArray], [4, 5, 6, 7])
			})
			it("should return the slice from 4 to 7", () => {
				const testArray = new Array__([0, 1, 2, 3, 4, 5, 6, 7]).removeSliceDelimited(4, 7)
				assert.deepStrictEqual([...testArray], [4, 5, 6, 7])
			})
		})

		describe("unique()", () => {
			it("should return an array were each number contained in the input appears once", () => {
				const firstArray = new Array__([1, 1, 2, 2, 3, 4, 5, 5])
				const testArray = firstArray.unique()
				assert.deepStrictEqual([...testArray], [1, 2, 3, 4, 5])
			})

			it("should return an array were each string contained in the input appears once", () => {
				const firstArray = new Array__(["car", "car", "bus", "train", "train", "train", "train", "train"])
				const testArray = firstArray.unique()
				assert.deepStrictEqual([...testArray], ["car", "bus", "train"])
			})

			it("should return an empty array if the input arary is empty", () => {
				const firstArray = new Array__([])
				const testArray = firstArray.unique()
				assert.deepStrictEqual([...testArray], [])
			})

			it("should throw an error if the input array contains objects", () => {
				const firstArray = new Array__([1, 1, 2, 2, 3, 4, 5, 5])
				assert.throws(firstArray.unique, "Error")
			})

			it("should throw an error if the input array contains arrays", () => {
				const firstArray = new Array__([[1], [1], [1], [2], [3], [4], [5], [5]])
				assert.throws(firstArray.unique, "Error")
			})

			it("should throw an error if the input array contains undefined values", () => {
				const firstArray = new Array__([1, 1, 2, undefined, 5, undefined, 2, 3, 4, 5, undefined])
				assert.throws(firstArray.unique, "Error")
			})

		})

		describe("union()", () => {
			// it("should join series of arguments and return only the distincts ones", () => {
			// 	const firstArray = new Array__([0, 1, 2])
			// 	const testArray = firstArray.union([1, 2, 3, 4, 5])
			// 	assert.deepStrictEqual([...testArray], [0, 1, 2, 3, 4, 5])
			// })
		})

		describe("take()", () => {
			it("should return the number of elements wanted", () => {
				const firstArray = new Array__([0, 1, 2, 3, 4, 5])
				const testArray = firstArray.take(2)
				assert.deepStrictEqual([...testArray], [0, 1])
			})
		})

		describe("skip()", () => {
			it("should return all elements except the first Xth", () => {
				const firstArray = new Array__([0, 1, 2, 3, 4, 5])
				const testArray = firstArray.skip(2)
				assert.deepStrictEqual([...testArray], [2, 3, 4, 5])
			})
		})

		describe("mode()", () => {

			it("should return 10 for the array [0, 10, 10, 10, 2, 2, 4, 4, 6, 14, 15, 18]", () => {
				const testArray = new Array__([0, 10, 10, 10, 2, 2, 4, 4, 6, 14, 15, 18])
				assert.equal(testArray.mode(), 10)
			})

			it("should return 'blue' for the array ['blue', 'blue', 'blue', 'blue', 'red', 'red', 'yellow']", () => {
				const testArray = new Array__(['blue', 'blue', 'blue', 'blue', 'red', 'red', 'yellow'])
				assert.equal(testArray.mode(), "blue")
			})

			it("should return false for the array [false, false, false, true]", () => {
				const testArray = new Array__([false, false, false, true])
				assert.equal(testArray.mode(), false)
			})
		})
	})

	describe("ArrayNumeric", () => {
		describe("variance()", () => {
			it("should return 41.004545454545465 for the array [0,1,1.5,2,2,4,4,6,14,15,18]", () => {
				const testArray = new ArrayNumeric([0, 1, 1.5, 2, 2, 4, 4, 6, 14, 15, 18])
				assert.equal(testArray.variance(), 41.004545454545465)
			})

			it("should return 0 for arrays of 1 elements", () => {
				const testArray = new ArrayNumeric([18])
				assert.equal(testArray.variance(), 0)
			})

			it("should return undefined for arrays of 0 elements", () => {
				const testArray = new ArrayNumeric()
				assert.throws(testArray.variance, "Tried to call getNumber() on an array including undefined values")
			})

			it("It should return NaN for an array containing only NaN element", () => {
				const testArray = new ArrayNumeric([NaN, NaN])
				assert.ok(Number.isNaN(testArray.variance()))
			})

			it("should return NaN if there is any NaN value in the array", () => {
				const testArray = new ArrayNumeric([0, 1, 1.5, 2, 2, 4, 4, 6, 14, 15, 18, NaN])
				assert.ok(Number.isNaN(testArray.variance()))
			})
		})
	})

	describe("String prototype", () => {

		it("should check whether is a whitespace or not", () => {
			const inputString = "";
			assert.equal(new String__(inputString).isWhiteSpace(), true);
		})

		describe("shorten()", () => {
			it(`should return an empty string when passing that same string with any max length input value`, (done) => {
				const testData = ["", "", 20]
				const maxLen = testData[2]
				const expectedTitle = testData[1]
				const newTitle = new String__(testData[0] as string).shorten(maxLen as number).toString()

				assert.equal(newTitle, expectedTitle)
				done()
			})

			it(`should return only the first character of the input string plus an ellipsis when passed a max length between 1 and 4 and the string length is greater than the max length`, (done) => {
				const testData = ["Long Blink Experiment (1) Experiment", "L...", 1]
				const maxLen = testData[2]
				const expectedTitle = testData[1]
				const newTitle = new String__(testData[0] as string).shorten(maxLen as number).toString()

				assert.equal(newTitle, expectedTitle)
				done()
			})

			it(`should return the start and end characters of the input string with an ellipsis between them when passed a max length equals to 5 and the string length is greater than the max length`, (done) => {
				const testData = ["Feature discovery by competitive learning Release 2.1", "F...1", 5]
				const maxLen = testData[2]
				const expectedTitle = testData[1]
				const newTitle = new String__(testData[0] as string).shorten(maxLen as number).toString()

				assert.equal(newTitle, expectedTitle)
				done()
			})

			it(`should return the same input string when its length is less than the max lenght input value`, (done) => {
				const testData = ["Ignite Experiment", "Ignite Experiment", 20]
				const maxLen = testData[2]
				const expectedTitle = testData[1]
				const newTitle = new String__(testData[0] as string).shorten(maxLen as number).toString()

				assert.equal(newTitle, expectedTitle)
				done()
			})
		})

		describe("isUrl()", () => {
			it(`should return true for valid URLs that start with 'www'`, () => {
				const expected = true
				const actual = new String__("www.data.com/table.csv").isURL()
				assert.equal(actual, expected)
			})

			it(`should return true for valid URLs that start with neither 'http', 'https' or 'www' `, () => {
				const expected = true
				const actual = new String__("gist.github.com").isURL()
				assert.equal(actual, expected)
			})

			it(`should return true for valid URLs that start with 'http'`, () => {
				const expected = true
				const actual = new String__("http://gist.github.com").isURL()
				assert.equal(actual, expected)
			})

			it(`should return false for invalid URLs that start with 'https'`, () => {
				const expected = false
				const actual = new String__("https:/gist.github.com").isURL()
				assert.equal(actual, expected)
			})

			it(`should return false for invalid URLs that start with 'http'`, () => {
				const expected = false
				const actual = new String__("http//gist.github.com").isURL()
				assert.equal(actual, expected)
			})

			it(`should return false for invalid URLs that have no domain extension`, () => {
				const expected = false
				const actual = new String__("http://test").isURL()
				assert.equal(actual, expected)
			})

			it(`should return false for empty URLs`, () => {
				const expected = false
				const actual = new String__("").isURL()
				assert.equal(actual, expected)
			})

			it(`should return false for invalid URLs that start with special characters`, () => {
				const expected = false
				const actual = new String__("http://www.*test.com").isURL()
				assert.equal(actual, expected)
			})

			it(`should return true for urls that contain a * character in the query after the domain name`, () => {
				const expected = true
				const actual = new String__("https://en.wikipedia.org/w/api.php?format=json&origin=*&titles=P-value").isURL()
				assert.equal(actual, expected)
			})

		})
	})

	describe("Number prototype", () => {
		describe("smartRounding()", () => {

			it(`should return an empty stirng when the input is undefined`, () => {
				assert.equal(Number__.smartRounding(undefined as any), "")
			})

			it(`should not show any decimals when the input is an integer`, () => {
				assert.equal(Number__.smartRounding(15), "15")
			})

			it(`should show decimals when the input is a float, without tilde if no rounding is done`, () => {
				assert.equal(Number__.smartRounding(15.5), "15.5")
			})

			it(`should show decimals when the input is a float, with a tilde if rounding is done`, () => {
				assert.equal(Number__.smartRounding(15.5006), "15.5")
			})

			it(`should not show any decimals when the input has 4 digits before the decimal`, () => {
				assert.equal(Number__.smartRounding(-1500.60), "-1501")
			})

			it(`should show no decimal when the input has 3 digits before the decimal`, () => {
				assert.equal(Number__.smartRounding(150.60), "151")
			})

			it(`should show one decimal when the input has 2 digits before the decimal`, () => {
				assert.equal(Number__.smartRounding(15.605), "15.6")
			})

			it(`should show two decimal when the input has 1 digits before the decimal`, () => {
				assert.equal(Number__.smartRounding(5.60), "5.60")
			})

			it(`should show two decimal when the input has no digits before the decimal`, () => {
				assert.equal(Number__.smartRounding(0.622256), "0.62")
			})

			it(`should show enough decimals to have 2 significant digits if the input is less than 0`, () => {
				assert.equal(Number__.smartRounding(0.000652387), "0.00065")
			})
		})


	})

}
//#endregion
