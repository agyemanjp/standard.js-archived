/* eslint-disable brace-style */
/* eslint-disable fp/no-unused-expression */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable fp/no-class */

import { Predicate, Projector, Reducer, take, skip, first, last, map, filter, reduce, forEach } from "./combinators"

/** Lazy collection of elements accessed sequentially, not known in advance */
export class Sequence<X> implements Iterable<X> {
	// eslint-disable-next-line fp/no-nil, fp/no-mutation
	constructor(iterable: Iterable<X>) { this._iterable = iterable }
	protected _iterable: Iterable<X>
	protected ctor(iterable: Iterable<X>): this { return new Sequence(iterable) as this }

	[Symbol.iterator](): Iterator<X> { return this._iterable[Symbol.iterator]() }

	/** Convert to another iterable container type */
	to<C extends Iterable<X>>(container: { (items: Iterable<X>): C }) { return container([...this]) }

	take(n: number) { return this.ctor(take(this, n)) }
	skip(n: number) { return this.ctor(skip(this, n)) }

	/** Get first element (or first element to satisfy a predicate, if supplied) of this sequence
	 * @param predicate Optional predicate to filter elements
	 * @returns First element, or <undefined> if such an element is not found
	 */
	first(predicate?: Predicate<X>) { return first(this, predicate) }

	/** Get last element (or last element to satisfy optional predicate argument) of this sequence
	 * @param predicate Optional predicate to filter elements
	 * @returns Last element as defined, or <undefined> if such an element is not found
	 */
	last(predicate?: Predicate<X>) { return last(this, predicate) }

	filter(predicate: Predicate<X>) { return this.ctor(filter(this, predicate)) }
	map<Y>(projector: Projector<X, Y>) { return new Sequence(map(this, projector)) }
	reduce<Y>(initial: Y, reducer: Reducer<X, Y>) { return new Sequence(reduce(this, initial, reducer)) }
	forEach(action: Projector<X>) { return forEach(this, action) }

	/** Generate sequence of integers */
	static integers(args: { from: number, to: number } | { from: number, direction: "upwards" | "downwards" }) {
		return new Sequence((function* () {
			// eslint-disable-next-line fp/no-let
			let num = args.from
			// eslint-disable-next-line fp/no-loops
			do {
				// eslint-disable-next-line fp/no-mutation
				yield ("to" in args ? args.to >= args.from : args.direction === "upwards") ? num++ : num--
			}
			while ("direction" in args || args.from !== args.to)

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

/* export class stdTupleSequence<T> extends Sequence<[string, T]> {
	toDictionary<X>() {
		return Dictionary.fromKeyValues([...this])
	}
}*/