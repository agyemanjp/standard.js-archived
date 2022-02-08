import { Predicate, PredicateAsync } from "../functional"
import { Obj, ExtractByType, Primitive } from "../utility"

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


export type TableFilter = {
	fieldName: string,
	operator: Filter["operator"],
	value: any,
	negated?: boolean
}
export type FilterBase<TObj extends Obj = Obj, TVal = any> = {
	fieldName: keyof (ExtractByType<TObj, TVal>),
	value: TVal,
	negated?: boolean
}
export type FilterCategorical<T extends Obj> = FilterBase<T, Primitive | null> & {
	operator: "equal" | "not_equal" | "blank",
}
export type FilterOrdinal<T extends Obj> = FilterBase<T, number> & {
	operator: "greater" | "greater_or_equal" | "less" | "less_or_equal" | "blank",
}
export type FilterTextual<T extends Obj> = FilterBase<T, string> & {
	operator: "contains" | "is-contained" | "starts_with" | "ends_with" | "blank",
}
export type FilterStatistical<T extends Obj> = FilterBase<T, number> & {
	operator: "is_outlier_by" | "blank", // number of std. deviations (possibly fractional)

}
export type Filter<T extends Obj = Obj> = (
	| FilterCategorical<T>
	| FilterOrdinal<T>
	| FilterTextual<T>
	| FilterStatistical<T>
)
export type FilterGroup = {
	filters: Array<TableFilter | FilterGroup>
	combinator?: "AND" | "OR"
}
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
