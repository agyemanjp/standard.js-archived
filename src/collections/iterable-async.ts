/* eslint-disable fp/no-rest-parameters */
/* eslint-disable fp/no-loops */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable brace-style */
/* eslint-disable fp/no-unused-expression */
/* eslint-disable fp/no-mutation */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable init-declarations */
/* eslint-disable fp/no-let */

import { Tuple, hasValue } from "../utility"
import { map, integers, isIterable } from "./iterable"
import { PredicateAsync, ProjectorAsync } from "../functional"

//type IterableAsync<X> = AsyncIterable<X> | Iterable<Promise<X>> | Iterable<() => Promise<X>>
export type ZipAsync<A extends ReadonlyArray<unknown>> = { [K in keyof A]: A[K] extends AsyncIterable<infer T> | Iterable<infer T> ? T : never }

export type AsyncOptions = ({ mode: "parallel", resultOrder: "completion" | "original" } | { mode: "serial" })

/** AsyncIterable type guard */
export function isAsyncIterable<T, _>(val: AsyncIterable<T> | _): val is _ extends AsyncIterable<infer X> ? never : AsyncIterable<T> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return hasValue(val) && typeof (val as any)[Symbol.asyncIterator] === "function"
}

function from<X>(items: Promise<X>[], strategy: AsyncOptions) {
	const mapped = items.map((item, index) => item.then(result => new Tuple(index, result)))

	async function* parallelByCompletion(_items: Promise<[number, X]>[]): AsyncIterable<X> {
		const result = await Promise.race(_items)
		yield result[1]
		yield* parallelByCompletion(_items.filter((_, index) => index != result[0]))
	}

	switch (strategy.mode) {
		case "parallel": {
			if (strategy.resultOrder === "completion") {
				return parallelByCompletion(mapped)
			}
			else {
				//...;
			}
		}
	}
}

export async function toArrayAsync<T>(iterable: Iterable<T> | AsyncIterable<T>) {
	const arr = [] as Array<T>
	for await (const element of iterable) {
		// eslint-disable-next-line fp/no-mutating-methods
		arr.push(element)
	}
	return arr
}

/** Turns n (possible async) iterables into an async iterable of n-tuples
 * The shortest iterable determines the length of the resulting iterable
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function* zipAsync<T extends readonly (AsyncIterable<any> | Iterable<any>)[]>(...iterables: T): AsyncIterable<ZipAsync<T>> {
	// console.assert(iterables.every(iter => isAsyncIterable(iter)))

	//const iterators = iterables.map(i => i[Symbol.asyncIterator]() as AsyncIterator<unknown>)
	const iters = iterables.map(arg =>
		isIterable(arg)
			? arg[Symbol.iterator]()
			: arg[Symbol.asyncIterator]())
	const itersDone = iters.map(iter => ({ done: false as boolean | undefined, iter }))

	try {
		while (true) {
			const results = map(iters, iter => iter.next())
			// eslint-disable-next-line no-await-in-loop
			const syncResults = await Promise.all(results)

			const zipped = new Array(iters.length)

			let i = 0
			let allDone = true as boolean | undefined
			let done = false as boolean | undefined
			for (const result of syncResults) {
				allDone = allDone && result.done
				done = done || result.done
				itersDone[i].done = result.done
				zipped[i] = result.value
				i++
			}

			if (done) break
			yield zipped as any as ZipAsync<T>
			if (allDone) break
		}
	}
	finally {
		for (const { iter, done } of itersDone) {
			// eslint-disable-next-line no-await-in-loop
			if (!done && typeof iter.return === 'function') await iter.return()
		}
	}
	// eslint-disable-next-line fp/no-let
	/*let done = false
	return {
		[Symbol.asyncIterator]() { return this },
		async next() {
			if (!done) {
				const items = await Promise.all(iterators.map(i => i.next()))
				// eslint-disable-next-line fp/no-mutation
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
	}*/
}

export async function* mapAsync<X, Y>(items: AsyncIterable<X>, projector: ProjectorAsync<X, Y>) {
	const zipped = zipAsync(integers({ from: 0, direction: "upwards" }), items)
	for await (const element of zipped) {
		yield projector(element[1], element[0])
	}
}

/* export async function* filterAsync<T>(iterable: AsyncIterable<T>, predicate: PredicateAsync<T>, options: { concurrency: number }) {
	let c = 0

	const mapped = new ParallelRunner(
		iterable[Symbol.asyncIterator](),
		async item => ({ item, value: await func(item, c++) }),
		concurrency,
	)

	for await (const item of mapped) {
		if (item.value) {
			yield item.item
		}
	}
}*/

export async function containsAsync<A>(iterable: AsyncIterable<A>, value: A) {
	for await (const x of iterable) {
		if (x === value) return true
	}
	return false
}

export async function* takeAsync<T>(iterable: AsyncIterable<T>, n: number): AsyncIterable<T> {
	if (typeof n !== "number")
		throw new Error(`take(): Invalid type ${typeof n} for argument "n"\nMust be number`)
	if (n < 0) {
		console.warn(`Warning: Negative value ${n} passed to argument <n> of take()`)
		return
	}

	if (n > 0) {
		for await (const element of iterable) {
			yield element
			if (--n <= 0) break
		}
	}
}

/*async function mapDictAsync<X, Y, I>(projection: AsyncProjector<X, Y, I>) {
	var _map = new Dictionary<T>()
	let promisesArr = this.entries()
		.map(entry => projection(entry[1]!, entry[0]))

	let resolvedArr = await Promise.all(promisesArr)
	return new Dictionary(resolvedArr);
}*/



