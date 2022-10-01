/* eslint-disable @typescript-eslint/no-explicit-any */
import { Predicate, PredicateAsync } from "../functional/index.js"
import { Obj, ExtractByType, Primitive } from "../utility.js"

/** Collection that is finite (length known in advance) */
export type Finite = | { readonly size: number } | { readonly length: number }

/** Collection that supports direct/random access by index */
export type IndexedAccess<T> = | { readonly [n: number]: T } | { get: (index: number) => T }

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

/** Finite, eager, materialized collection */
/*export type Materialized<T> = (Iterable<T> &
	(
		| { contains: Predicate<T, any> }
		| { includes: Predicate<T, any> }
		| { has: Predicate<T, any | never> }
	) & Finite
)*/

/** Finite, eager, async, materialized collection */
/*export type MaterializedAsync<T> = (Iterable<T> | AsyncIterable<T> &
	(
		| { contains: Predicate<T, any> | PredicateAsync<T, any> }
		| { includes: Predicate<T, any> | PredicateAsync<T, any> }
		| { has: Predicate<T, any> | PredicateAsync<T, any> }
	) &
	(
		| { size: number }
		| { length: number }
	)
)*/

export type Zip<A extends ReadonlyArray<unknown>> = { [K in keyof A]: A[K] extends Iterable<infer T> ? T : never }
export type ZipAsync<A extends ReadonlyArray<unknown>> = { [K in keyof A]: A[K] extends AsyncIterable<infer T> | Iterable<infer T> ? T : never }

export type AsyncOptions = ({ mode: "parallel", resultOrder: "completion" | "original" } | { mode: "serial" })


export type FilterBase<T extends Obj = Obj, V = any> = {
	fieldName: keyof (ExtractByType<T, V>),
	value: V,
	negated?: boolean
}
export type FilterBlank<T extends Obj> = {
	fieldName: keyof (ExtractByType<T, Primitive | null | undefined>),
	operator: "is_blank",
	negated?: boolean
}
export type FilterArray<T extends Obj, V = any> = FilterBase<T, V> & {
	operator: "in",
	values: V[]
}
export type FilterCategorical<T extends Obj> = FilterBase<T, Primitive | null> & {
	operator:
	| "equals"
	| "not_equal_to"
}
export type FilterOrdinal<T extends Obj> = FilterBase<T, number> & {
	operator:
	| "greater_than"
	| "greater_than_or_equals"
	| "less_than"
	| "less_than_or_equals"
}
export type FilterTextual<T extends Obj> = FilterBase<T, string> & {
	operator:
	| "contains"
	| "is_contained_in"
	| "starts_with"
	| "ends_with"
}
export type FilterNumeric<T extends Obj> = FilterBase<T, number> & {
	operator:
	| "is_outlier_by" // number of std. deviations (possibly fractional)
}

export type Filter<T extends Obj = Obj> = (
	| FilterBlank<T>
	| FilterArray<T>
	| FilterCategorical<T>
	| FilterOrdinal<T>
	| FilterTextual<T>
	| FilterNumeric<T>
)
export type FilterGroup<T extends Obj = Obj> = {
	filters: Array<Filter<T> | FilterGroup<T>>
	combinator?: "AND" | "OR"
}

export type FilterSimple = {
	fieldName: string,
	operator: Filter["operator"],
	value: any,
	negated?: boolean
}
export type FilterGroupSimple = {
	filters: Array<FilterSimple | FilterGroupSimple>
	combinator?: "AND" | "OR"
}

export type ColumnarData<T extends Obj = Obj> = { [k in keyof T]: globalThis.Array<T[k]> }

export type SortOrder = "ascending" | "descending" | "none"
export interface SortOptions {
	tryNumericSort: boolean
}
export interface FilterOptions {
	scope: "current" | "original" //Filter without consideration of id vector i.e., use all/original values in column vectors
}
export interface PagingOptions {
	scope: "current" | "original" // Page without consideration of id vector i.e., use all/original values in column vectors
}
