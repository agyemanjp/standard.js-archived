import { hasValue, type ExtractByType, type Rec } from "../common"
import { first, skip } from "./combinators"

/** Return -1 if a is smaller than b; 0 if they are equal; 1 if a is bigger than b */
export type Ranker<X = unknown> = (a: X, b: X) => -1 | 0 | 1
export type RankerAsync<X = unknown> = (a: X, b: X) => number | Promise<number>

/** Return true if a and b are equal, otherwise returns false */
export type Comparer<X = unknown> = (a: X, b: X) => boolean
export type ComparerAsync<X = unknown> = (a: X, b: X) => boolean | Promise<boolean>

export type Hasher<X = unknown, Y extends string | number | symbol = number> = (a?: X) => Y
export type HasherAsync<X = unknown, Y extends string | number | symbol = number> = (a?: X) => Y | Promise<Y>

export type Projector<X = unknown, Y = unknown, I = number> = (value: X, index: I) => Y
export type ProjectorAsync<X = unknown, Y = unknown, I = unknown> = (item: X, index: I) => Y | Promise<Y>

export type Predicate<X = unknown, I = unknown> = (value: X, index: I) => boolean
export type PredicateAsync<X = unknown, I = unknown> = (value: X, index: I) => boolean | Promise<boolean>

export type Reducer<X = unknown, Y = unknown, I = unknown> = (prev: Y, current: X, index: I) => Y
export type ReducerAsync<X = unknown, Y = unknown, I = unknown> = (prev: Y, current: X, index: I) => Y | Promise<Y>

export type Zip<A extends ReadonlyArray<unknown>> = { [K in keyof A]: A[K] extends Iterable<infer T> ? T : never }
export type ZipAsync<A extends ReadonlyArray<unknown>> = { [K in keyof A]: A[K] extends AsyncIterable<infer T> | Iterable<infer T> ? T : never }

export type AsyncOptions = ({ mode: "parallel", resultOrder: "completion" | "original" } | { mode: "serial" })

/** Collection that is finite (length known in advance) */
export type CollectionFinite = | { readonly size: number } | { readonly length: number }
/** Collection that supports direct/random access by index */
export type CollectionIndexed<T> = | { readonly [n: number]: T } | { get: (index: number) => T }

/** Collection that supports checking whether an item is contained in it */
export type Container<T> = (
	| { contains: Predicate<T, any> }
	| { includes: Predicate<T, any> }
	| { has: Predicate<T, any> }
)
/** Collection that supports checking whether an item is contained in it asynchronously */
export type ContainerAsync<T> = (
	| { contains: PredicateAsync<T, any> }
	| { includes: PredicateAsync<T, any> }
	| { has: PredicateAsync<T, any> }
)

export type RecordFilter<T extends Rec = Rec, C extends "AND" | "OR" = "AND" | "OR"> = (| FilterPair<T, C> | FilterSingle<T>)
export type FilterPair<T extends Rec = Rec, C extends "AND" | "OR" = "AND" | "OR"> = [RecordFilter<T, C>, C, RecordFilter<T, C>]
export type FilterSingle<T extends Rec = Rec> = (
	| [ // Nulliity filter
		keyof T, // field name
		"is-null" | "is-not-null"
	]
	| [ // Textual filter
		keyof T, // field name
		"starts-with" | "doesn't-start-with" | "ends-with" | "doesn't-end-with" | "contains" | "doesn't-contain",
		string // key value
	]
	| [ // General filter
		keyof T, // field name
		"equals" | "does-not-equal" | "greater-than" | "greater-than-or-equals" | "less-than" | "less-than-or-equals",
		string | number // key value
	]
)
export type FilterOperator = FilterSingle<any>[1]


export type SortOrder = "ascending" | "descending" | "none"

export type ColumnarData<T extends Rec = Rec> = {
	[k in keyof T]: globalThis.Array<T[k]>
}
