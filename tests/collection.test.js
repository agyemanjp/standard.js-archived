import { it, describe } from "bun:test";
import assert from "assert";
import { map, flatten, chunk, take, skip, first, firstAsync, last, reduce, reduceAsync, negate, flat } from "../source";
describe('flatten()', function () {
    it('should return a result that excludes empty arrays', function () {
        const actual = [...flatten([
                [{
                        "path": "src/check-general.schema.json",
                        "message": "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to override.",
                        "start_line": 0,
                        "end_line": 0,
                        "annotation_level": "warning"
                    }], [], [], [], []
            ])];
        const expected = [{
                "path": "src/check-general.schema.json",
                "message": "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to override.",
                "start_line": 0,
                "end_line": 0,
                "annotation_level": "warning"
            }];
        assert.deepStrictEqual(actual, expected);
    });
    it('should treat strings as primitives, not iterables', function () {
        const actual = [...flatten([["annotation"], ["simplicity"]])];
        const expected = ["annotation", "simplicity"];
        assert.deepStrictEqual(actual, expected);
    });
    it('should be able to handle null or undefined elements inside input iterables', function () {
        assert.doesNotThrow(() => {
            const actual = [...flatten([["annotation"], [undefined, 1, null, [undefined]], ["simplicity"]])];
            const expected = ["annotation", undefined, 1, null, undefined, "simplicity"];
            assert.deepStrictEqual(actual, expected);
        });
    });
    it('should be able to handle null or undefined elements among other input iterables', function () {
        assert.doesNotThrow(() => {
            const actual = [...flatten([["annotation"], null, undefined, ["simplicity"]])];
            const expected = ["annotation", null, undefined, "simplicity"];
            assert.deepStrictEqual(actual, expected);
        });
    });
});
describe('flat()', function () {
    it('should return a result that excludes empty arrays', function () {
        const actual = [...flat([
                [{
                        "path": "src/check-general.schema.json",
                        "message": "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to override.",
                        "start_line": 0,
                        "end_line": 0,
                        "annotation_level": "warning"
                    }], [], [], [], []
            ])];
        const expected = [{
                "path": "src/check-general.schema.json",
                "message": "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to override.",
                "start_line": 0,
                "end_line": 0,
                "annotation_level": "warning"
            }];
        assert.deepStrictEqual(actual, expected);
    });
    it('should treat strings as primitives, not iterables', function () {
        const actual = [...flat([["annotation"], ["simplicity"]])];
        const expected = ["annotation", "simplicity"];
        assert.deepStrictEqual(actual, expected);
    });
    it('should be able to handle null or undefined elements inside input iterables', function () {
        assert.doesNotThrow(() => {
            const actual = [...flat([["annotation"], [undefined, 1, null, [undefined]], ["simplicity"]])];
            const expected = ["annotation", undefined, 1, null, undefined, "simplicity"];
            assert.deepStrictEqual(actual, expected);
        });
    });
    it('should be able to handle null or undefined elements among other input iterables', function () {
        assert.doesNotThrow(() => {
            const actual = [...flat([["annotation"], null, undefined, ["simplicity"]])];
            const expected = ["annotation", null, undefined, "simplicity"];
            assert.deepStrictEqual(actual, expected);
        });
    });
});
// eslint-disable-next-line mocha/max-top-level-suites
describe('take()', function () {
    it('should return array with length equal to the smaller of input array length and take count', function () {
        assert.deepStrictEqual([...take([10, 20, 30, 40], 7)], [10, 20, 30, 40]);
        assert.deepStrictEqual([...take([10, 20, 30, 40], 2)], [10, 20]);
    });
    it('should return empty array for an input empty array', function () {
        assert.deepStrictEqual([...take([], 7)], []);
    });
    it('should return empty array for take count of 0', function () {
        assert.deepStrictEqual([...take([5, 2, 3, 1], 0)], []);
    });
    it('should return empty array for negative take count', function () {
        assert.deepStrictEqual([...take([5, 2, 3, 1], -3)], []);
    });
    it('should be idempotent for pure iterables', function () {
        const arr = [10, 20, 99, 3, 30, 40];
        assert.deepStrictEqual([...take(arr, 4)], [...take(arr, 4)]);
    });
});
describe('skip()', function () {
    it('should skip over no items if skip count is 0', function () {
        assert.deepStrictEqual([...skip([10, 20, 30, 40], 0)], [10, 20, 30, 40]);
    });
    it('should skip over no items if skip count is negative', function () {
        assert.deepStrictEqual([...skip([10, 20, 30, 40], -2)], [10, 20, 30, 40]);
    });
    it('should return empty collection if skip count equals the length of collection', function () {
        assert.deepStrictEqual([...skip([10, 30, 20, 40], 4)], []);
    });
    it('should return empty collection if skip count exceeds length of collection', function () {
        assert.deepStrictEqual([...skip([10, 30, 20, 40], 7)], []);
    });
    it('should skip over the correct number of items', function () {
        assert.deepStrictEqual([...skip([5, 2, 3, 1, 7], 3)], [1, 7]);
    });
    it('should be idempotent for pure iterables', function () {
        const arr = [10, 20, 99, 3, 30, 40];
        assert.deepStrictEqual([...skip(arr, 4)], [...skip(arr, 4)]);
    });
});
describe('first()', function () {
    it('should return first element when passed an infinite iterable', function () {
        const iterable = (function* () { let seed = Number.MAX_SAFE_INTEGER; while (true)
            yield seed--; })();
        assert.deepStrictEqual(first(iterable), Number.MAX_SAFE_INTEGER);
    });
    it('should return first element when passed a finite iterable', function () {
        assert.deepStrictEqual(first((function* () { yield 3; yield 6; yield 1; })()), 3);
        assert.deepStrictEqual(first(["e", "u", "r", "e", "k", "a"]), "e");
        const f = { num: 1 };
        assert.deepStrictEqual(first([f, { str: "x" }, "a"]), f);
    });
    it('should throw an error when passed an empty collection', function () {
        assert.throws(() => first((function* () { })()));
        assert.throws(() => first([]));
    });
    it('should throw an error when first element cannot be found', function () {
        assert.throws(() => first((function* () { yield 1; yield 2; yield 3; })(), x => x <= 0));
        assert.throws(() => first(["eureka", "hello"], x => x === "me"));
    });
    it('should be idempotent for pure iterables', function () {
        const arr = [10, 20, 99, 3, 30, 40];
        assert.deepStrictEqual(first(arr), first(arr));
    });
});
describe('last()', function () {
    it('should return last element when passed a finite iterable', function () {
        assert.deepStrictEqual(last((function* () { yield 3; yield 6; yield 1; })()), 1);
        assert.deepStrictEqual(last(["e", "u", "r", "e", "k", "a"]), "a");
        const obj = { num: 1 };
        assert.deepStrictEqual(last(["f", { str: "x" }, "a", obj]), obj);
    });
    it('should throw an error when passed an empty collection', function () {
        assert.throws(() => last((function* () { })()));
        assert.throws(() => last([]));
    });
    it('should throw an error when last element cannot be found', function () {
        assert.throws(() => last((function* () { yield 1; yield 2; yield 3; })(), x => x <= 0));
        assert.throws(() => last(["eureka", "hello"], x => x === "me"));
    });
    it('should be idempotent for pure iterables', function () {
        const arr = [10, 20, 99, 3, 30, 40];
        assert.deepStrictEqual(last(arr), last(arr));
    });
});
describe('reduce() & reduceAsync', function () {
    it('should yield initial value as first item, even if input collection is empty', async function () {
        const iterable = (function* () { while (true)
            yield 1; })();
        assert.deepStrictEqual(first(reduce(iterable, 53, (prev, curr) => prev + curr)), 53);
        assert.deepStrictEqual(await firstAsync(reduceAsync(iterable, 53, async (prev, curr) => prev + curr)), 53);
        assert.deepStrictEqual([...reduce([], 7, (prev, curr) => 123)], [7]);
        assert.deepStrictEqual([...reduce([], null, (prev, curr) => curr)], [null]);
        assert.deepStrictEqual([...reduce([], undefined, (prev, curr) => curr)], [undefined]);
    });
    it('should yield only first item if passed an empty iterable', async function () {
        assert.deepStrictEqual([...reduce([], "hello", (prev, curr) => prev + curr)].length, 1);
        assert.deepStrictEqual([...reduce([], 7, (prev, curr) => prev + curr)].length, 1);
        assert.deepStrictEqual([...reduce([], null, (prev, curr) => curr)].length, 1);
        const r = [...reduce([], 46, (prev, curr) => prev + curr)];
        assert.deepStrictEqual(last(r), first(r));
        assert.deepStrictEqual(r.length, 1);
    });
    it('should yield the correct successive reduced values', function () {
        assert.deepStrictEqual([...reduce((function* () { yield 1; yield 2; yield 3; })(), 53, (p, c) => p + c)], [53, 54, 56, 59]);
        assert.deepStrictEqual([...reduce((function* () { yield "e"; yield "ll"; yield "o"; })(), "h", (p, c) => p + c)], ['h', 'he', 'hell', "hello"]);
        assert.deepStrictEqual([...reduce((function* () { yield null; yield 2; })(), "undefined", (_, c) => typeof c)], ["undefined", "object", "number"]);
    });
    it('should be idempotent for pure iterables', function () {
        const arr = [10, 20, 99, 3, 30, 40];
        assert.deepStrictEqual([...reduce(arr, 4, () => null)], [...reduce(arr, 4, () => null)]);
    });
});
describe('chunk()', function () {
    it('should return empty array when given empty array', function () {
        assert.deepStrictEqual([...chunk([], 50)], []);
    });
    it('should return a one-element array for an input array of length less than chunk size', function () {
        const actual = [...chunk([{
                    "path": "src/check-general.schema.json",
                    "message": "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to override.",
                    "start_line": 0,
                    "end_line": 0,
                    "annotation_level": "warning"
                }], 50)];
        const expected = [[{
                    "path": "src/check-general.schema.json",
                    "message": "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to override.",
                    "start_line": 0,
                    "end_line": 0,
                    "annotation_level": "warning"
                }]];
        assert.deepStrictEqual(actual, expected);
    });
});
describe('map()', function () {
    it('should return empty array when given empty array', function () {
        assert.deepStrictEqual([...map([], x => x)], []);
    });
    it('should work on objects', function () {
        const obj = {
            "/": (x) => true,
            "/splash": (x) => x > 0,
            "/dashboard": (x) => isNaN(x)
        };
        const actual = map(obj, (fn) => negate(fn));
        assert(actual);
        assert.deepStrictEqual(Object.keys(actual).length, 3);
        assert.deepStrictEqual(Object.keys(actual), ["/", "/splash", "/dashboard"]);
        assert(Object.values(actual).every(x => typeof x === "function"));
        assert.deepStrictEqual(Object.values(actual)[0](0), false);
        assert.deepStrictEqual(map({ a: 'first', b: 32 }, (value, key) => `${key}-${value}`), { a: 'a-first', b: 'b-32' });
        assert.deepStrictEqual(map({}, () => { }), {});
    });
});
//# sourceMappingURL=collection.test.js.map