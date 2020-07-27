/* eslint-disable brace-style */
import { Predicate, unique, Projector, map } from "./core"
import { stdSet } from "./set"
import { stdNumber } from "./number"

/** Eager, ordered, material collection */
export class stdArray<X> extends stdSet<X> {
	constructor(elements: Iterable<X>) {
		// eslint-disable-next-line fp/no-unused-expression
		super(elements)
	}
	private _array?: globalThis.Array<X> = undefined
	private _map?: globalThis.Map<number, X> = undefined

	ctor(elements: Iterable<X>): this {
		return new stdArray(elements) as this
	}
	protected readonly core = ((me: this) => {
		return {
			...super.core,
			get map() {
				if (me._map === undefined) {
					// eslint-disable-next-line fp/no-mutation
					me._map = new global.Map([...me._iterable].entries())
				}
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				return me._map!
			},
			get array() {
				if (me._array === undefined) {
					// eslint-disable-next-line fp/no-mutation
					me._array = global.Array.from([...me._iterable])
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

	entries() { return new stdArray(this.core.array.entries()) }

	/** Get unique items in this array
	 * ToDo: Implement use of comparer in the include() call
	 */
	unique() { return this.ctor(unique(this)) }

	/** Returns new array containing this array's elements in reverse order */
	// eslint-disable-next-line fp/no-mutating-methods
	reverse() { return this.ctor([...this].reverse()) }

	/** Array-specific implementation of map() */
	map<Y>(projector: Projector<X, Y>) {
		return new stdArray<Y>(map(this, projector))
	}
}

export class stdArrayNumeric extends stdArray<number> {
	ctor(iterable: Iterable<number>): this { return new stdArrayNumeric(iterable) as this }

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
		return this
			.reduce(undefined as number | undefined, (prev, curr) => (prev === undefined || curr < prev) ? curr : prev)
			.last()
	}
	max(): number | undefined {
		return this
			.reduce(undefined as number | undefined, (prev, curr) => (prev === undefined || curr > prev) ? curr : prev)
			.last()
	}

	map(projector: Projector<number, number>): stdArrayNumeric
	map<Y>(projector: Projector<number, Y>): stdArray<Y>
	map<Y>(projector: Projector<number, number> | Projector<number, Y>): stdArrayNumeric | stdArray<Y> {
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
	sum() { return this.reduce(0, (x, y) => x + y).last() || 0 }

}
