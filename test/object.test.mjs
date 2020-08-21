/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable fp/no-unused-expression */

//@ts-check

//@ts-ignore
import assert from "assert"
import mocha from "mocha"
const { describe, it } = mocha
import _object from "../dist/collections/object.js"
const { pick, deepMerge, filterObject, mapObject, omit, keys, entries, fromKeyValues } = _object


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

describe('mapObject', () => {
	it('should return transformed object', () => {
		const obj = { a: 'first', b: 32 }
		/** @type {{ a: string; b: string }} */
		const mapped = mapObject(obj, (value, key) => `${key}-${value}`)

		assert.deepEqual(mapped, { a: 'a-first', b: 'b-32' })
	})

	it('should return empty object when given an empty object', () => {
		const obj = {}
		// const mapfn = jest.fn()
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		const mapped = mapObject(obj, () => { })

		// expect(mapfn).toHaveBeenCalledTimes(0)
		assert.deepEqual(mapped, {})
	})
})

describe('filterObject', () => {
	it('should remove fields not matching predicate', () => {
		const obj = { a: 'first', b: 2, c: 'third' }
		const result = filterObject(obj, (field, key) => `${key}-${field}` !== 'b-2')
		assert.deepEqual(result, { a: 'first', c: 'third' })
	})

	it('should remove fields not matching guard and cast values that match using the guard', () => {
		//const obj = { a: 'first', b: 2, c: 'third' }
		/** String type guard
		 * @param value { unknown }
		 * @returns { value is string }
		 */
		//const isString = (value) => typeof value === 'string'
		///** @type {{ readonly a: string; readonly c: string }} */
		//const result = filterObject(obj, isString)
		//assert.deepEqual(result, { a: 'first', c: 'third', })
	})
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

	it('throws error if first argument is not an array', function () {
		assert.throws(() => deepMerge(null, {}))
	})

	it('returns an empty object if passed empty objects', function () {
		assert.deepEqual(deepMerge([{}, {}, {}]), {})
	})

	it('works if first argument is an array with less than two elements', function () {
		const actual = deepMerge([{ example: true }])
		const expected = { example: true }
		assert.deepEqual(actual, expected)
	})

	it('executes correctly if options object were not passed', function () {
		assert.doesNotThrow(() => deepMerge([{ example: true }, { another: '123' }], {}))
	})

	it('execute correctly if options object were passed', function () {
		assert.doesNotThrow(() => deepMerge([{ example: true }, { another: '123' }], { clone: true }))
	})

	it('invokes merge on every item in array should result with all props', function () {
		const firstObject = { first: true }
		const secondObject = { second: false }
		const thirdObject = { third: 123 }
		const fourthObject = { fourth: 'some string' }

		const mergedObject = deepMerge([firstObject, secondObject, thirdObject, fourthObject])

		assert.ok(mergedObject.first === true)
		assert.ok(mergedObject.second === false)
		assert.ok(mergedObject.third === 123)
		assert.ok(mergedObject.fourth === 'some string')
	})

	it('invoke merge on every item in array with clone should clone all elements', function () {
		const firstObject = { a: { d: 123 } }
		const secondObject = { b: { e: true } }
		const thirdObject = { c: { f: 'string' } }

		const mergedWithClone = deepMerge([firstObject, secondObject, thirdObject], { clone: true })

		assert.notEqual(mergedWithClone.a, firstObject.a)
		assert.notEqual(mergedWithClone.b, secondObject.b)
		assert.notEqual(mergedWithClone.c, thirdObject.c)
	})

	it('invoke merge on every item in array clone=false should not clone all elements', function () {
		const firstObject = { a: { d: 123 } }
		const secondObject = { b: { e: true } }
		const thirdObject = { c: { f: 'string' } }

		const mergedWithoutClone = deepMerge([firstObject, secondObject, thirdObject], { clone: false })

		assert.equal(mergedWithoutClone.a, firstObject.a)
		assert.equal(mergedWithoutClone.b, secondObject.b)
		assert.equal(mergedWithoutClone.c, thirdObject.c)
	})


	it('invoke merge on every item in array without clone should clone all elements', function () {
		const firstObject = { a: { d: 123 } }
		const secondObject = { b: { e: true } }
		const thirdObject = { c: { f: 'string' } }

		const mergedWithoutClone = deepMerge([firstObject, secondObject, thirdObject])

		assert.notEqual(mergedWithoutClone.a, firstObject.a)
		assert.notEqual(mergedWithoutClone.b, secondObject.b)
		assert.notEqual(mergedWithoutClone.c, thirdObject.c)

	})

})
