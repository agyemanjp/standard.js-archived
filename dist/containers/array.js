"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stdArrayNumeric = exports.Array = void 0;
const combinators_1 = require("./combinators");
const set_1 = require("./set");
/** Eager, ordered, material collection */
class Array extends set_1.Set {
    constructor(elements) {
        // eslint-disable-next-line fp/no-unused-expression
        super(elements);
        this._array = undefined;
        this._map = undefined;
        this.core = ((me) => {
            return Object.assign(Object.assign({}, super.core), { get map() {
                    if (me._map === undefined) {
                        // eslint-disable-next-line fp/no-mutation
                        me._map = new globalThis.Map([...me._iterable].entries());
                    }
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    return me._map;
                },
                get array() {
                    if (me._array === undefined) {
                        // eslint-disable-next-line fp/no-mutation
                        me._array = globalThis.Array.from([...me._iterable]);
                    }
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    return me._array;
                } });
        })(this);
    }
    ctor(elements) {
        return new Array(elements);
    }
    get length() { return this.core.array.length; }
    get size() { return this.length; }
    get(selection) {
        if (typeof selection === "number") {
            if (selection < 0 || selection >= this.length)
                throw new Error(`Array index ${selection} out of bounds`);
            return this.core.array[selection];
        }
        else {
            // eslint-disable-next-line fp/no-unused-expression
            console.warn(`Array get() selection arg type: ${typeof selection}`);
            return [...selection].map(index => this.get(index));
        }
    }
    /** Get the indexes where a value occurs or a certain predicate/condition is met */
    indexesOf(args) {
        return 'value' in args
            ? this.entries().filter(kv => kv[1] === args.value).map(kv => kv[0])
            : this.entries().filter(kv => args.predicate(kv[1]) === true).map(kv => kv[0]);
    }
    entries() { return new Array(this.core.array.entries()); }
    /** Get unique items in this array
     * ToDo: Implement use of comparer in the include() call
     */
    unique() { return this.ctor(combinators_1.unique(this)); }
    /** Returns new array containing this array's elements in reverse order */
    // eslint-disable-next-line fp/no-mutating-methods
    reverse() { return this.ctor([...this].reverse()); }
    /** Array-specific implementation of map() */
    map(projector) {
        return new Array(combinators_1.map(this, projector));
    }
}
exports.Array = Array;
class stdArrayNumeric extends Array {
    ctor(iterable) { return new stdArrayNumeric(iterable); }
    min() {
        return this
            .reduce(undefined, (prev, curr) => (prev === undefined || curr < prev) ? curr : prev)
            .last();
    }
    max() {
        return this
            .reduce(undefined, (prev, curr) => (prev === undefined || curr > prev) ? curr : prev)
            .last();
    }
    mean() {
        if (this.length === 0)
            throw new Error(`Cannot calculate mean of empty array`);
        return this.sum() / this.size;
    }
    variance(mean /*optional already calculated mean */) {
        if (this.size === 1)
            return 0;
        const _mean = mean || this.mean();
        if (_mean === undefined)
            return undefined;
        return this.map(datum => Math.pow(datum - _mean, 2)).sum() / (this.size);
    }
    deviation() {
        const variance = this.variance(this.mean());
        return variance ? Math.sqrt(variance) : undefined;
    }
    median() {
        // eslint-disable-next-line fp/no-mutating-methods
        const _ordered = this.sort();
        if (_ordered.size % 2 === 1) {
            return _ordered.get(Math.floor(this.size / 2));
        }
        else {
            // eslint-disable-next-line no-shadow, @typescript-eslint/no-non-null-assertion
            const first = _ordered.get(Math.floor(_ordered.size / 2) - 1);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const second = _ordered.get(Math.floor(_ordered.size / 2));
            return (first + second) / 2;
        }
    }
    interQuartileRange() {
        // eslint-disable-next-line fp/no-mutating-methods
        const sortedList = this.sort();
        const percentile25 = sortedList.get(Math.floor(0.25 * sortedList.size));
        const percentile75 = sortedList.get(Math.ceil(0.75 * sortedList.size));
        return percentile25 && percentile75 ? percentile75 - percentile25 : undefined;
    }
    sum() { return this.reduce(0, (x, y) => x + y).last() || 0; }
    map(projector) {
        // eslint-disable-next-line fp/no-let
        let notNumeric = false;
        const newArr = combinators_1.map(this, val => {
            const newVal = projector(val);
            if (typeof newVal !== "number" && typeof newVal !== "bigint")
                // eslint-disable-next-line fp/no-mutation
                notNumeric = true;
            return newVal;
        });
        return notNumeric
            ? new Array(newArr)
            : new stdArrayNumeric(newArr);
    }
}
exports.stdArrayNumeric = stdArrayNumeric;
