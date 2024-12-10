import {
	zip,
	unique,
	take, takeAsync,
	takeWhile, takeWhileAsync,
	skip, skipAsync,
	skipWhile, skipWhileAsync,
	first, firstAsync,
	firstOrDefault, firstOrDefaultAsync,
	last, lastAsync,
	lastOrDefault, lastOrDefaultAsync,
	map, mapAsync,
	filter, filterAsync,
	reduce, reduceAsync,
	forEach, forEachAsync,
	intersection,
	every, union,
	some, except,
	complement,
	toArrayAsync
} from "./combinators.js"
import { min, max, sum } from "../stats"
import type { Predicate, Projector, Reducer, PredicateAsync, ProjectorAsync, ReducerAsync, CollectionFinite, Ranker, ColumnarData, FilterSingle, RecordFilter, SortOrder } from "./types.js"
import { type TypeGuard, isAsyncIterable, Tuple, type Rec, isIterable, hasValue, isArray } from "../common"
import { createRanker, isFilterPair, isFilterSingle } from "./common"

/** Lazy collection of elements accessed sequentially, not known in advance */
export class Sequence<X> implements Iterable<X> {
	protected _iterable: Iterable<X>
	constructor(iterable: Iterable<X>) { this._iterable = iterable }
	protected ctor(iterable: Iterable<X>): this { return new Sequence(iterable) as this }

	[Symbol.iterator](): Iterator<X> { return this._iterable[Symbol.iterator]() }

	/** Convert to another iterable container type */
	to<C extends Iterable<X>>(container: { (items: Iterable<X>): C }) { return container([...this]) }

	toArray() { return [...this] }

	take(n: number) { return this.ctor(take(this, n)) }
	skip(n: number) { return this.ctor(skip(this, n)) }

	takeWhile(predicate: Predicate<X, number | void>) { return this.ctor(takeWhile(this, predicate)) }
	skipWhile(predicate: Predicate<X, number | void>) { return this.ctor(skipWhile(this, predicate)) }

	/** Get first element (or first element to satisfy a predicate, if supplied) of this sequence
	 * @param predicate Optional predicate applied to the elements
	 * @returns First element (as defined above) of this sequence
	 * @throws An error if such a first element cannot found
	 */
	first(predicate?: Predicate<X>) { return first(this, predicate) }
	/** Get first element (or first element to satisfy a predicate, if supplied) of this sequence
	 * @param predicate Optional predicate applied to elements
	 * @param defaultValue Optional default value to return if first element is not found (defaults to <undefined>)
	 * @returns First element (as defined above) of this sequence, or the defaultValue argument, if not found
	 */
	firstOrDefault(predicate?: Predicate<X>, defaultValue?: X) { return firstOrDefault(this, { predicate, defaultValue }) }

	/** Get last element (or last element to satisfy a predicate, if supplied) of this sequence
	 * @param predicate Optional predicate applied to elements
	 * @returns Last element (as defined above) of this sequence 
	 * @throws An error if such a last element cannot found
	 */
	last(predicate?: Predicate<X>) { return last(this, predicate) }
	/** Get last element (or last element to satisfy a predicate, if supplied) of this sequence
	 * @param predicate Optional predicate applied to elements
	 * @param defaultValue Optional default value to return if last element is not found (defaults to <undefined>)
	 * @returns Last element (as defined above) of this sequence, or the defaultValue argument, if not found
	 */
	lastOrDefault(predicate?: Predicate<X>, defaultValue?: X) { return lastOrDefault(this, { predicate, defaultValue }) }

	/** Filter based on a type-guard (for proper typing of the result) or predicate. */
	filter<X1 extends X>(guard: ["by-typeguard", TypeGuard<X, X1>]): Sequence<X1>
	filter(predicate: Predicate<X, number>): Sequence<X>
	filter<X1 extends X>(guardOrPredicate: Predicate<X, number> | ["by-typeguard", TypeGuard<X, X1>]) {
		return this.ctor(typeof guardOrPredicate === "function"
			? filter(this, guardOrPredicate)
			: filter(this, guardOrPredicate))
	}

