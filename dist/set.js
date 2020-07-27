"use strict";
/* eslint-disable brace-style */
Object.defineProperty(exports, "__esModule", { value: true });
exports.stdSet = void 0;
const core_1 = require("./core");
const sequence_1 = require("./sequence");
const array_1 = require("./array");
/** Set of elements, known in advance, without any order */
class stdSet extends sequence_1.stdSequence {
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
                        me._set = new global.Set(global.Array.isArray(me._iterable)
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
    ctor(iterable) { return new stdSet(iterable); }
    get size() { return this.core.set.size; }
    get length() { return this.size; }
    /** Synonym of this.contains */
    has(value) { return this.contains(value); }
    /** Synonym of this.contains */
    includes(value) { return this.contains(value); }
    /** Returns true if this array contains an element equal to value */
    contains(value) { return this.core.set.has(value); }
    some(predicate) { return core_1.some(this, predicate); }
    every(predicate) { return core_1.every(this, predicate); }
    map(projector) { return new stdSet(core_1.map(this, projector)); }
    union(collections) { return this.ctor(core_1.union([this, ...collections])); }
    intersection(collections) { return this.ctor(core_1.intersection(collections)); }
    except(collections) { return this.ctor(core_1.except(this, collections)); }
    complement(universe) { return core_1.complement([...this], universe); }
    // eslint-disable-next-line fp/no-mutating-methods
    sort(comparer) { return new array_1.stdArray([...this].sort(comparer)); }
    // eslint-disable-next-line fp/no-mutating-methods
    sortDescending(comparer) { return new array_1.stdArray([...this].sort(comparer).reverse()); }
}
exports.stdSet = stdSet;
//# sourceMappingURL=set.js.map