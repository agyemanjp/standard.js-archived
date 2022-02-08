/* eslint-disable fp/no-unused-expression */
/* eslint-disable fp/no-mutating-methods */
import * as assert from "assert"
import { DataTable } from "../dist/collections/containers"

describe("Table", () => {
	describe("contruction", () => {
		it(`should be constructed from an array of rows`, () => {
			const dataTable = new DataTable([
				{ v: 1, color: "Green" },
				{ v: 5, color: "Orange" },
				{ v: 1, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 25, color: "Red" },
				{ v: 36, color: "Red" },
				{ v: 7, color: "Orange" },
				{ v: 3, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 1, color: "Green" }])

			assert.strictEqual(JSON.stringify([...dataTable.rowObjects]), '[{"v":1,"color":"Green"},{"v":5,"color":"Orange"},{"v":1,"color":"Green"},{"v":2,"color":"Green"},{"v":25,"color":"Red"},{"v":36,"color":"Red"},{"v":7,"color":"Orange"},{"v":3,"color":"Green"},{"v":2,"color":"Green"},{"v":1,"color":"Green"}]')
		})
		it(`should be constructed from columns`, () => {
			const dataTable = new DataTable({
				v: [1, 5, 1, 2, 25, 36, 7, 3, 2, 1],
				color: ["Green", "Orange", "Green", "Green", "Red", "Red", "Orange", "Green", "Green", "Green"]
			})

			assert.strictEqual(JSON.stringify([...dataTable.rowObjects]), '[{"v":1,"color":"Green"},{"v":5,"color":"Orange"},{"v":1,"color":"Green"},{"v":2,"color":"Green"},{"v":25,"color":"Red"},{"v":36,"color":"Red"},{"v":7,"color":"Orange"},{"v":3,"color":"Green"},{"v":2,"color":"Green"},{"v":1,"color":"Green"}]')
		})

		it(`should be constructed with an index indicating which rows to keep`, () => {
			const dataTable = new DataTable({
				v: [1, 5, 1, 2, 25, 36, 7, 3, 2, 1],
				color: ["Green", "Orange", "Green", "Green", "Red", "Red", "Orange", "Green", "Green", "Green"]
			}, [0, 1, 9])

			assert.strictEqual(JSON.stringify([...dataTable.rowObjects]), '[{"v":1,"color":"Green"},{"v":5,"color":"Orange"},{"v":1,"color":"Green"}]')
		})
	})

	describe("content access", () => {
		it(`should return enumerable row objects`, () => {
			const dataTable = new DataTable([
				{ v: 1, color: "Green" },
				{ v: 5, color: "Orange" },
				{ v: 1, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 25, color: "Red" },
				{ v: 36, color: "Red" },
				{ v: 7, color: "Orange" },
				{ v: 3, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 1, color: "Green" }])

			assert.strictEqual(JSON.stringify([...dataTable.rowObjects]), '[{"v":1,"color":"Green"},{"v":5,"color":"Orange"},{"v":1,"color":"Green"},{"v":2,"color":"Green"},{"v":25,"color":"Red"},{"v":36,"color":"Red"},{"v":7,"color":"Orange"},{"v":3,"color":"Green"},{"v":2,"color":"Green"},{"v":1,"color":"Green"}]')
		})
		it(`should return numbered enumerable row objects`, () => {
			const dataTable = new DataTable([
				{ v: 1, color: "Green" },
				{ v: 5, color: "Orange" },
				{ v: 1, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 25, color: "Red" },
				{ v: 36, color: "Red" },
				{ v: 7, color: "Orange" },
				{ v: 3, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 1, color: "Green" }])

			assert.strictEqual(JSON.stringify([...dataTable.rowObjectsNumbered][0]), '{"origRowNum":0,"sequentialRowNum":1,"v":1,"color":"Green"}')
		})
		it(`should return numbered enumerable row objects, original and sequential numbers being correct after filtering`, () => {
			const startingDT = new DataTable([
				{ v: 1, color: "Green" },
				{ v: 5, color: "Orange" },
				{ v: 1, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 25, color: "Red" },
				{ v: 36, color: "Red" },
				{ v: 7, color: "Orange" },
				{ v: 3, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 1, color: "Green" }])
			const filteredDT = startingDT
				.filter({ filter: { negated: true, fieldName: "v", operator: "less", value: 25 } })
			assert.strictEqual(JSON.stringify([...filteredDT.rowObjectsNumbered]), '[{"origRowNum":4,"sequentialRowNum":1,"v":25,"color":"Red"},{"origRowNum":5,"sequentialRowNum":2,"v":36,"color":"Red"}]')
		})
		it(`should return numbered enumerable row objects, original and sequential numbers being correct after filtering & sorting`, () => {
			const startingDT = new DataTable([
				{ v: 1, color: "Green" },
				{ v: 5, color: "Orange" },
				{ v: 1, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 25, color: "Red" },
				{ v: 36, color: "Red" },
				{ v: 7, color: "Orange" },
				{ v: 3, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 1, color: "Green" }])
			const filteredDT = startingDT
				.filter({ filter: { negated: true, fieldName: "v", operator: "less", value: 25 } })
				.sort({ columnName: "v", order: "descending" })
			assert.strictEqual(JSON.stringify([...filteredDT.rowObjectsNumbered]), '[{"origRowNum":5,"sequentialRowNum":1,"v":36,"color":"Red"},{"origRowNum":4,"sequentialRowNum":2,"v":25,"color":"Red"}]')
		})

		it(`should return a correct length and original length after sorting`, () => {
			const startingDT = new DataTable([
				{ v: 1, color: "Green" },
				{ v: 5, color: "Orange" },
				{ v: 1, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 25, color: "Red" },
				{ v: 36, color: "Red" },
				{ v: 7, color: "Orange" },
				{ v: 3, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 1, color: "Green" }])
			const filteredDT = startingDT
				.filter({ filter: { negated: true, fieldName: "v", operator: "less", value: 25 } })
				.sort({ columnName: "v", order: "descending" })
			assert.strictEqual(filteredDT.length, 2)
			assert.strictEqual(filteredDT.originalLength, 10)
		})
	})

	describe("utility functions", () => {
		it(`should values into other values`, () => {
			const startingDT = new DataTable([
				{ v: 1, color: "Green" },
				{ v: 5, color: "Orange" },
				{ v: 1, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 25, color: "Red" },
				{ v: 36, color: "Red" },
				{ v: 7, color: "Orange" },
				{ v: 3, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 1, color: "Green" }])
			const mappedDT = startingDT.map(cell => {
				return typeof cell === "string" && cell === "Green"
					? "Dark Green"
					: typeof cell === "number" && cell > 10
						? cell + 100
						: cell
			})
			assert.strictEqual(JSON.stringify([...mappedDT.rowObjects]), '[{"v":1,"color":"Dark Green"},{"v":5,"color":"Orange"},{"v":1,"color":"Dark Green"},{"v":2,"color":"Dark Green"},{"v":125,"color":"Red"},{"v":136,"color":"Red"},{"v":7,"color":"Orange"},{"v":3,"color":"Dark Green"},{"v":2,"color":"Dark Green"},{"v":1,"color":"Dark Green"}]')
		})

		it(`rowsToColumns`, () => {
			const columns = DataTable.rowsToColumns([
				{ v: 1, color: "Green" },
				{ v: 5, color: "Orange" },
				{ v: 1, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 25, color: "Red" },
				{ v: 36, color: "Red" },
				{ v: 7, color: "Orange" },
				{ v: 3, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 1, color: "Green" }])

			assert.strictEqual(JSON.stringify(columns), '{"v":[1,5,1,2,25,36,7,3,2,1],"color":["Green","Orange","Green","Green","Red","Red","Orange","Green","Green","Green"]}')
		})
	})

	describe("filtering", () => {

		it(`should return all rows when no filter is applied`, () => {
			const startingDT = new DataTable([
				{ v: 1, color: "Green" },
				{ v: 5, color: "Orange" },
				{ v: 1, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 25, color: "Red" },
				{ v: 36, color: "Red" },
				{ v: 7, color: "Orange" },
				{ v: 3, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 1, color: "Green" }])
			const filteredDT = startingDT
				.filter({})
			assert.strictEqual(JSON.stringify([...filteredDT.rowObjects]), '[{"v":1,"color":"Green"},{"v":5,"color":"Orange"},{"v":1,"color":"Green"},{"v":2,"color":"Green"},{"v":25,"color":"Red"},{"v":36,"color":"Red"},{"v":7,"color":"Orange"},{"v":3,"color":"Green"},{"v":2,"color":"Green"},{"v":1,"color":"Green"}]')
		})

		it(`should remove rows where the value of column 'v' is greater than 35`, () => {
			const startingDT = new DataTable([
				{ v: 1, color: "Green" },
				{ v: 5, color: "Orange" },
				{ v: 1, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 25, color: "Red" },
				{ v: 36, color: "Red" },
				{ v: 7, color: "Orange" },
				{ v: 3, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 1, color: "Green" }])
			const filteredDT = startingDT
				.filter({ filter: { negated: true, fieldName: "v", operator: "greater", value: 35 } })
			assert.strictEqual(JSON.stringify([...filteredDT.rowObjects]), '[{"v":1,"color":"Green"},{"v":5,"color":"Orange"},{"v":1,"color":"Green"},{"v":2,"color":"Green"},{"v":25,"color":"Red"},{"v":7,"color":"Orange"},{"v":3,"color":"Green"},{"v":2,"color":"Green"},{"v":1,"color":"Green"}]')
		})

		it(`should remove rows where the value of column 'v' is less than 25`, () => {
			const startingDT = new DataTable([
				{ v: 1, color: "Green" },
				{ v: 5, color: "Orange" },
				{ v: 1, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 25, color: "Red" },
				{ v: 36, color: "Red" },
				{ v: 7, color: "Orange" },
				{ v: 3, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 1, color: "Green" }])
			const filteredDT = startingDT
				.filter({ filter: { negated: true, fieldName: "v", operator: "less", value: 25 } })
			assert.strictEqual(JSON.stringify([...filteredDT.rowObjects]), '[{"v":25,"color":"Red"},{"v":36,"color":"Red"}]')
		})

		it(`should only include rows where the value of column 'v' is equal to 1`, () => {
			const startingDT = new DataTable([
				{ v: 1, color: "Green" },
				{ v: 5, color: "Orange" },
				{ v: 1, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 25, color: "Red" },
				{ v: 36, color: "Red" },
				{ v: 7, color: "Orange" },
				{ v: 3, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 1, color: "Green" }])
			const filteredDT = startingDT
				.filter({ filter: { negated: false, fieldName: "v", operator: "equal", value: 1 } })
			assert.strictEqual(JSON.stringify([...filteredDT.rowObjects]), '[{"v":1,"color":"Green"},{"v":1,"color":"Green"},{"v":1,"color":"Green"}]')
		})

		it(`should include rows where the value of column 'color' is equal to 'Red'`, () => {
			const startingDT = new DataTable([
				{ v: 1, color: "Green" },
				{ v: 5, color: "Orange" },
				{ v: 1, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 25, color: "Red" },
				{ v: 36, color: "Red" },
				{ v: 7, color: "Orange" },
				{ v: 3, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 1, color: "Green" }])
			const filteredDT = startingDT
				.filter({ filter: { negated: false, fieldName: "color", operator: "equal", value: "Red" } })
			assert.strictEqual(JSON.stringify([...filteredDT.rowObjects]), '[{"v":25,"color":"Red"},{"v":36,"color":"Red"}]')
		})

		it(`should remove rows where the value of column 'v' is greater or equal to 7`, () => {
			const startingDT = new DataTable([
				{ v: 1, color: "Green" },
				{ v: 5, color: "Orange" },
				{ v: 1, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 25, color: "Red" },
				{ v: 36, color: "Red" },
				{ v: 7, color: "Orange" },
				{ v: 3, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 1, color: "Green" }])
			const filteredDT = startingDT
				.filter({ filter: { negated: true, fieldName: "v", operator: "greater_or_equal", value: 7 } })
			assert.strictEqual(JSON.stringify([...filteredDT.rowObjects]), '[{"v":1,"color":"Green"},{"v":5,"color":"Orange"},{"v":1,"color":"Green"},{"v":2,"color":"Green"},{"v":3,"color":"Green"},{"v":2,"color":"Green"},{"v":1,"color":"Green"}]')
		})

		it(`should remove rows where the value of column 'v' is smaller or equal to 7`, () => {
			const startingDT = new DataTable([
				{ v: 1, color: "Green" },
				{ v: 5, color: "Orange" },
				{ v: 1, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 25, color: "Red" },
				{ v: 36, color: "Red" },
				{ v: 7, color: "Orange" },
				{ v: 3, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 1, color: "Green" }])
			const filteredDT = startingDT
				.filter({ filter: { negated: true, fieldName: "v", operator: "less_or_equal", value: 7 } })
			assert.strictEqual(JSON.stringify([...filteredDT.rowObjects]), '[{"v":25,"color":"Red"},{"v":36,"color":"Red"}]')
		})

		it(`should only include rows where the value of column 'color' contains string 'n'`, () => {
			const startingDT = new DataTable([
				{ v: 1, color: "Green" },
				{ v: 5, color: "Orange" },
				{ v: 1, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 25, color: "Red" },
				{ v: 36, color: "Red" },
				{ v: 7, color: "Orange" },
				{ v: 3, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 1, color: "Green" }])
			const filteredDT = startingDT
				.filter({ filter: { negated: false, fieldName: "color", operator: "contains", value: "n" } })
			assert.strictEqual(JSON.stringify([...filteredDT.rowObjects]), '[{"v":1,"color":"Green"},{"v":5,"color":"Orange"},{"v":1,"color":"Green"},{"v":2,"color":"Green"},{"v":7,"color":"Orange"},{"v":3,"color":"Green"},{"v":2,"color":"Green"},{"v":1,"color":"Green"}]')
		})

		it(`should only include rows where the value of column 'color' is contained in string 'InfraRed Laser'`, () => {
			const startingDT = new DataTable([
				{ v: 1, color: "Green" },
				{ v: 5, color: "Orange" },
				{ v: 1, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 25, color: "Red" },
				{ v: 36, color: "Red" },
				{ v: 7, color: "Orange" },
				{ v: 3, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 1, color: "Green" }])
			const filteredDT = startingDT
				.filter({ filter: { negated: false, fieldName: "color", operator: "is-contained", value: "InfraRed Laser" } })
			assert.strictEqual(JSON.stringify([...filteredDT.rowObjects]), '[{"v":25,"color":"Red"},{"v":36,"color":"Red"}]')
		})

		it(`should only include rows where the value of column 'color' starts with string 'Gre'`, () => {
			const startingDT = new DataTable([
				{ v: 1, color: "Green" },
				{ v: 5, color: "Orange" },
				{ v: 1, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 25, color: "Red" },
				{ v: 36, color: "Red" },
				{ v: 7, color: "Orange" },
				{ v: 3, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 1, color: "Green" }])
			const filteredDT = startingDT
				.filter({ filter: { negated: false, fieldName: "color", operator: "starts_with", value: "Gre" } })
			assert.strictEqual(JSON.stringify([...filteredDT.rowObjects]), '[{"v":1,"color":"Green"},{"v":1,"color":"Green"},{"v":2,"color":"Green"},{"v":3,"color":"Green"},{"v":2,"color":"Green"},{"v":1,"color":"Green"}]')
		})

		it(`should only include rows where the value of column 'color' ends with string 'ed'`, () => {
			const startingDT = new DataTable([
				{ v: 1, color: "Green" },
				{ v: 5, color: "Orange" },
				{ v: 1, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 25, color: "Red" },
				{ v: 36, color: "Red" },
				{ v: 7, color: "Orange" },
				{ v: 3, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 1, color: "Green" }])
			const filteredDT = startingDT
				.filter({ filter: { negated: false, fieldName: "color", operator: "ends_with", value: "ed" } })
			assert.strictEqual(JSON.stringify([...filteredDT.rowObjects]), '[{"v":25,"color":"Red"},{"v":36,"color":"Red"}]')
		})

		it(`should exclude rows where the value of column 'v' is blank`, () => {
			const startingDT = new DataTable([
				{ v: 1, color: "Green" },
				{ v: 5, color: "Orange" },
				{ v: 1, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 25, color: "Red" },
				{ v: 36, color: "Red" },
				{ v: null, color: "Orange" },
				{ v: 3, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 1, color: "Green" }])
			const filteredDT = startingDT
				.filter({ filter: { negated: true, fieldName: "v", operator: "blank", value: "" } })
			assert.strictEqual(JSON.stringify([...filteredDT.rowObjects]), '[{"v":1,"color":"Green"},{"v":5,"color":"Orange"},{"v":1,"color":"Green"},{"v":2,"color":"Green"},{"v":25,"color":"Red"},{"v":36,"color":"Red"},{"v":3,"color":"Green"},{"v":2,"color":"Green"},{"v":1,"color":"Green"}]')
		})

		it(`should exclude rows whose column 'color' equals Red OR 'v' is lower than 6`, () => {
			const startingDT = new DataTable([
				{ v: 1, color: "Green" },
				{ v: 5, color: "Orange" },
				{ v: 1, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 25, color: "Red" },
				{ v: 36, color: "Red" },
				{ v: 7, color: "Orange" },
				{ v: 3, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 1, color: "Green" }])
			const filteredDT = startingDT
				.filter({
					filter: {
						filters: [
							{ negated: true, fieldName: "v", operator: "less", value: 6 },
							{ negated: true, fieldName: "color", operator: "equal", value: "Red" }
						], combinator: "AND"
					}
				})
			assert.strictEqual(JSON.stringify([...filteredDT.rowObjects]), '[{"v":7,"color":"Orange"}]')
		})

		it(`should exclude rows whose column 'color' equals "Orange" AND 'v' is higher than 6`, () => {
			const startingDT = new DataTable([
				{ v: 1, color: "Green" },
				{ v: 5, color: "Orange" },
				{ v: 1, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 25, color: "Red" },
				{ v: 36, color: "Red" },
				{ v: 7, color: "Orange" },
				{ v: 3, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 1, color: "Green" }])
			const filteredDT = startingDT
				.filter({
					filter: {
						filters: [
							{ negated: true, fieldName: "v", operator: "greater", value: 6 },
							{ negated: true, fieldName: "color", operator: "equal", value: "Orange" }
						], combinator: "OR"
					}
				})
			assert.strictEqual(JSON.stringify([...filteredDT.rowObjects]), '[{"v":1,"color":"Green"},{"v":5,"color":"Orange"},{"v":1,"color":"Green"},{"v":2,"color":"Green"},{"v":25,"color":"Red"},{"v":36,"color":"Red"},{"v":3,"color":"Green"},{"v":2,"color":"Green"},{"v":1,"color":"Green"}]')
		})

		it(`should filter out the outliers correctly`, () => {
			const startingDT = new DataTable([
				{ v: 1, color: "Green" },
				{ v: 5, color: "Orange" },
				{ v: 1, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 25, color: "Red" },
				{ v: 36, color: "Red" },
				{ v: 7, color: "Orange" },
				{ v: 3, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 1, color: "Green" }])
			const filteredDT = startingDT
				.filter({ filter: { negated: true, fieldName: "v", operator: "is_outlier_by", value: 1 } })
			assert.strictEqual(filteredDT.length, 8)
			assert.strictEqual([...filteredDT.rowObjects].filter(row => row.color === "Red").length, 0)
		})
		it(`should remove outliers correctly with positive and negative values`, () => {
			const startingDT = new DataTable([
				{ v: -1, color: "Green" },
				{ v: 5, color: "Orange" },
				{ v: 1, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: -25, color: "Red" },
				{ v: 36, color: "Red" },
				{ v: 7, color: "Orange" },
				{ v: 3, color: "Green" },
				{ v: -2, color: "Green" },
				{ v: 1, color: "Green" }])
			const filteredDT = startingDT
				.filter({ filter: { negated: true, fieldName: "v", operator: "is_outlier_by", value: 1 } })
			assert.strictEqual(filteredDT.length, 8)
			assert.strictEqual([...filteredDT.rowObjects].filter(row => row.color === "Red").length, 0)
		})
		it(`should not remove the outliers when the number of standard deviation is too high`, () => {
			const startingDT = new DataTable([
				{ v: 1, color: "Green" },
				{ v: 5, color: "Orange" },
				{ v: 1, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 25, color: "Red" },
				{ v: 36, color: "Red" },
				{ v: 7, color: "Orange" },
				{ v: 3, color: "Green" },
				{ v: 2, color: "Green" },
				{ v: 1, color: "Green" }])
			const filteredDT = startingDT
				.filter({ filter: { negated: true, fieldName: "v", operator: "is_outlier_by", value: 5 } })
			assert.strictEqual(filteredDT.length, 10)
		})
		it(`should return the original rows after filtering if the original scope is required`, () => {
			const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
			const filteredDT = startingDT
				.filter({ filter: { fieldName: "v", negated: false, operator: "less_or_equal", value: 4 } })
				.filter({ filter: { filters: [], combinator: "AND" }, options: { scope: "original" } })
			assert.strictEqual(filteredDT.length, 10)
		})
		it(`should discard original rows with the regular filter function`, () => {
			const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
			const filteredDT = startingDT
				.filter({ filter: { fieldName: "v", negated: false, operator: "less_or_equal", value: 4 } })
				.filter({ filter: { filters: [], combinator: "AND" } })
			assert.strictEqual(filteredDT.length, 4)
		})
	})

	describe("paging", () => {
		it(`should return the first rows if page() is called without any sorting or filtering`, () => {
			const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
			const pagedDT = startingDT.page({ size: 5, index: 0 })
			assert.strictEqual(JSON.stringify(pagedDT.idVector), "[0,1,2,3,4]")
		})
		it(`should return the first rows starting at the desired index`, () => {
			const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
			const pagedDT = startingDT.page({ size: 3, index: 2 })
			assert.strictEqual(JSON.stringify([...pagedDT.rowObjects]), '[{"v":7},{"v":8},{"v":9}]')
		})
		it(`should return all rows if page() is called with more available rows than in the data source`, () => {
			const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
			const pagedDT = startingDT.page({ size: 25, index: 0 })
			assert.strictEqual(pagedDT.length, 10)
		})
		it(`should return the original rows if page (original) is called several time in a row`, () => {
			const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
			const pagedDT = startingDT
				.page({ size: 4, index: 0, options: { scope: "original" } })
				.page({ size: 10, index: 0, options: { scope: "original" } })
			assert.strictEqual(pagedDT.length, 10)
		})
		it(`should discard original rows with the regular page function`, () => {
			const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
			const pagedDT = startingDT
				.page({ size: 4, index: 0 })
				.page({ size: 10, index: 0 })
			assert.strictEqual(pagedDT.length, 4)
		})
	})

	describe("Combinations of paging, sorting and filtering", () => {
		it(`should return 5 rows, when we filtered 2 out (discard) then paged 5 (no discard)`, () => {
			const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
			const filteredDT = startingDT.filter({ filter: { fieldName: "v", negated: false, operator: "less_or_equal", value: 8 } })
			const pagedDT = filteredDT.page({ size: 5, index: 0, options: { scope: "original" } })
			assert.strictEqual(pagedDT.length, 5)
		})
		it(`should return rows 10, 9, 8, 7, 6, 5 after sorting and paging`, () => {
			const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
			const sortedDT = startingDT.sort({ columnName: "v", order: "descending" })
			const pagedDT = sortedDT.page({ size: 5, index: 0 })
			assert.strictEqual(JSON.stringify([...pagedDT.rowObjects].map(r => r.v)), JSON.stringify([10, 9, 8, 7, 6]))
		})
		it(`should return rows 7, 6, 5, 4, 3 after filtering, sorting and paging`, () => {
			const startingDT = new DataTable([{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 }])
			const filteredDT = startingDT.filter({ filter: { negated: true, fieldName: "v", operator: "greater_or_equal", value: 8 } })
			const sortedDT = filteredDT.sort({ columnName: "v", order: "descending" })
			const pagedDT = sortedDT.page({ size: 5, index: 0 })
			assert.strictEqual(JSON.stringify([...pagedDT.rowObjects].map(r => r.v)), JSON.stringify([7, 6, 5, 4, 3]))
		})
	})
})