	map<Y>(projector: Projector<X, Y>) { return new Sequence(map(this, projector)) }
	reduce<Y>(initial: Y, reducer: Reducer<X, Y>) { return new Sequence(reduce(this, initial, reducer)) }
	forEach(action: Projector<X>) { return forEach(this, action) }

	/** Generate sequence of integers including 'from' and 'to' values if provided */
	static integers(args: { from: number, to: number } | { from: number, direction: "upwards" | "downwards" }) {
		return new Sequence((function* () {
			let num = args.from
			while ("direction" in args || num !== (args.to >= args.from ? args.to + 1 : args.to - 1)) {
				yield ("to" in args ? args.to >= args.from : args.direction === "upwards") ? num++ : num--
			}
		})())
	}
	static fromRange(from: number, to: number, opts?: { mode: "width", width: number } | { mode: "count", count: number }) {
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

		return new Sequence((function* () {
			for (let index = 0; index < length; index++) {
				yield (from + (index * delta))
			}
		})())
	}
}

export class SequenceAsync<X> implements AsyncIterable<X> {
	protected _iterable: AsyncIterable<X>
	constructor(iterable: AsyncIterable<X> | Iterable<X>) {
		this._iterable = isAsyncIterable(iterable) ? iterable : (async function* () { yield* iterable })()
	}
	protected ctor(iterable: AsyncIterable<X>): this { return new SequenceAsync(iterable) as this }

	[Symbol.asyncIterator](): AsyncIterator<X> { return this._iterable[Symbol.asyncIterator]() }

	/** Convert to another iterable container type */
	to<C extends AsyncIterable<X>>(container: { (items: AsyncIterable<X>): C }) { return container(this) }

	toArrayAsync() { return toArrayAsync(this) }

	takeAsync(n: number) { return this.ctor(takeAsync(this, n)) }
	skipAsync(n: number) { return this.ctor(skipAsync(this, n)) }

	takeWhileAsync(predicate: PredicateAsync<X, number | void>) { return this.ctor(takeWhileAsync(this, predicate)) }
	skipWhileAsync(predicate: PredicateAsync<X, number | void>) { return this.ctor(skipWhileAsync(this, predicate)) }


	/** Get first element (or first element to satisfy a predicate, if supplied) of this sequence
	 * @param predicate Optional predicate applied to the elements
	 * @returns First element (as defined above) of this sequence
	 * @throws An error if such a first element cannot found
	 */
	firstAsync(predicate?: Predicate<X>) { return firstAsync(this, predicate) }
	/** Get first element (or first element to satisfy a predicate, if supplied) of this sequence
	 * @param predicate Optional predicate applied to elements
	 * @param defaultValue Optional default value to return if first element is not found (defaults to <undefined>)
	 * @returns First element (as defined above) of this sequence, or the defaultValue argument, if not found
	 */
	firstOrDefaultAsync(predicate?: Predicate<X>, defaultValue?: X) { return firstOrDefaultAsync(this, { predicate, defaultValue }) }

	/** Get last element (or last element to satisfy a predicate, if supplied) of this sequence
	 * @param predicate Optional predicate applied to elements
	 * @returns Last element (as defined above) of this sequence 
	 * @throws An error if such a last element cannot found
	 */
	lastAsync(predicate?: Predicate<X>) { return lastAsync(this, predicate) }
	/** Get last element (or last element to satisfy a predicate, if supplied) of this sequence
	 * @param predicate Optional predicate applied to elements
	 * @param defaultValue Optional default value to return if last element is not found (defaults to <undefined>)
	 * @returns Last element (as defined above) of this sequence, or the defaultValue argument, if not found
	 */
	lastOrDefaultAsync(predicate?: Predicate<X>, defaultValue?: X) { return lastOrDefaultAsync(this, { predicate, defaultValue }) }

