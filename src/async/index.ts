/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable fp/no-rest-parameters */
/* eslint-disable brace-style */

export type AsyncFn<T, Args extends any[] = any[]> = (...args: Args) => Promise<T>


export function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

export function promisify<T, A extends any[]>(fn: (...args: A) => T): AsyncFn<T, A> {
	return (...args: A) => {
		return new Promise<T>((resolve, reject) => {
			try {
				// eslint-disable-next-line fp/no-unused-expression
				resolve(fn(...args))
			}
			catch (e) {
				// eslint-disable-next-line fp/no-unused-expression
				reject(e)
			}
		})
	}
}

/** Returns a wrapped version of a function that prevents simultaneous execution.
 * See https://spin.atomicobject.com/2018/09/10/javascript-concurrency/
 * @param proc 
 */
export function notConcurrent<T>(proc: () => PromiseLike<T>): () => Promise<T> {
	// eslint-disable-next-line fp/no-let
	let inFlight: Promise<T> | false = false
	return () => {
		if (!inFlight) {
			// eslint-disable-next-line fp/no-mutation
			inFlight = (async () => {
				try {
					return await proc()
				}
				finally {
					// eslint-disable-next-line fp/no-mutation
					inFlight = false
				}
			})()
		}
		return inFlight
	}
}

/** Enables a way to specify critical section of code that cannot be happening simultaneously */
export class Mutex {
	private mutex = Promise.resolve();

	lock(): PromiseLike<() => void> {
		// eslint-disable-next-line @typescript-eslint/no-empty-function, fp/no-let
		let begin: (unlock: () => void) => void = unlock => { }

		// eslint-disable-next-line fp/no-mutation
		this.mutex = this.mutex.then(() => new Promise(begin))

		return new Promise(res => { begin = res })
	}

	async dispatch<T>(fn: (() => T) | (() => PromiseLike<T>)): Promise<T> {
		const unlock = await this.lock()
		try {
			return await Promise.resolve(fn())
		} finally {
			unlock()
		}
	}
}