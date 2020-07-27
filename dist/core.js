"use strict";
/* eslint-disable fp/no-rest-parameters */
/* eslint-disable fp/no-mutation */
/* eslint-disable fp/no-unused-expression */
/* eslint-disable brace-style */
/* eslint-disable fp/no-loops */
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasValue = exports.getComparer = exports.getRanker = exports.compare = exports.flatten = exports.sum = exports.last = exports.first = exports.chunk = exports.indexesOf = exports.complement = exports.except = exports.intersection = exports.union = exports.unique = exports.forEach = exports.zip = exports.every = exports.some = exports.filter = exports.map = exports.reduce = exports.skip = exports.take = exports.Tuple = void 0;
exports.Tuple = class {
    constructor(x, y) {
        return [x, y];
    }
};
//#region Iterable/Collection functions
function* take(iterable, n) {
    if (typeof n !== "number")
        throw new Error(`Invalid type ${typeof n} for argument "n"\nMust be number`);
    if (n < 0)
        throw new Error(`Invalid value ${n} for argument "n"\nMust be zero or positive number`);
    if (n > 0) {
        for (const element of iterable) {
            yield element;
            if (--n <= 0)
                break;
        }
    }
}
exports.take = take;
function* skip(iterable, n) {
    if (typeof n !== "number")
        throw new Error(`Invalid type ${typeof n} for argument "n"\nMust be number`);
    if (n < 0)
        throw new Error(`Invalid value ${n} for argument "n"\nMust be zero or positive number`);
    for (const element of iterable) {
        if (n === 0)
            yield element;
        else
            n--;
    }
}
exports.skip = skip;
function* reduce(iterable, initial, reducer) {
    for (const element of iterable) {
        initial = reducer(initial, element);
        yield initial;
    }
}
exports.reduce = reduce;
function* map(iterable, projector) {
    for (const element of iterable) {
        yield projector(element);
    }
}
exports.map = map;
function* filter(iterable, predicate) {
    for (const element of iterable) {
        if (predicate(element))
            yield element;
        else
            continue;
    }
}
exports.filter = filter;
function some(iterable, predicate) {
    for (const elt of iterable) {
        if (predicate(elt) === true)
            return true;
    }
    return false;
}
exports.some = some;
function every(iterable, predicate) {
    for (const elt of iterable) {
        if (predicate(elt) === false)
            return false;
    }
    return true;
}
exports.every = every;
/** Turns n iterables into an iterable of n-tuples
 * The shortest iterable determines the length of the result
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, fp/no-rest-parameters, @typescript-eslint/no-explicit-any
function zip(...iterables) {
    console.assert(iterables.every(iter => typeof iter[Symbol.iterator] === "function"));
    const iterators = iterables.map(i => i[Symbol.iterator]());
    // eslint-disable-next-line fp/no-let
    let done = false;
    return {
        [Symbol.iterator]() { return this; },
        next() {
            if (!done) {
                const items = iterators.map(i => i.next());
                // eslint-disable-next-line fp/no-mutation
                done = items.some(item => item.done);
                if (!done) {
                    return { value: items.map(i => i.value), done: false };
                }
                // Done for the first time: close all iterators
                for (const iterator of iterators) {
                    if (iterator.return)
                        iterator.return();
                }
            }
            // We are done
            return { done: true, value: [] };
        }
    };
}
exports.zip = zip;
function forEach(iterable, action) {
    for (const element of iterable) {
        // eslint-disable-next-line fp/no-unused-expression
        action(element);
    }
}
exports.forEach = forEach;
function* unique(iterable) {
    const seen = new Set();
    outer: for (const element of iterable) {
        if (seen.has(element))
            continue outer;
        else {
            // eslint-disable-next-line fp/no-unused-expression
            seen.add(element);
        }
        // eslint-disable-next-line fp/no-unused-expression
        yield element;
    }
}
exports.unique = unique;
function union(collections) {
    return unique((function* () {
        for (const collection of collections) {
            for (const element of collection) {
                yield element;
            }
        }
    })());
}
exports.union = union;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function intersection(collections) {
    throw new Error(`Not Implemented`);
}
exports.intersection = intersection;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function except(src, exclusions) {
    throw new Error(`Not Implemented`);
}
exports.except = except;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function complement(target, universe) {
    throw new Error(`Not Implemented`);
}
exports.complement = complement;
function indexesOf(collection, target) {
    return 'value' in target
        ? map(filter(collection, kv => kv[1] === target.value), kv => kv[0])
        : map(filter(collection, kv => target.predicate(kv[1])), kv => kv[0]);
}
exports.indexesOf = indexesOf;
function* chunk(arr, chunkSize) {
    const batch = [...take(arr, chunkSize)];
    if (batch.length) {
        // eslint-disable-next-line fp/no-unused-expression
        yield batch;
        // eslint-disable-next-line fp/no-unused-expression
        yield* chunk(skip(arr, chunkSize), chunkSize);
    }
}
exports.chunk = chunk;
/** Get first element (or first element to satisfy a predicate, if supplied) of this sequence
 * @param predicate Optional predicate to filter elements
 * @returns First element, or <undefined> if such an element is not found
 */
