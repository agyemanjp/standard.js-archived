/* eslint-disable brace-style */
import { Predicate, Projector } from "./lambda"
import { unique, map } from "./combinators"
import { Set } from "./set"

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
			: this.entries().filter(kv => args.predicate(kv[1]) === true).map(kv => kv[0])
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
	map<Y>(projector: Projector<X, Y>) {
		return new Array<Y>(map(this, projector))
	}
}

export class stdArrayNumeric extends Array<number> {
	ctor(iterable: Iterable<number>): this { return new stdArrayNumeric(iterable) as this }

	min(): number | undefined {
		return this
			.reduce(undefined as number | undefined, (prev, curr) => (prev === undefined || curr < prev) ? curr : prev)
			.last()
	}
	max(): number | undefined {
		return this
			.reduce(undefined as number | undefined, (prev, curr) => (prev === undefined || curr > prev) ? curr : prev)
			.last()
	}

	mean(): number {
		if (this.length === 0)
			throw new Error(`Cannot calculate mean of empty array`)
		return this.sum() / this.size
	}
	variance(mean?: number /*optional already calculated mean */): number | undefined {
		if (this.size === 1)
			return 0

		const _mean = mean || this.mean()
		if (_mean === undefined)
			return undefined

		return this.map(datum => Math.pow(datum - _mean, 2)).sum() / (this.size)
	}
	deviation(): number | undefined {
		const variance = this.variance(this.mean())
		return variance ? Math.sqrt(variance) : undefined
	}

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
	sum() { return this.reduce(0, (x, y) => x + y).last() || 0 }

	map(projector: Projector<number, number>): stdArrayNumeric
	map<Y>(projector: Projector<number, Y>): Array<Y>
	map<Y>(projector: Projector<number, number> | Projector<number, Y>): stdArrayNumeric | Array<Y> {
		// eslint-disable-next-line fp/no-let
		let notNumeric = false
		const newArr = map<number, number | Y>(this, val => {
			const newVal = projector(val)
			if (typeof newVal !== "number" && typeof newVal !== "bigint")
				// eslint-disable-next-line fp/no-mutation
				notNumeric = true
			return newVal
		})

		return notNumeric
			? new Array(newArr as Iterable<Y>)
			: new stdArrayNumeric(newArr as Iterable<number>)
	}
}
