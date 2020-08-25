/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable fp/no-unused-expression */

//@ts-check

//@ts-ignore
import assert from "assert"
import mocha from "mocha"
const { describe, it } = mocha
import containers from "../dist/collections/containers/index.js"

const { Array } = containers

describe("Array", () => {
	it("should be equivalent to global array for empty arrays", () => {
		assert.deepEqual([], [...new Array([])])

	})
})

