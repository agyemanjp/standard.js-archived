import { map } from "../collections"
import { isPrimitive, isPromise, isArray, isObject, type Atomic } from "../common"
import { objectFromTuples, entries } from "../object"

export type AsyncFn<T, Args extends any[] = any[]> = (...args: Args) => Promise<T>

export function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

export function promisify<T, A extends any[]>(fn: (...args: A) => T): AsyncFn<T, A> {
	return (...args: A) => {
		return new Promise<T>((resolve, reject) => {
			try {
				resolve(fn(...args))
			}
			catch (e) {
				reject(e)
			}
		})
	}
}

/** Recursively awaits all promises in input value as effieciently as possible */
async function recursiveAwait<T>(val: T): Promise<AwaitedRecursive<T>> {
	return (isPrimitive(val) || typeof val === "function")
		? val
		: isPromise(val)
			? recursiveAwait(await val)
			: isArray(val)
				? Promise.all([...map(val, _ => recursiveAwait(_))])
				: isObject(val)
					? objectFromTuples(await Promise.all([...map(entries(val), _ => recursiveAwait(_))]))
					: val as any
}


type AwaitedRecursive<T> = (T extends Atomic | null | undefined
	? T
	: T extends Promise<infer P>
	? AwaitedRecursive<P>
	: T extends { [k: string | number | symbol]: any }
	? { [k in keyof T]: AwaitedRecursive<T[k]> }
	: T extends [infer head, ...(infer tail)]
	? [AwaitedRecursive<head>, ...tail]
	: never
)
type X = AwaitedRecursive<{
	pStr: Promise<string>, str: string,
	pFun: Promise<Function>, fun: Function,
	pNum: Promise<number>, num: number,
	pArr: [bigint, Promise<symbol>, number, null],
	pObj: { m: Promise<Map<any, any>>, a: Array<Promise<7>> }
}>
