"use strict";
/* eslint-disable indent */
/* eslint-disable fp/no-rest-parameters */
/* eslint-disable fp/no-mutation */
/* eslint-disable fp/no-unused-expression */
/* eslint-disable brace-style */
/* eslint-disable fp/no-loops */
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectMap = exports.objectEntries = exports.objectFromKeyValues = exports.objectKeys = exports.objectPick = exports.indexesOf = exports.complement = exports.except = exports.intersection = exports.union = exports.every = exports.some = exports.last = exports.first = exports.forEach = exports.flatten = exports.zip = exports.chunk = exports.unique = exports.filter = exports.map = exports.reduce = exports.skip = exports.take = void 0;
const _types_1 = require("./_types");
//#region Iterable/Collection functions
function* take(iterable, n) {
    if (typeof n !== "number")
        throw new Error(`Invalid type ${typeof n} for argument "n"\nMust be number`);
    if (n < 0) {
        console.warn(`Warning: Negative value ${n} passed to argument <n> of take()`);
        return;
    }
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
    if (n < 0) {
        console.warn(`Warning: Negative value ${n} passed to argument <n> of skip()`);
        return;
    }
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
// eslint-disable-next-line require-yield
function filter(iterable, predicate) {
    return ({
        *[Symbol.iterator]() {
            for (const element of iterable) {
                if (predicate(element))
                    yield element;
                else
                    continue;
            }
        }
    });
}
exports.filter = filter;
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
function* chunk(iter, chunkSize) {
    // console.log(`\n\tStarting chunk()`)
    const batch = [...take(iter, chunkSize)];
    // console.assert(batch.length === Math.min([...iter].length, chunkSize))
    // console.log(`\n\tBatch length ${batch.length}`)
    if (batch.length > 0) {
        // console.log(`\n\tYielding batch of length ${batch.length}`)
        // eslint-disable-next-line fp/no-unused-expression
        yield batch;
        // eslint-disable-next-line fp/no-unused-expression
        yield* chunk(skip(iter, chunkSize), chunkSize);
    }
}
exports.chunk = chunk;
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
function* flatten(nestedIterable) {
    //console.log(`\nInput to flatten: ${JSON.stringify(nestedIterable)}`)
    for (const element of nestedIterable) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof element !== "string" && typeof element[Symbol.iterator] === 'function') {
            //console.log(`flatten: element <${JSON.stringify(element)}> is iterable; flattening it *`)
            yield* flatten(element);
        }
        else {
            //console.log(`flatten: element <${JSON.stringify(element)}> is not iterable; yielding it *`)
            yield element;
        }
    }
}
exports.flatten = flatten;
function forEach(iterable, action) {
    for (const element of iterable) {
        // eslint-disable-next-line fp/no-unused-expression
        action(element);
    }
}
exports.forEach = forEach;
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
//#endregion
//#region Object functions
function objectPick(obj, ...keys) {
    const result = {};
    keys.forEach(k => result[k] = obj[k]);
    return result;
}
exports.objectPick = objectPick;
// eslint-disable-next-line @typescript-eslint/ban-types
function objectKeys(obj) {
    return Object.keys(obj); //as K[]
}
exports.objectKeys = objectKeys;
function objectFromKeyValues(keyValues) {
    const obj = {};
    keyValues.forEach(kvp => {
        obj[kvp[0]] = kvp[1];
    });
    return obj;
}
exports.objectFromKeyValues = objectFromKeyValues;
function objectEntries(obj) {
    return objectKeys(obj).map((key) => new _types_1.Tuple(key, obj[key]));
}
exports.objectEntries = objectEntries;
function objectMap(obj, projector) {
    const entries = objectEntries(obj);
    const mapped = entries.map(kv => new _types_1.Tuple(kv[0], projector(kv[1], kv[0])));
    const newObj = objectFromKeyValues(mapped);
    return newObj;
}
exports.objectMap = objectMap;
//#endregion
