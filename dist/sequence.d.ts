import { Predicate, Projector, Reducer } from "./core";
import { stdObject } from "./object";
/** Lazy collection of elements accessed sequentially, not known in advance */
export declare class stdSequence<X> implements Iterable<X> {
    constructor(iterable: Iterable<X>);
    protected _iterable: Iterable<X>;
    protected ctor(iterable: Iterable<X>): this;
    [Symbol.iterator](): Iterator<X>;
    /** Convert to another iterable container type */
    to<C extends Iterable<X>>(container: {
        (items: Iterable<X>): C;
    }): C;
    take(n: number): this;
    skip(n: number): this;
    /** Get first element (or first element to satisfy a predicate, if supplied) of this sequence
     * @param predicate Optional predicate to filter elements
     * @returns First element, or <undefined> if such an element is not found
     */
    first(predicate?: Predicate<X>): X | undefined;
    /** Get last element (or last element to satisfy optional predicate argument) of this sequence
     * @param predicate Optional predicate to filter elements
     * @returns Last element as defined, or <undefined> if such an element is not found
     */
    last(predicate?: Predicate<X>): X | undefined;
    filter(predicate: Predicate<X>): this;
    map<Y>(projector: Projector<X, Y>): stdSequence<Y>;
    reduce<Y>(initial: Y, reducer: Reducer<X, Y>): stdSequence<Y>;
    forEach(action: Projector<X>): void;
    /** Generate sequence of integers */
    static integers(args: {
        from: number;
        to: number;
    } | {
        from: number;
        direction: "upwards" | "downwards";
    }): stdSequence<number>;
    static fromRange(from: number, to: number, opts?: {
        mode: "width";
        width: number;
    } | {
        mode: "count";
        count: number;
    }): stdSequence<number>;
}
export declare class stdTupleSequence<T> extends stdSequence<[string, T]> {
    toDictionary<X>(): stdObject<Record<string, T>>;
}
