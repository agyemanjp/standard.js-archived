/* eslint-disable fp/no-unused-expression */
import * as assert from "assert"
import { } from "./object"

/*
describe('keys', () => {
	it('should return a typed array of objects keys', () => {
		const symbol = Symbol('key')
		const obj = { a: 'first', b: 2, c: new Date(), 1: 2, [symbol]: 'adsf' } as const
		const objKeys: Array<'1' | 'a' | 'b' | 'c'> = keys(obj)
		// typeAssert<>(objKeys)
		assert.deepEqual(objKeys.sort(), ['1', 'a', 'b', 'c'])
	})

	it('should throw error on non plain objects', () => {
		const value = [1, 2] as {}
		assert.throws(() => keys(value), 'object.keys argument must be a plain object')
	})
})

describe('map', () => {
	it('should return transformed object', () => {
		const obj = { a: 'first', b: 32 }
		const mapped: { a: string; b: string } = map(obj, (value, key) => `${key}-${value}`)

		assert.deepEqual(mapped, { a: 'a-first', b: 'b-32' })
	})

	it('should return empty object when given an empty object', () => {
		const obj = {}
		const mapfn = jest.fn()
		const mapped = map(obj, mapfn)

		expect(mapfn).toHaveBeenCalledTimes(0)
		expect(mapped).toEqual({})
	})
})

describe('filter', () => {
	it('should remove fields not matching predicate', () => {
		const obj = { a: 'first', b: 2, c: 'third' } as const
		const result = filter(obj, (field, key) => `${key}-${field}` !== 'b-2')
		assert.deepEqual(result, { a: 'first', c: 'third' })
	})

	it('should remove fields not matching guard and cast values that match using the guard', () => {
		const obj = { a: 'first', b: 2, c: 'third' } as const
		const isString = (value: string | unknown): value is string => typeof value === 'string'
		const result: { readonly a: string; readonly c: string } = filter(obj, isString)
		assert.deepEqual(result, { a: 'first', c: 'third', })
	})
})

describe('pick', () => {
	const obj = { a: 'first', b: 2, c: 'third' } as const

	it('returns an object with picked fields', () => {
		const result = pick(obj, ['a', 'b'])

		typeAssert<{ a: 'first'; b: 2 }>(result)
		expect(result).toEqual({ a: 'first', b: 2 })
	})

	it('returns an empty object if keys are empty', () => {
		const result = pick(obj, [])

		typeAssert<{}>(result)
		expect(result).toEqual({})
	})
})
*/

/*test('throw error if first argument is not an array', function (t) {
	t.throws(merge.all.bind(null, { example: true }, { another: '2' }), Error)
	t.end()
})

test('return an empty object if first argument is an array with no elements', function (t) {
	t.deepEqual(merge.all([]), {})
	t.end()
})

test('Work just fine if first argument is an array with least than two elements', function (t) {
	var actual = merge.all([{ example: true }])
	var expected = { example: true }
	t.deepEqual(actual, expected)
	t.end()
})

test('execute correctly if options object were not passed', function (t) {
	var arrayToMerge = [{ example: true }, { another: '123' }]
	t.doesNotThrow(merge.all.bind(null, arrayToMerge))
	t.end()
})

test('execute correctly if options object were passed', function (t) {
	var arrayToMerge = [{ example: true }, { another: '123' }]
	t.doesNotThrow(merge.all.bind(null, arrayToMerge, { clone: true }))
	t.end()
})

test('invoke merge on every item in array should result with all props', function (t) {
	var firstObject = { first: true }
	var secondObject = { second: false }
	var thirdObject = { third: 123 }
	var fourthObject = { fourth: 'some string' }

	var mergedObject = merge.all([firstObject, secondObject, thirdObject, fourthObject])

	t.ok(mergedObject.first === true)
	t.ok(mergedObject.second === false)
	t.ok(mergedObject.third === 123)
	t.ok(mergedObject.fourth === 'some string')
	t.end()
})

test('invoke merge on every item in array with clone should clone all elements', function (t) {
	var firstObject = { a: { d: 123 } }
	var secondObject = { b: { e: true } }
	var thirdObject = { c: { f: 'string' } }

	var mergedWithClone = merge.all([firstObject, secondObject, thirdObject], { clone: true })

	t.notEqual(mergedWithClone.a, firstObject.a)
	t.notEqual(mergedWithClone.b, secondObject.b)
	t.notEqual(mergedWithClone.c, thirdObject.c)

	t.end()
})

test('invoke merge on every item in array clone=false should not clone all elements', function (t) {
	var firstObject = { a: { d: 123 } }
	var secondObject = { b: { e: true } }
	var thirdObject = { c: { f: 'string' } }

	var mergedWithoutClone = merge.all([firstObject, secondObject, thirdObject], { clone: false })

	t.equal(mergedWithoutClone.a, firstObject.a)
	t.equal(mergedWithoutClone.b, secondObject.b)
	t.equal(mergedWithoutClone.c, thirdObject.c)

	t.end()
})


test('invoke merge on every item in array without clone should clone all elements', function (t) {
	var firstObject = { a: { d: 123 } }
	var secondObject = { b: { e: true } }
	var thirdObject = { c: { f: 'string' } }

	var mergedWithoutClone = merge.all([firstObject, secondObject, thirdObject])

	t.notEqual(mergedWithoutClone.a, firstObject.a)
	t.notEqual(mergedWithoutClone.b, secondObject.b)
	t.notEqual(mergedWithoutClone.c, thirdObject.c)

	t.end()
})
*/