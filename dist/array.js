"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stdArrayNumeric = exports.stdArray = void 0;
/* eslint-disable brace-style */
const core_1 = require("./core");
const set_1 = require("./set");
const number_1 = require("./number");
/** Eager, ordered, material collection */
class stdArray extends set_1.stdSet {
    constructor(elements) {
        // eslint-disable-next-line fp/no-unused-expression
        super(elements);
        this._array = undefined;
        this._map = undefined;
        this.core = ((me) => {
            return Object.assign(Object.assign({}, super.core), { get map() {
                    if (me._map === undefined) {
                        // eslint-disable-next-line fp/no-mutation
                        me._map = new global.Map([...me._iterable].entries());
                    }
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    return me._map;
                },
                get array() {
                    if (me._array === undefined) {
                        // eslint-disable-next-line fp/no-mutation
                        me._array = global.Array.from([...me._iterable]);
                    }
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    return me._array;
                } });
        })(this);
    }
    ctor(elements) {
        return new stdArray(elements);
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
    entries() { return new stdArray(this.core.array.entries()); }
    /** Get unique items in this array
     * ToDo: Implement use of comparer in the include() call
     */
    unique() { return this.ctor(core_1.unique(this)); }
    /** Returns new array containing this array's elements in reverse order */
    // eslint-disable-next-line fp/no-mutating-methods
    reverse() { return this.ctor([...this].reverse()); }
    /** Array-specific implementation of map() */
    map(projector) {
        return new stdArray(core_1.map(this, projector));
    }
}
exports.stdArray = stdArray;
class stdArrayNumeric extends stdArray {
    ctor(iterable) { return new stdArrayNumeric(iterable); }
    /*static fromRange(from: number, to: number): ArrayNumeric {
        let _difference = to - from;
        let _length = Math.abs(_difference);
        let _sign = _difference / _length;
        let _index = 0;
        let _value = from;
        let _arr = new Vector<number>([_length])
        while (true) {
            _arr[_index++] = _value;
            if (_value === to)
                break;
            _value += _sign;
        }
        return new ArrayNumeric(_arr)
    }*/
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
    map(projector) {
        // eslint-disable-next-line fp/no-let
        let notNumeric = false;
        const newArr = core_1.map(this, val => {
            const newVal = projector(val);
            if (typeof newVal !== "number" && typeof newVal !== "bigint")
                // eslint-disable-next-line fp/no-mutation
                notNumeric = true;
            return newVal;
        });
        return notNumeric
            ? new stdArray(newArr)
            : new stdArrayNumeric(newArr);
    }
    mean(exclusions) {
        if (exclusions) {
            if (exclusions.meanOriginal) {
                const len = this.size;
                const validExcludedValues = new stdArrayNumeric(exclusions.excludedIndices.filter(index => number_1.stdNumber.isNumber(this.get(index))));
                const excludedSum = validExcludedValues.sum();
                const excludedLen = validExcludedValues.size;
                return (exclusions.meanOriginal - (1.0 * excludedSum / len)) * (1.0 * len / (len - excludedLen));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const arr = [...this].filter((item, index) => !exclusions.excludedIndices.includes(index));
                return new stdArrayNumeric(arr).mean();
            }
        }
        else {
            return this.sum() / this.size;
        }
    }
    variance(mean, forSample = true) {
        if (this.size === 1)
            return 0;
        const _mean = mean || this.mean();
        if (_mean === undefined)
            return undefined;
        return this.map(datum => Math.pow(datum - _mean, 2)).sum() / (this.size - (forSample ? 1 : 0));
    }
    deviation(args) {
        const forSample = args && args.forSample === false ? false : true;
        const excludedIndices = args && typeof args.mean === "object"
            ? args.mean.excludeIndices
            : undefined;
        const mean = args && typeof args.mean === "number"
            ? args.mean
            : this.mean(excludedIndices ? { excludedIndices: excludedIndices } : undefined);
        const variance = this.variance(mean, forSample);
        return variance ? Math.sqrt(variance) : undefined;
    }
    // eslint-disable-next-line fp/no-nil
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    sum() { return this.reduce(0, (x, y) => x + y).last() || 0; }
}
exports.stdArrayNumeric = stdArrayNumeric;
//# sourceMappingURL=array.js.map