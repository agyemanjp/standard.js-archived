import { Predicate, Projector } from "./core";
import { stdSet } from "./set";
/** Eager, ordered, material collection */
export declare class stdArray<X> extends stdSet<X> {
    constructor(elements: Iterable<X>);
    private _array?;
    private _map?;
    ctor(elements: Iterable<X>): this;
    protected readonly core: {
        map: Map<number, X>;
        array: X[];
        set: Set<X>;
        iterable: Iterable<X>;
    };
    get length(): number;
    get size(): number;
    get(index: number): X;
    get(indices: Iterable<number>): X[];
    /** Get the indexes where a value occurs or a certain predicate/condition is met */
    indexesOf(args: ({
        value: X;
    } | {
        predicate: Predicate<X>;
    })): stdArray<number>;
    entries(): stdArray<[number, X]>;
    /** Get unique items in this array
     * ToDo: Implement use of comparer in the include() call
     */
    unique(): this;
    /** Returns new array containing this array's elements in reverse order */
    reverse(): this;
    /** Array-specific implementation of map() */
    map<Y>(projector: Projector<X, Y>): stdArray<Y>;
}
export declare class stdArrayNumeric extends stdArray<number> {
    ctor(iterable: Iterable<number>): this;
    min(): number | undefined;
    max(): number | undefined;
    map(projector: Projector<number, number>): stdArrayNumeric;
    map<Y>(projector: Projector<number, Y>): stdArray<Y>;
    mean(exclusions?: {
        excludedIndices: number[];
        meanOriginal?: number;
    }): number;
    variance(mean?: number, forSample?: boolean): number | undefined;
    deviation(args?: {
        mean?: number | {
            excludeIndices: number[];
        };
        forSample: boolean;
    }): number | undefined;
    median(): number | undefined;
    interQuartileRange(): number | undefined;
    sum(): number;
}
