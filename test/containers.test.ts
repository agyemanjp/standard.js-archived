// /* eslint-disable fp/no-unused-expression */
// import * as assert from "assert"

// import { flatten, chunk, take } from "./_combinators"

// describe('flatten()', function () {
// 	it('should return a result that excludes empty arrays', function () {

// 		const actual = [...flatten([
// 			[{
// 				"path": "src/check-general.schema.json",
// 				"message": "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to override.",
// 				"start_line": 0,
// 				"end_line": 0,
// 				"annotation_level": "warning"
// 			}],
// 			[],
// 			[],
// 			[],
// 			[]
// 		])]

// 		const expected = [{
// 			"path": "src/check-general.schema.json",
// 			"message": "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to override.",
// 			"start_line": 0,
// 			"end_line": 0,
// 			"annotation_level": "warning"
// 		}]

// 		assert.deepEqual(actual, expected)
// 	})

// 	it('should treat strings as primitives, not iterables', function () {
// 		const actual = [...flatten([["annotation"], ["simplicity"]])]
// 		const expected = ["annotation", "simplicity"]
// 		assert.deepEqual(actual, expected)
// 	})
// })

// describe('take()', function () {
// 	it('should return array with length equal to the smaller of input array length and take count', function () {
// 		assert.deepEqual([...take([10, 20, 30, 40], 7)], [10, 20, 30, 40])
// 		assert.deepEqual([...take([10, 20, 30, 40], 2)], [10, 20])
// 	})
// 	it('should return empty array for an input empty array', function () {
// 		assert.deepEqual([...take([], 7)], [])
// 	})
// 	it('should return empty array for take count of 0', function () {
// 		assert.deepEqual([...take([5, 2, 3, 1], 0)], [])
// 	})
// 	it('should return empty array for negative take count', function () {
// 		assert.deepEqual([...take([5, 2, 3, 1], -3)], [])
// 	})
// 	it('should be idempotent for pure iterables', function () {
// 		const arr = [10, 20, 99, 3, 30, 40]
// 		assert.deepEqual([...take(arr, 4)], [...take(arr, 4)])
// 	})
// })

// describe('chunk()', function () {
// 	it('should return empty array when given empty array', function () {
// 		assert.deepEqual([...chunk([], 50)], [])
// 	})
// 	it('should return a one-element array for an input array of length less than chunk size', function () {
// 		const actual = [...chunk([{
// 			"path": "src/check-general.schema.json",
// 			"message": "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to override.",
// 			"start_line": 0,
// 			"end_line": 0,
// 			"annotation_level": "warning"
// 		}], 50)]

// 		const expected = [[{
// 			"path": "src/check-general.schema.json",
// 			"message": "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to override.",
// 			"start_line": 0,
// 			"end_line": 0,
// 			"annotation_level": "warning"
// 		}]]

// 		assert.deepEqual(actual, expected)
// 	})
// })


// /* // data-table tests
// 	describe("page", () => {
// 		it(`should return the original rows if page (original) is called several time in a row`, () => {
// 			const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
// 			const filteredDT = startingDT
// 				.page({ size: 4, index: 0, options: { scope: "original" } })
// 				.page({ size: 10, index: 0, options: { scope: "original" } })
// 			assert.equal(filteredDT.length, 10)
// 		})
// 		it(`should discard original rows with the regular page function`, () => {
// 			const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
// 			const filteredDT = startingDT
// 				.page({ size: 4, index: 0 })
// 				.page({ size: 10, index: 0 })
// 			assert.equal(filteredDT.length, 4)
// 		})
// 	})
// 	describe("filter", () => {
// 		it(`should return the original rows if filterOriginal is called several time in a row`, () => {
// 			const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
// 			const filteredDT = startingDT
// 				.filter({ filter: { fieldName: "v", negated: false, operator: "less_or_equal", value: 4 } })
// 				.filter({ filter: { filters: [], combinator: "AND" }, options: { scope: "original" } })
// 			assert.equal(filteredDT.length, 10)
// 		})
// 		it(`should discard original rows with the regular page function`, () => {
// 			const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
// 			const filteredDT = startingDT
// 				.page({ size: 3, index: 2 })
// 				.page({ size: 3, index: 2, options: { scope: "original" } })
// 			assert.equal(filteredDT.length, 4)
// 		})
// 	})
// 	describe("Combinations of paging, sorting and filtering", () => {
// 		it(`should return 5 rows and contain 8 values (from a starting 10), when we filtered 2 out (discard) then paged 5 (no discard)`, () => {
// 			const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
// 			const filteredDT = startingDT.filter({ filter: { fieldName: "v", negated: false, operator: "less_or_equal", value: 8 } })
// 			const pagedDT = filteredDT.page({ size: 5, index: 0, options: { scope: "original" } })
// 			assert.equal(pagedDT.length, 5)
// 			assert.equal(pagedDT.length, 8)
// 		})
// 		it(`should return rows 10, 9, 8, 7, 6, 5 after sorting and paging`, () => {
// 			const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
// 			const sortedDT = startingDT.sort({ columnName: "v", order: "descending" })
// 			const pagedDT = sortedDT.page({ size: 5, index: 0, options: { scope: "original" } })
// 			assert.equal(JSON.stringify([...pagedDT.rowObjects].map(r => r.v)), JSON.stringify([10, 9, 8, 7, 6]))
// 		})
// 		it(`should apply the ordering on the original rows, returning ordered rows when filters are removed`, () => {
// 			const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
// 			const filteredDT = startingDT.filter({ filter: { fieldName: "v", negated: false, operator: "greater_or_equal", value: 5 }, options: { scope: "original" } })
// 			const sortedDT = filteredDT.sort({ columnName: "v", order: "descending" })
// 			const unfilteredDT = sortedDT.filter({ options: { scope: "original" } })

// 			assert.equal(JSON.stringify([...unfilteredDT.filter({}).rowObjects].map(r => r.v)), JSON.stringify([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]))
// 		})
// 	})

// */