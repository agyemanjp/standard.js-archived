/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable fp/no-unused-expression */

import * as assert from "assert"
import { flatten } from "../dist/collections/combinators"
import { Sequence, Array, Set } from "../dist/collections/containers"

describe('Sequence', () => {
	describe('integers()', () => {
		it("should yield a sequence including both 'from' and 'to' arguments when going upwards ", () => {
			const actual = [...Sequence.integers({ from: 3, to: 6 })]
			const expected = [3, 4, 5, 6]
			assert.deepEqual(expected, actual)
		})
		it("should yield a sequence including both 'from' and 'to' arguments when going downwards ", () => {
			const actual = [...Sequence.integers({ from: 4, to: -1 })]
			const expected = [4, 3, 2, 1, 0, -1]
			assert.deepEqual(expected, actual)
		})
	})
})

describe("Set", () => {
	it("should be equivalent to global array for empty sets", () => {
		assert.deepStrictEqual([], [...new Set([])])
	})

	it("should be equivalent to global set when contructing from an iterator", () => {
		const elt = [{
			"path": "src/check-general.schema.json",
			"message": "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to override.",
			"start_line": 0,
			"end_line": 0,
			"annotation_level": "warning"
		}]
		const _container = new Set(elt)
		const _global = new globalThis.Set(elt)
		assert([..._global.values()].every(val => _container.has(val)))
	})

	/*describe("union()", () => {
		it("should return a new array with a new element at index 1 when it is inserted at that index", () => {
			const actual = [...new Set([1, 3]).union(1, 2)]
			const expected = [...new Array([1, 2, 3])]
	
			assert.deepStrictEqual(actual, expected)
		})
		it("should place multiple new elements contiguously starting at the correct index", () => {
			const actual = [...new Array([1, 3]).insert(1, 2, 4, 5, 6)]
			const expected = [...new Array([1, 2, 4, 5, 6, 3])]
	
			assert.deepStrictEqual(actual, expected)
		})
		it("should return a new array with the same elements when passed a negative index", () => {
			const actual = [...new Array([1, 3]).insert(-2, 2, 4)]
			const expected = [...new Array([1, 3])]
	
			assert.deepStrictEqual(actual, expected)
		})
		it("should return a new array with the same elements when passed an empty set of items", () => {
			const actual = [...new Array([1, 3]).insert(1)]
			const expected = [...new Array([1, 3])]
	
			assert.deepStrictEqual(actual, expected)
		})
	})*/

	describe("equals()", () => {
		it("should check for set equality with another set container", () => {
			assert(new Set([]).equals(new Set([])))
			assert(!new Set([1, 2, 3]).equals(new Set([545345, 535352, 323])))
			assert(new Set([2, 3, 1]).equals(new Set([1, 2, 3])))
		})
	})

	describe("static equals()", () => {
		it("should check for set equality of several collections", () => {
			assert(Set.equals([], [], []))
			assert(!Set.equals([1, 2, 3], [4], [545345, 535352, 323]))
			assert(Set.equals([1, 2, 3], [2, 3, 1], [3, 2, 1]))
			assert(Set.equals([1, 2, 3], new Set([2, 1, 3])))
		})
	})
})

describe("Array", () => {
	it("should be equivalent to global array for empty arrays", () => {
		assert.deepStrictEqual([], [...new Array([])])
	})

	it("should be equivalent to global array when contructing it from an iterator", () => {
		const actual = [...new Array(flatten([
			[{
				"path": "src/check-general.schema.json",
				"message": "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to override.",
				"start_line": 0,
				"end_line": 0,
				"annotation_level": "warning"
			}],
			[],
			[],
			[],
			[]
		]))]
		const expected = [{
			"path": "src/check-general.schema.json",
			"message": "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to override.",
			"start_line": 0,
			"end_line": 0,
			"annotation_level": "warning"
		}]
		assert.deepEqual(expected, actual)

		const actual2 = [...new Array(flatten([
			{ "type": "span", "props": null, "children": [" Some render "] },
			" ",
			{ "type": "i", "props": null, "children": [" test "] }
		]))]
		const expected2 = [
			{ "type": "span", "props": null, "children": [" Some render "] },
			" ",
			{ "type": "i", "props": null, "children": [" test "] }
		]

		assert.deepEqual(expected2, actual2)
	})

	describe("insert()", () => {
		it("should return a new array with a new element at index 1 when it is inserted at that index", () => {
			const actual = [...new Array([1, 3]).insert(1, 2)]
			const expected = [...new Array([1, 2, 3])]

			assert.deepStrictEqual(actual, expected)
		})
		it("should place multiple new elements contiguously starting at the correct index", () => {
			const actual = [...new Array([1, 3]).insert(1, 2, 4, 5, 6)]
			const expected = [...new Array([1, 2, 4, 5, 6, 3])]

			assert.deepStrictEqual(actual, expected)
		})
		it("should return a new array with the same elements when passed a negative index", () => {
			const actual = [...new Array([1, 3]).insert(-2, 2, 4)]
			const expected = [...new Array([1, 3])]

			assert.deepStrictEqual(actual, expected)
		})
		it("should return a new array with the same elements when passed an empty set of items", () => {
			const actual = [...new Array([1, 3]).insert(1)]
			const expected = [...new Array([1, 3])]

			assert.deepStrictEqual(actual, expected)
		})
	})

	describe("equals()", () => {
		it("should check for deep equality with another array container", () => {
			assert(new Array([]).equals(new Array([])))
			assert(!new Array([1, 2, 3]).equals(new Array([545345, 535352, 323])))
			assert(new Array([1, 2, 3]).equals(new Array([1, 2, 3])))
		})
	})

	describe("static equals()", () => {
		it("should be able to check for deep equality of several array-like collections", () => {
			assert(Array.equals([], [], []))
			assert(!Array.equals([1, 2, 3], [4], [545345, 535352, 323]))
			assert(Array.equals([1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3]))
			assert(Array.equals([1, 2, 3], new Array([1, 2, 3])))
		})
	})
})
