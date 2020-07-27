import { Predicate, Projector, Ranker } from "./core";
import { stdSequence } from "./sequence";
import { stdArray } from "./array";
/** Set of elements, known in advance, without any order */
export declare class stdSet<X> extends stdSequence<X> {
    constructor(elements: Iterable<X>);
    protected _set?: globalThis.Set<X>;
    protected readonly core: {
        readonly set: Set<X>;
        readonly iterable: Iterable<X>;
    };
    protected ctor(iterable: Iterable<X>): this;
    get size(): number;
    get length(): number;
    /** Synonym of this.contains */
    has(value: X): boolean;
    /** Synonym of this.contains */
    includes(value: X): boolean;
    /** Returns true if this array contains an element equal to value */
    contains(value: X): boolean;
    some(predicate: Predicate<X>): boolean;
    every(predicate: Predicate<X>): boolean;
    map<Y>(projector: Projector<X, Y>): stdSet<Y>;
    union(collections: Iterable<X>[]): this;
    intersection(collections: globalThis.Array<X>[]): this;
    except(collections: globalThis.Array<X>[]): Iterable<X>;
    complement(universe: Iterable<X>): Iterable<X>;
    sort(comparer?: Ranker<X>): stdArray<X>;
    sortDescending(comparer?: Ranker<X>): stdArray<X>;
}