	filterAsync(predicate: PredicateAsync<X>) { return this.ctor(filterAsync(this, predicate)) }
	mapAsync<Y>(projector: ProjectorAsync<X, Y>) { return new SequenceAsync(mapAsync(this, projector)) }
	reduceAsync<Y>(initial: Y, reducer: ReducerAsync<X, Y>) { return new SequenceAsync(reduceAsync(this, initial, reducer)) }
	forEachAsync(action: Projector<X>) { return forEachAsync(this, action) }
}

/** Set of unique elements, known in advance, without any specific order */
export class Set<X> extends Sequence<X> {
	constructor(elements: Iterable<X>/*, protected opts?: { comparer?: Comparer<X>, ranker?: Ranker<X> }*/) {
		super([...elements])
	}
	protected _set?: globalThis.Set<X> = undefined

	protected get core() {
		return ((me: this) => ({
			get set() {
				if (me._set === undefined) {
					// set is created from array for performance reasons
					me._set = new globalThis.Set(globalThis.Array.isArray(me._iterable)
						? me._iterable
						: [...me._iterable]
					)
				}
				return me._set
			},
			get iterable() { return me._iterable },
		}))(this)
	}
	protected readonly core_ = ((me: this) => ({
		get set() {
			if (me._set === undefined) {
				// set is created from array for performance reasons
				me._set = new globalThis.Set(globalThis.Array.isArray(me._iterable)
					? me._iterable
					: [...me._iterable]
				)
			}
			return me._set
		},
		get iterable() { return me._iterable },
	}))(this)
	protected ctor(iterable: Iterable<X>): this { return new Set(iterable) as this }

	get size(): number { return this.core.set.size }
	get length(): number { return this.size }

	/** Returns true if this array contains an element equal to value */
	contains(value: X) { return this.core.set.has(value) }
	/** Synonym of contains */
	has(value: X): boolean { return this.contains(value) }
	/** Synonym of contains */
	includes(value: X) { return this.contains(value) }

	some(predicate: Predicate<X, number>): boolean { return some(this, predicate) }
	every(predicate: Predicate<X, number>): boolean { return every(this, predicate) }

	map<Y>(projector: Projector<X, Y>) { return new Set<Y>(map(this, projector)) }

	/** Filter based on type-guard (for proper typing of the result) or predicate. */
	filter<X1 extends X>(guard: ["by-typeguard", TypeGuard<X, X1>]): Set<X1>
	filter(predicate: Predicate<X, number>): Set<X>
	filter<X1 extends X>(guardOrPredicate: Predicate<X, number> | ["by-typeguard", TypeGuard<X, X1>]) {
		return this.ctor(super.filter(guardOrPredicate as any))
	}

	union(collections: Iterable<X>[]) { return this.ctor(union([this, ...collections])) }

	intersection(others: (Iterable<X> & CollectionFinite)[]) { return this.ctor(intersection(others)) }

	/** All items in this set, except those in any of the input arrays */
	except(...excluded: (Iterable<X> & CollectionFinite)[]): Iterable<X> { return this.ctor(except(this, ...excluded)) }

	/** All items in input collection but not in this set */
	complement(universe: Iterable<X>): Iterable<X> { return complement([...this], universe) }

	equals(other: Set<X>) { return (this.size === other.size) && this.every(x => other.has(x)) }
	static equals<T>(...collections: (Iterable<T> & CollectionFinite)[]) {
		if (collections.length === 0) throw new Error(`Cannot check quality of empty set of collections passed`)
		const firstSet = new Set(collections[0]!)
		return new Vector(collections).skip(1).every(st => new Set(st).equals(firstSet))
	}

