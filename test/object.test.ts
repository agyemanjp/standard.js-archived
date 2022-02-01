/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable fp/no-unused-expression */

import * as assert from "assert"
import { pick, deepMerge, shallowEquals, omit, keys, entries, objectFromTuples } from "../dist/object"


describe('objectFromTuples', () => {
	it('should return an empty for an emtpy collection of tuples', () => {
		assert.deepStrictEqual(objectFromTuples([]), {})
	})

	it('should return an object that matches input collection of tuples', () => {
		const fn = (x: any) => x
		assert.deepStrictEqual(
			objectFromTuples<unknown, string>([["/", false], ["str", 'str'], ["num", 1], ['fn', fn]]),
			{ "/": false, str: "str", num: 1, fn }
		)

		assert.deepStrictEqual(
			objectFromTuples<unknown, string>([["num", 1], ['fn', fn], ["str", 'str']]),
			{ num: 1, fn, str: "str" }
		)

		assert.deepStrictEqual(
			objectFromTuples<unknown, string>([["x", true]]),
			{ x: true }
		)
	})
})

describe('keys', () => {
	it('should return a typed array of objects keys', () => {
		// eslint-disable-next-line no-undef
		const symbol = Symbol('key')

		const obj = { a: 'first', b: 2, c: new Date(), 1: 2, [symbol]: 'adsf' }
		/** @type { Array<1 | 'a' | 'b' | 'c'| symbol>} */
		const objKeys = keys(obj)
		// typeAssert<>(objKeys)
		// eslint-disable-next-line fp/no-mutating-methods
		assert.deepEqual(objKeys.sort(), ['1', 'a', 'b', 'c'])
	})

	// it('should throw error on non plain objects', () => {
	// 	// eslint-disable-next-line @typescript-eslint/ban-types
	// 	const value = [1, 2]
	// 	assert.throws(() => keys(value), 'object.keys argument must be a plain object')
	// })
})

describe('pick', () => {
	const obj = { a: 'first', b: 2, c: 'third' }

	it('returns an object with picked fields', () => {
		///** @type {{ a: 'first'; b: 2 }} */
		const result = pick(obj, 'a', 'b')
		assert.deepEqual(result, { a: 'first', b: 2 })
	})

	it('returns an empty object if keys are empty', () => {
		assert.deepEqual(pick(obj), {})
	})
})

