"use strict";
/* eslint-disable brace-style */
/* eslint-disable fp/no-unused-expression */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable fp/no-class */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sequence = void 0;
const combinators_1 = require("./combinators");
/** Lazy collection of elements accessed sequentially, not known in advance */
class Sequence {
    // eslint-disable-next-line fp/no-nil, fp/no-mutation
    constructor(iterable) { this._iterable = iterable; }
    ctor(iterable) { return new Sequence(iterable); }
    [Symbol.iterator]() { return this._iterable[Symbol.iterator](); }
    /** Convert to another iterable container type */
    to(container) { return container([...this]); }
    take(n) { return this.ctor(combinators_1.take(this, n)); }
    skip(n) { return this.ctor(combinators_1.skip(this, n)); }
    /** Get first element (or first element to satisfy a predicate, if supplied) of this sequence
     * @param predicate Optional predicate to filter elements
     * @returns First element, or <undefined> if such an element is not found
     */
    first(predicate) { return combinators_1.first(this, predicate); }
    /** Get last element (or last element to satisfy optional predicate argument) of this sequence
     * @param predicate Optional predicate to filter elements
     * @returns Last element as defined, or <undefined> if such an element is not found
     */
    last(predicate) { return combinators_1.last(this, predicate); }
    filter(predicate) { return this.ctor(combinators_1.filter(this, predicate)); }
    map(projector) { return new Sequence(combinators_1.map(this, projector)); }
    reduce(initial, reducer) { return new Sequence(combinators_1.reduce(this, initial, reducer)); }
    forEach(action) { return combinators_1.forEach(this, action); }
    /** Generate sequence of integers */
    static integers(args) {
        return new Sequence((function* () {
            // eslint-disable-next-line fp/no-let
            let num = args.from;
            // eslint-disable-next-line fp/no-loops
            do {
                // eslint-disable-next-line fp/no-mutation
                yield ("to" in args ? args.to >= args.from : args.direction === "upwards") ? num++ : num--;
            } while ("direction" in args || args.from !== args.to);
        })());
    }
    static fromRange(from, to, opts) {
        if (opts) {
            if (opts.mode === "width" && opts.width <= 0)
                throw new Error("width must be positive non-zero number");
            if (opts.mode === "count" && opts.count <= 0)
                throw new Error("count must be positive non-zero number");
        }
        const diff = to - from;
        const sign = to >= from ? 1 : -1;
        const delta = opts === undefined
            ? sign
            : opts.mode === "width"
                ? (opts.width * sign)
                : diff / opts.count;
        const length = Math.floor(diff / delta) + 1;
        return new Sequence((function* () {
            // eslint-disable-next-line fp/no-let, fp/no-loops, fp/no-mutation
            for (let index = 0; index < length; index++) {
                // eslint-disable-next-line fp/no-mutating-methods
                yield (from + (index * delta));
            }
        })());
    }
}
exports.Sequence = Sequence;
/* export class stdTupleSequence<T> extends Sequence<[string, T]> {
    toDictionary<X>() {
        return Dictionary.fromKeyValues([...this])
    }
}*/ 
