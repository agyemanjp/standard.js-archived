/* eslint-disable brace-style */

import { map, intersection, every, union, some, except, complement } from "../iterable"
import { Predicate, Ranker, Projector } from "../../functional"
import { Sequence } from "./sequence"
// import { Array } from "./array"

/** Set of unique elements, known in advance, without any specific order */
export class Set<X> extends Sequence<X> {
	constructor(elements: Iterable<X>/*, protected opts?: { comparer?: Comparer<X>, ranker?: Ranker<X> }*/) {
		// eslint-disable-next-line fp/no-unused-expression
		super(elements)
	}
	protected _set?: globalThis.Set<X> = undefined
	protected readonly core = ((me: this) => {
		return {
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

	/** Synonym of this.contains */
	has(value: X): boolean { return this.contains(value) }
	/** Synonym of this.contains */
	includes(value: X) { return this.contains(value) }
	/** Returns true if this array contains an element equal to value */
	contains(value: X) { return this.core.set.has(value) }

	some(predicate: Predicate<X>): boolean { return some(this, predicate) }
	every(predicate: Predicate<X>): boolean { return every(this, predicate) }

	map<Y>(projector: Projector<X, Y>) { return new Set<Y>(map(this, projector)) }

	union(collections: Iterable<X>[]) { return this.ctor(union([this, ...collections])) }
	intersection(collections: globalThis.Array<X>[]) { return this.ctor(intersection(collections)) }
	except(collections: globalThis.Array<X>[]): Iterable<X> { return this.ctor(except(this, ...collections)) }
	complement(universe: Iterable<X>): Iterable<X> { return complement([...this], universe) }

	// eslint-disable-next-line fp/no-mutating-methods
	sort(comparer?: Ranker<X>) { return this.ctor([...this].sort(comparer)) }
	// eslint-disable-next-line fp/no-mutating-methods
	sortDescending(comparer?: Ranker<X>) { return new Array([...this].sort(comparer).reverse()) }
}

