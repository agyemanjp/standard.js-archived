import { ExtractByType, Primitive } from "../types";
import { Projector } from "./_types";
import { Dictionary } from "./dictionary";
export declare const ROW_NUM_COL_NAME: "rowNum";
export declare class DataTable<T extends Record<string, Primitive> = Record<string, Primitive>> {
    protected readonly _idVector: number[];
    protected readonly _colVectors: Dictionary<Record<keyof T, T[keyof T][]>>;
    /** Contruct from a collection of objects
     * @param rowObjects Iterable collection of row object literals
     * @param idVector
     */
    constructor(rowObjects: Iterable<T>, idVector?: Iterable<number>);
    /** Construct from an object literal of columns
     * @param columnVectors
     * @param idVector
     */
    constructor(columnVectors: Record<keyof T, T[keyof T][]>, idVector?: Iterable<number>);
    get idVector(): number[];
    /** Columns vectors excluding row ids vector */
    get columnVectors(): Dictionary<Record<keyof T, T[keyof T][]>>;
    /** Return data as an iterable of rows that include a sequential row number property */
    get rowObjects(): Iterable<T & {
        rowNum: number;
    }>;
    get length(): number;
    /** Return a new data table that excludes data disallowed by the passed filters */
    filter(args: {
        filter?: Filter<T> | FilterGroup<T>;
        options?: FilterOptions;
    }): DataTable<T>;
    sort(args: {
        columnName: typeof ROW_NUM_COL_NAME | keyof T;
        order: SortOrder;
        options?: SortOptions;
    }): DataTable<T>;
    page(args: {
        size: number;
        index: number;
        options?: PagingOptions;
    }): DataTable<T>;
    map(projector: Projector<Primitive, Primitive>): DataTable<Record<string, Primitive>>;
    static rowsToColumns: <X extends Record<string, Primitive> = Record<string, Primitive>>(rows: Iterable<X>) => Record<keyof X, X[keyof X][]>;
}
export declare namespace Filter {
    interface Base<TObj extends Record<string, Primitive>, TVal extends Primitive | null> {
        fieldName: keyof (ExtractByType<TObj, TVal>);
        value: TVal;
        /** If true, values matching the test will be excluded. If false, only they will be included */
        negated?: boolean;
    }
    interface Categorical<T extends Record<string, Primitive>> extends Base<T, Primitive | null> {
        operator: "equal" | "not_equal" | "blank";
    }
    interface Ordinal<T extends Record<string, Primitive>> extends Base<T, number> {
        operator: "greater" | "greater_or_equal" | "less" | "less_or_equal" | "blank";
        negated?: boolean;
    }
    interface Textual<T extends Record<string, Primitive>> extends Base<T, string> {
        operator: "contains" | "starts_with" | "ends_with" | "blank";
    }
    interface Statistical<T extends Record<string, Primitive>> extends Base<T, number> {
        operator: "is_outlier_by" | "blank";
    }
}
export declare type Filter<T extends Record<string, Primitive> = Record<string, Primitive>> = (Filter.Categorical<T> | Filter.Ordinal<T> | Filter.Textual<T> | Filter.Statistical<T>);
export interface FilterGroup<T extends Record<string, Primitive> = Record<string, Primitive>> {
    filters: Array<Filter<T> | FilterGroup<T>>;
    combinator?: "AND" | "OR";
}
export declare type SortOrder = "ascending" | "descending" | "none";
interface SortOptions {
    tryNumericSort: boolean;
}
interface FilterOptions {
    /** Filter without consideration of id vector i.e., use all/original values in column vectors */
    scope: "current" | "original";
}
interface PagingOptions {
    /** Page without consideration of id vector i.e., use all/original values in column vectors */
    scope: "current" | "original";
}
export {};
/** Data table */
