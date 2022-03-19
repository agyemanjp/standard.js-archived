/* eslint-disable fp/no-rest-parameters */
/* eslint-disable fp/no-mutating-methods */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable brace-style */
/* eslint-disable fp/no-unused-expression */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable fp/no-class */

/* eslint-disable fp/no-mutation */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable indent */
/* eslint-disable fp/no-loops */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable brace-style */

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
	every, everyAsync,
	union,
	some, someAsync,
	except,
	complement,
	toArrayAsync
} from "./combinators"

import {
	min,
	max,
	sum,
	mean,
	deviation
} from "../stats"

import { Ranker, Predicate, PredicateAsync, Projector, ProjectorAsync, Reducer, ReducerAsync, createRanker } from "../functional"
import { Tuple, Obj, isIterable, isAsyncIterable, hasValue } from "../utility"
import {
	Finite,
	PagingOptions, SortOptions, FilterOptions,
	Filter, FilterGroup, SortOrder,
	ColumnarData
} from "./types"



/** Lazy collection of elements accessed sequentially, not known in advance */
export class Sequence<X> implements Iterable<X> {
	protected _iterable: Iterable<X>
	// eslint-disable-next-line fp/no-nil, fp/no-mutation
	constructor(iterable: Iterable<X>) { this._iterable = iterable }
	protected ctor(iterable: Iterable<X>): this { return new Sequence(iterable) as this }

	[Symbol.iterator](): Iterator<X> { return this._iterable[Symbol.iterator]() }

	/** Convert to another iterable container type */
	to<C extends Iterable<X>>(container: { (items: Iterable<X>): C }) { return container([...this]) }

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

	filter(predicate: Predicate<X>) { return this.ctor(filter(this, predicate)) }
	map<Y>(projector: Projector<X, Y>) { return new Sequence(map(this, projector)) }
	reduce<Y>(initial: Y, reducer: Reducer<X, Y>) { return new Sequence(reduce(this, initial, reducer)) }
	forEach(action: Projector<X>) { return forEach(this, action) }

	/** Generate sequence of integers including 'from' and 'to' values if provided */
	static integers(args: { from: number, to: number } | { from: number, direction: "upwards" | "downwards" }) {
		return new Sequence((function* () {
			// eslint-disable-next-line fp/no-let
			let num = args.from
			// eslint-disable-next-line fp/no-loops
			while ("direction" in args || num !== (args.to >= args.from ? args.to + 1 : args.to - 1)) {
				// eslint-disable-next-line fp/no-mutation
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
			// eslint-disable-next-line fp/no-let, fp/no-loops, fp/no-mutation
			for (let index = 0; index < length; index++) {
				// eslint-disable-next-line fp/no-mutating-methods
				yield (from + (index * delta))
			}
		})())
	}
}

export class SequenceAsync<X> implements AsyncIterable<X> {
	protected _iterable: AsyncIterable<X>
	// eslint-disable-next-line fp/no-nil, fp/no-mutation
	constructor(iterable: AsyncIterable<X> | Iterable<X>) {
		this._iterable = isAsyncIterable(iterable) ? iterable : (async function* () { yield* iterable })()
	}
	protected ctor(iterable: AsyncIterable<X>): this { return new SequenceAsync(iterable) as this }

	[Symbol.asyncIterator](): AsyncIterator<X> { return this._iterable[Symbol.asyncIterator]() }

	/** Convert to another iterable container type */
	to<C extends AsyncIterable<X>>(container: { (items: AsyncIterable<X>): C }) { return container(this) }

