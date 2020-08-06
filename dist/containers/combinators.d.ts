import { Reducer, Projector, ProjectorIndexed, Predicate, Zip, UnwrapNestedIterable, Tuple } from "./_types";
export declare function take<T>(iterable: Iterable<T>, n: number): Iterable<T>;
export declare function skip<T>(iterable: Iterable<T>, n: number): Iterable<T>;
export declare function reduce<X, Y>(iterable: Iterable<X>, initial: Y, reducer: Reducer<X, Y>): Iterable<Y>;
export declare function map<X, Y>(iterable: Iterable<X>, projector: Projector<X, Y>): Iterable<Y>;
export declare function filter<T>(iterable: Iterable<T>, predicate: Predicate<T>): {
    [Symbol.iterator](): Generator<T, void, unknown>;
};
export declare function unique<T>(iterable: Iterable<T>): Iterable<T>;
export declare function chunk<T>(iter: Iterable<T>, chunkSize: number): Iterable<T[]>;
/** Turns n iterables into an iterable of n-tuples
 * The shortest iterable determines the length of the result
 */
export declare function zip<T extends readonly any[]>(...iterables: T): IterableIterator<Zip<T>>;
export declare function flatten<X>(nestedIterable: Iterable<X>): Iterable<UnwrapNestedIterable<X>>;
export declare function forEach<T>(iterable: Iterable<T>, action: Projector<T>): void;
/** Get first element (or first element to satisfy a predicate, if supplied) of this sequence
 * @param predicate Optional predicate to filter elements
 * @returns First element, or <undefined> if such an element is not found
 */
export declare function first<T>(iterable: Iterable<T>, predicate?: Predicate<T>): T | undefined;
/** Get last element (or last element to satisfy optional predicate argument) of this sequence
 * @param predicate Optional predicate to filter elements
 * @returns Last element as defined, or <undefined> if such an element is not found
 */
export declare function last<T>(collection: Iterable<T> | {
    length: number;
    get(index: number): T;
}, predicate?: Predicate<T>): T | undefined;
export declare function some<T>(iterable: Iterable<T>, predicate: Predicate<T>): boolean;
export declare function every<T>(iterable: Iterable<T>, predicate: Predicate<T>): boolean;
export declare function union<T>(collections: globalThis.Array<Iterable<T>>): Iterable<T>;
export declare function intersection<T>(collections: ArrayLike<T>[]): Iterable<T>;
export declare function except<T>(src: Iterable<T>, exclusions: ArrayLike<T>[]): Iterable<T>;
export declare function complement<T>(target: ArrayLike<T>, universe: Iterable<T>): Iterable<T>;
export declare function indexesOf<K, V>(collection: Iterable<Tuple<K, V>>, target: ({
    value: V;
} | {
    predicate: Predicate<V>;
})): Iterable<K>;
export declare function objectPick<T extends Record<string, unknown>, K extends keyof T>(obj: T, ...keys: K[]): Record<K, T[K]>;
export declare function objectKeys<K extends string, V>(obj: Record<K, V>): K[];
export declare function objectKeys<T extends Record<string, unknown>>(obj: T): (keyof T)[];
export declare function objectFromKeyValues<T, K extends string = string>(keyValues: Tuple<K, T>[]): Record<K, T>;
export declare function objectEntries<V, K extends string>(obj: Record<K, V>): Tuple<K, V>[];
export declare function objectMap<K extends string, X, Y>(obj: Record<K, X>, projector: ProjectorIndexed<X, Y, K>): Record<K, Y>;
