import { it, describe } from "bun:test";
import assert from "assert";
import { hasValue, isArray, isIterable, isAsyncIterable } from "../source";
describe('hasValue', function () {
    it('should return true for an empty array', function () {
        assert.equal(hasValue([]), true);
    });
    it('should return true for a non-empty array', function () {
        assert.equal(hasValue([1, 2, 3]), true);
    });
    it('should return false for an empty string', function () {
        assert.equal(hasValue("", "deep"), false);
    });
    it('should return false for a whitespace string', function () {
        assert.equal(hasValue(" ", "deep"), false);
        assert.equal(hasValue(`
		`, "deep"), false);
        assert.equal(hasValue("		", "deep"), false);
    });
    it('should return true for a non-empty string', function () {
        assert.equal(hasValue("abc"), true);
    });
    it('should return true for the boolean value "false"', function () {
        assert.equal(hasValue(false), true);
    });
    it('should return true for a function', function () {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        assert.equal(hasValue(() => { }), true);
    });
    it('should return true for an empty object', function () {
        assert.equal(hasValue({}), true);
    });
    it('should return true for a symbol', function () {
        // eslint-disable-next-line no-undef
        assert.equal(hasValue(Symbol()), true);
    });
    it('should return false for the value "undefined"', function () {
        assert.equal(hasValue(undefined), false);
    });
    it('should return true for the number "0"', function () {
        assert.equal(hasValue(0), true);
    });
    it('should return false for the number "NaN"', function () {
        assert.equal(hasValue(NaN, "deep"), false);
        assert.equal(hasValue(Number.NaN, "deep"), false);
    });
});
describe("isArray", () => {
    it("should work for a union of an array and a primitive", () => {
        // eslint-disable-next-line no-constant-condition
        const val = true ? [1, 2, 3] : "";
        if (isArray(val)) {
            // test type
            /** @type Array<number> */
            const x = val;
            assert.ok(Array.isArray(x));
        }
    });
    it("should work for a union of an array and a primitive", () => {
        // eslint-disable-next-line no-constant-condition
        const val = true ? [1, 2, 3] : [""];
        if (isArray(val)) {
            // test type
            /** @type Array<number> | Array<string> */
            const x = val;
            assert.ok(Array.isArray(x));
        }
    });
});
describe("isIterable", () => {
    it("should return false for a string, if the excludeString argument is effectively true", () => {
        assert.strictEqual(isIterable("/dashboard"), false);
        assert.strictEqual(isIterable(" ", true), false);
        assert.strictEqual(isIterable(""), false);
        assert.strictEqual(isIterable("\n"), false);
    });
    it("should return false for an object, whether empty or not", () => {
        assert.strictEqual(isIterable({
            "/": (x) => true,
            "/splash": (x) => x > 0,
            "/dashboard": (x) => isNaN(x)
        }), false);
        assert.strictEqual(isIterable({}), false);
    });
    it("should return true for an array, whether empty or not", () => {
        assert.strictEqual(isIterable([1, 4, 2]), true);
        assert.strictEqual(isIterable([]), true);
    });
    it("should return true for a generator, even if it yields nothing", () => {
        assert.strictEqual(isIterable((function* () { yield 1; yield 2; })()), true);
        assert.strictEqual(isIterable((function* () { })()), true);
    });
});
//#region Type tests
describe("IsAny", () => {
    it("should reliably check for whether a type is any", () => {
        // type IsAny<T> = ((Exclude<any, T> extends (never) ? 1 : 0) extends (0 | 1)
        // 	? (0 | 1) extends (Exclude<any, T> extends never ? 1 : 0)
        // 	? "false"
        // 	: "true"
        // 	: "true"
        // )
        const test_any_any = "true";
        const test_any_union = "false";
        const test_any_never = "false";
        const test_any_undefined = "false";
        const test_any_obj = "false";
        const test_any_num = "false";
        const test_any_arr = "false";
        const test_any_tuple = "false";
        const test_any_tuple_unknown = "false";
        const test_any_unknown = "true";
        const test_any_unknown_union = "true";
        assert.ok(true);
    });
});
describe("TypeAssert", () => {
    it("should return 'true' for identical union types", () => {
        const test_1 = "true";
        const test_2 = "true";
        assert.ok(true);
    });
    it("should return 'false' for non-identical union types", () => {
        const test = "false";
        const test1 = "false";
        assert.ok(true);
    });
    it("should return 'false' when comparing a non-union type with a union type", () => {
        const test = "false";
        assert.ok(true);
    });
    it("should return 'true' when both types are <any>", () => {
        const test = "true";
        assert.ok(true);
    });
    it("should return 'true' when both types are <unknown>", () => {
        const test = "true";
        assert.ok(true);
    });
    it("should return 'true' when both types are <never>", () => {
        const test = "true";
        assert.ok(true);
    });
    it("should return 'false' when one type extends the other but they are not identical", () => {
        const test = "false";
        assert.ok(true);
    });
    it("should return 'false' when comparing <any> to another (non-union) type", () => {
        const test = "false";
        const test_0 = "false";
        const test_5 = "false";
        const test_6 = "false";
        const test_1 = "false";
        // const test_2: TypeAssert<unknown, any> = "false"
        // const test_3: TypeAssert<any, unknown> = "false"
        const test_4 = "false";
        assert.ok(true);
    });
    it("should return 'false' when comparing <any> to another union type", () => {
        const test_1 = "false";
        const test_2 = "false";
        const test_3 = "false";
        const test_4 = "false";
        const test_5 = "false";
        // const test_6: TypeAssert<any, any | any> = "false"
        assert.ok(true);
    });
    it("should return 'false' when comparing <never> to another type", () => {
        const test = "false";
        const test_1 = "false";
        const test_2 = "false";
        const test_3 = "false";
        const test_4 = "false";
        assert.ok(true);
    });
});
describe("ExtractByType", () => {
    it("should return only those properties that have the desired type", () => {
        const obj = { str: "", num: 1, b: true, arr: [1, 2, 3], o: { x: null } };
        const test_1 = "true";
        const test_2 = "false";
        const test_3 = "true";
        assert.ok(true);
    });
    it("should return all properties if extracted property type is <any>", () => {
        const obj = { str: "", num: 1, b: true, arr: [1, 2, 3], o: { x: null } };
        const test_1 = "true";
        assert.ok(true);
    });
    it("should return an empty object if extracted property type is <unknown>", () => {
        const obj = { str: "", num: 1, b: true, arr: [1, 2, 3], o: { x: null } };
        const test = "true";
        assert.ok(true);
    });
    it("should return only properties that have the desired string literal type", () => {
        const obj = { str: "", num: 1, b: true, arr: [1, 2, 3], o: { x: null } };
        const test = "true";
        assert.ok(true);
    });
    it("should return only properties that have the desired numeric literal type", () => {
        const obj = { str: "", num: 1, b: true, arr: [1, 2, 3], o: { x: null } };
        const test = "true";
        assert.ok(true);
    });
});
describe("Merge", () => {
    it("should return the argument value if passed a single argument", () => {
        const test = "true";
        const test_1 = "true";
        const test_2 = "true";
        const test_3 = "true";
        assert.ok(true);
    });
    it("should overwrite undefined properties upstream", () => {
        const test = "true";
        assert.ok(true);
    });
    it("should overwrite first argument is any of the arguments are primitive", () => {
        // const test_1: TypeAssert<Merge2<{ str: "str", num: undefined }, 2>, 2> = "true"
        // const test_2: TypeAssert<Merge3<"abc", { str: "str", num: undefined }, 2>, 2> = "true"
        assert.ok(true);
    });
});
describe("IsIterable", () => {
    let union;
    if (isIterable(union)) {
        const test = "true";
    }
    assert.ok(true);
});
describe("IsAsyncIterable", () => {
    let union;
    if (isAsyncIterable(union)) {
        const test = "true";
    }
    assert.ok(true);
});
/* const testMerge2: TypeAssert<Merge2<{ str: "str", num: 3 }, { str: "abc", num: undefined }>, { str: "abc", num: 3 }> = "true"

    const testMerge2_1: TypeAssert<Merge2<"c", "str">, "str"> = "true"

    const testMerge3: TypeAssert<Merge3<"", { str: "str" }, { str: undefined, num: 1 }>, { str: "str", num: 1 }> = "true"

    const testMerge3_1: TypeAssert<Merge3<{}, {}, { str: "num" }>, { str: "num" }> = "true"

    const test_TypeAssert_Any: TypeAssert<any, { str: "num" }> = "false"
*/
//#endregion
//# sourceMappingURL=common.test.js.map