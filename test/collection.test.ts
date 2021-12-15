/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable fp/no-unused-expression */

// import mocha from "mocha"
import * as assert from "assert"
import { isIterable, flatten, chunk, take, skip } from "../dist/collections"

describe("isIterable", () => {
	// it("", () => {
	// 	function f1(x) {
	// 		if (isIterable(x)) {
	// 			const iter = x[Symbol.iterator]()
	// 		}
	// 	}

	// 	function f2(x: Iterable<number> | Promise<any> | string) {
	// 		if (isIterable(x)) {
	// 			const iter = x[Symbol.iterator]()
	// 		}
	// 	}
	// })
})

describe('flatten()', function () {
	it('should return a result that excludes empty arrays', function () {

		const actual = [...flatten([
			[{
				"path": "src/check-general.schema.json",
				"message": "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to override.",
				"start_line": 0,
				"end_line": 0,
				"annotation_level": "warning"
			}], [], [], [], []
		])]

		const expected = [{
			"path": "src/check-general.schema.json",
			"message": "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to override.",
			"start_line": 0,
			"end_line": 0,
			"annotation_level": "warning"
		}]

		assert.deepEqual(actual, expected)
	})

	it('should treat strings as primitives, not iterables', function () {
		const actual = [...flatten([["annotation"], ["simplicity"]])]
		const expected = ["annotation", "simplicity"]
		assert.deepEqual(actual, expected)
	})

	it('should be able to handle null or undefined elements inside input iterables', function () {
		// eslint-disable-next-line fp/no-let, init-declarations
		let actual: unknown
		assert.doesNotThrow(() => {
			// eslint-disable-next-line fp/no-mutation
			actual = [...flatten([["annotation"], [undefined, 1, null, [undefined]], ["simplicity"]])]
		})
		const expected = ["annotation", undefined, 1, null, undefined, "simplicity"]
		assert.deepEqual(actual, expected)
	})

	it('should be able to handle null or undefined elements among other input iterables', function () {
		// eslint-disable-next-line fp/no-let, init-declarations
		let actual: unknown
		assert.doesNotThrow(() => {
			// eslint-disable-next-line fp/no-mutation
			actual = [...flatten([["annotation"], null, undefined, ["simplicity"]])]
		})
		const expected = ["annotation", null, undefined, "simplicity"]
		assert.deepEqual(actual, expected)
	})
})

describe('take()', function () {
	it('should return array with length equal to the smaller of input array length and take count', function () {
		assert.deepEqual([...take([10, 20, 30, 40], 7)], [10, 20, 30, 40])
		assert.deepEqual([...take([10, 20, 30, 40], 2)], [10, 20])
	})
	it('should return empty array for an input empty array', function () {
		assert.deepEqual([...take([], 7)], [])
	})
	it('should return empty array for take count of 0', function () {
		assert.deepEqual([...take([5, 2, 3, 1], 0)], [])
	})
	it('should return empty array for negative take count', function () {
		assert.deepEqual([...take([5, 2, 3, 1], -3)], [])
	})
	it('should be idempotent for pure iterables', function () {
		const arr = [10, 20, 99, 3, 30, 40]
		assert.deepEqual([...take(arr, 4)], [...take(arr, 4)])
	})
})

describe('skip()', function () {
	it('should skip over no items if skip count is 0', function () {
		assert.deepStrictEqual([...skip([10, 20, 30, 40], 0)], [10, 20, 30, 40])
	})
	it('should skip over no items if skip count is negative', function () {
		assert.deepStrictEqual([...skip([10, 20, 30, 40], -2)], [10, 20, 30, 40])
	})
	it('should return empty collection if skip count equals the length of collection', function () {
		assert.deepStrictEqual([...skip([10, 30, 20, 40], 4)], [])
	})
	it('should return empty collection if skip count exceeds length of collection', function () {
		assert.deepStrictEqual([...skip([10, 30, 20, 40], 7)], [])
	})
	it('should skip over the correct number of items', function () {
		assert.deepStrictEqual([...skip([5, 2, 3, 1, 7], 3)], [1, 7])
	})
	it('should be idempotent for pure iterables', function () {
		const arr = [10, 20, 99, 3, 30, 40]
		assert.deepStrictEqual([...skip(arr, 4)], [...skip(arr, 4)])
	})
})

describe('chunk()', function () {
	it('should return empty array when given empty array', function () {
		assert.deepEqual([...chunk([], 50)], [])
	})
	it('should return a one-element array for an input array of length less than chunk size', function () {
		const actual = [...chunk([{
			"path": "src/check-general.schema.json",
			"message": "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to override.",
			"start_line": 0,
			"end_line": 0,
			"annotation_level": "warning"
		}], 50)]

		const expected = [[{
			"path": "src/check-general.schema.json",
			"message": "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to override.",
			"start_line": 0,
			"end_line": 0,
			"annotation_level": "warning"
		}]]

		assert.deepEqual(actual, expected)
	})
})