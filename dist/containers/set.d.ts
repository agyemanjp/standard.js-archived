import { Predicate, Projector, Ranker } from "./_types";
import { Sequence } from "./sequence";
import { Array } from "./array";
/** Set of unique elements, known in advance, without any specific order */
export declare class Set<X> extends Sequence<X> {
    constructor(elements: Iterable<X>);
    protected _set?: globalThis.Set<X>;
    protected readonly core: {
        readonly set: globalThis.Set<X>;
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
    map<Y>(projector: Projector<X, Y>): Set<Y>;
    union(collections: Iterable<X>[]): this;
    intersection(collections: globalThis.Array<X>[]): this;
    except(collections: globalThis.Array<X>[]): Iterable<X>;
    complement(universe: Iterable<X>): Iterable<X>;
    sort(comparer?: Ranker<X>): Array<X>;
    sortDescending(comparer?: Ranker<X>): Array<X>;
}
