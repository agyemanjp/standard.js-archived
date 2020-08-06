import { Predicate, Projector } from "./_types";
import { Set } from "./set";
/** Eager, ordered, material collection */
export declare class Array<X> extends Set<X> {
    constructor(elements: Iterable<X>);
    private _array?;
    private _map?;
    ctor(elements: Iterable<X>): this;
    protected readonly core: {
        map: Map<number, X>;
        array: X[];
        set: globalThis.Set<X>;
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
    })): Array<number>;
    entries(): Array<[number, X]>;
    /** Get unique items in this array
     * ToDo: Implement use of comparer in the include() call
     */
    unique(): this;
    /** Returns new array containing this array's elements in reverse order */
    reverse(): this;
    /** Array-specific implementation of map() */
    map<Y>(projector: Projector<X, Y>): Array<Y>;
}
export declare class stdArrayNumeric extends Array<number> {
    ctor(iterable: Iterable<number>): this;
    min(): number | undefined;
    max(): number | undefined;
    mean(): number;
    variance(mean?: number): number | undefined;
    deviation(): number | undefined;
    median(): number | undefined;
    interQuartileRange(): number | undefined;
    sum(): number;
    map(projector: Projector<number, number>): stdArrayNumeric;
    map<Y>(projector: Projector<number, Y>): Array<Y>;
}