	sort(ranker?: Ranker<X>/*|Projector<X, any>*/) { return this.ctor([...this].sort(ranker)) }
	sortDescending(ranker?: Ranker<X>) { return new Vector([...this].sort(ranker).reverse()) }
}

/** Eager, ordered, material collection */
export class Vector<X> extends Set<X> {
	constructor(elements: Iterable<X>) {
		super(elements)
	}
	private _array?: globalThis.Array<X> = undefined
	private _map?: Map<number, X> = undefined

	ctor(elements: Iterable<X>): this {
		return new Vector(elements) as this
	}
	protected get core() {
		return ((me: this) => ({
			...super.core,
			get map() {
				if (me._map === undefined) {
					me._map = new globalThis.Map([...me._iterable].entries())
				}
				return me._map
			},
			get array() {
				if (me._array === undefined) {
					me._array = globalThis.Array.from([...me._iterable])
				}
				return me._array
			}
		}))(this)
	}

	get length() { return this.core.array.length }
	get size() { return this.length }

	get(index: number): X
	get(indices: Iterable<number>): X[]
	get(selection: number | Iterable<number>) {
		if (typeof selection === "number") {
			if (selection < 0 || selection >= this.length) { throw new Error(`Array index ${selection} out of bounds`) }
			return this.core.array[selection] as X
		}
		else {
			console.warn(`Array get() selection arg type: ${typeof selection}`)
			return [...selection].map(index => this.get(index))
		}
	}

	equals(other: Vector<X>) { return (this.size === other.size) && this.every((x, index) => x === other.get(index)) }
	static equals<T>(...collections: (Iterable<T> & CollectionFinite)[]) {
		if (collections.length === 0) throw new Error(`No collection input to check equality of`)
		const firstArray = new Vector(collections[0]!)
		return new Vector(collections).skip(1).every(collection => new Vector(collection).equals(firstArray))
	}

	/** Get the indexes where a value occurs or a certain predicate/condition is met */
	indexesOf(args: ({ value: X } | { predicate: Predicate<X> })) {
		return 'value' in args
			? this.entries().filter(kv => kv[1] === args.value).map(kv => kv[0])
			: this.entries().filter(kv => args.predicate(kv[1], kv[0]) === true).map(kv => kv[0])
	}

	entries() { return new Vector(this.core.array.entries()) }

	/** Get unique items in this array
	 * ToDo: Implement use of comparer in the include() call
	 */
	unique() { return this.ctor(unique(this)) }

	/** Returns new array containing this array's elements in reverse order */
	reverse() { return this.ctor([...this].reverse()) }

	/** Filter based on type-guard (for proper typing of the result) or predicate. */
	filter<X1 extends X>(guard: ["by-typeguard", TypeGuard<X, X1>]): Vector<X1>
	filter(predicate: Predicate<X, number>): Vector<X>
	filter<X1 extends X>(guardOrPredicate: Predicate<X, number> | ["by-typeguard", TypeGuard<X, X1>]) {
		return this.ctor(super.filter(guardOrPredicate as any))
	}

	/** Array-specific implementation of map() */
	map<Y>(projector: Projector<X, Y>) { return new Vector<Y>(map(this, projector)) }

	min(ranker: Ranker<X>) { return min([...this], ranker) }
	max(ranker: Ranker<X>) { return max([...this], ranker) }

	removeSliceCounted(index: number, count: number) {
		return this.ctor([...this].splice(index, count))
	}
	removeSliceDelimited(fromIndex: number, toIndex: number) {
		return this.ctor([...this].splice(fromIndex, toIndex - fromIndex + 1))
	}

	/** Insert items into the array at specific index. It returns a new created array with the added items
	 * @param index the index of the array at which insert the items
	 * @param items elements to insert
	 */
	insert(index: number, ...items: X[]) {
		const arr = [...this]
		if (index < 0 || index > arr.length) return this.ctor(arr)
		return this.ctor([...arr.slice(0, index), ...items, ...arr.slice(index)])
	}
}

