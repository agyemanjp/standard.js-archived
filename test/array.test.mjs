/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable fp/no-unused-expression */

//@ts-check

//@ts-ignore
import assert from "assert"
import mocha from "mocha"
const { describe, it } = mocha
import containers from "../dist/collections/containers/index.js"
import iterable from "../dist/collections/iterable.js"

const { Array } = containers

describe("Array", () => {
	it("should be equivalent to global array for empty arrays", () => {
		assert.deepEqual([], [...new Array([])])
	})
	it("should be equivalent to global array when contructing it from an iterator", () => {
		const actual = [...new Array(iterable.flatten([
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

		const actual2 = [...new Array(iterable.flatten([
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
})

