/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable brace-style */
/* eslint-disable fp/no-unused-expression */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable fp/no-class */

import {
	contains,
	unique,
	take, takeWhile,
	skip, skipWhile,
	first, firstOrDefault,
	last, lastOrDefault,
	map,
	filter,
	reduce,
	forEach,
	intersection,
	every,
	union,
	some,
	except,
	complement,
} from "./combinators"

import {
	min,
	max,
	sum
} from "../stats"

import { Ranker, Predicate, Projector, Reducer } from "../functional"
import { Tuple } from "../utility"
import { IndexedAccess, Container, Finite } from "./types"

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

	some(predicate: Predicate<X>): boolean { return some(this, predicate) }
	every(predicate: Predicate<X>): boolean { return every(this, predicate) }

	map<Y>(projector: Projector<X, Y>) { return new Set<Y>(map(this, projector)) }

	union(collections: Iterable<X>[]) { return this.ctor(union([this, ...collections])) }

	intersection(others: (Iterable<X> & Finite)[]) { return this.ctor(intersection(others)) }

	/** All items in this set, except those in any of the input arrays */
	except(...excluded: (Iterable<X> & Finite)[]): Iterable<X> { return this.ctor(except(this, ...excluded)) }

	/** All items in input collection but not in this set */
	complement(universe: Iterable<X>): Iterable<X> { return complement([...this], universe) }

	equals(other: Set<X>) { return (this.size === other.size) && this.every(x => other.has(x)) }
	static equals<T>(...collections: (Iterable<T> & Finite)[]) {
		const _first = first(collections)
		const size = "length" in _first ? _first.length : _first.size
		return collections.every(c => ("length" in c ? c.length : c.size) === size && every(c, x => contains(collections[0], x)))
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

	get(selector: keyof T): T[keyof T] | undefined { return this.obj[selector] }
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

