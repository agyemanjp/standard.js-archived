/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable fp/no-unused-expression */

import *as assert from "assert"
import { Array } from "../dist/collections/containers"
import { flatten } from "../dist/collections"

describe("Array", () => {
	it("should be equivalent to global array for empty arrays", () => {
		assert.deepEqual([], [...new Array([])])
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

			assert.deepEqual(actual, expected)
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

})

