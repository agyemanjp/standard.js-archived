/* eslint-disable no-shadow */
/* eslint-disable brace-style */
import { Array } from "../collections"

export function min(collection: Array<number>): number | undefined {
	return collection
		.reduce(undefined as number | undefined, (prev, curr) => (prev === undefined || curr < prev) ? curr : prev)
		.last()
}

export function max(collection: Array<number>): number | undefined {
	return collection
		.reduce(undefined as number | undefined, (prev, curr) => (prev === undefined || curr > prev) ? curr : prev)
		.last()
}

export function sum(collection: Array<number>) { return collection.reduce(0, (x, y) => x + y).last() || 0 }


export function mean(collection: Array<number>): number {
	if (collection.length === 0)
		throw new Error(`Cannot calculate mean of empty array`)
	return sum(collection) / collection.size
}

export function variance(collection: Array<number>, collectionMean?: number /*optional already calculated mean */): number | undefined {
	if (collection.size === 1)
		return 0

	const _mean = collectionMean || mean(collection)
	if (_mean === undefined)
		return undefined

	return sum(collection.map(datum => Math.pow(datum - _mean, 2))) / (collection.size)
}

export function deviation(collection: Array<number>): number | undefined {
	const _variance = variance(collection, mean(collection))
	return _variance ? Math.sqrt(_variance) : undefined
}

export function median(collection: Array<number>): number | undefined {
	// eslint-disable-next-line fp/no-mutating-methods
	const _ordered = collection.sort()
	if (_ordered.size % 2 === 1) {
		return _ordered.get(Math.floor(collection.size / 2))
	}
	else {
		// eslint-disable-next-line no-shadow, @typescript-eslint/no-non-null-assertion
		const first = _ordered.get(Math.floor(_ordered.size / 2) - 1)
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const second = _ordered.get(Math.floor(_ordered.size / 2))
		return (first + second) / 2
	}
}

export function interQuartileRange(collection: Array<number>) {
	// eslint-disable-next-line fp/no-mutating-methods
	const sortedList = collection.sort()
	const percentile25 = sortedList.get(Math.floor(0.25 * sortedList.size))
	const percentile75 = sortedList.get(Math.ceil(0.75 * sortedList.size))
	return percentile25 && percentile75 ? percentile75 - percentile25 : undefined
}