/** Numeric array with extra methods */
export class VectorNumeric<X extends number = number> extends Vector<X> {
	ctor(iterable: Iterable<X>): this { return new VectorNumeric<X>(iterable) as this }

	static fromRange(from: number, to: number, opts?: { mode: "width", width: number } | { mode: "count", count: number }) {
		return new VectorNumeric(Sequence.fromRange(from, to, opts))
	}

	sum() { return sum([...this]) }

	map<Y extends number>(projector: Projector<X, Y>): VectorNumeric<Y>
	map<Y>(projector: Projector<X, Y>): Vector<Y>
	map<Y>(projector: Projector<X, Y>) {
		let notNumeric = false
		const newArr = map<X, Y>(this, (val, index) => {
			const newVal = projector(val, index)
			if (typeof newVal !== "number" && typeof newVal !== "bigint") { notNumeric = true }
			return newVal
		})

		return notNumeric
			? new Vector(newArr as Iterable<Y>)
			: new VectorNumeric<any>(newArr) as any
	}

	/** Filter based on type-guard (for proper typing of the result) or predicate. */
	filter<X1 extends X>(guard: ["by-typeguard", TypeGuard<X, X1>]): VectorNumeric<X1>
	filter(predicate: Predicate<X, number>): VectorNumeric<X>
	filter<X1 extends X>(guardOrPredicate: Predicate<X, number> | ["by-typeguard", TypeGuard<X, X1>]) {
		return this.ctor(super.filter(guardOrPredicate as any))
	}
}

/** Eager, un-ordered, material, indexed associative collection */
export class Dictionary<T extends Record<string, unknown>> implements Iterable<Tuple<keyof T, T[keyof T]>> {
	private readonly obj: Readonly<T>
	constructor(obj: T) { this.obj = Object.freeze({ ...obj }) }

	static fromKeyValues<K extends string, V>(keyValues: Iterable<Tuple<K, V>>) {
		const obj = {} as Record<K, V>
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
		keys.forEach(k => result[k] = this.obj[k])

		return new Dictionary(result)
	}
	omit<K extends keyof T>(keys: K[]) {
		const result = this.asObject()
		keys.forEach(k => delete result[k])
		return new Dictionary(result as Omit<T, K>)
	}

	map<Y>(projector: Projector<T[keyof T], Y, keyof T>) {
		const keyValues = this.entries().map(kv => new Tuple(String(kv[0]), projector(kv[1], kv[0])))
		return Dictionary.fromKeyValues(keyValues)
	}
	reduce<Y>(initial: Y, reducer: Reducer<T[keyof T], Y, keyof T>) {
		return this.entries().reduce((prev, curr) => reducer(prev, curr[1], curr[0]), initial)
	}

	get(selector: keyof T): T[keyof T] {
		if ([null, undefined].includes(this.obj[selector] as any)) { throw new Error() }
		else { return this.obj[selector] }
	}
	tryGet(selector: keyof T): T[keyof T] | undefined { return this.obj[selector] }
	getAll(selector: Iterable<keyof T>): Iterable<T[keyof T] | undefined> { return map(selector, index => this.obj[index]) }

	set(key: keyof T, value: T[keyof T]) {
		return new Dictionary({ ...this.obj, [key]: value })
	}
}

/** Provides functionality for manipulating a data table in memory */
export class DataTable<T extends Rec = Rec> /*implements Table<T>*/ {
	protected readonly ROW_NUM_COL_NAME: string
	protected readonly _idVector: number[]
	protected readonly _colVectors: Dictionary<ColumnarData<T>>

	/** Contruct from a collection of objects
	 * @param rowObjects Iterable collection of row object literals
	 * @param idVector 
	 */
	constructor(rowObjects: Iterable<T>, idVector?: Iterable<number>, rowNumColName?: string)

