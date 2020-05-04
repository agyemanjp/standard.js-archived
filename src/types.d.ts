declare module Hypothesize {

    type Primitive = number | string /*| boolean*/ | Date
    
    type Obj<TValue = any, TKey extends string = string> = { [key in TKey]: TValue }

    namespace Collection {

        interface Enumerable<T> {}

        type Material<T> = Iterable<T>

        interface Ordered<T> {}

        interface IndexedExtended<K, V> {}
    }

    type Ranker<T> = (a: T, b: T) => number

    type Comparer<X = any, Y = number | boolean> = (a?: X, b?: X) => Y

    type Reducer<X = any, Y = any, I = number> = (prev: Y, current: X, index?: I, collection?: Iterable<X>) => Y;

    type Projector<X = any, Y = any, I = number> = (value: X, index?: I) => Y

    type Predicate<X = any, I = number> = (value: X, index?: I) => boolean

    type ArrayElementType<T> = {}
    
    type RecursivePartial<T> = {}

    type Tuple<X, Y> = [X, Y]
}