	takeAsync(n: number) { return this.ctor(takeAsync(this, n)) }
	skip(n: number) { return this.ctor(skipAsync(this, n)) }

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
		// eslint-disable-next-line fp/no-unused-expression
		super([...elements])
	}
	protected _set?: globalThis.Set<X> = undefined
	protected readonly core = ((me: this) => {
		return {
			// eslint-disable-next-line fp/no-get-set
			get set() {
				if (me._set === undefined) {
					// set is created from array for performance reasons
					// eslint-disable-next-line fp/no-mutation
					me._set = new globalThis.Set(globalThis.Array.isArray(me._iterable)
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

	union(collections: Iterable<X>[]) { return this.ctor(union([this, ...collections])) }

	intersection(others: (Iterable<X> & Finite)[]) { return this.ctor(intersection(others)) }

	/** All items in this set, except those in any of the input arrays */
	except(...excluded: (Iterable<X> & Finite)[]): Iterable<X> { return this.ctor(except(this, ...excluded)) }

	/** All items in input collection but not in this set */
	complement(universe: Iterable<X>): Iterable<X> { return complement([...this], universe) }

	equals(other: Set<X>) { return (this.size === other.size) && this.every(x => other.has(x)) }
	static equals<T>(...collections: (Iterable<T> & Finite)[]) {
		const firstSet = new Set(collections[0])
		return new Array(collections).skip(1).every(st => new Set(st).equals(firstSet))
	}

	// eslint-disable-next-line fp/no-mutating-methods
	sort(comparer?: Ranker<X>) { return this.ctor([...this].sort(comparer)) }
	// eslint-disable-next-line fp/no-mutating-methods
	sortDescending(comparer?: Ranker<X>) { return new Array([...this].sort(comparer).reverse()) }
}

/** Eager, ordered, material collection */
export class Array<X> extends Set<X> {
	constructor(elements: Iterable<X>) {
		// eslint-disable-next-line fp/no-unused-expression
		super(elements)
	}
	private _array?: globalThis.Array<X> = undefined
	private _map?: Map<number, X> = undefined

	ctor(elements: Iterable<X>): this {
		return new Array(elements) as this
	}
	protected readonly core = ((me: this) => {
		return {
			...super.core,
			get map() {
				if (me._map === undefined) {
					// eslint-disable-next-line fp/no-mutation
					me._map = new globalThis.Map([...me._iterable].entries())
				}
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				return me._map!
			},
			get array() {
				if (me._array === undefined) {
					// eslint-disable-next-line fp/no-mutation
					me._array = globalThis.Array.from([...me._iterable])
				}
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				return me._array!
			}
		}
	})(this)

	get length() { return this.core.array.length }
	get size() { return this.length }

	get(index: number): X
	get(indices: Iterable<number>): X[]
	get(selection: number | Iterable<number>) {
		if (typeof selection === "number") {
			if (selection < 0 || selection >= this.length)
				throw new Error(`Array index ${selection} out of bounds`)
			return this.core.array[selection] as X
		}
		else {
			// eslint-disable-next-line fp/no-unused-expression
			console.warn(`Array get() selection arg type: ${typeof selection}`)
			return [...selection].map(index => this.get(index))
		}
	}

	equals(other: Array<X>) { return (this.size === other.size) && this.every((x, index) => x === other.get(index)) }
	static equals<T>(...collections: (Iterable<T> & Finite)[]) {
		const firstArray = new Array(collections[0])
		return new Array(collections).skip(1).every(collection => new Array(collection).equals(firstArray))
	}

	/** Get the indexes where a value occurs or a certain predicate/condition is met */
	indexesOf(args: ({ value: X } | { predicate: Predicate<X> })) {
		return 'value' in args
			? this.entries().filter(kv => kv[1] === args.value).map(kv => kv[0])
			: this.entries().filter(kv => args.predicate(kv[1], kv[0]) === true).map(kv => kv[0])
	}

	entries() { return new Array(this.core.array.entries()) }

	/** Get unique items in this array
	 * ToDo: Implement use of comparer in the include() call
	 */
	unique() { return this.ctor(unique(this)) }

	/** Returns new array containing this array's elements in reverse order */
	// eslint-disable-next-line fp/no-mutating-methods
	reverse() { return this.ctor([...this].reverse()) }

	/** Array-specific implementation of map() */
	map<Y>(projector: Projector<X, Y>) { return new Array<Y>(map(this, projector)) }

	min(ranker: Ranker<X>) { return min([...this], ranker) }
	max(ranker: Ranker<X>) { return max([...this], ranker) }

	removeSliceCounted(index: number, count: number) {
		// eslint-disable-next-line fp/no-mutating-methods
		return this.ctor([...this].splice(index, count))
	}
	removeSliceDelimited(fromIndex: number, toIndex: number) {
		// eslint-disable-next-line fp/no-mutating-methods
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
export class ArrayNumeric extends Array<number> {
	ctor(iterable: Iterable<number>): this { return new ArrayNumeric(iterable) as this }

	static fromRange(from: number, to: number, opts?: { mode: "width", width: number } | { mode: "count", count: number }) {
		return new ArrayNumeric(Sequence.fromRange(from, to, opts))
	}

	sum() { return sum([...this]) }

	map(projector: Projector<number, number>): ArrayNumeric
	map<Y>(projector: Projector<number, Y>): Array<Y>
	map<Y>(projector: Projector<number, number> | Projector<number, Y>): ArrayNumeric | Array<Y> {
		// eslint-disable-next-line fp/no-let
		let notNumeric = false
		const newArr = map<number, number | Y>(this, (val, index) => {
			const newVal = projector(val, index)
			if (typeof newVal !== "number" && typeof newVal !== "bigint")
				// eslint-disable-next-line fp/no-mutation
				notNumeric = true
			return newVal
		})

		return notNumeric
			? new Array(newArr as Iterable<Y>)
			: new ArrayNumeric(newArr as Iterable<number>)
	}
}

/** Eager, un-ordered, material, indexed associative collection */
export class Dictionary<T extends Record<string, unknown>> implements Iterable<Tuple<keyof T, T[keyof T]>> {
	private readonly obj: Readonly<T>
	// eslint-disable-next-line brace-style
	// eslint-disable-next-line fp/no-mutation
	constructor(obj: T) { this.obj = Object.freeze({ ...obj }) }

	static fromKeyValues<K extends string, V>(keyValues: Iterable<Tuple<K, V>>) {
		const obj = {} as Record<K, V>
		// eslint-disable-next-line fp/no-mutation, fp/no-loops
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
		// eslint-disable-next-line fp/no-unused-expression, fp/no-mutation
		keys.forEach(k => result[k] = this.obj[k])

		return new Dictionary(result)
	}
	omit<K extends keyof T>(keys: K[]) {
		const result = this.asObject()
		// eslint-disable-next-line fp/no-unused-expression, fp/no-delete
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
		if ([null, undefined].includes(this.obj[selector] as any))
			throw new Error()
		else
			return this.obj[selector]
	}
	tryGet(selector: keyof T): T[keyof T] | undefined { return this.obj[selector] }
	getAll(selector: Iterable<keyof T>): Iterable<T[keyof T] | undefined> { return map(selector, index => this.obj[index]) }

	set(key: keyof T, value: T[keyof T]) {
		return new Dictionary({ ...this.obj, [key]: value })
	}

	/** Get the indexes where a value occurs or a certain predicate/condition is met */
	indexesOf(args: ({ value: T[keyof T] } | { predicate: Predicate<T[keyof T], keyof T> })) {
		return 'value' in args
			? this.entries().filter(kv => kv[1] === args.value).map(kv => kv[0])
			: this.entries().filter(kv => args.predicate(kv[1], kv[0]) === true).map(kv => kv[0])
	}
}

/** Provides functionality for manipulating data table in memory */
export class DataTable<T extends Obj = Obj> /*implements Table<T>*/ {
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
		// eslint-disable-next-line fp/no-mutation, @typescript-eslint/no-explicit-any
		this._colVectors = isIterable(source)
			? new Dictionary(DataTable.rowsToColumns(source))
			: new Dictionary(source)

		// eslint-disable-next-line fp/no-mutation
		this._idVector = idVector
			? [...idVector]
			: this._colVectors.size > 0
				? [...globalThis.Array([...this._colVectors][0][1].length).keys()]
				: []

		// eslint-disable-next-line fp/no-unused-expression
		// console.log(`\nDataTable took ${new Date().getTime() - start}ms to instantiate`)
		this.ROW_NUM_COL_NAME = rowNumColName
	}

	static fromColumns<X extends Obj = Obj>(columnVectors: ColumnarData<X>, idVector?: Iterable<number>) {
		return new DataTable(columnVectors, idVector)
	}
	static fromRows<X extends Obj = Obj>(rowObjects: Iterable<X>, idVector?: Iterable<number>) {
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
	get originalLength() { return this._colVectors.get(this._colVectors.keys()[0])?.length || 0 }

	/** Return a new data table that excludes data disallowed by the passed filters */
	filter(args: { filter?: Predicate<T, void> | Filter<T> | FilterGroup<T>, options?: FilterOptions }): DataTable<T> {

		const shouldRetain = (row: T, _filter: Predicate<T, void> | Filter<T> | FilterGroup<T>): boolean => {
			if ("filters" in _filter) {
				switch (_filter.combinator) {
					case undefined:
					case "AND": return _filter.filters.every(f => shouldRetain(row, f))
					case "OR": return _filter.filters.some(f => shouldRetain(row, f))
					default: {
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
						const _: never = _filter.combinator
						throw new Error(`Unknown filter group combinator: ${_filter.combinator}`)
					}
				}
			}
			else if ("fieldName" in _filter) {
				// eslint-disable-next-line fp/no-let
				let averageAndDev: { average: number, std: number } = { average: 0, std: 0 }
				if (_filter.operator === "is_outlier_by") {
					const originalIdVector = this.idVector
					const colVector: unknown[] | undefined = _filter.fieldName === "rowId"
						? originalIdVector
						: this._colVectors.get(_filter.fieldName as keyof T)
					if (colVector === undefined) {
						throw new Error(`Trying to apply a filter on column ${_filter.fieldName}, but no such column in the dataTable`)
					}
					const vector: number[] = colVector.filter(v => v !== undefined).map(val => Number.parseFloat(String(val)))
					const columnMean = mean(vector)
					const stdv = deviation(vector, { mean: columnMean, forSample: true })
					if (columnMean === undefined) { throw new Error("Undefined mean, cannot filter by standard deviation") }
					if (stdv === undefined) { throw new Error("Undefined std dev, cannot filter by standard deviation") }

					averageAndDev = {
						average: columnMean,
						std: stdv
					}
				}

				const _test = _filter.negated ? false : true
				const _val = row[_filter.fieldName as keyof T]

				switch (_filter.operator) {
					case "equal":
						return (_val == _filter.value) === _test
					case "not_equal":
						return (_val != _filter.value) === _test
					case "greater":
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						return (parseFloat(String(_val)) > parseFloat(_filter.value as any)) === _test
					case "greater_or_equal":
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						return (parseFloat(String(_val)) >= parseFloat(_filter.value as any)) === _test
					case "less":
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						return (parseFloat(String(_val)) < parseFloat(_filter.value as any)) === _test
					case "less_or_equal":
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						return (parseFloat(String(_val)) <= parseFloat(_filter.value as any)) === _test
					case "is_outlier_by": {
						const belowMin = parseFloat(String(_val)) < averageAndDev.average - parseFloat(_filter.value as any) * averageAndDev.std
						const aboveMax = parseFloat(String(_val)) > averageAndDev.average + parseFloat(_filter.value as any) * averageAndDev.std
						return (belowMin || aboveMax) === _test
					}
					case "contains":
						return (hasValue(_val) && String(_val).indexOf(_filter.value) >= 0) === _test
					case "is-contained":
						return (hasValue(_val) && _filter.value.indexOf(String(_val)) >= 0) === _test
					case "starts_with":
						return (_val !== undefined && _val !== null && String(_val).startsWith(_filter.value)) === _test
					case "ends_with":
						return (_val !== undefined && _val !== null && String(_val).endsWith(_filter.value)) === _test
					case "blank":
						return _val === undefined || _val === null === _test

					default: {
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const row = this._colVectors.map(v => v[rowNum]).asObject() as any as T
			return shouldRetain(row, args.filter)
		})

		return new DataTable<T>(this._colVectors.asObject(), idColumnVectorFiltered)
	}

	sort(args: { columnName: /*typeof this.ROW_NUM_COL_NAME |*/ keyof T, order: SortOrder, options?: SortOptions }) {
		if (args.columnName !== this.ROW_NUM_COL_NAME && this._colVectors.get(args.columnName) === undefined)
			throw new Error(`Unknown column ${args.columnName}`)

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

	page(args: { size: number, index: number, options?: PagingOptions }) {
		const effectiveIdVector = args.options?.scope === "original"
			? [...Sequence.integers({ from: 0, to: this.originalLength - 1 })]
			: this._idVector

		const idColumnVectorPaged = effectiveIdVector.slice(args.index * args.size, (args.index + 1) * args.size)
		return new DataTable<T>(this._colVectors.asObject(), idColumnVectorPaged)
	}

	map<Y>(projector: Projector<T[keyof T], Y>) {
		return new DataTable(this._colVectors.map(vector => vector.map(projector)).asObject()) as DataTable<Obj<Y>>
	}

	static rowsToColumns = <X extends Obj = Obj>(rows: Iterable<X>): ColumnarData<X> => {
		const srcArray = [...rows as Iterable<X>]
		const columnVectors = {} as ColumnarData<X>
		// eslint-disable-next-line fp/no-unused-expression
		srcArray.forEach((row, index) => {
			const rowKeys = new Dictionary(row).keys()
			if (rowKeys.some(key => hasValue(row[key]))) { // ensure row is not empty
				// eslint-disable-next-line fp/no-unused-expression
				rowKeys.forEach(colName => {
					if (!columnVectors[colName])
						// eslint-disable-next-line fp/no-mutation
						columnVectors[colName] = new globalThis.Array(srcArray.length).fill(undefined)
					// eslint-disable-next-line fp/no-mutation
					columnVectors[colName][index] = row[colName]
				})
			}
		})
		return columnVectors
	}
}