	/** Construct from an object literal of columns
	 * @param columnVectors
	 * @param idVector 
	 */
	constructor(columnVectors: ColumnarData<T>, idVector?: Iterable<number>, rowNumColName?: string)

	/** Actual implementation of constructor variants
	 * @param source Either rows or columns as defined above
	 * @param idVector Optional vector of row indexes indicating which which rows are part of this data table
	 */
	constructor(source: Iterable<T> | ColumnarData<T>, idVector?: Iterable<number>, rowNumColName = "rowNum") {
		this._colVectors = isIterable(source)
			? new Dictionary(DataTable.rowsToColumns(source))
			: new Dictionary(source)

		this._idVector = idVector
			? [...idVector]
			: this._colVectors.size > 0
				? [...globalThis.Array([...this._colVectors][0]![1].length).keys()]
				: []

		// console.log(`\nDataTable took ${new Date().getTime() - start}ms to instantiate`)
		this.ROW_NUM_COL_NAME = rowNumColName
	}

	static fromColumns<X extends Rec = Rec>(columnVectors: ColumnarData<X>, idVector?: Iterable<number>) {
		return new DataTable(columnVectors, idVector)
	}
	static fromRows<X extends Rec = Rec>(rowObjects: Iterable<X>, idVector?: Iterable<number>) {
		return new DataTable(rowObjects, idVector)
	}

	get idVector() { return this._idVector }

	/** Columns vectors excluding row ids vector */
	get columnVectors() { return this._colVectors }

	/** Return data as an iterable of rows that includes a sequential row number property */
	get rowObjects(): Iterable<T> {
		return (function* (me): IterableIterator<T> {
			for (const originalRowNum of me._idVector) {
				const row = {
					...me._colVectors.map(vector => vector[originalRowNum]).asObject() as any as T
				}
				yield row
			}
		})(this)
	}
	get rowObjectsNumbered(): Iterable<T & { origRowNum: number, sequentialRowNum: number }> {
		return (function* (me): IterableIterator<T & { origRowNum: number, sequentialRowNum: number }> {
			for (const rowNumInfo of zip(Sequence.integers({ from: 0, to: me.length - 1 }), me._idVector)) {
				const [sequentialRowNum, originalRowNum] = rowNumInfo

				const row: T & { origRowNum: number, sequentialRowNum: number } = {
					origRowNum: originalRowNum,
					sequentialRowNum: sequentialRowNum + 1,
					...me._colVectors.map(vector => vector[originalRowNum]).asObject() as any as T
				}

				yield row
			}
		})(this)
	}

	get length() { return this._idVector.length }
	get originalLength() { return this._colVectors.get(this._colVectors.keys()[0]!).length || 0 }

