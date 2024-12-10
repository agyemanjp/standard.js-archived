import { it, describe } from "bun:test"
import assert from "assert"
import {
	type ExtractByType,
	type TypeAssert,
	type IsAny,
	type Merge1, type Merge2, type Merge3,
	hasValue, isArray, isIterable,
	isAsyncIterable
} from "../source"


describe('hasValue', function () {
	it('should return true for an empty array', function () {
		assert.equal(hasValue([]), true)
	})
	it('should return true for a non-empty array', function () {
		assert.equal(hasValue([1, 2, 3]), true)
	})
	it('should return false for an empty string', function () {
		assert.equal(hasValue("", "deep"), false)
	})
	it('should return false for a whitespace string', function () {
		assert.equal(hasValue(" ", "deep"), false)
		assert.equal(hasValue(`
		`, "deep"), false)
		assert.equal(hasValue("		", "deep"), false)
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
		assert.equal(hasValue(NaN, "deep"), false)
		assert.equal(hasValue(Number.NaN, "deep"), false)
	})
})

describe("isArray", () => {
	it("should work for a union of an array and a primitive", () => {
		// eslint-disable-next-line no-constant-condition
		const val = true ? [1, 2, 3] : ""
		if (isArray(val)) {
			// test type
			/** @type Array<number> */
			const x = val

			assert.ok(Array.isArray(x))
		}
	})
	it("should work for a union of an array and a primitive", () => {
		// eslint-disable-next-line no-constant-condition
		const val = true ? [1, 2, 3] : [""]
		if (isArray(val)) {
			// test type
			/** @type Array<number> | Array<string> */
			const x = val

			assert.ok(Array.isArray(x))
		}
	})
})

describe("isIterable", () => {
	it("should return false for a string, if the excludeString argument is effectively true", () => {
		assert.strictEqual(isIterable("/dashboard"), false)
		assert.strictEqual(isIterable(" ", true), false)
		assert.strictEqual(isIterable(""), false)
		assert.strictEqual(isIterable("\n"), false)
	})

	it("should return false for an object, whether empty or not", () => {
		assert.strictEqual(isIterable({
			"/": (x: number) => true,
			"/splash": (x: number) => x > 0,
			"/dashboard": (x: number) => isNaN(x)
		}), false)

		assert.strictEqual(isIterable({}), false)
	})

	it("should return true for an array, whether empty or not", () => {
		assert.strictEqual(isIterable([1, 4, 2]), true)
		assert.strictEqual(isIterable([]), true)
	})

	it("should return true for a generator, even if it yields nothing", () => {
		assert.strictEqual(isIterable((function* () { yield 1; yield 2 })()), true)
		assert.strictEqual(isIterable((function* () { })()), true)
	})
})


//#region Type tests
describe("IsAny", () => {
	it("should reliably check for whether a type is any", () => {
		// type IsAny<T> = ((Exclude<any, T> extends (never) ? 1 : 0) extends (0 | 1)
		// 	? (0 | 1) extends (Exclude<any, T> extends never ? 1 : 0)
		// 	? "false"
		// 	: "true"
		// 	: "true"
		// )

		const test_any_any: IsAny<(any)> = "true"
		const test_any_union: IsAny<(string | undefined)> = "false"
		const test_any_never: IsAny<(never)> = "false"
		const test_any_undefined: IsAny<(undefined)> = "false"
		const test_any_obj: IsAny<({})> = "false"
		const test_any_num: IsAny<(number)> = "false"
		const test_any_arr: IsAny<(Array<any>)> = "false"
		const test_any_tuple: IsAny<[number, Array<any>]> = "false"
		const test_any_tuple_unknown: IsAny<[unknown, any]> = "false"

		const test_any_unknown: IsAny<(unknown)> = "true"
		const test_any_unknown_union: IsAny<(number | unknown)> = "true"

		assert.ok(true)
	})

})

describe("TypeAssert", () => {
	it("should return 'true' for identical union types", () => {
		const test_1: TypeAssert<string | bigint, string | bigint> = "true"
		const test_2: TypeAssert<string | {} | bigint, {} | string | bigint> = "true"
		assert.ok(true)
	})
	it("should return 'false' for non-identical union types", () => {
		const test: TypeAssert<string | bigint, string | boolean> = "false"
		const test1: TypeAssert<string | undefined, boolean | undefined> = "false"
		assert.ok(true)
	})
	it("should return 'false' when comparing a non-union type with a union type", () => {
		const test: TypeAssert<string, string | bigint> = "false"
		assert.ok(true)
	})
	it("should return 'true' when both types are <any>", () => {
		const test: TypeAssert<any, any> = "true"
		assert.ok(true)
	})
	it("should return 'true' when both types are <unknown>", () => {
		const test: TypeAssert<unknown, unknown> = "true"
		assert.ok(true)
	})
	it("should return 'true' when both types are <never>", () => {
		const test: TypeAssert<never, never> = "true"
		assert.ok(true)
	})
	it("should return 'false' when one type extends the other but they are not identical", () => {
		const test: TypeAssert<Array<any>, Iterable<any>> = "false"
		assert.ok(true)
	})
	it("should return 'false' when comparing <any> to another (non-union) type", () => {
		const test: TypeAssert<any, { str: "" }> = "false"
		const test_0: TypeAssert<any, RegExp> = "false"
		const test_5: TypeAssert<any, Array<any>> = "false"
		const test_6: TypeAssert<any, []> = "false"
		const test_1: TypeAssert<number, any> = "false"
		// const test_2: TypeAssert<unknown, any> = "false"
		// const test_3: TypeAssert<any, unknown> = "false"
		const test_4: TypeAssert<any, never> = "false"

		assert.ok(true)
	})
	it("should return 'false' when comparing <any> to another union type", () => {

		const test_1: TypeAssert<string | number, any> = "false"
		const test_2: TypeAssert<number[] | undefined, any> = "false"
		const test_3: TypeAssert<never[] | undefined, any> = "false"
		const test_4: TypeAssert<any, never[] | undefined> = "false"
		const test_5: TypeAssert<{} | number, any> = "false"
		// const test_6: TypeAssert<any, any | any> = "false"


		assert.ok(true)
	})
	it("should return 'false' when comparing <never> to another type", () => {
		const test: TypeAssert<never, {}> = "false"
		const test_1: TypeAssert<never, unknown> = "false"
		const test_2: TypeAssert<never, string> = "false"
		const test_3: TypeAssert<number, never> = "false"
		const test_4: TypeAssert<never, object> = "false"
		assert.ok(true)
	})
})

