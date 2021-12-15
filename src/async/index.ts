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
