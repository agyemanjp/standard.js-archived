"use strict";
/* eslint-disable fp/no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const core_1 = require("./core");
describe('hasValue()', function () {
    it('should return true for an empty array', function () {
        assert.equal(core_1.hasValue([]), true);
    });
    it('should return true for a non-empty array', function () {
        assert.equal(core_1.hasValue([1, 2, 3]), true);
    });
    it('should return false for an empty string', function () {
        assert.equal(core_1.hasValue(""), false);
    });
    it('should return false for a whitespace string', function () {
        assert.equal(core_1.hasValue(" "), false);
        assert.equal(core_1.hasValue(`
		`), false);
        assert.equal(core_1.hasValue("		"), false);
    });
    it('should return true for a non-empty string', function () {
        assert.equal(core_1.hasValue("abc"), true);
    });
    it('should return true for the boolean value "false"', function () {
        assert.equal(core_1.hasValue(false), true);
    });
    it('should return true for a function', function () {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        assert.equal(core_1.hasValue(() => { }), true);
    });
    it('should return true for an empty object', function () {
        assert.equal(core_1.hasValue({}), true);
    });
    it('should return true for a symbol', function () {
        assert.equal(core_1.hasValue(Symbol()), true);
    });
    it('should return false for the value "undefined"', function () {
        assert.equal(core_1.hasValue(undefined), false);
    });
    it('should return true for the number "0"', function () {
        assert.equal(core_1.hasValue(0), true);
    });
    it('should return false for the number "NaN"', function () {
        assert.equal(core_1.hasValue(NaN), false);
        assert.equal(core_1.hasValue(Number.NaN), false);
    });
});