describe("ExtractByType", () => {
	it("should return only those properties that have the desired type", () => {
		const obj = { str: "", num: 1, b: true, arr: [1, 2, 3], o: { x: null } }
		const test_1: TypeAssert<ExtractByType<typeof obj, string>, { str: string }> = "true"
		const test_2: TypeAssert<ExtractByType<typeof obj, number>, { str: "" }> = "false"
		const test_3: TypeAssert<ExtractByType<typeof obj, number>, { num: number }> = "true"

		assert.ok(true)
	})
	it("should return all properties if extracted property type is <any>", () => {
		const obj = { str: "", num: 1, b: true, arr: [1, 2, 3], o: { x: null } }
		const test_1: TypeAssert<ExtractByType<typeof obj, any>, typeof obj> = "true"
		assert.ok(true)
	})
	it("should return an empty object if extracted property type is <unknown>", () => {
		const obj = { str: "", num: 1, b: true, arr: [1, 2, 3], o: { x: null } }
		const test: TypeAssert<ExtractByType<typeof obj, unknown>, {}> = "true"
		assert.ok(true)
	})
	it("should return only properties that have the desired string literal type", () => {
		const obj = { str: "" as const, num: 1, b: true, arr: [1, 2, 3], o: { x: null } }
		const test: TypeAssert<ExtractByType<typeof obj, "">, { str: "" }> = "true"

		assert.ok(true)
	})
	it("should return only properties that have the desired numeric literal type", () => {
		const obj = { str: "" as const, num: 1 as const, b: true, arr: [1, 2, 3], o: { x: null } }
		const test: TypeAssert<ExtractByType<typeof obj, 1>, { num: 1 }> = "true"
		assert.ok(true)
	})
})

describe("Merge", () => {
	it("should return the argument value if passed a single argument", () => {
		const test: TypeAssert<Merge1<{ str: "str", num: 3 }>, { str: "str", num: 3 }> = "true"
		const test_1: TypeAssert<Merge1<string>, string> = "true"
		const test_2: TypeAssert<Merge1<any>, any> = "true"
		const test_3: TypeAssert<Merge1<2>, 2> = "true"

		assert.ok(true)
	})
	it("should overwrite undefined properties upstream", () => {
		const test: TypeAssert<Merge2<{ str: "str", num: undefined }, { str: "abc", num: 3 }>, { str: "abc", num: 3 }> = "true"
		assert.ok(true)
	})
	it("should overwrite first argument is any of the arguments are primitive", () => {
		// const test_1: TypeAssert<Merge2<{ str: "str", num: undefined }, 2>, 2> = "true"
		// const test_2: TypeAssert<Merge3<"abc", { str: "str", num: undefined }, 2>, 2> = "true"

		assert.ok(true)
	})
})

describe("IsIterable", () => {
	let union: (
		| never
		| null
		| undefined
		| boolean
		| symbol
		| number
		| BigInt
		| RegExp
		| string[]
		| Set<string>
		| Map<symbol, string>
		| Generator<bigint>
		| Iterator<number>
		| Record<'a' | 'b', boolean>
		| 1
		| AsyncIterable<object>
	)

	if (isIterable(union)) {
		const test: TypeAssert<
			typeof union,
			string[] | Set<string> | Map<symbol, string> | Generator<bigint, any, unknown> //| AsyncIterable<object>
		> = "true"
	}
	assert.ok(true)
})

describe("IsAsyncIterable", () => {
	let union: (
		| never
		| null
		| undefined
		| boolean
		| symbol
		| number
		| BigInt
		| RegExp
		| string[]
		| Set<string>
		| Map<symbol, string>
		| Generator<bigint>
		| Iterator<number>
		| Record<'a' | 'b', boolean>
		| 1
		| AsyncIterable<object>
	)

	if (isAsyncIterable(union)) {
		const test: TypeAssert<typeof union, AsyncIterable<object>> = "true"
	}
	assert.ok(true)
})

/* const testMerge2: TypeAssert<Merge2<{ str: "str", num: 3 }, { str: "abc", num: undefined }>, { str: "abc", num: 3 }> = "true"

	const testMerge2_1: TypeAssert<Merge2<"c", "str">, "str"> = "true"

	const testMerge3: TypeAssert<Merge3<"", { str: "str" }, { str: undefined, num: 1 }>, { str: "str", num: 1 }> = "true"

	const testMerge3_1: TypeAssert<Merge3<{}, {}, { str: "num" }>, { str: "num" }> = "true"

	const test_TypeAssert_Any: TypeAssert<any, { str: "num" }> = "false"
*/

//#endregion