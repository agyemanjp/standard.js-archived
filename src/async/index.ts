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

/** Returns a version of a function that prevents simultaneous execution.
 * See https://spin.atomicobject.com/2018/09/10/javascript-concurrency/
 * @param fn 
 */
export function notConcurrent<X extends any[], Y>(fn: (...args: X) => PromiseLike<Y>): (...args: X) => Promise<Y> {
	// eslint-disable-next-line fp/no-let
	let inFlight: Promise<Y> | false = false
	return (...args: X) => {
		if (!inFlight) {
			inFlight = (async () => {
				try {
					return await fn(...args)
				}
				finally {
					inFlight = false
				}
			})()
		}
		return inFlight
	}
}

/** Enables a way to specify critical section of code that cannot be running simultaneously */
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
		}
		finally {
			unlock()
		}
	}
}