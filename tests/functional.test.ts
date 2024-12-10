
import { it, describe } from "bun:test"
import assert from "assert"
import { rank, createComparer, createRanker } from '../source'


describe('rank()', () => {
	it(`should return negative number when comparing two numbers, first greater than the second one`, () => {
		const x = 2
		const y = 3
		assert.strictEqual(rank(x, y) < 0, true)
	})
	it(`should return zero when comparing two variables with the same value`, () => {
		const x = 2
		const y = 2
		assert.strictEqual(rank(x, y) === 0, true)
	})
	it(`should return a positive number when comparing two variables passed as string with the 'tryNumber' parameter enabled`, () => {
		const x = "4"
		const y = "3"
		assert.strictEqual(rank(x, y, undefined, true) > 0, true)
	})
	it(`should return a negative number when comparing 2 strings, the first alphabetically first than the second one`, () => {
		const x = "abc"
		const y = "xyz"
		assert.strictEqual(rank(x, y) < 0, true)
	})
	it(`should return a negative number when comparing dates formated as strings, with the 'tryDate' parameter enabled`, () => {
		const x = "2012-05-06 11:20:30"
		const y = "2012-05-06 11:20:32"
		assert.strictEqual(rank(x, y, undefined, false, true) < 0, true)
	})
})

describe('getRanker()', () => {
	it(`should rank numbers correctly`, () => {
		const series = [7, 7, 7, 2, 5, 3, 4, 5, 5, 6]
		// eslint-disable-next-line fp/no-mutating-methods
		const sortedSeries = series.sort(createRanker(v => v))
		assert.strictEqual(JSON.stringify(sortedSeries), JSON.stringify([2, 3, 4, 5, 5, 5, 6, 7, 7, 7]))
	})
	it(`should rank text correctly`, () => {
		const series = ["banana", "apple", "lemon", "apple", "citrus"]
		// eslint-disable-next-line fp/no-mutating-methods
		const sortedSeries = series.sort(createRanker(v => v))
		assert.strictEqual(JSON.stringify(sortedSeries), JSON.stringify(["apple", "apple", "banana", "citrus", "lemon",]))
	})
	it(`should rank number and text separately`, () => {
		const series = ["Blue", "Blue", 2, 5, 3, "Blue", 4, "Green", 5, 5, 6, 7, 7, 7, "Green"]
		// eslint-disable-next-line fp/no-mutating-methods
		const sortedSeries = series.sort(createRanker(v => v))
		assert.strictEqual(JSON.stringify(sortedSeries), JSON.stringify([2, 3, 4, 5, 5, 5, 6, 7, 7, 7, "Blue", "Blue", "Blue", "Green", "Green"]))
	})
	it(`should rank number and text correctly as text, if no option is passed`, () => {
		const mixedseries = ["Blue", "Blue", 2, 5, 3, "Blue", 4, "Green", 5, 5, 6, 7, 7, 7, "Green"]
		const textSeries = ["Blue", "Blue", "2", "5", "3", "Blue", "4", "Green", "5", "5", "6", "7", "7", "7", "Green"]
		const _ranker = createRanker(v => v)
		const sortedMixedSeries = mixedseries.sort(_ranker)
		const sortedTextSeries = textSeries.sort(_ranker)

		assert.strictEqual(JSON.stringify(sortedMixedSeries), JSON.stringify(sortedTextSeries.map(v => parseInt(v) || v)))
	})
	it(`should rank strings as number, if tryNumeric is set`, () => {
		const series = ["Blue", "0", 2, 5, 3, "15", 4, "Green", 5, 5, 6, 7, 7, 7, "Green"]
		// eslint-disable-next-line fp/no-mutating-methods
		const sortedSeries = series.sort(
			createRanker(v => v, { tryNumeric: true })
		)
		assert.strictEqual(JSON.stringify(sortedSeries), JSON.stringify(["0", 2, 3, 4, 5, 5, 5, 6, 7, 7, 7, "15", "Blue", "Green", "Green"]))
	})
	it(`should rank dates as number, if tryDate is set`, () => {
		const series = ["December 1 1991", "December 1 1991", "December 2 1991", "December 5 1991", "April 5, 2001"]
		// eslint-disable-next-line fp/no-mutating-methods
		const sortedSeries = series.sort(
			createRanker(v => v, { tryDate: true })
		)
		assert.strictEqual(JSON.stringify(sortedSeries), JSON.stringify(["December 1 1991", "December 1 1991", "December 2 1991", "December 5 1991", "April 5, 2001"]))
	})
	it(`should rank dates as strings, if tryDate is not set`, () => {
		const series = ["December 1 1991", "December 1 1991", "December 2 1991", "December 5 1991", "April 5, 2001", "December 5 1995"]
		// eslint-disable-next-line fp/no-mutating-methods
		const sortedSeries = series.sort(
			createRanker(v => v)
		)
		assert.strictEqual(JSON.stringify(sortedSeries), JSON.stringify(["April 5, 2001", "December 1 1991", "December 1 1991", "December 2 1991", "December 5 1991", "December 5 1995"]))
	})
})


