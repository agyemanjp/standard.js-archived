/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable fp/no-unused-expression */

import *as assert from "assert"
import { Array } from "../dist/collections/containers"
import { flatten } from "../dist/collections/iterable"

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
})