	/** Return a new data table that excludes data disallowed by the passed filters */
	filter(args:
		{
			filter?: Predicate<T, void> | FilterSingle<T> | RecordFilter<T>,
			options?: {
				/** Filter without consideration of id vector i.e., use all/original values in column vectors */
				scope: "current" | "original"
			}
		}): DataTable<T> {

		const shouldRetain = (row: T, _filter: Predicate<T, void> | FilterSingle<T> | RecordFilter<T>): boolean => {
			if (isArray(_filter) && isFilterPair(_filter)) {
				switch (_filter[1]) {
					// case undefined:
					case "AND": return [_filter[0], _filter[2]].every(f => shouldRetain(row, f))
					case "OR": return [_filter[0], _filter[2]].some(f => shouldRetain(row, f))
					default: {
						const _: never = _filter[1]
						throw new Error(`Unknown filter group combinator: ${_filter[1]}`)
					}
				}
			}
			else if (isArray(_filter) && isFilterSingle(_filter)) {
				const _val = row[_filter[0]]
				const _key = () => _filter[2]

				switch (_filter[1]) {
					case "equals": return (_val === _key())
					case "does-not-equal": return (_val !== _filter[2])
					case "greater-than": {
						const key = _filter[2]
						return typeof key === "string"
							? String(_val) > String(key)
							: parseFloat(String(_val)) > key
					}
					case "less-than": {
						const key = _filter[2]
						return typeof key === "string"
							? String(_val) < String(key)
							: parseFloat(String(_val)) > key
					}
					case "contains": return (hasValue(_val) && String(_val).indexOf(_filter[2]) >= 0)
					case "doesn't-contain": return (hasValue(_val) && String(_val).indexOf(_filter[2]) < 0)
					case "starts-with": return (_val !== undefined && _val !== null && String(_val).startsWith(_filter[2]))
					case "ends-with": return (_val !== undefined && _val !== null && String(_val).endsWith(_filter[2]))
					case "is-null": return _val === undefined || _val === null
					case "is-not-null": return hasValue(_val)

					default: {
						throw new Error(`Unknown filter operator: ${(_filter as any).operator}`)
					}
				}
			}
			else {
				return _filter(row)
			}
		}

		const effectiveIdVector = args.options?.scope === "original"
			? Sequence.integers({ from: 0, to: this.originalLength - 1 })
			: this._idVector
		const idColumnVectorFiltered = effectiveIdVector.filter(rowNum => {
			if (args.filter === undefined) return true
			const row = this._colVectors.map(v => v[rowNum]).asObject() as any as T
			return shouldRetain(row, args.filter)
		})

		return new DataTable<T>(this._colVectors.asObject(), idColumnVectorFiltered)
	}

	sort(args:
		{
			columnName: /*typeof this.ROW_NUM_COL_NAME |*/ keyof T,
			order: SortOrder,
			options?: { tryNumericSort: boolean }
		}) {
		if (args.columnName !== this.ROW_NUM_COL_NAME && this._colVectors.get(args.columnName) === undefined) { throw new Error(`Unknown column ${String(args.columnName)}`) }

		const idColumnVectorSorted = [...this._idVector].sort(
			createRanker<number>(rowNum => args.columnName === this.ROW_NUM_COL_NAME
				? rowNum
				: this._colVectors.get(args.columnName)[rowNum],
				{
					tryNumeric: args.options?.tryNumericSort ?? true,
					reverse: args.order === "descending"
				}
			)
		)

		return new DataTable<T>(this._colVectors.asObject(), idColumnVectorSorted)
	}

	page(args:
		{
			size: number,
			index: number, options?: {
				/** Page without consideration of id vector i.e., use all/original values in column vectors */
				scope: "current" | "original"
			}
		}) {
		const effectiveIdVector = args.options?.scope === "original"
			? [...Sequence.integers({ from: 0, to: this.originalLength - 1 })]
			: this._idVector

		const idColumnVectorPaged = effectiveIdVector.slice(args.index * args.size, (args.index + 1) * args.size)
		return new DataTable<T>(this._colVectors.asObject(), idColumnVectorPaged)
	}

	map<Y>(projector: Projector<T[keyof T], Y>) {
		return new DataTable(this._colVectors.map(vector => vector.map(projector)).asObject()) as DataTable<Rec<Y>>
	}

	static rowsToColumns = <X extends Rec = Rec>(rows: Iterable<X>): ColumnarData<X> => {
		const srcArray = [...rows]
		const columnVectors = {} as ColumnarData<X>
		srcArray.forEach((row, index) => {
			const rowKeys = new Dictionary(row).keys()
			if (rowKeys.some(key => hasValue(row[key]))) { // ensure row is not empty
				rowKeys.forEach(colName => {
					if (!columnVectors[colName]) { columnVectors[colName] = new globalThis.Array(srcArray.length).fill(undefined) }
					columnVectors[colName][index] = row[colName]
				})
			}
		})
		return columnVectors
	}
}


const x = new VectorNumeric([1, 2, 3, 4]).filter(["by-typeguard", (n): n is 3 => n === 3])
