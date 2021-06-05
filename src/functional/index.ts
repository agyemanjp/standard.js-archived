/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable fp/no-rest-parameters */
/* eslint-disable brace-style */
import { Obj } from "../utility"

/** Return -1 if a is smaller than b; 0 if a & b are equal, and 1 if a is bigger than b */
export type Ranker<X = unknown> = (a: X, b: X) => number
export type RankerAsync<X = unknown> = (a: X, b: X) => Promise<number>

/** Return true if a and b are equal, otherwise returns false */
export type Comparer<X = unknown> = (a: X, b: X) => boolean
export type ComparerAsync<X = unknown> = (a: X, b: X) => Promise<boolean>

/** Computes a unique hash */
export type Hasher<X = unknown, Y extends string | number | symbol = number> = (a?: X) => Y
export type HasherAsync<X = unknown, Y extends string | number | symbol = number> = (a?: X) => Promise<Y>

export type Projector<X = unknown, Y = unknown, I = number> = (value: X, index: I) => Y
export type ProjectorAsync<X = unknown, Y = unknown, I = unknown> = (item: X, index: I) => Y | Promise<Y>

export type Predicate<X = unknown, I = unknown> = (value: X, index: I) => boolean
export type PredicateAsync<X = unknown, I = unknown> = (value: X, index: I) => Promise<boolean>

export type Reducer<X = unknown, Y = unknown, I = unknown> = (prev: Y, current: X, index: I) => Y
export type ReducerAsync<X = unknown, Y = unknown, I = unknown> = (prev: Y, current: X, index: I) => Promise<Y>



export function getRanker<T>(args: { projector: Projector<T, unknown, void>, tryNumeric?: boolean/*=false*/, tryDate?: boolean/*=false*/, reverse?: boolean/*=false*/ }): Ranker<T> {
	//console.log(`generating comparer, try numeric is ${tryNumeric}, reversed is ${reverse} `)
	return (x: T, y: T) => {
		return compare(x, y, args.projector, args.tryNumeric, args.tryDate) * (args.reverse === true ? -1 : 1)
	}
}
export function getComparer<T>(projector: Projector<T, unknown, void>, tryNumeric = false, tryDate?: boolean/*=false* reverse = false*/): Comparer<T> {
	//console.log(`generating comparer, try numeric is ${tryNumeric}, reversed is ${reverse} `)
	return (x: T, y: T) => {
		return compare(x, y, projector, tryNumeric, tryDate) === 0
	}
}
/** Compares 2 values and sort them, possibly parsing it as date or number beforehand.
 * If the 2 compared values have a different type, the string type will always be ranked last, unless the user choses (through 'tryNumeric') to convert number-likes strings into numbers for comparison.
 * @param larger One value to compare
 * @param smaller The other value to compare
 * @param projector A projector used to find the values to compare, if the passed values are objects
 * @param tryNumeric If any or both of the two values are strings, an attempt will be made to parse them as number before doing to comparison
 * @param tryDateAsNumeric If both values are strings corresponding to dates, they will be parsed as Dates and compared as such.
 */
export function compare<T>(larger: T, smaller: T, projector?: Projector<T, unknown, void>, tryNumeric = false, tryDateAsNumeric = false): -1 | 0 | 1 {
	const _larger: unknown = projector ? projector(larger) : larger
	const _smaller: unknown = projector ? projector(smaller) : smaller

	const sign = (n: number) => Math.sign(n) as -1 | 0 | 1

	if (typeof _larger === "string" && typeof _smaller === "string") {
		if (tryDateAsNumeric === true) {
			const __x = new Date(_larger)
			const __y = new Date(_smaller)
			if (__x > __y)
				return 1
			else if (__x === __y)
				return 0
			else
				return -1
		}
		if (tryNumeric === true) {
			const __x = parseFloat(_larger)
			const __y = parseFloat(_smaller)
			if ((!Number.isNaN(__x)) && (!Number.isNaN(__y))) {
				return sign(__x - __y)
			}
		}

		return sign(new Intl.Collator().compare(_larger || "", _smaller || ""))
	}
	else if (typeof _larger === "number" && typeof _smaller === "number") {
		return sign((_larger || 0) - (_smaller || 0))
	}
	else if (_larger instanceof Date && _smaller instanceof Date) {
		const largerDate = _larger || new Date()
		const smallerDate = _smaller || new Date()
		if (largerDate > smallerDate)
			return 1
		else if (largerDate === smallerDate)
			return 0
		else
			return -1
	}
	else if (typeof _larger !== typeof _smaller) { // When both values have different types
		if (tryNumeric) {
			const _largerNum = typeof _larger === "number"
				? _larger
				: typeof _larger === "string"
					? parseFloat(_larger)
					: 0
			const _smallerNum = typeof _smaller === "number"
				? _smaller
				: typeof _smaller === "string"
					? parseFloat(_smaller)
					: 0
			// If both types could succesfully be turned into numbers, we compare it numerically
			if (!isNaN(_smallerNum) && !isNaN(_largerNum)) {
				return sign(_largerNum - _smallerNum)
			}
		}
		return typeof _larger === "string" ? 1 : -1 // Strings will appear last
	}
	else {
		return _larger === _smaller ? 0 : 1

	}
}

