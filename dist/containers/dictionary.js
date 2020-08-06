"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dictionary = void 0;
/* eslint-disable brace-style */
const _types_1 = require("./_types");
const combinators_1 = require("./combinators");
const set_1 = require("./set");
/** Eager, un-ordered, material, indexed associative collection */
class Dictionary {
    // eslint-disable-next-line brace-style
    // eslint-disable-next-line fp/no-mutation
    constructor(obj) { this.obj = Object.freeze(Object.assign({}, obj)); }
    static fromKeyValues(keyValues) {
        const obj = {};
        // eslint-disable-next-line fp/no-mutation, fp/no-loops
        for (const kv of keyValues)
            obj[kv[0]] = kv[1];
        return new Dictionary(obj);
    }
    static fromArray(arr) {
        return Dictionary.fromKeyValues(arr.map((elt, i) => new _types_1.Tuple(i.toString(), elt)));
    }
    [Symbol.iterator]() { return this.entries()[Symbol.iterator](); }
    asObject() { return Object.assign({}, this.obj); }
    get size() { return this.keys().length; }
    /** TODO: Memoize this method? */
    keys() { return Object.keys(this.obj); }
    /** TODO: Memoize this method? */
    values() { return Object.values(this.obj); }
    /** Check whether this dictionary contains a specific key or value */
    has(arg) {
        return "key" in arg
            ? this.keys().includes(arg.key)
            : this.values().includes(arg.value);
    }
    /** TODO: Memoize this method? */
    entries() { return Object.entries(this.obj); }
    pick(keys) {
        const result = {};
        // eslint-disable-next-line fp/no-unused-expression, fp/no-mutation
        keys.forEach(k => result[k] = this.obj[k]);
        return new Dictionary(result);
    }
    omit(keys) {
        const result = this.asObject();
        // eslint-disable-next-line fp/no-unused-expression, fp/no-delete
        keys.forEach(k => delete result[k]);
        return new Dictionary(result);
    }
    map(projector) {
        const keyValues = this.entries().map(kv => new _types_1.Tuple(String(kv[0]), projector(kv[1], kv[0])));
        return Dictionary.fromKeyValues(keyValues);
    }
    reduce(initial, reducer) {
        return this.entries().reduce((prev, curr) => reducer(prev, curr[1], curr[0]), initial);
    }
    get(selector) { return this.obj[selector]; }
    getAll(selector) { return new set_1.Set(combinators_1.map(selector, index => this.obj[index])); }
    /** Get the indexes where a value occurs or a certain predicate/condition is met */
    indexesOf(args) {
        return 'value' in args
            ? this.entries().filter(kv => kv[1] === args.value).map(kv => kv[0])
            : this.entries().filter(kv => args.predicate(kv[1]) === true).map(kv => kv[0]);
    }
}
exports.Dictionary = Dictionary;
