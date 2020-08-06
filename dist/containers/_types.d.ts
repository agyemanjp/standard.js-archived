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
export declare type Hasher<X = unknown, Y extends string | number | symbol = number> = (a?: X) => Y;
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
export {};
