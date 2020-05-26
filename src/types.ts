export declare module Types {

    type Primitive = number | string /*| boolean*/ | Date
    
    type Obj<TValue = any, TKey extends string = string> = { [key in TKey]: TValue }

    namespace Collection {
        export interface Enumerable<X> extends Iterable<X> {
            take: (n: number) => Enumerable<X>
            skip: (n: number) => Enumerable<X>
            filter: (predicate: Predicate<X>) => Enumerable<X>
    
            map<Y extends [S, Z], Z, S extends string>(projector: Projector<X, Y>): Enumerable<[S, Z]>
            map<Y>(projector: Projector<X, Y>): Enumerable<Y> //Y extends [string, infer Z] ? Enumerable<[string, Z]> : Enumerable<Y>
    
            reduce: <Y>(initial: Y, reducer: Reducer<X, Y>) => Enumerable<Y>
            forEach: (action: Projector<X>) => void
    
            first(): X | undefined
    
            materialize(): MaterialExtended<X>
        }
        export interface Material<X> extends Enumerable<X> {
            size: number
            some(predicate: Predicate<X>): boolean
            every(predicate: Predicate<X>): boolean
        }
        export interface MaterialExtended<X> extends Material<X> {
            unique(comparer: Comparer<X>): Material<X>
            union(...collections: Material<X>[]): Material<X>
            intersection(...collections: Material<X>[]): Material<X>
            except(...collections: Material<X>[]): Material<X>
            complement(universe: Iterable<X>): Material<X>
    
            sort(comparer?: Ranker<X>): Ordered<X>
            sortDescending(comparer?: Ranker<X>): Ordered<X>
    
            //has(value: X): boolean
            contains(value: X): boolean
            //includes(value: X): boolean
        }
        export interface Indexed<K, V> {
            get(index: K): V | undefined
            get(indices: K[]): (V | undefined)[]
            get(...indices: K[]): (V | undefined)[]
            get(selector: K | K[]): undefined | V | V[]
    
            indexesOf(value: V): Enumerable<K>
            indexesOf(value: V, mode: "as-value"): Enumerable<K>
            indexesOf(value: Predicate<V>, mode: "as-predicate"): Enumerable<K>
        }
        export interface IndexedExtended<K, V> extends Indexed<K, V> {
            keys(): Material<K>
            hasKey(key: K): boolean
    
            values(): Material<V>
            hasValue(value: V): boolean
    
            //indexOf(args: ({ value: V } | { block: Iterable<V> } | { predicate: Predicate<V> }) & { fromIndex?: number, fromEnd?: boolean }): K
        }
        export interface Ordered<T> extends MaterialExtended<T>, Indexed<number, T> {
            last(): T | undefined
            reverse(): Ordered<T>
    
            //indexOfRange(range: Iterable<number>, fromIndex?: number, fromEnd?: boolean): number
        }
    }

   /** Returns -1 if a is smaller than b; 0 if a & b are equal, and 1 if a is bigger than b */
    type Ranker<X = any> = (a: X, b: X) => number

    /** Returns true if a and b are equal, otherwise returne false */
    type Comparer<X = any> = (a: X, b: X) => boolean

    type Projector<X = any, Y = any> = (value: X) => Y;
    type Predicate<X = any> = (value: X) => boolean;
    type Reducer<X = any, Y = any> = (prev: Y, current: X) => Y;

    type ArrayElementType<T> = T extends (infer U)[] ? U : T
    type Tuple<X, Y> = [X, Y]

    type RecursivePartial<T> = { [P in keyof T]?: T[P] extends object ? RecursivePartial<T[P]> : T[P] }
    type RecursiveRequired<T> = { [P in keyof T]-?: Required<T[P]> }
}