export const noop = () => { }

export const identity = <T>(val: T) => val

//#region Combinators
export const constant = <T>(val: T) => () => val

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function once<R, A extends any[]>(fn?: (...a: A) => R) {
	// eslint-disable-next-line fp/no-let
	let hasRun = false
	return fn
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		? function xyz(...args: A) {
			if (!hasRun) {
				// eslint-disable-next-line fp/no-mutation
				hasRun = true
				return fn(...args)
			}
			else {
				return
			}
		}
		: undefined
}

/** Transforms a function into a partially applied one.
 * The transformed function takes the same arguments as the original function
 * except for the first one, and returns a function that only takes the original functions first argument.
 */
export function partial<A, B, Rest extends unknown[]>(fun: (a: A, ...rest: Rest) => B): (...rest: Rest) => (a: A) => B {
	return (...rest: Rest) => (a: A): B => {
		return fun(a, ...rest)
	}
}

/** Transforms a function into one that expects the original arguments in reverse order */
export function flip<A, B, Ret>(f: (a: A, b: B) => Ret): (b: B, a: A) => Ret {
	return (b: B, a: A) => f(a, b)
}

/* https://github.com/caderek/arrows/blob/master/packages/composition/src/curry.ts */
/* export function curry(fn: (...x: any[]) => any, args: any[] = []) {
	if (fn.length < 2) {
		return fn
	}

	return (...newArgs: any[]) =>
		((rest) => (rest.length >= fn.length ? fn(...rest) : curry(fn, rest)))([
			...args,
			...newArgs,
		])
}*/

/* https://github.com/TylorS/typed-curry/blob/master/src/curry.ts */
/* export function curry(fn: Function) {
	switch (fn.length) {
		case 0: return fn;
		case 1: return curry1(fn as Arity1<any, any>);
		case 2: return curry2(fn as Arity2<any, any, any>);
		case 3: return curry3(fn as Arity3<any, any, any, any>);
		case 4: return curry4(fn as Arity4<any, any, any, any, any>);
		case 5: return curry5(fn as Arity5<any, any, any, any, any, any>);
		default: throw new Error(`Its highly suggested that you do not write functions with more than 5 parameters.`);
	}
}*/

/* https://github.com/kolodny/cury/blob/master/index.ts */
export function curry<A, R>(fn: (a: A) => R): (a: A) => R
export function curry<A, B, R>(fn: (a: A, b: B) => R): (a: A) => (b: B) => R
export function curry<A, B, C, R>(fn: (a: A, b: B, c: C) => R): (a: A) => (b: B) => (c: C) => R
export function curry<A, B, C, D, R>(fn: (a: A, b: B, c: C, d: D) => R): (a: A) => (b: B) => (c: C) => (d: D) => R
export function curry(fn: (...args: any[]) => unknown) {
	return function curried(...args: any[]) {
		if (args.length >= fn.length) {
			const x = fn(...args)
			return x
		}
		return curry(fn.bind(null, ...args))
	}
}

export function objectCurry<X extends Obj, Y>(fn: (x: X) => Y) {
	return <P extends Partial<X>>(part: P) => (x: Omit<X, keyof P>): Y => {
		return fn({ ...x, ...part } as X)
	}
}


//#endregion
