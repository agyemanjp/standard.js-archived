"use strict";
/* eslint-disable indent */
/* eslint-disable fp/no-loops */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable brace-style */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTable = exports.ROW_NUM_COL_NAME = void 0;
const _utility_1 = require("./_utility");
const core_1 = require("../core/core");
const combinators_1 = require("./combinators");
const dictionary_1 = require("./dictionary");
const sequence_1 = require("./sequence");
//import { tableParsers } from "./parsers"
exports.ROW_NUM_COL_NAME = "rowNum";
class DataTable {
    /** Actual implementation of constructor variants
     * @param source Either rows or columns as defined above
     * @param idVector Optional vector of row indexes indicating which which rows are part of this data table
     */
    constructor(source, idVector) {
        const start = new Date().getTime();
        // eslint-disable-next-line fp/no-mutation, @typescript-eslint/no-explicit-any
        this._colVectors = (typeof source[Symbol.iterator] === "function")
            ? new dictionary_1.Dictionary(DataTable.rowsToColumns(source))
            : new dictionary_1.Dictionary(source);
        // eslint-disable-next-line fp/no-mutation
        this._idVector = idVector
            ? [...idVector]
            : this._colVectors.size > 0
                ? [...Array([...this._colVectors][0][1].length).keys()]
                : [];
        // eslint-disable-next-line fp/no-unused-expression
        console.log(`\nDataTable took ${new Date().getTime() - start}ms to instantiate`);
    }
    get idVector() { return this._idVector; }
    /** Columns vectors excluding row ids vector */
    get columnVectors() { return this._colVectors; }
    /** Return data as an iterable of rows that include a sequential row number property */
    get rowObjects() {
        return (function* (me) {
            for (const rowNumInfo of combinators_1.zip(sequence_1.Sequence.integers({ from: 0, to: me.length - 1 }), me._idVector)) {
                const [sequentialRowNum, originalRowNum] = rowNumInfo;
                const row = Object.assign({ rowNum: sequentialRowNum + 1 }, me._colVectors.map(vector => vector[originalRowNum]).asObject());
                // eslint-disable-next-line fp/no-unused-expression
                yield row;
            }
        })(this);
    }
    get length() { return this._idVector.length; }
    /** Return a new data table that excludes data disallowed by the passed filters */
    filter(args) {
        var _a;
        const shouldRetain = (row, filter) => {
            if ("filters" in filter) {
                switch (filter.combinator) {
                    case undefined:
                    case "AND": return filter.filters.every(f => shouldRetain(row, f));
                    case "OR": return filter.filters.some(f => shouldRetain(row, f));
                    default: {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const _ = filter.combinator;
                        throw new Error(`Unknown filter group combinator: ${filter.combinator}`);
                    }
                }
            }
            else {
                const _test = filter.negated ? false : true;
                const _val = row[filter.fieldName];
                switch (filter.operator) {
                    case "equal":
                        return (_val == filter.value) === _test;
                    case "not_equal":
                        return (_val != filter.value) === _test;
                    case "greater":
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        return (parseFloat(String(_val)) > parseFloat(filter.value)) === _test;
                    case "greater_or_equal":
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        return (parseFloat(String(_val)) >= parseFloat(filter.value)) === _test;
                    case "less":
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        return (parseFloat(String(_val)) < parseFloat(filter.value)) === _test;
                    case "less_or_equal":
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        return (parseFloat(String(_val)) <= parseFloat(filter.value)) === _test;
                    case "is_outlier_by":
                        // const belowMin = parseFloat(_val) < filter.average! - parseFloat(filter.value as any) * filter.std!
                        // const aboveMax = parseFloat(_val) > filter.average! + parseFloat(filter.value as any) * filter.std!
                        // return (belowMin || aboveMax) === _test
                        return true;
                    case "contains":
                        return (_val !== undefined && _val !== null && _val.toString().indexOf(filter.value) >= 0) === _test;
                    case "starts_with":
                        return (_val !== undefined && _val !== null && _val.toString().startsWith(filter.value)) === _test;
                    case "ends_with":
                        return (_val !== undefined && _val !== null && _val.toString().endsWith(filter.value)) === _test;
                    case "blank":
                        return _val === undefined || _val === null === _test;
                    default: {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const _ = filter;
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        throw new Error(`Unknown filter operator: ${filter.operator}`);
                    }
                }
            }
        };
        const effectiveIdVector = ((_a = args.options) === null || _a === void 0 ? void 0 : _a.scope) === "original"
            ? sequence_1.Sequence.integers({ from: 0, to: this.length - 1 })
            : this._idVector;
        const idColumnVectorFiltered = effectiveIdVector.filter(rowNum => {
            if (args.filter === undefined)
                return true;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const row = this._colVectors.map(v => v[rowNum]).asObject();
            return shouldRetain(row, args.filter);
        });
        return new DataTable(this._colVectors.asObject(), idColumnVectorFiltered);
    }
    sort(args) {
        var _a, _b;
        if (args.columnName !== exports.ROW_NUM_COL_NAME && this._colVectors.get(args.columnName) === undefined)
            throw new Error(`Unknown column ${args.columnName}`);
        // eslint-disable-next-line fp/no-mutating-methods
        const idColumnVectorSorted = [...this._idVector].sort(_utility_1.getRanker({
            projector: rowNum => args.columnName === exports.ROW_NUM_COL_NAME
                ? rowNum
                : this._colVectors.get(args.columnName)[rowNum],
            tryNumeric: (_b = (_a = args.options) === null || _a === void 0 ? void 0 : _a.tryNumericSort) !== null && _b !== void 0 ? _b : true,
            reverse: args.order === "descending"
        }));
        return new DataTable(this._colVectors.asObject(), idColumnVectorSorted);
    }
    page(args) {
        var _a;
        const effectiveIdVector = ((_a = args.options) === null || _a === void 0 ? void 0 : _a.scope) === "original"
            ? [...sequence_1.Sequence.integers({ from: 0, to: this.length - 1 })]
            : this._idVector;
        const idColumnVectorPaged = effectiveIdVector.slice(args.index * args.size, (args.index + 1) * args.size);
        return new DataTable(this._colVectors.asObject(), idColumnVectorPaged);
    }
    map(projector) {
        return new DataTable(this._colVectors.map(vector => vector.map(projector)).asObject());
    }
}
exports.DataTable = DataTable;
DataTable.rowsToColumns = (rows) => {
    const srcArray = [...rows];
    const columnVectors = {};
    // eslint-disable-next-line fp/no-unused-expression
    srcArray.forEach((row, index) => {
        const rowKeys = new dictionary_1.Dictionary(row).keys();
        if (rowKeys.some(key => core_1.hasValue(row[key]))) { // ensure row is not empty
            // eslint-disable-next-line fp/no-unused-expression
            rowKeys.forEach(colName => {
                if (!columnVectors[colName])
                    // eslint-disable-next-line fp/no-mutation
                    columnVectors[colName] = new Array(srcArray.length).fill(undefined);
                // eslint-disable-next-line fp/no-mutation
                columnVectors[colName][index] = row[colName];
            });
        }
    });
    return columnVectors;
};
/** Data table */
/*export interface Table<T extends Record<string, unknown> = {}> {
    length: number
    // lengthOriginal: number
    idVector: Iterable<number>
    // filteredIdVector: number[]
    columnVectors: Collection.Enumerable<[keyof T, any[]]>
    // columnNames: Collection.Ordered<keyof T>
    rowObjects: Iterable<T & { rowId: number }>

    filter(args: { filterGroup: FilterGroup<T>, options?: Record<string, unknown> }): Table<T>

    sort(args: { columnName: string, order: SortOrder, options?: Record<string, unknown> }): Table<T>

    page(args: { size: number, index: number }): Table<T>
    pageOriginal(args: { size: number, index: number }): Table<T>

    removeById(rowId: number): Table<T>
}*/