// /** https://github.com/kolodny/cury/blob/master/test.ts */
// describe('curry', () => {
// 	const f1 = (s1: string) => `${s1}`
// 	const f2 = (s1: string, s2: string) => `${s1}${s2}`
// 	const f3 = (s1: string, s2: string, s3: string) => `${s1}${s2}${s3}`
// 	const f4 = (s1: string, s2: string, s3: string, s4: string) => `${s1}${s2}${s3}${s4}`
// 	const f5 = (s1: string, s2: string, s3: string, s4: string, s5: string) => `${s1}${s2}${s3}${s4}${s5}`
// 	const f6 = (s1: string, s2: string, s3: string, s4: string, s5: string, s6: string) => `${s1}${s2}${s3}${s4}${s5}${s6}`
// 	const f7 = (s1: string, s2: string, s3: string, s4: string, s5: string, s6: string, s7: string) => `${s1}${s2}${s3}${s4}${s5}${s6}${s7}`
// 	const f8 = (s1: string, s2: string, s3: string, s4: string, s5: string, s6: string, s7: string, s8: string) => `${s1}${s2}${s3}${s4}${s5}${s6}${s7}${s8}`
// 	const f9 = (s1: string, s2: string, s3: string, s4: string, s5: string, s6: string, s7: string, s8: string, s9: string) => `${s1}${s2}${s3}${s4}${s5}${s6}${s7}${s8}${s9}`

// 	describe('curries an arty of 1', () => {
// 		const curried = curry(f1)
// 		assert(curried('a'), 'a')
// 	})

// 	describe('curries an arty of 2', () => {
// 		const curried = curry(f2)
// 		assert(curried('a')('b'), 'ab')
// 	})

// 	describe('curries an arty of 3', () => {
// 		const curried = curry(f3)
// 		assert(curried('a')('b')('c'), 'abc')
// 	})

// 	describe('curries an arty of 4', () => {
// 		const curried = curry(f4)
// 		assert(curried('a')('b')('c')('d'), 'abcd')
// 	})

// 	describe('curries an arty of 5', () => {
// 		const curried = curry(f5)
// 		assert(curried('a')('b')('c')('d')('e'), 'abcde')
// 	})

// 	describe('curries an arty of 6', () => {
// 		const curried = curry(f6)
// 		assert(curried('a')('b')('c')('d')('e')('f'), 'abcdef')
// 	})

// 	describe('curries an arty of 7', () => {
// 		const curried = curry(f7)
// 		assert(curried('a')('b')('c')('d')('e')('f')('g'), 'abcdefg')
// 	})

// 	describe('curries an arty of 8', () => {
// 		const curried = curry(f8)
// 		assert(curried('a')('b')('c')('d')('e')('f')('g')('h'), 'abcdefgh')
// 	})

// 	describe('curries an arty of 9', () => {
// 		const curried = curry(f9)
// 		assert(curried('a')('b')('c')('d')('e')('f')('g')('h')('i'), 'abcdefghi')
// 	})

