/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable brace-style */
/* eslint-disable fp/no-unused-expression */
/* eslint-disable fp/no-mutation */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable init-declarations */
/* eslint-disable fp/no-let */

const SLEEP_DURATION_MILLISECONDS = 100

export interface ProgressInfo<T> {
	/** Result value, either final (undefined and then set once) or cumulative (repeatedly updated) */
	result?: T

	done: boolean

	/** Optional percentage completion estimate */
	percentComplete?: number

	/** Context-dependent optional message; Can be used for prev/current/next operation, extra completion info, etc */
	message?: string
}
/* export interface CumulativeProgressInfo<T> extends Omit<ProgressInfo<T>, "result"> {
	result: { value: T, done: boolean }
}*/


export type fnGenerator<X, Y> = (arg: X) => AsyncGenerator<ProgressInfo<Y>, void>
export type fnPromise<X, Y> = (arg: X) => Promise<Y>
type fn<X, Y> = fnPromise<X, Y> | fnGenerator<X, Y>

export function asProgressiveGenerator<X, Y>(f: fnGenerator<X, Y>): (arg: X) => AsyncGenerator<ProgressInfo<Y>>
export function asProgressiveGenerator<X, Y>(f: fnPromise<X, Y>, etaMillisecs: number): (arg: X) => AsyncGenerator<ProgressInfo<Y>>
export function asProgressiveGenerator<X, Y>(f: fn<X, Y>, etaMillisecs?: number) {
	return async function* wrappedFn(arg: X) {

		const worker = new Worker(URL.createObjectURL(new Blob(
			[
				`(${function (_f: fn<X, Y>) {
					self.onmessage = async (e: MessageEvent) => {
						const generatorOrPromise = _f(e.data)
						if ("then" in generatorOrPromise) {
							const result = await generatorOrPromise
							self.postMessage({ result, done: true } as ProgressInfo<Y>, "")
						}
						else {
							// eslint-disable-next-line fp/no-loops
							for await (const result of generatorOrPromise) {
								self.postMessage(result as ProgressInfo<Y>, "")
							}
							self.postMessage({ done: true } as ProgressInfo<Y>, "")
						}
					}
				}.toString()})(${f.toString()})`
			],
			{ type: 'text/javascript' }
		)))

		let progress: ProgressInfo<Y> = { result: undefined, done: false, percentComplete: 0, message: "" }
		worker.onmessage = (e) => { progress = { ...e.data } }
		worker.postMessage(arg)

		let iterations = 0
		// eslint-disable-next-line fp/no-loops
		while (progress.done === false) {
			yield {
				percentComplete: etaMillisecs
					? iterations++ * 100 / (etaMillisecs / SLEEP_DURATION_MILLISECONDS)
					: 0,
				message: undefined,

				...progress
			}
			sleep(SLEEP_DURATION_MILLISECONDS)
		}

	}
}


export function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

/* export const notConcurrent = <T>(proc: () => PromiseLike<T>): () => Promise<T> => {
	let inFlight: Promise<T> | false = false
	return () => {
		if (!inFlight) {
			inFlight = (async () => {
				try {
					return await proc()
				}
				finally {
					inFlight = false
				}
			})()
		}
		return inFlight
	}
}
*/