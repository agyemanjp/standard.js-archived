export declare type Primitive = number | string | bigint | boolean | symbol;
export declare type ObjectLiteral<TValue = unknown, TKey extends string = string> = {
    [key in TKey]: TValue;
};
export declare type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends Record<string, unknown> ? RecursivePartial<T[P]> : T[P];
};
export declare type ArrayElementType<T> = T extends (infer U)[] ? U : T;
export declare type ExtractByType<TObj, TType> = Pick<TObj, {
    [k in keyof TObj]-?: TObj[k] extends TType ? k : never;
}[keyof TObj]>;
declare type UnwrapIterable1<T> = T extends Iterable<infer X> ? X : T;
declare type UnwrapIterable2<T> = T extends Iterable<infer X> ? UnwrapIterable1<X> : T;
declare type UnwrapIterable3<T> = T extends Iterable<infer X> ? UnwrapIterable2<X> : T;
export declare type UnwrapNestedIterable<T> = T extends Iterable<infer X> ? UnwrapIterable3<X> : T;
export declare type Tuple<X, Y> = [X, Y];
export declare const Tuple: new <X, Y>(x: X, y: Y) => [X, Y];
export declare type Zip<A extends ReadonlyArray<unknown>> = {
    [K in keyof A]: A[K] extends Iterable<infer T> ? T : never;
};
/** Returns -1 if a is smaller than b; 0 if a & b are equal, and 1 if a is bigger than b */
export declare type Ranker<X = unknown> = (a: X, b: X) => number;
/** Returns true if a and b are equal, otherwise returne false */
export declare type Comparer<X = unknown> = (a: X, b: X) => boolean;
export declare type Projector<X = unknown, Y = unknown> = (value: X) => Y;
export declare type ProjectorIndexed<X = unknown, Y = unknown, I = unknown> = (value: X, indexOrKey: I) => Y;
export declare type Predicate<X = unknown> = (value: X) => boolean;
export declare type Reducer<X = unknown, Y = unknown> = (prev: Y, current: X) => Y;
export declare type ReducerIndexed<X = unknown, Y = unknown, I = unknown> = (prev: Y, current: X, indexOrKey: I) => Y;
export declare namespace Collection {
    interface Enumerable<X> extends Iterable<X> {
        take: (n: number) => Enumerable<X>;
        skip: (n: number) => Enumerable<X>;
        filter: (predicate: Predicate<X>) => Enumerable<X>;
        map<Y extends [S, Z], Z, S extends string>(projector: Projector<X, Y>): Enumerable<[S, Z]>;
        map<Y>(projector: Projector<X, Y>): Enumerable<Y>;
        reduce: <Y>(initial: Y, reducer: Reducer<X, Y>) => Enumerable<Y>;
        forEach: (action: Projector<X>) => void;
        first(): X | undefined;
        materialize(): MaterialExtended<X>;
    }
    interface Material<X> extends Enumerable<X> {
        size: number;
        some(predicate: Predicate<X>): boolean;
        every(predicate: Predicate<X>): boolean;
    }
    interface MaterialExtended<X> extends Material<X> {
        unique(comparer: Comparer<X>): Material<X>;
        union(...collections: Material<X>[]): Material<X>;
        intersection(...collections: Material<X>[]): Material<X>;
        except(...collections: Material<X>[]): Material<X>;
        complement(universe: Iterable<X>): Material<X>;
        sort(comparer?: Ranker<X>): Ordered<X>;
        sortDescending(comparer?: Ranker<X>): Ordered<X>;
        contains(value: X): boolean;
    }
    interface Indexed<K, V> {
        get(index: K): V | undefined;
        get(indices: K[]): (V | undefined)[];
        get(...indices: K[]): (V | undefined)[];
        get(selector: K | K[]): undefined | V | V[];
        indexesOf(value: V): Enumerable<K>;
        indexesOf(value: V, mode: "as-value"): Enumerable<K>;
        indexesOf(value: Predicate<V>, mode: "as-predicate"): Enumerable<K>;
    }
    interface IndexedExtended<K, V> extends Indexed<K, V> {
        keys(): Material<K>;
        hasKey(key: K): boolean;
        values(): Material<V>;
        hasValue(value: V): boolean;
    }
    interface Ordered<T> extends MaterialExtended<T>, Indexed<number, T> {
        last(): T | undefined;
        reverse(): Ordered<T>;
    }
    interface ArrayLike<T> extends Iterable<T> {
        length: number;
        get(index: number): T;
    }
}
export declare function take<T>(iterable: Iterable<T>, n: number): Iterable<T>;
export declare function skip<T>(iterable: Iterable<T>, n: number): Iterable<T>;
export declare function reduce<X, Y>(iterable: Iterable<X>, initial: Y, reducer: Reducer<X, Y>): Iterable<Y>;
export declare function map<X, Y>(iterable: Iterable<X>, projector: Projector<X, Y>): Iterable<Y>;
export declare function filter<T>(iterable: Iterable<T>, predicate: Predicate<T>): Iterable<T>;
export declare function some<T>(iterable: Iterable<T>, predicate: Predicate<T>): boolean;
export declare function every<T>(iterable: Iterable<T>, predicate: Predicate<T>): boolean;
/** Turns n iterables into an iterable of n-tuples
 * The shortest iterable determines the length of the result
 */
export declare function zip<T extends readonly any[]>(...iterables: T): IterableIterator<Zip<T>>;
export declare function forEach<T>(iterable: Iterable<T>, action: Projector<T>): void;
export declare function unique<T>(iterable: Iterable<T>): Iterable<T>;
export declare function union<T>(collections: globalThis.Array<Iterable<T>>): Iterable<T>;
export declare function intersection<T>(collections: ArrayLike<T>[]): Iterable<T>;
export declare function except<T>(src: Iterable<T>, exclusions: ArrayLike<T>[]): Iterable<T>;
export declare function complement<T>(target: ArrayLike<T>, universe: Iterable<T>): Iterable<T>;
export declare function indexesOf<K, V>(collection: Iterable<Tuple<K, V>>, target: ({
    value: V;
} | {
    predicate: Predicate<V>;
})): Iterable<K>;
export declare function chunk<T>(arr: Iterable<T>, chunkSize: number): Iterable<T[]>;
/** Get first element (or first element to satisfy a predicate, if supplied) of this sequence
 * @param predicate Optional predicate to filter elements
 * @returns First element, or <undefined> if such an element is not found
 */
export declare function first<T>(iterable: Iterable<T>, predicate?: Predicate<T>): T | undefined;
/** Get last element (or last element to satisfy optional predicate argument) of this sequence
 * @param predicate Optional predicate to filter elements
 * @returns Last element as defined, or <undefined> if such an element is not found
 */
export declare function last<T>(collection: Iterable<T> | Collection.ArrayLike<T>, predicate?: Predicate<T>): T | undefined;
export declare function sum(iterable: Iterable<number>): number;
export declare function flatten<X>(nestedIterable: Iterable<X>): Iterable<UnwrapNestedIterable<X>>;
export declare function compare<T>(x: T, y: T, comparer?: Projector<T, unknown>, tryNumeric?: boolean): number;
export declare function getRanker<T>(args: {
    projector: Projector<T, unknown>;
    tryNumeric?: boolean;
    reverse?: boolean;
}): Ranker<T>;
export declare function getComparer<T>(projector: Projector<T, unknown>, tryNumeric?: boolean): Comparer<T>;
export declare function hasValue(value: unknown): boolean;
export {};
