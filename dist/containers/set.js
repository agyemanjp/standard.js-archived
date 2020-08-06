"use strict";
/* eslint-disable brace-style */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Set = void 0;
const combinators_1 = require("./combinators");
const sequence_1 = require("./sequence");
const array_1 = require("./array");
/** Set of unique elements, known in advance, without any specific order */
class Set extends sequence_1.Sequence {
    constructor(elements /*, protected opts?: { comparer?: Comparer<X>, ranker?: Ranker<X> }*/) {
        // eslint-disable-next-line fp/no-unused-expression
        super(elements);
        this._set = undefined;
        this.core = ((me) => {
            return {
                get set() {
                    if (me._set === undefined) {
                        // set is created from array for performance reasons
                        // eslint-disable-next-line fp/no-mutation
                        me._set = new globalThis.Set(globalThis.Array.isArray(me._iterable)
                            ? me._iterable
                            : [...me._iterable]);
                    }
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    return me._set;
                },
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                get iterable() { return me._iterable; },
            };
        })(this);
    }
    ctor(iterable) { return new Set(iterable); }
    get size() { return this.core.set.size; }
    get length() { return this.size; }
    /** Synonym of this.contains */
    has(value) { return this.contains(value); }
    /** Synonym of this.contains */
    includes(value) { return this.contains(value); }
    /** Returns true if this array contains an element equal to value */
    contains(value) { return this.core.set.has(value); }
    some(predicate) { return combinators_1.some(this, predicate); }
    every(predicate) { return combinators_1.every(this, predicate); }
    map(projector) { return new Set(combinators_1.map(this, projector)); }
    union(collections) { return this.ctor(combinators_1.union([this, ...collections])); }
    intersection(collections) { return this.ctor(combinators_1.intersection(collections)); }
    except(collections) { return this.ctor(combinators_1.except(this, collections)); }
    complement(universe) { return combinators_1.complement([...this], universe); }
    // eslint-disable-next-line fp/no-mutating-methods
    sort(comparer) { return new array_1.Array([...this].sort(comparer)); }
    // eslint-disable-next-line fp/no-mutating-methods
    sortDescending(comparer) { return new array_1.Array([...this].sort(comparer).reverse()); }
}
exports.Set = Set;
