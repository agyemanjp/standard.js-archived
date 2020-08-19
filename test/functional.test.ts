/* eslint-disable fp/no-unused-expression */
// /* eslint-disable fp/no-unused-expression */

import assert from "assert"
// import { flip, curry } from './functional'
import functional from '../dist/functional/index.js'
const { compare } = functional


describe('compare()', () => {
	it(`should return negative number when comparing two numbers, first greater than the second one`, () => {
		const x = 2
		const y = 3
		assert.equal(compare(x, y) < 0, true)
	})
	it(`should return zero when comparing two variables with the same value`, () => {
		const x = 2
		const y = 2
		assert.equal(compare(x, y) === 0, true)
	})
	it(`should return a positive number when comparing two variables passed as string with the 'tryNumber' parameter enabled`, () => {
		const x = "4"
		const y = "3"
		assert.equal(compare(x, y, undefined, true) > 0, true)
	})
	it(`should return a negative number when comparing 2 strings, the first alphabetically first than the second one`, () => {
		const x = "abc"
		const y = "xyz"
		assert.equal(compare(x, y) < 0, true)
	})
	it(`should return a negative number when comparing dates formated as strings, with the 'tryDate' parameter enabled`, () => {
		const x = "2012-05-06 11:20:30"
		const y = "2012-05-06 11:20:32"
		assert.equal(compare(x, y, undefined, false, true) < 0, true)
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

// 	it('curries an arty of 1', () => {
// 		const curried = curry(f1)
// 		assert(curried('a'), 'a')
// 	})

// 	it('curries an arty of 2', () => {
// 		const curried = curry(f2)
// 		assert(curried('a')('b'), 'ab')
// 	})

// 	it('curries an arty of 3', () => {
// 		const curried = curry(f3)
// 		assert(curried('a')('b')('c'), 'abc')
// 	})

// 	it('curries an arty of 4', () => {
// 		const curried = curry(f4)
// 		assert(curried('a')('b')('c')('d'), 'abcd')
// 	})

// 	it('curries an arty of 5', () => {
// 		const curried = curry(f5)
// 		assert(curried('a')('b')('c')('d')('e'), 'abcde')
// 	})

// 	it('curries an arty of 6', () => {
// 		const curried = curry(f6)
// 		assert(curried('a')('b')('c')('d')('e')('f'), 'abcdef')
// 	})

// 	it('curries an arty of 7', () => {
// 		const curried = curry(f7)
// 		assert(curried('a')('b')('c')('d')('e')('f')('g'), 'abcdefg')
// 	})

// 	it('curries an arty of 8', () => {
// 		const curried = curry(f8)
// 		assert(curried('a')('b')('c')('d')('e')('f')('g')('h'), 'abcdefgh')
// 	})

// 	it('curries an arty of 9', () => {
// 		const curried = curry(f9)
// 		assert(curried('a')('b')('c')('d')('e')('f')('g')('h')('i'), 'abcdefghi')
// 	})

// 	it('keeps track of all the different types', () => {
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
// 	it('returns original function for functions of arity 0', () => {
// 		const fn = () => null
// 		const curried = curry(fn)

// 		expect(curried).toBe(fn)
// 	})

// 	it('returns original function for functions of arity 1', () => {
// 		const fn = (a) => a
// 		const curried = curry(fn)

// 		expect(curried).toBe(fn)
// 	})

// 	it('returns original function for variadic functions', () => {
// 		const fn = (...args) => args
// 		const curried = curry(fn)

// 		expect(curried).toBe(fn)
// 	})

// 	it('returns curried function for function of arity 2', () => {
// 		const fn = (a, b) => [a, b]
// 		const curried = curry(fn)

// 		expect(curried).not.toBe(fn)
// 		expect(typeof curried(1)).toEqual('function')
// 		expect(curried(1, 2)).toEqual([1, 2])
// 		expect(curried(1)(2)).toEqual([1, 2])
// 	})

// 	it('returns curried function for function of arity 3 and more', () => {
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
// 	it('curries a function of arity 1', () => {
// 		const f = (a: number) => a
// 		const curried = curry(f)

// 		assert.strictEqual(curried()()()()(1), 1)
// 	})

// 	it('curries a function of arity 2', () => {
// 		const f = (a: number, b: number) => a + b
// 		const curried = curry(f)

// 		assert.strictEqual(curried()()()(1)()()()(2), 3)
// 		assert.strictEqual(curried(1, 2), 3)
// 	})

// 	it('curries a function of arity 3', () => {
// 		const f = (a: number, b: number, c: number) => a + b + c
// 		const curried = curry(f)

// 		assert.strictEqual(curried(1, 1, 1), 3)
// 		assert.strictEqual(curried(1)(1, 1), 3)
// 		assert.strictEqual(curried(1)(1)(1), 3)
// 	})

// 	it('curries a function of arity 4', () => {
// 		const f = (a: number, b: number, c: number, d: number) => a + b + c + d
// 		const curried = curry(f)

// 		assert.strictEqual(curried(1, 1, 1, 1), 4)
// 		assert.strictEqual(curried(1, 1)(1, 1), 4)
// 		assert.strictEqual(curried(1)(1)(1)(1), 4)
// 	})

// 	it('curries a function of arity 5', () => {
// 		const f = (a: number, b: number, c: number, d: number, e: number) => a + b + c + d + e
// 		const curried = curry(f)

// 		assert.strictEqual(curried(1, 1, 1, 1, 1), 5)
// 		assert.strictEqual(curried(1, 1, 1)(1, 1), 5)
// 		assert.strictEqual(curried(1)(1)(1)(1)(1), 5)
// 	})
// })