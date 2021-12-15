
export type Zip<A extends ReadonlyArray<unknown>> = { [K in keyof A]: A[K] extends Iterable<infer T> ? T : never }
export type ZipAsync<A extends ReadonlyArray<unknown>> = { [K in keyof A]: A[K] extends AsyncIterable<infer T> | Iterable<infer T> ? T : never }

export type AsyncOptions = ({ mode: "parallel", resultOrder: "completion" | "original" } | { mode: "serial" })


/*
export type TableFilter = {
	fieldName: string,
	operator: Filter["operator"],
	value: any,
	negated?: boolean
}
export namespace Filter {
	export type Base<TObj extends Obj = Obj, TVal = any> = {
		fieldName: keyof (ExtractByType<TObj, TVal>),
		value: TVal,
		negated?: boolean
	}
	export type Categorical<T extends Obj> = Base<T, Primitive | null> & {
		operator: "equal" | "not_equal" | "blank",
	}
	export type Ordinal<T extends Obj> = Base<T, number> & {
		operator: "greater" | "greater_or_equal" | "less" | "less_or_equal" | "blank",
	}
	export type Textual<T extends Obj> = Base<T, string> & {
		operator: "contains" | "is-contained" | "starts_with" | "ends_with" | "blank",
	}
	export type Statistical<T extends Obj> = Base<T, number> & {
		operator: "is_outlier_by" | "blank", // number of std. deviations (possibly fractional)

	}
}
export type Filter<T extends Obj = Obj> = (
	| Filter.Categorical<T>
	| Filter.Ordinal<T>
	| Filter.Textual<T>
	| Filter.Statistical<T>
)
export type FilterGroup = {
	filters: Array<TableFilter | FilterGroup>
	combinator?: "AND" | "OR"
}
export type SortOrder = "ascending" | "descending" | "none"
interface SortOptions { tryNumericSort: boolean }
interface FilterOptions {
		scope: "current" | "original" //Filter without consideration of id vector i.e., use all/original values in column vectors
}
interface PagingOptions {
	scope: "current" | "original" // Page without consideration of id vector i.e., use all/original values in column vectors
}
*/