/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable fp/no-unused-expression */

//@ts-check

import mocha from "mocha"
// @ts-ignore
import assert from "assert"
import utility from "../dist/utility.js"

const { describe, it } = mocha
const { hasValue, isArr } = utility

describe('hasValue()', function () {
	it('should return true for an empty array', function () {
		assert.equal(hasValue([]), true)
	})
	it('should return true for a non-empty array', function () {
		assert.equal(hasValue([1, 2, 3]), true)
	})
	it('should return false for an empty string', function () {
		assert.equal(hasValue(""), false)
	})
	it('should return false for a whitespace string', function () {
		assert.equal(hasValue(" "), false)
		assert.equal(hasValue(`
		`), false)
		assert.equal(hasValue("		"), false)
	})
	it('should return true for a non-empty string', function () {
		assert.equal(hasValue("abc"), true)
	})
	it('should return true for the boolean value "false"', function () {
		assert.equal(hasValue(false), true)
	})
	it('should return true for a function', function () {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		assert.equal(hasValue(() => { }), true)
	})
	it('should return true for an empty object', function () {
		assert.equal(hasValue({}), true)
	})
	it('should return true for a symbol', function () {
		// eslint-disable-next-line no-undef
		assert.equal(hasValue(Symbol()), true)
	})
	it('should return false for the value "undefined"', function () {
		assert.equal(hasValue(undefined), false)
	})
	it('should return true for the number "0"', function () {
		assert.equal(hasValue(0), true)
	})
	it('should return false for the number "NaN"', function () {
		assert.equal(hasValue(NaN), false)
		assert.equal(hasValue(Number.NaN), false)
	})
})

describe("isArray", () => {
	it("should work for a union of an array and a primitive", () => {
		// eslint-disable-next-line no-constant-condition
		const val = true ? [1, 2, 3] : ""
		if (isArr(val)) {
			// test type
			/** @type Array<number> */
			const x = val

			assert.ok(Array.isArray(x))
		}
	})


	it("should work for a union of an array and a primitive", () => {
		// eslint-disable-next-line no-constant-condition
		const val = true ? [1, 2, 3] : [""]
		if (isArr(val)) {
			// test type
			/** @type Array<number> | Array<string> */
			const x = val

			assert.ok(Array.isArray(x))
		}
	})

})

/*
describe("Number Regex", function () {
	var re = new RegExp("^(" + numberReSnippet + ")$")
	it("Matches Java and JavaScript numbers", function () {
		expect(re.test("1")).toBe(true)
		expect(re.test("0.2")).toBe(true)
		expect(re.test("0.4E4")).toBe(true)  // Java-style
		expect(re.test("-55")).toBe(true)
		expect(re.test("-0.6")).toBe(true)
		expect(re.test("-0.77E77")).toBe(true)
		expect(re.test("88E8")).toBe(true)
		expect(re.test("NaN")).toBe(true)
		expect(re.test("Infinity")).toBe(true)
		expect(re.test("-Infinity")).toBe(true)
		expect(re.test("1e+24")).toBe(true)  // JavaScript-style
	})
	it("Matches fractions with a leading decimal point", function () {
		expect(re.test(".3")).toBe(true)
		expect(re.test("-.3")).toBe(true)
		expect(re.test(".3e-4")).toBe(true)
	})
	it("Doesn't match non-numbers", function () {
		expect(re.test(".")).toBe(false)
		expect(re.test("9.")).toBe(false)
		expect(re.test("")).toBe(false)
		expect(re.test("E")).toBe(false)
		expect(re.test("e24")).toBe(false)
		expect(re.test("1e+24.5")).toBe(false)
		expect(re.test("-.Infinity")).toBe(false)
	})
})

describe('clone()', () => {
	describe('objects', () => {
		it('should shallow clone an array of primitives', () => {
			assert.deepEqual(clone(['alpha', 'beta', 'gamma']), ['alpha', 'beta', 'gamma']);
		});

		it('should shallow clone an array with varied elements', () => {
			const val = [0, 'a', {}, [{}], [function () { }], function () { }];
			assert.deepEqual(clone(val), val);
		});

		it('should clone Map', () => {
			const a = new Map([[1, 5]]);
			const b = clone(a);
			a.set(2, 4);
			assert.notDeepEqual(a, b);
		});

		it('should clone Set', () => {
			const a = new Set([2, 1, 3]);
			const b = clone(a);
			a.add(8);
			assert.notDeepEqual(a, b);
		});

		it('should shallow clone arrays', () => {
			assert(clone([1, 2, 3]) !== [1, 2, 3]);
			assert.deepEqual(clone([1, 2, 3]), [1, 2, 3]);
		});

		it('should shallow clone a regex with flags', () => {
			assert(clone(/foo/g) !== /foo/g);
			assert.deepEqual(clone(/foo/g), /foo/g);
		});

		it('should shallow clone a regex without any flags', () => {
			assert(clone(/foo/) !== /foo/);
			assert.deepEqual(clone(/foo/), /foo/);
		});

		it('should shallow clone a date', () => {
			const date = new Date();
			assert(clone(date) !== date);
			assert.deepEqual(clone(date), date);
		});

		it('should shallow clone objects', () => {
			assert.deepEqual(clone({ a: 1, b: 2, c: 3 }), { a: 1, b: 2, c: 3 });
		});

		it('should shallow clone an array of objects.', () => {
			const expected = [{ a: 0 }, { b: 1 }];
			const actual = clone(expected);

			assert(actual !== expected);
			assert.deepEqual(actual, expected);
			assert.deepEqual(actual[0], expected[0]);
		});
	});

	describe('primitives', () => {
		it('should return primitives', () => {
			assert.equal(clone(0), 0);
			assert.equal(clone(1), 1);
			assert.equal(clone('foo'), 'foo');
		});

		it('should clone symbols', () => {
			const val = { prop: Symbol() };
			const cloned = clone(val);
			assert.equal(typeof cloned.prop, 'symbol');
			assert.notEqual(cloned, val);
			assert.equal(cloned.prop, val.prop);
		});
	});
})
*/