function first(iterable, predicate) {
    for (const element of iterable) {
        if (predicate === undefined || predicate(element))
            return element;
    }
    return undefined;
}
exports.first = first;
/** Get last element (or last element to satisfy optional predicate argument) of this sequence
 * @param predicate Optional predicate to filter elements
 * @returns Last element as defined, or <undefined> if such an element is not found
 */
function last(collection, predicate) {
    // eslint-disable-next-line fp/no-let
    if ('length' in collection) {
        // Array-specific implementation of last() for better performance using direct elements access
        // eslint-disable-next-line fp/no-let
        for (let i = collection.length - 1; i >= 0; i--) {
            const element = collection.get(i);
            if (predicate === undefined || predicate(element))
                return element;
        }
        return undefined;
    }
    else {
        // eslint-disable-next-line fp/no-let
        let _last = undefined;
        const iterable = predicate === undefined ? collection : filter(collection, predicate);
        for (const element of iterable) {
            _last = element;
        }
        return _last;
    }
}
exports.last = last;
function sum(iterable) {
    var _a;
    return (_a = last(reduce(iterable, 0, (prev, curr) => prev + curr))) !== null && _a !== void 0 ? _a : 0;
}
exports.sum = sum;
function* flatten(nestedIterable) {
    for (const element of nestedIterable) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (hasValue(element) && typeof element[Symbol.iterator] === 'function')
            yield* flatten(element);
        else
            yield element;
    }
}
exports.flatten = flatten;
//#endregion
//#region Comparison Functions
function compare(x, y, comparer, tryNumeric = false) {
    // eslint-disable-next-line fp/no-let
    let _x = comparer ? comparer(x) : x;
    // eslint-disable-next-line fp/no-let
    let _y = comparer ? comparer(y) : y;
    if (typeof _x === "string" && typeof _y === "string") {
        if (tryNumeric === true) {
            const __x = parseFloat(_x);
            const __y = parseFloat(_y);
            if ((!Number.isNaN(__x)) && (!Number.isNaN(__y))) {
                return __x - __y;
            }
        }
        return new Intl.Collator().compare(_x || "", _y || "");
    }
    else if (typeof _x === "number" && typeof _y === "number") {
        return (_x || 0) - (_y || 0);
    }
    else if (_x instanceof Date && _y instanceof Date) {
        _x = _x || new Date();
        _y = _y || new Date();
        if (_x > _y)
            return 1;
        else if (_x === _y)
            return 0;
        else
            return -1;
    }
    else
        return _x === _y ? 0 : 1;
}
exports.compare = compare;
function getRanker(args) {
    //console.log(`generating comparer, try numeric is ${tryNumeric}, reversed is ${reverse} `)
    return (x, y) => {
        return compare(x, y, args.projector, args.tryNumeric) * (args.reverse === true ? -1 : 1);
    };
}
exports.getRanker = getRanker;
function getComparer(projector, tryNumeric = false /*, reverse = false*/) {
    //console.log(`generating comparer, try numeric is ${tryNumeric}, reversed is ${reverse} `)
    return (x, y) => {
        return compare(x, y, projector, tryNumeric) === 0;
    };
}
exports.getComparer = getComparer;
//#endregion
//#region General functions
function hasValue(value) {
    if (typeof value === "undefined")
        return false;
    if (value === undefined)
        return false;
    if (value === null)
        return false;
    const str = String(value);
    if (str.trim().length === 0)
        return false;
    if (/^\s*$/.test(str))
        return false;
    //if(str.replace(/\s/g,"") == "") return false
    return true;
}
exports.hasValue = hasValue;
//#endregion
//# sourceMappingURL=core.js.map