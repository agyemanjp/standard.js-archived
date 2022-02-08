/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable fp/no-rest-parameters */
/* eslint-disable brace-style */
import { Obj } from "../utility"

/** Return -1 if a is smaller than b; 0 if a & b are equal, and 1 if a is bigger than b */
export type Ranker<X = unknown> = (a: X, b: X) => -1 | 0 | 1
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

/** A function that does nothing */
export function noop() { }

/** Identity function which returns the exact same argument it was passed */
export function identity<T>(val: T) { return val }

/** Returns a function thats always returns the input value */
export const constant = <T>(val: T) => () => val

/** Returns a function that is the negation of the input predicate function */
export function negate<X = any, I = void>(predicate: Predicate<X, I>): Predicate<X, I> { return (x: X, i: I) => !predicate(x, i) }

/** Transforms input function into one that runs only once. 
 * Subsequent invocations after the first one do nothing and return undefined 
 */
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

/** Transforms input function into one that expects the original arguments in reverse order */
export function flip<A, B, Ret>(f: (a: A, b: B) => Ret): (b: B, a: A) => Ret {
	return (b: B, a: A) => f(a, b)
}

/** Transforms a function into a partially applied one.
 * The transformed function takes the same arguments as the original function
 * except for the first one, and returns a function that only takes the original function's first argument.
 */
export function partial<A, B, Rest extends unknown[]>(fun: (a: A, ...rest: Rest) => B): (...rest: Rest) => (a: A) => B {
	return (...rest: Rest) => (a: A): B => {
		return fun(a, ...rest)
	}
}

/** Returns the curried form of input function */
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

/** Transforms input projector function into a ranker function (that determines which of two values is greater)
 * @param tryNumeric (default: false) Output ranker function will attempt to compare string arguments as numbers
 * @param tryDate (default: false) Output ranker function will attempt to compare arguments as dates.
 */
export function createRanker<T, Y = unknown>(projector: Projector<T, Y, void>, args?:
	{
		tryNumeric?: boolean, tryDate?: boolean, reverse?: boolean
	}): Ranker<T> {
	return (x: T, y: T) => {
		return compare(x, y, projector, args?.tryNumeric, args?.tryDate) * (args?.reverse === true ? -1 : 1) as -1 | 0 | 1
	}
}
/** Transforms input projector function into a comparer function (that determines whether two values are equal)
 * @param tryNumeric (default: false) Output ranker function will attempt to compare string arguments as numbers
 * @param tryDate (default: false) Output ranker function will attempt to compare arguments as dates.
 */
export function createComparer<T, Y = unknown>(projector: Projector<T, Y, void>, tryNumeric = false, tryDate = false): Comparer<T> {
	return (x: T, y: T) => {
		return compare(x, y, projector, tryNumeric, tryDate) === 0
	}
}
/** Compares 2 values for sorting, possibly parsing them as date or number beforehand.
 * If the values have different types, string values will always be ranked last, 
 * unless the caller chooses (through 'tryNumeric' or 'tryDate') to convert them into numbers or dates for comparison.
 * @param a One value to compare
 * @param b The other value to compare
 * @param projector A projector used to find the values to compare, if the passed values are objects
 * @param tryNumeric If any or both of the two values are strings, attempt to parse them as number before doing comparison
 * @param tryDate If both values are strings corresponding to dates, they will be parsed as Dates and compared as such.
 */
export function compare<T, Y = unknown>(a: T, b: T, projector?: Projector<T, Y, void>, tryNumeric = false, tryDate = false): -1 | 0 | 1 {
	const _a: unknown = projector ? projector(a) : a
	const _b: unknown = projector ? projector(b) : b

	const sign = (n: number) => Math.sign(n) as -1 | 0 | 1

	if (typeof _a === "string" && typeof _b === "string") {
		if (tryDate === true) {
			const __x = new Date(_a)
			const __y = new Date(_b)
			if (__x > __y)
				return 1
			else if (__x === __y)
				return 0
			else
				return -1
		}
		if (tryNumeric === true) {
			const __x = parseFloat(_a)
			const __y = parseFloat(_b)
			if ((!Number.isNaN(__x)) && (!Number.isNaN(__y))) {
				return sign(__x - __y)
			}
		}

		return sign(new Intl.Collator().compare(_a || "", _b || ""))
	}
	else if (typeof _a === "number" && typeof _b === "number") {
		return sign((_a || 0) - (_b || 0))
	}
	else if (_a instanceof Date && _b instanceof Date) {
		const largerDate = _a || new Date()
		const smallerDate = _b || new Date()
		if (largerDate > smallerDate)
			return 1
		else if (largerDate === smallerDate)
			return 0
		else
			return -1
	}
	else if (typeof _a !== typeof _b) { // When both values have different types
		if (tryNumeric) {
			const _aa = typeof _a === "number"
				? _a
				: typeof _a === "string"
					? parseFloat(_a)
					: 0
			const _bb = typeof _b === "number"
				? _b
				: typeof _b === "string"
					? parseFloat(_b)
					: 0
			// If both types could succesfully be turned into numbers, we compare it numerically
			if (!isNaN(_bb) && !isNaN(_aa)) {
				return sign(_aa - _bb)
			}
		}
		return typeof _a === "string" ? 1 : -1 // Strings will appear last
	}
	else {
		return _a === _b ? 0 : 1

	}
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