// 	describe('keeps track of all the different types', () => {
// 		interface A { a: string }
// 		interface B { b: string }
// 		interface C { c: string }
// 		interface D { d: string }
// 		interface E { e: string }
// 		interface F { f: string }
// 		interface G { g: string }
// 		interface H { h: string }
// 		interface I { i: string }
// 		const differentTyped9 = (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I) => {
// 			return a.a + b.b + c.c + d.d + e.e + f.f + g.g + h.h + i.i
// 		}
// 		const curried = curry(differentTyped9)
// 		assert(
// 			curried({ a: '@' })({ b: '6' })({ c: '<' })({ d: 'D' })({ e: '7' })({ f: 'F' })({ g: 'G' })({ h: 'H' })({ i: '1' }),
// 			'@6<D7FGH1')
// 	})
// })

// /** https://github.com/caderek/arrows/blob/master/packages/composition/src/curry.test.ts */
// describe('curry', () => {
// 	describe('returns original function for functions of arity 0', () => {
// 		const fn = () => null
// 		const curried = curry(fn)

// 		expect(curried).toBe(fn)
// 	})

// 	describe('returns original function for functions of arity 1', () => {
// 		const fn = (a) => a
// 		const curried = curry(fn)

// 		expect(curried).toBe(fn)
// 	})

// 	describe('returns original function for variadic functions', () => {
// 		const fn = (...args) => args
// 		const curried = curry(fn)

// 		expect(curried).toBe(fn)
// 	})

// 	describe('returns curried function for function of arity 2', () => {
// 		const fn = (a, b) => [a, b]
// 		const curried = curry(fn)

// 		expect(curried).not.toBe(fn)
// 		expect(typeof curried(1)).toEqual('function')
// 		expect(curried(1, 2)).toEqual([1, 2])
// 		expect(curried(1)(2)).toEqual([1, 2])
// 	})

// 	describe('returns curried function for function of arity 3 and more', () => {
// 		const fn = (a, b, c) => [a, b, c]
// 		const curried = curry(fn)

// 		expect(curried).not.toBe(fn)
// 		expect(typeof curried(1)).toEqual('function')
// 		expect(typeof curried(1)(2)).toEqual('function')
// 		expect(typeof curried(1, 2)).toEqual('function')
// 		expect(curried(1, 2, 3)).toEqual([1, 2, 3])
// 		expect(curried(1)(2, 3)).toEqual([1, 2, 3])
// 		expect(curried(1, 2)(3)).toEqual([1, 2, 3])
// 		expect(curried(1)(2)(3)).toEqual([1, 2, 3])
// 	})
// })

// /** https://github.com/TylorS/typed-curry/blob/master/src/curry.test.ts */
// describe('curry', () => {
// 	describe('curries a function of arity 1', () => {
// 		const f = (a: number) => a
// 		const curried = curry(f)

// 		assert.strictEqual(curried()()()()(1), 1)
// 	})

// 	describe('curries a function of arity 2', () => {
// 		const f = (a: number, b: number) => a + b
// 		const curried = curry(f)

// 		assert.strictEqual(curried()()()(1)()()()(2), 3)
// 		assert.strictEqual(curried(1, 2), 3)
// 	})

// 	describe('curries a function of arity 3', () => {
// 		const f = (a: number, b: number, c: number) => a + b + c
// 		const curried = curry(f)

// 		assert.strictEqual(curried(1, 1, 1), 3)
// 		assert.strictEqual(curried(1)(1, 1), 3)
// 		assert.strictEqual(curried(1)(1)(1), 3)
// 	})

// 	describe('curries a function of arity 4', () => {
// 		const f = (a: number, b: number, c: number, d: number) => a + b + c + d
// 		const curried = curry(f)

// 		assert.strictEqual(curried(1, 1, 1, 1), 4)
// 		assert.strictEqual(curried(1, 1)(1, 1), 4)
// 		assert.strictEqual(curried(1)(1)(1)(1), 4)
// 	})

// 	describe('curries a function of arity 5', () => {
// 		const f = (a: number, b: number, c: number, d: number, e: number) => a + b + c + d + e
// 		const curried = curry(f)

// 		assert.strictEqual(curried(1, 1, 1, 1, 1), 5)
// 		assert.strictEqual(curried(1, 1, 1)(1, 1), 5)
// 		assert.strictEqual(curried(1)(1)(1)(1)(1), 5)
// 	})
// })