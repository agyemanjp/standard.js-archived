// import { describe, it } from "bun:test"
// import assert from "assert"
// import { flatten, Sequence, Array, Set, DataTable } from "../source"
export {};
// describe('Sequence', () => {
// 	describe('integers()', () => {
// 		describe("should yield a sequence including both 'from' and 'to' arguments when going upwards ", () => {
// 			const actual = [...Sequence.integers({ from: 3, to: 6 })]
// 			const expected = [3, 4, 5, 6]
// 			assert.deepEqual(expected, actual)
// 		})
// 		describe("should yield a sequence including both 'from' and 'to' arguments when going downwards ", () => {
// 			const actual = [...Sequence.integers({ from: 4, to: -1 })]
// 			const expected = [4, 3, 2, 1, 0, -1]
// 			assert.deepEqual(expected, actual)
// 		})
// 	})
// })
// describe("Set", () => {
// 	describe("should be equivalent to global array for empty sets", () => {
// 		assert.deepStrictEqual([], [...new Set([])])
// 	})
// 	describe("should be equivalent to global set when contructing from an iterator", () => {
// 		const elt = [{
// 			"path": "src/check-general.schema.json",
// 			"message": "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to override.",
// 			"start_line": 0,
// 			"end_line": 0,
// 			"annotation_level": "warning"
// 		}]
// 		const _container = new Set(elt)
// 		const _global = new globalThis.Set(elt)
// 		assert([..._global.values()].every(val => _container.has(val)))
// 	})
// 	/*describe("union()", () => {
// 		describe("should return a new array with a new element at index 1 when it is inserted at that index", () => {
// 			const actual = [...new Set([1, 3]).union(1, 2)]
// 			const expected = [...new Array([1, 2, 3])]
// 			assert.deepStrictEqual(actual, expected)
// 		})
// 		describe("should place multiple new elements contiguously starting at the correct index", () => {
// 			const actual = [...new Array([1, 3]).insert(1, 2, 4, 5, 6)]
// 			const expected = [...new Array([1, 2, 4, 5, 6, 3])]
// 			assert.deepStrictEqual(actual, expected)
// 		})
// 		describe("should return a new array with the same elements when passed a negative index", () => {
// 			const actual = [...new Array([1, 3]).insert(-2, 2, 4)]
// 			const expected = [...new Array([1, 3])]
// 			assert.deepStrictEqual(actual, expected)
// 		})
// 		describe("should return a new array with the same elements when passed an empty set of items", () => {
// 			const actual = [...new Array([1, 3]).insert(1)]
// 			const expected = [...new Array([1, 3])]
// 			assert.deepStrictEqual(actual, expected)
// 		})
// 	})*/
// 	describe("equals()", () => {
// 		describe("should check for set equality with another set container", () => {
// 			assert(new Set([]).equals(new Set([])))
// 			assert(!new Set([1, 2, 3]).equals(new Set([545345, 535352, 323])))
// 			assert(new Set([2, 3, 1]).equals(new Set([1, 2, 3])))
// 		})
// 	})
// 	describe("static equals()", () => {
// 		describe("should check for set equality of several collections", () => {
// 			assert(Set.equals([], [], []))
// 			assert(!Set.equals([1, 2, 3], [4], [545345, 535352, 323]))
// 			assert(Set.equals([1, 2, 3], [2, 3, 1], [3, 2, 1]))
// 			assert(Set.equals([1, 2, 3], new Set([2, 1, 3])))
// 		})
// 	})
// })
// describe("Array", () => {
// 	describe("should be equivalent to global array for empty arrays", () => {
// 		assert.deepStrictEqual([], [...new Array([])])
// 	})
// 	describe("should be equivalent to global array when contructing it from an iterator", () => {
// 		const actual = [...new Array(flatten([
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
// 		]))]
// 		const expected = [{
// 			"path": "src/check-general.schema.json",
// 			"message": "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to override.",
// 			"start_line": 0,
// 			"end_line": 0,
// 			"annotation_level": "warning"
// 		}]
// 		assert.deepEqual(expected, actual)
// 		const actual2 = [...new Array(flatten([
// 			{ "type": "span", "props": null, "children": [" Some render "] },
// 			" ",
// 			{ "type": "i", "props": null, "children": [" test "] }
// 		]))]
// 		const expected2 = [
// 			{ "type": "span", "props": null, "children": [" Some render "] },
// 			" ",
// 			{ "type": "i", "props": null, "children": [" test "] }
// 		]
// 		assert.deepEqual(expected2, actual2)
// 	})
// 	describe("insert()", () => {
// 		describe("should return a new array with a new element at index 1 when it is inserted at that index", () => {
// 			const actual = [...new Array([1, 3]).insert(1, 2)]
// 			const expected = [...new Array([1, 2, 3])]
// 			assert.deepStrictEqual(actual, expected)
// 		})
// 		describe("should place multiple new elements contiguously starting at the correct index", () => {
// 			const actual = [...new Array([1, 3]).insert(1, 2, 4, 5, 6)]
// 			const expected = [...new Array([1, 2, 4, 5, 6, 3])]
// 			assert.deepStrictEqual(actual, expected)
// 		})
// 		describe("should return a new array with the same elements when passed a negative index", () => {
// 			const actual = [...new Array([1, 3]).insert(-2, 2, 4)]
// 			const expected = [...new Array([1, 3])]
// 			assert.deepStrictEqual(actual, expected)
// 		})
// 		describe("should return a new array with the same elements when passed an empty set of items", () => {
// 			const actual = [...new Array([1, 3]).insert(1)]
// 			const expected = [...new Array([1, 3])]
// 			assert.deepStrictEqual(actual, expected)
// 		})
// 	})
// 	describe("equals()", () => {
// 		describe("should check for deep equality with another array container", () => {
// 			assert(new Array([]).equals(new Array([])))
// 			assert(!new Array([1, 2, 3]).equals(new Array([545345, 535352, 323])))
// 			assert(new Array([1, 2, 3]).equals(new Array([1, 2, 3])))
// 		})
// 	})
// 	describe("static equals()", () => {
// 		describe("should be able to check for deep equality of several array-like collections", () => {
// 			assert(Array.equals([], [], []))
// 			assert(!Array.equals([1, 2, 3], [4], [545345, 535352, 323]))
// 			assert(Array.equals([1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3]))
// 			assert(Array.equals([1, 2, 3], new Array([1, 2, 3])))
// 		})
// 	})
// })
// describe("Table", () => {
// 	describe("contruction", () => {
// 		it(`should be constructed from an array of rows`, () => {
// 			const dataTable = new DataTable([
// 				{ v: 1, color: "Green" },
// 				{ v: 5, color: "Orange" },
// 				{ v: 1, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 25, color: "Red" },
// 				{ v: 36, color: "Red" },
// 				{ v: 7, color: "Orange" },
// 				{ v: 3, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 1, color: "Green" }])
// 			assert.strictEqual(JSON.stringify([...dataTable.rowObjects]), '[{"v":1,"color":"Green"},{"v":5,"color":"Orange"},{"v":1,"color":"Green"},{"v":2,"color":"Green"},{"v":25,"color":"Red"},{"v":36,"color":"Red"},{"v":7,"color":"Orange"},{"v":3,"color":"Green"},{"v":2,"color":"Green"},{"v":1,"color":"Green"}]')
// 		})
// 		it(`should be constructed from columns`, () => {
// 			const dataTable = new DataTable({
// 				v: [1, 5, 1, 2, 25, 36, 7, 3, 2, 1],
// 				color: ["Green", "Orange", "Green", "Green", "Red", "Red", "Orange", "Green", "Green", "Green"]
// 			})
// 			assert.strictEqual(JSON.stringify([...dataTable.rowObjects]), '[{"v":1,"color":"Green"},{"v":5,"color":"Orange"},{"v":1,"color":"Green"},{"v":2,"color":"Green"},{"v":25,"color":"Red"},{"v":36,"color":"Red"},{"v":7,"color":"Orange"},{"v":3,"color":"Green"},{"v":2,"color":"Green"},{"v":1,"color":"Green"}]')
// 		})
// 		it(`should be constructed with an index indicating which rows to keep`, () => {
// 			const dataTable = new DataTable({
// 				v: [1, 5, 1, 2, 25, 36, 7, 3, 2, 1],
// 				color: ["Green", "Orange", "Green", "Green", "Red", "Red", "Orange", "Green", "Green", "Green"]
// 			}, [0, 1, 9])
// 			assert.strictEqual(JSON.stringify([...dataTable.rowObjects]), '[{"v":1,"color":"Green"},{"v":5,"color":"Orange"},{"v":1,"color":"Green"}]')
// 		})
// 	})
// 	describe("content access", () => {
// 		it(`should return enumerable row objects`, () => {
// 			const dataTable = new DataTable([
// 				{ v: 1, color: "Green" },
// 				{ v: 5, color: "Orange" },
// 				{ v: 1, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 25, color: "Red" },
// 				{ v: 36, color: "Red" },
// 				{ v: 7, color: "Orange" },
// 				{ v: 3, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 1, color: "Green" }])
// 			assert.strictEqual(JSON.stringify([...dataTable.rowObjects]), '[{"v":1,"color":"Green"},{"v":5,"color":"Orange"},{"v":1,"color":"Green"},{"v":2,"color":"Green"},{"v":25,"color":"Red"},{"v":36,"color":"Red"},{"v":7,"color":"Orange"},{"v":3,"color":"Green"},{"v":2,"color":"Green"},{"v":1,"color":"Green"}]')
// 		})
// 		it(`should return numbered enumerable row objects`, () => {
// 			const dataTable = new DataTable([
// 				{ v: 1, color: "Green" },
// 				{ v: 5, color: "Orange" },
// 				{ v: 1, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 25, color: "Red" },
// 				{ v: 36, color: "Red" },
// 				{ v: 7, color: "Orange" },
// 				{ v: 3, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 1, color: "Green" }])
// 			assert.strictEqual(JSON.stringify([...dataTable.rowObjectsNumbered][0]), '{"origRowNum":0,"sequentialRowNum":1,"v":1,"color":"Green"}')
// 		})
// 		it(`should return numbered enumerable row objects, original and sequential numbers being correct after filtering`, () => {
// 			const startingDT = new DataTable([
// 				{ v: 1, color: "Green" },
// 				{ v: 5, color: "Orange" },
// 				{ v: 1, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 25, color: "Red" },
// 				{ v: 36, color: "Red" },
// 				{ v: 7, color: "Orange" },
// 				{ v: 3, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 1, color: "Green" }])
// 			const filteredDT = startingDT
// 				.filter({ filter: { negated: true, fieldName: "v", operator: "less_than", value: 25 } })
// 			assert.strictEqual(JSON.stringify([...filteredDT.rowObjectsNumbered]), '[{"origRowNum":4,"sequentialRowNum":1,"v":25,"color":"Red"},{"origRowNum":5,"sequentialRowNum":2,"v":36,"color":"Red"}]')
// 		})
// 		it(`should return numbered enumerable row objects, original and sequential numbers being correct after filtering & sorting`, () => {
// 			const startingDT = new DataTable([
// 				{ v: 1, color: "Green" },
// 				{ v: 5, color: "Orange" },
// 				{ v: 1, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 25, color: "Red" },
// 				{ v: 36, color: "Red" },
// 				{ v: 7, color: "Orange" },
// 				{ v: 3, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 1, color: "Green" }])
// 			const filteredDT = startingDT
// 				.filter({ filter: { negated: true, fieldName: "v", operator: "less_than", value: 25 } })
// 				.sort({ columnName: "v", order: "descending" })
// 			assert.strictEqual(JSON.stringify([...filteredDT.rowObjectsNumbered]), '[{"origRowNum":5,"sequentialRowNum":1,"v":36,"color":"Red"},{"origRowNum":4,"sequentialRowNum":2,"v":25,"color":"Red"}]')
// 		})
// 		it(`should return a correct length and original length after sorting`, () => {
// 			const startingDT = new DataTable([
// 				{ v: 1, color: "Green" },
// 				{ v: 5, color: "Orange" },
// 				{ v: 1, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 25, color: "Red" },
// 				{ v: 36, color: "Red" },
// 				{ v: 7, color: "Orange" },
// 				{ v: 3, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 1, color: "Green" }])
// 			const filteredDT = startingDT
// 				.filter({ filter: { negated: true, fieldName: "v", operator: "less_than", value: 25 } })
// 				.sort({ columnName: "v", order: "descending" })
// 			assert.strictEqual(filteredDT.length, 2)
// 			assert.strictEqual(filteredDT.originalLength, 10)
// 		})
// 	})
// 	describe("utility functions", () => {
// 		it(`should values into other values`, () => {
// 			const startingDT = new DataTable([
// 				{ v: 1, color: "Green" },
// 				{ v: 5, color: "Orange" },
// 				{ v: 1, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 25, color: "Red" },
// 				{ v: 36, color: "Red" },
// 				{ v: 7, color: "Orange" },
// 				{ v: 3, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 1, color: "Green" }])
// 			const mappedDT = startingDT.map(cell => {
// 				return typeof cell === "string" && cell === "Green"
// 					? "Dark Green"
// 					: typeof cell === "number" && cell > 10
// 						? cell + 100
// 						: cell
// 			})
// 			assert.strictEqual(JSON.stringify([...mappedDT.rowObjects]), '[{"v":1,"color":"Dark Green"},{"v":5,"color":"Orange"},{"v":1,"color":"Dark Green"},{"v":2,"color":"Dark Green"},{"v":125,"color":"Red"},{"v":136,"color":"Red"},{"v":7,"color":"Orange"},{"v":3,"color":"Dark Green"},{"v":2,"color":"Dark Green"},{"v":1,"color":"Dark Green"}]')
// 		})
// 		it(`rowsToColumns`, () => {
// 			const columns = DataTable.rowsToColumns([
// 				{ v: 1, color: "Green" },
// 				{ v: 5, color: "Orange" },
// 				{ v: 1, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 25, color: "Red" },
// 				{ v: 36, color: "Red" },
// 				{ v: 7, color: "Orange" },
// 				{ v: 3, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 1, color: "Green" }])
// 			assert.strictEqual(JSON.stringify(columns), '{"v":[1,5,1,2,25,36,7,3,2,1],"color":["Green","Orange","Green","Green","Red","Red","Orange","Green","Green","Green"]}')
// 		})
// 	})
// 	describe("filtering", () => {
// 		it(`should return all rows when no filter is applied`, () => {
// 			const startingDT = new DataTable([
// 				{ v: 1, color: "Green" },
// 				{ v: 5, color: "Orange" },
// 				{ v: 1, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 25, color: "Red" },
// 				{ v: 36, color: "Red" },
// 				{ v: 7, color: "Orange" },
// 				{ v: 3, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 1, color: "Green" }])
// 			const filteredDT = startingDT
// 				.filter({})
// 			assert.strictEqual(JSON.stringify([...filteredDT.rowObjects]), '[{"v":1,"color":"Green"},{"v":5,"color":"Orange"},{"v":1,"color":"Green"},{"v":2,"color":"Green"},{"v":25,"color":"Red"},{"v":36,"color":"Red"},{"v":7,"color":"Orange"},{"v":3,"color":"Green"},{"v":2,"color":"Green"},{"v":1,"color":"Green"}]')
// 		})
// 		it(`should remove rows where the value of column 'v' is greater than 35`, () => {
// 			const startingDT = new DataTable([
// 				{ v: 1, color: "Green" },
// 				{ v: 5, color: "Orange" },
// 				{ v: 1, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 25, color: "Red" },
// 				{ v: 36, color: "Red" },
// 				{ v: 7, color: "Orange" },
// 				{ v: 3, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 1, color: "Green" }])
// 			const filteredDT = startingDT
// 				.filter({ filter: { negated: true, fieldName: "v", operator: "greater_than", value: 35 } })
// 			assert.strictEqual(JSON.stringify([...filteredDT.rowObjects]), '[{"v":1,"color":"Green"},{"v":5,"color":"Orange"},{"v":1,"color":"Green"},{"v":2,"color":"Green"},{"v":25,"color":"Red"},{"v":7,"color":"Orange"},{"v":3,"color":"Green"},{"v":2,"color":"Green"},{"v":1,"color":"Green"}]')
// 		})
// 		it(`should remove rows where the value of column 'v' is less than 25`, () => {
// 			const startingDT = new DataTable([
// 				{ v: 1, color: "Green" },
// 				{ v: 5, color: "Orange" },
// 				{ v: 1, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 25, color: "Red" },
// 				{ v: 36, color: "Red" },
// 				{ v: 7, color: "Orange" },
// 				{ v: 3, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 1, color: "Green" }])
// 			const filteredDT = startingDT
// 				.filter({ filter: { negated: true, fieldName: "v", operator: "less_than", value: 25 } })
// 			assert.strictEqual(JSON.stringify([...filteredDT.rowObjects]), '[{"v":25,"color":"Red"},{"v":36,"color":"Red"}]')
// 		})
// 		it(`should only include rows where the value of column 'v' is equal to 1`, () => {
// 			const startingDT = new DataTable([
// 				{ v: 1, color: "Green" },
// 				{ v: 5, color: "Orange" },
// 				{ v: 1, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 25, color: "Red" },
// 				{ v: 36, color: "Red" },
// 				{ v: 7, color: "Orange" },
// 				{ v: 3, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 1, color: "Green" }])
// 			const filteredDT = startingDT
// 				.filter({ filter: { negated: false, fieldName: "v", operator: "equals", value: 1 } })
// 			assert.strictEqual(JSON.stringify([...filteredDT.rowObjects]), '[{"v":1,"color":"Green"},{"v":1,"color":"Green"},{"v":1,"color":"Green"}]')
// 		})
// 		it(`should include rows where the value of column 'color' is equal to 'Red'`, () => {
// 			const startingDT = new DataTable([
// 				{ v: 1, color: "Green" },
// 				{ v: 5, color: "Orange" },
// 				{ v: 1, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 25, color: "Red" },
// 				{ v: 36, color: "Red" },
// 				{ v: 7, color: "Orange" },
// 				{ v: 3, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 1, color: "Green" }])
// 			const filteredDT = startingDT
// 				.filter({ filter: { negated: false, fieldName: "color", operator: "equals", value: "Red" } })
// 			assert.strictEqual(JSON.stringify([...filteredDT.rowObjects]), '[{"v":25,"color":"Red"},{"v":36,"color":"Red"}]')
// 		})
// 		it(`should remove rows where the value of column 'v' is greater or equal to 7`, () => {
// 			const startingDT = new DataTable([
// 				{ v: 1, color: "Green" },
// 				{ v: 5, color: "Orange" },
// 				{ v: 1, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 25, color: "Red" },
// 				{ v: 36, color: "Red" },
// 				{ v: 7, color: "Orange" },
// 				{ v: 3, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 1, color: "Green" }])
// 			const filteredDT = startingDT.filter({
// 				filter: {
// 					combinator: "AND",
// 					filters: [
// 						{
// 							negated: true,
// 							fieldName: "v",
// 							operator: "greater_than",
// 							value: 7
// 						},
// 						{
// 							negated: true,
// 							fieldName: "v",
// 							operator: "equals",
// 							value: 7
// 						}
// 					]
// 				}
// 			})
// 			assert.strictEqual(JSON.stringify([...filteredDT.rowObjects]), '[{"v":1,"color":"Green"},{"v":5,"color":"Orange"},{"v":1,"color":"Green"},{"v":2,"color":"Green"},{"v":3,"color":"Green"},{"v":2,"color":"Green"},{"v":1,"color":"Green"}]')
// 		})
// 		it(`should remove rows where the value of column 'v' is smaller or equal to 7`, () => {
// 			const startingDT = new DataTable([
// 				{ v: 1, color: "Green" },
// 				{ v: 5, color: "Orange" },
// 				{ v: 1, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 25, color: "Red" },
// 				{ v: 36, color: "Red" },
// 				{ v: 7, color: "Orange" },
// 				{ v: 3, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 1, color: "Green" }])
// 			const filteredDT = startingDT.filter({
// 				filter: {
// 					filters: [
// 						{
// 							negated: true,
// 							fieldName: "v",
// 							operator: "less_than",
// 							value: 7
// 						},
// 						{
// 							negated: true,
// 							fieldName: "v",
// 							operator: "equals",
// 							value: 7
// 						}
// 					],
// 					combinator: "AND"
// 				}
// 			})
// 			assert.strictEqual(JSON.stringify([...filteredDT.rowObjects]), '[{"v":25,"color":"Red"},{"v":36,"color":"Red"}]')
// 		})
// 		it(`should only include rows where the value of column 'color' contains string 'n'`, () => {
// 			const startingDT = new DataTable([
// 				{ v: 1, color: "Green" },
// 				{ v: 5, color: "Orange" },
// 				{ v: 1, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 25, color: "Red" },
// 				{ v: 36, color: "Red" },
// 				{ v: 7, color: "Orange" },
// 				{ v: 3, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 1, color: "Green" }])
// 			const filteredDT = startingDT
// 				.filter({ filter: { negated: false, fieldName: "color", operator: "contains", value: "n" } })
// 			assert.strictEqual(JSON.stringify([...filteredDT.rowObjects]), '[{"v":1,"color":"Green"},{"v":5,"color":"Orange"},{"v":1,"color":"Green"},{"v":2,"color":"Green"},{"v":7,"color":"Orange"},{"v":3,"color":"Green"},{"v":2,"color":"Green"},{"v":1,"color":"Green"}]')
// 		})
// 		it(`should only include rows where the value of column 'color' is contained in string 'InfraRed Laser'`, () => {
// 			const startingDT = new DataTable([
// 				{ v: 1, color: "Green" },
// 				{ v: 5, color: "Orange" },
// 				{ v: 1, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 25, color: "Red" },
// 				{ v: 36, color: "Red" },
// 				{ v: 7, color: "Orange" },
// 				{ v: 3, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 1, color: "Green" }])
// 			const filteredDT = startingDT
// 				.filter({
// 					filter: {
// 						negated: false,
// 						fieldName: "color",
// 						operator: "is_contained_in",
// 						value: "InfraRed Laser"
// 					} as const
// 				})
// 			assert.strictEqual(JSON.stringify([...filteredDT.rowObjects]), '[{"v":25,"color":"Red"},{"v":36,"color":"Red"}]')
// 		})
// 		it(`should only include rows where the value of column 'color' starts with string 'Gre'`, () => {
// 			const startingDT = new DataTable([
// 				{ v: 1, color: "Green" },
// 				{ v: 5, color: "Orange" },
// 				{ v: 1, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 25, color: "Red" },
// 				{ v: 36, color: "Red" },
// 				{ v: 7, color: "Orange" },
// 				{ v: 3, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 1, color: "Green" }])
// 			const filteredDT = startingDT
// 				.filter({ filter: { negated: false, fieldName: "color", operator: "starts_with", value: "Gre" } })
// 			assert.strictEqual(JSON.stringify([...filteredDT.rowObjects]), '[{"v":1,"color":"Green"},{"v":1,"color":"Green"},{"v":2,"color":"Green"},{"v":3,"color":"Green"},{"v":2,"color":"Green"},{"v":1,"color":"Green"}]')
// 		})
// 		it(`should only include rows where the value of column 'color' ends with string 'ed'`, () => {
// 			const startingDT = new DataTable([
// 				{ v: 1, color: "Green" },
// 				{ v: 5, color: "Orange" },
// 				{ v: 1, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 25, color: "Red" },
// 				{ v: 36, color: "Red" },
// 				{ v: 7, color: "Orange" },
// 				{ v: 3, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 1, color: "Green" }])
// 			const filteredDT = startingDT
// 				.filter({ filter: { negated: false, fieldName: "color", operator: "ends_with", value: "ed" } })
// 			assert.strictEqual(JSON.stringify([...filteredDT.rowObjects]), '[{"v":25,"color":"Red"},{"v":36,"color":"Red"}]')
// 		})
// 		it(`should exclude rows where the value of column 'v' is blank`, () => {
// 			const startingDT = new DataTable([
// 				{ v: 1, color: "Green" },
// 				{ v: 5, color: "Orange" },
// 				{ v: 1, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 25, color: "Red" },
// 				{ v: 36, color: "Red" },
// 				{ v: null, color: "Orange" },
// 				{ v: 3, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 1, color: "Green" }])
// 			const filteredDT = startingDT
// 				.filter({ filter: { negated: true, fieldName: "v", operator: "is-null" } as const })
// 			assert.strictEqual(JSON.stringify([...filteredDT.rowObjects]), '[{"v":1,"color":"Green"},{"v":5,"color":"Orange"},{"v":1,"color":"Green"},{"v":2,"color":"Green"},{"v":25,"color":"Red"},{"v":36,"color":"Red"},{"v":3,"color":"Green"},{"v":2,"color":"Green"},{"v":1,"color":"Green"}]')
// 		})
// 		it(`should exclude rows whose column 'color' equals Red OR 'v' is lower than 6`, () => {
// 			const startingDT = new DataTable([
// 				{ v: 1, color: "Green" },
// 				{ v: 5, color: "Orange" },
// 				{ v: 1, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 25, color: "Red" },
// 				{ v: 36, color: "Red" },
// 				{ v: 7, color: "Orange" },
// 				{ v: 3, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 1, color: "Green" }])
// 			const filteredDT = startingDT.filter({
// 				filter: {
// 					filters: [
// 						{ negated: true, fieldName: "v", operator: "less_than", value: 6 },
// 						{ negated: true, fieldName: "color", operator: "equals", value: "Red" }
// 					],
// 					combinator: "AND"
// 				}
// 			})
// 			assert.strictEqual(JSON.stringify([...filteredDT.rowObjects]), '[{"v":7,"color":"Orange"}]')
// 		})
// 		it(`should exclude rows whose column 'color' equals "Orange" AND 'v' is higher than 6`, () => {
// 			const startingDT = new DataTable([
// 				{ v: 1, color: "Green" },
// 				{ v: 5, color: "Orange" },
// 				{ v: 1, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 25, color: "Red" },
// 				{ v: 36, color: "Red" },
// 				{ v: 7, color: "Orange" },
// 				{ v: 3, color: "Green" },
// 				{ v: 2, color: "Green" },
// 				{ v: 1, color: "Green" }])
// 			const filteredDT = startingDT
// 				.filter({
// 					filter: {
// 						filters: [
// 							{ negated: true, fieldName: "v", operator: "greater_than", value: 6 },
// 							{ negated: true, fieldName: "color", operator: "equals", value: "Orange" }
// 						], combinator: "OR"
// 					}
// 				})
// 			assert.strictEqual(JSON.stringify([...filteredDT.rowObjects]), '[{"v":1,"color":"Green"},{"v":5,"color":"Orange"},{"v":1,"color":"Green"},{"v":2,"color":"Green"},{"v":25,"color":"Red"},{"v":36,"color":"Red"},{"v":3,"color":"Green"},{"v":2,"color":"Green"},{"v":1,"color":"Green"}]')
// 		})
// 		it(`should return the original rows after filtering if the original scope is required`, () => {
// 			const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
// 			const filteredDT = startingDT
// 				.filter({ filter: { fieldName: "v", negated: false, operator: "less_than", value: 4 } })
// 				.filter({ filter: { filters: [], combinator: "AND" }, options: { scope: "original" } })
// 			assert.strictEqual(filteredDT.length, 10)
// 		})
// 		/*it(`should discard original rows with the regular filter function`, () => {
// 			const startingDT = new DataTable([
// 				{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }
// 			])
// 			const filteredDT = startingDT
// 				.filter({ filter: { fieldName: "v", negated: false, operator: "less_than", value: 4 } })
// 				.filter({ filter: { filters: [], combinator: "AND" } })
// 			assert.strictEqual(filteredDT.length, 4)
// 		})*/
// 	})
// 	describe("paging", () => {
// 		it(`should return the first rows if page() is called without any sorting or filtering`, () => {
// 			const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
// 			const pagedDT = startingDT.page({ size: 5, index: 0 })
// 			assert.strictEqual(JSON.stringify(pagedDT.idVector), "[0,1,2,3,4]")
// 		})
// 		it(`should return the first rows starting at the desired index`, () => {
// 			const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
// 			const pagedDT = startingDT.page({ size: 3, index: 2 })
// 			assert.strictEqual(JSON.stringify([...pagedDT.rowObjects]), '[{"v":7},{"v":8},{"v":9}]')
// 		})
// 		it(`should return all rows if page() is called with more available rows than in the data source`, () => {
// 			const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
// 			const pagedDT = startingDT.page({ size: 25, index: 0 })
// 			assert.strictEqual(pagedDT.length, 10)
// 		})
// 		it(`should return the original rows if page (original) is called several time in a row`, () => {
// 			const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
// 			const pagedDT = startingDT
// 				.page({ size: 4, index: 0, options: { scope: "original" } })
// 				.page({ size: 10, index: 0, options: { scope: "original" } })
// 			assert.strictEqual(pagedDT.length, 10)
// 		})
// 		it(`should discard original rows with the regular page function`, () => {
// 			const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
// 			const pagedDT = startingDT
// 				.page({ size: 4, index: 0 })
// 				.page({ size: 10, index: 0 })
// 			assert.strictEqual(pagedDT.length, 4)
// 		})
// 	})
// 	describe("Combinations of paging, sorting and filtering", () => {
// 		it(`should return 5 rows, when we filtered 2 out (discard) then paged 5 (no discard)`, () => {
// 			const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
// 			const filteredDT = startingDT.filter({ filter: { fieldName: "v", negated: false, operator: "less_than", value: 8 } })
// 			const pagedDT = filteredDT.page({ size: 5, index: 0, options: { scope: "original" } })
// 			assert.strictEqual(pagedDT.length, 5)
// 		})
// 		/*it(`should return rows 10, 9, 8, 7, 6, 5 after sorting and paging`, () => {
// 			const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
// 			const sortedDT = startingDT.sort({ columnName: "v", order: "descending" })
// 			const pagedDT = sortedDT.page({ size: 5, index: 0 })
// 			assert.strictEqual(JSON.stringify([...pagedDT.rowObjects].map(r => r.v)), JSON.stringify([10, 9, 8, 7, 6]))
// 		})*/
// 		// it(`should return rows * after filtering, sorting and paging`, () => {
// 		// 	const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
// 		// 	const filteredDT = startingDT.filter({ filter: { negated: true, fieldName: "v", operator: "greater_than", value: 8 } })
// 		// 	const sortedDT = filteredDT.sort({ columnName: "v", order: "descending" })
// 		// 	const pagedDT = sortedDT.page({ size: 5, index: 0 })
// 		// 	assert.strictEqual(JSON.stringify([...pagedDT.rowObjects].map(r => r.v)), JSON.stringify([7, 6, 5, 4, 3]))
// 		// })
// 	})
// })
//# sourceMappingURL=containers.test.js.map