/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable fp/no-unused-expression */

import * as assert from "assert"
import { String } from "../dist/text/string.js"
import { CharASCII } from "../dist/text/char.js"


describe("plural", () => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
	it("should handles words ending in 'h' properly", () => {
		assert.strictEqual(new String("batch").plural().toString(), "batches")
	})

	it("should check whether is a whitespace or not", () => {
		const inputString = ""
		assert.equal(new String(inputString).isWhiteSpace(), true)
	})



})

describe("shorten()", () => {
	it(`should return an empty string when passing that same string with any max length input value`, (done) => {
		const testData = ["", "", 20]
		const maxLen = testData[2]
		const expectedTitle = testData[1]
		const newTitle = new String(testData[0] as string).shorten(maxLen as number).toString()

		assert.equal(newTitle, expectedTitle)
		done()
	})

	it(`should return only the first character of the input string plus an ellipsis when passed a max length between 1 and 4 and the string length is greater than the max length`, (done) => {
		const testData = ["Long Blink Experiment (1) Experiment", "L...", 1]
		const maxLen = testData[2]
		const expectedTitle = testData[1]
		const newTitle = new String(testData[0] as string).shorten(maxLen as number).toString()

		assert.equal(newTitle, expectedTitle)
		done()
	})

	it(`should return the start and end characters of the input string with an ellipsis between them when passed a max length equals to 5 and the string length is greater than the max length`, (done) => {
		const testData = ["Feature discovery by competitive learning Release 2.1", "F...1", 5]
		const maxLen = testData[2]
		const expectedTitle = testData[1]
		const newTitle = new String(testData[0] as string).shorten(maxLen as number).toString()

		assert.equal(newTitle, expectedTitle)
		done()
	})

	it(`should return the same input string when its length is less than the max lenght input value`, (done) => {
		const testData = ["Ignite Experiment", "Ignite Experiment", 20]
		const maxLen = testData[2]
		const expectedTitle = testData[1]
		const newTitle = new String(testData[0] as string).shorten(maxLen as number).toString()

		assert.equal(newTitle, expectedTitle)
		done()
	})
})

describe("isUrl()", () => {
	it(`should return true for valid URLs that start with 'www'`, () => {
		const expected = true
		const actual = new String("www.data.com/table.csv").isURL()
		assert.equal(actual, expected)
	})

	it(`should return true for valid URLs that start with neither 'http', 'https' or 'www' `, () => {
		const expected = true
		const actual = new String("gist.github.com").isURL()
		assert.equal(actual, expected)
	})

	it(`should return true for valid URLs that start with 'http'`, () => {
		const expected = true
		const actual = new String("http://gist.github.com").isURL()
		assert.equal(actual, expected)
	})

	it(`should return false for invalid URLs that start with 'https'`, () => {
		const expected = false
		const actual = new String("https:/gist.github.com").isURL()
		assert.equal(actual, expected)
	})

	it(`should return false for invalid URLs that start with 'http'`, () => {
		const expected = false
		const actual = new String("http//gist.github.com").isURL()
		assert.equal(actual, expected)
	})

	it(`should return false for invalid URLs that have no domain extension`, () => {
		const expected = false
		const actual = new String("http://test").isURL()
		assert.equal(actual, expected)
	})

	it(`should return false for empty URLs`, () => {
		const expected = false
		const actual = new String("").isURL()
		assert.equal(actual, expected)
	})

	it(`should return false for invalid URLs that start with special characters`, () => {
		const expected = false
		const actual = new String("http://www.*test.com").isURL()
		assert.equal(actual, expected)
	})

	it(`should return true for urls that contain a * character in the query after the domain name`, () => {
		const expected = true
		const actual = new String("https://en.wikipedia.org/w/api.php?format=json&origin=*&titles=P-value").isURL()
		assert.equal(actual, expected)
	})

	it(`should return true for urls that contain parentheses in the query after the domain name`, () => {
		const expected = true
		const actual = new String("https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=Mode_(statistics)").isURL()
		assert.equal(actual, expected)
	})

	it(`should return true for urls that contain non-alphanumeric characters`, () => {
		const expected = true
		const actual = new String("https://docs.google.com/document/d/17fF-U9mMalQiFEzJrsdXYyw7YNCv8ihKGnrIKyz0M-E/edit?ts=6015dedd").isURL()
		assert.equal(actual, expected)
	})

})

/* t.is(plur('unicorn', 0), 'unicorns');
	t.is(plur('unicorn', 1), 'unicorn');
	t.is(plur('unicorn', 2), 'unicorns');
	t.is(plur('unicorn', 'horse', 0), 'horse');
	t.is(plur('unicorn', 'horse', 1), 'unicorn');
	t.is(plur('unicorn', 'horse', 2), 'horse');
	t.is(plur('bus', 2), 'buses');
	t.is(plur('box', 2), 'boxes');
	t.is(plur('fizz', 2), 'fizzes');
	t.is(plur('batch', 2), 'batches');
	t.is(plur('bush', 2), 'bushes');
	t.is(plur('Bush', 2), 'Bushes');
	t.is(plur('guppy', 2), 'guppies');
	t.is(plur('UNICORN', 2), 'UNICORNS');
	t.is(plur('puppY', 2), 'puppIES');
	t.is(plur('man', 2), 'men');
	t.is(plur('woman', 2), 'women');
	t.is(plur('fish', 2), 'fish');
	t.is(plur('sheep', 2), 'sheep');
	t.is(plur('tooth', 2), 'teeth');
	t.is(plur('tomato', 2), 'tomatoes');
	t.is(plur('wife', 2), 'wives');
	t.is(plur('shelf', 2), 'shelves');
	t.is(plur('day', 2), 'days');
	t.is(plur('diy', 2), 'diys');
	t.is(plur('child', 2), 'children');
	t.is(plur('child', 1), 'child');
	t.is(plur('unicorn', -1), 'unicorn');
	t.is(plur('unicorn', -2), 'unicorns');
	t.is(plur('shelf', 1), 'shelf');
	t.is(plur('shelf', 2), 'shelves');
	t.is(plur('Shelf', 1), 'Shelf');
	t.is(plur('Shelf', 2), 'Shelves');
	t.is(plur('SHELF', 1), 'SHELF');
	t.is(plur('SHELF', 2), 'SHELVES');

*/