describe('merge', () => {
	it('returns default empty object if inputs are undefined', () => {
		assert.deepStrictEqual(deepMerge({}), {})
	})

	it('returns null if inputs are null', () => {
		assert.deepStrictEqual(deepMerge(null, null), null)
	})

	it('returns default object if inputs are undefined', () => {
		assert.deepStrictEqual(deepMerge(undefined, undefined, { foo: 'bar' }), { foo: 'bar', })
	})

	it('returns default object if inputs are null', () => {
		assert.deepStrictEqual(deepMerge(null, null, { foo: 'bar' }), { foo: 'bar' })
	})

	it('returns merged objects for multiple inputs', () => {
		assert.deepStrictEqual(
			deepMerge(null, null, { foo: 'bar' }, null, {}, { foo: 'baz' })
			, { foo: 'baz' })
	})

	// it('throws exception if first input is a string', () => {
	// 	assert.throws(() => deepMerge('foo', null), 'All merge parameters are expected to be objects, null, or undefined.'
	// 	)
	// })

	// it('throws exception if second input is a string', () => {
	// 	assert.throws(() => deepMerge({}, 'foo'), 'All merge parameters are expected to be objects, null, or undefined.')
	// })

	it('returns object one if input two is undefined', () => {
		assert.deepStrictEqual(deepMerge({ foo: 'bar' }), { foo: 'bar' })
	})

	it('returns null if input two is null', () => {
		assert.deepStrictEqual(deepMerge({ foo: 'bar' }, null), null /*{ foo: 'bar' }*/)
	})

	it('returns object two if input one is undefined', () => {
		assert.deepStrictEqual(deepMerge(undefined, { foo: 'bar' }), { foo: 'bar' })
	})

	it('returns object two if input one is null', () => {
		assert.deepStrictEqual(deepMerge(null, { foo: 'bar' }), { foo: 'bar' })
	})

	it('does perform deep merge', () => {
		assert.deepStrictEqual(deepMerge({ foo: { bar: 'baz' } }, { foo: { baz: 'bar' } }),
			{
				foo: { bar: 'baz', baz: 'bar' },
			}
		)
	})

	it('does perform deep merge on multiple parameters', () => {
		assert.deepStrictEqual(
			deepMerge({ foo: { bar: 'baz' } }, { foo: { baz: 'bar' } }, { baz: 'foo' }),
			{ foo: { bar: 'baz', baz: 'bar' }, baz: 'foo', }
		)
	})

	/*it('throws error if first argument is not an array', function () {
		assert.throws(() => deepMerge(null, {}))
	})*/

	it('returns an empty object if passed empty objects', function () {
		assert.deepEqual(deepMerge({}, {}, {}), {})
	})

	it('works if first argument is an array with less than two elements', function () {
		const actual = deepMerge({ example: true })
		const expected = { example: true }
		assert.deepEqual(actual, expected)
	})

	it('executes correctly if options object were not passed', function () {
		assert.doesNotThrow(() => deepMerge({ example: true }, { another: '123' }, {}))
	})

	it('executes correctly if options object were passed', function () {
		assert.doesNotThrow(() => deepMerge({ example: true }, { another: '123' }/*, { clone: true }*/))
	})

	it('invoking merge on every item in array should result with all props', function () {
		const firstObject = { first: true }
		const secondObject = { second: false }
		const thirdObject = { third: 123 }
		const fourthObject = { fourth: 'some string' }

		const mergedObject = deepMerge(firstObject, secondObject, thirdObject, fourthObject)

		assert.ok(mergedObject.first === true)
		assert.ok(mergedObject.second === false)
		assert.ok(mergedObject.third === 123)
		assert.ok(mergedObject.fourth === 'some string')
	})

	/*it('should not mutate any arguments', function () {
		const firstObject = { a: { d: 123 } }
		const secondObject = { b: { e: true } }
		const thirdObject = { c: { f: 'string' } }

		const mergedWithClone = deepMerge(firstObject, secondObject, thirdObject)

		assert.deepEqual(mergedWithClone.a, firstObject.a)
		assert.notEqual(mergedWithClone.b, secondObject.b)
		assert.notEqual(mergedWithClone.c, thirdObject.c)
	})*/

	/*it('invoking merge on every item in array clone=false should not clone all elements', function () {
		const firstObject = { a: { d: 123 } }
		const secondObject = { b: { e: true } }
		const thirdObject = { c: { f: 'string' } }

		const mergedWithoutClone = deepMerge(firstObject, secondObject, thirdObject)

		assert.equal(mergedWithoutClone.a, firstObject.a)
		assert.equal(mergedWithoutClone.b, secondObject.b)
		assert.equal(mergedWithoutClone.c, thirdObject.c)
	})*/


	/*it('invoking merge on every item in array without clone should clone all elements', function () {
		const firstObject = { a: { d: 123 } }
		const secondObject = { b: { e: true } }
		const thirdObject = { c: { f: 'string' } }

		const mergedWithoutClone = deepMerge(firstObject, secondObject, thirdObject)

		assert.notEqual(mergedWithoutClone.a, firstObject.a)
		assert.notEqual(mergedWithoutClone.b, secondObject.b)
		assert.notEqual(mergedWithoutClone.c, thirdObject.c)

	})*/

})

describe('equalsShallow', () => {
	it('returns true when comparing empty objects', () => {
		assert(shallowEquals({}, {}))
		assert(!shallowEquals({}, { foo: {} }))
	})

	it('Properly compares each object property irrespective of their order', () => {
		assert(shallowEquals({ str: "hello", num: 1 }, { num: 1, str: "hello" }))
		assert(!shallowEquals({ str: "str", num: 1 }, { num: 1, str: "hello" }))
	})

	it('Properly compares reference properties', () => {
		const obj = { str: "hello", num: 1 }
		assert(shallowEquals({ obj, foo: "bar" }, { foo: "bar", obj }))
		assert(!shallowEquals({ obj }, { obj: { str: "hello", num: 1 } }))
	})

	it('Properly compares objects with single a property', () => {
		assert(shallowEquals({ str: "hello" }, { str: "hello" }))
	})
})


/*describe('filterObject', () => {
	it('should remove fields not matching predicate', () => {
		const obj = { a: 'first', b: 2, c: 'third' }
		const result = filterObject(obj, ((field, key) => `${key}-${field}` !== 'b-2'))
		assert.deepEqual(result, { a: 'first', c: 'third' })
	})

	it('should remove fields not matching guard and cast values that match using the guard', () => {
		//const obj = { a: 'first', b: 2, c: 'third' }
		//const isString = (value) => typeof value === 'string'
		//const result = filterObject(obj, isString)
		//assert.deepEqual(result, { a: 'first', c: 'third', })
	})
})
*/