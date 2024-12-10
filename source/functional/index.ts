import type { Predicate } from "../collections/types"
import type { ArgsType } from "../common"

/** A function that does nothing */
export function noop() { }

/** Identity function which returns the exact same argument it was passed
 * Can be useful for applying type inference to functions
 */
export function identity<T>(val: T): T { return val }

/** Returns a function thats always returns the input value */
export const constant = <T>(val: T) => () => val

/** Transforms input function into one that runs only once. 
 * Subsequent invocations after the first one do nothing and return undefined 
 */
export function once<R, A extends any[]>(fn?: (...a: A) => R) {
	let hasRun = false
	return fn
		? function xyz(...args: A) {
			if (!hasRun) {
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

/** Returns a function that is the negation of the input predicate function */
export function negate<X = any, I = void>(predicate: Predicate<X, I>): Predicate<X, I> { return (x: X, i: I) => !predicate(x, i) }

/** Transforms a function into a partially applied one.
 * The transformed function takes the same arguments as the original function
 * except for the first one, and returns a function that only takes the original function's first argument.
 */
export function partial<A, B, Rest extends unknown[]>(fun: (a: A, ...rest: Rest) => B): (...rest: Rest) => (a: A) => B {
	return (...rest: Rest) => (a: A): B => fun(a, ...rest)
}

/** Returns the curried form of input function that accepts multiple arguments */
export function curry<Fn extends ((...args: any[]) => any)>(fn: Fn): Curry<Fn> {
	return ((...args: any[]) =>
		(args.length >= fn.length)
			? fn(...args)
			: curry(fn.bind(null, ...args))
	) as any
}

/** Returns the curried form of input function that accepts arguments as an object literal */
export function objectCurry<F extends (...x: any[]) => any>(fn: F) {
	type X = ArgsType<F>[0]
	type Y = ReturnType<F>
	return <P extends Partial<X>>(part: P) =>
		(x: Omit<X, keyof P>): Y =>
			fn({ ...x, ...part } as X)
}

type Curry<Fn extends Function> = (
	Fn extends (...args: infer Args) => infer Return
	? Args extends [infer First, ...infer Rest]
	? (arg: First) => Curry<(...args: Rest) => Return>
	: Return
	: never
)

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
