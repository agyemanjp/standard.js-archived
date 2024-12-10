import { hasValue, type Rec } from "../common"
import { first, skip } from "./combinators"
import type { Comparer, FilterPair, FilterSingle, Projector, Ranker, RecordFilter } from "./types"

/** Transforms input projector function into a ranker function (that determines which of two values is greater)
 * @param tryNumeric (default: false) Output ranker function will attempt to compare string arguments as numbers
 * @param tryDate (default: false) Output ranker function will attempt to compare arguments as dates.
 */
export function createRanker<T, Y = unknown>(projector: Projector<T, Y, void>, args?:
	{
		tryNumeric?: boolean,
		tryDate?: boolean,
		reverse?: boolean
	}): Ranker<T> {
	return (x: T, y: T) =>
		rank(x, y, projector, args?.tryNumeric, args?.tryDate) * (args?.reverse === true ? -1 : 1) as -1 | 0 | 1
}
/** Transforms input projector function into a comparer function (that determines whether two values are equal)
 * @param tryNumeric (default: false) Output ranker function will attempt to compare string arguments as numbers
 * @param tryDate (default: false) Output ranker function will attempt to compare arguments as dates.
 */
export function createComparer<T, Y = unknown>(projector: Projector<T, Y, void>, tryNumeric = false, tryDate = false): Comparer<T> {
	return (x: T, y: T) =>
		rank(x, y, projector, tryNumeric, tryDate) === 0
}
/** Ranks 2 values for sorting, possibly parsing them as date or number beforehand.
 * If the values have different types, string values will always be ranked last, 
 * unless the caller chooses (through 'tryNumeric' or 'tryDate') to convert them into numbers or dates for comparison.
 * @param a One value to compare
 * @param b The other value to compare
 * @param projector A projector used to find the values to compare, if the passed values are objects
 * @param tryNumeric If any or both of the two values are strings, attempt to parse them as number before doing comparison
 * @param tryDate If both values are strings corresponding to dates, they will be parsed as Dates and compared as such.
 */
export function rank<T, Y = unknown>(a: T, b: T, projector?: Projector<T, Y, void>, tryNumeric = false, tryDate = false): -1 | 0 | 1 {
	const _a: unknown = projector ? projector(a) : a
	const _b: unknown = projector ? projector(b) : b

	const sign = (n: number) => Math.sign(n) as -1 | 0 | 1

	if (typeof _a === "string" && typeof _b === "string") {
		if (tryDate === true) {
			const __x = new Date(_a)
			const __y = new Date(_b)
			if (__x > __y) { return 1 }
			else if (__x === __y) { return 0 }
			else { return -1 }
		}
		if (tryNumeric === true) {
			const __x = parseFloat(_a)
			const __y = parseFloat(_b)
			if ((!Number.isNaN(__x)) && (!Number.isNaN(__y))) {
				return sign(__x - __y)
			}
		}

		return sign(new Intl.Collator().compare(_a || "", _b || ""))
	}
	else if (typeof _a === "number" && typeof _b === "number") {
		return sign((_a || 0) - (_b || 0))
	}
	else if (_a instanceof Date && _b instanceof Date) {
		const largerDate = _a
		const smallerDate = _b
		if (largerDate > smallerDate) { return 1 }
		else if (largerDate === smallerDate) { return 0 }
		else { return -1 }
	}
	else if (typeof _a !== typeof _b) { // When both values have different types
		if (tryNumeric) {
			const _aa = typeof _a === "number"
				? _a
				: typeof _a === "string"
					? parseFloat(_a)
					: 0
			const _bb = typeof _b === "number"
				? _b
				: typeof _b === "string"
					? parseFloat(_b)
					: 0
			// If both types could succesfully be turned into numbers, we compare it numerically
			if (!isNaN(_bb) && !isNaN(_aa)) {
				return sign(_aa - _bb)
			}
		}
		return typeof _a === "string" ? 1 : -1 // Strings will appear last
	}
	else {
		return _a === _b ? 0 : 1
	}
}

export function flattenFilters<T extends Rec = Rec>(filter: RecordFilter<T, "AND">): FilterSingle<T>[] {
	return isFilterSingle(filter)
		? [filter]
		: [...flattenFilters(filter[0]), ...flattenFilters(filter[2])]
}
export function rollupFilters<T extends Rec = Rec>(filters: FilterSingle<T>[]): RecordFilter<T, "AND"> | undefined {
	if (filters.length === 0) return undefined
	if (filters.length === 1) return first(filters)
	return [first(filters), "AND", rollupFilters([...skip(filters, 1)])!] satisfies FilterPair<T, "AND">
}

export function isFilterPair<T extends Rec = Rec>(filter?: RecordFilter<T>): filter is FilterPair<T> {
	return hasValue(filter) && (filter[1] === "AND" || filter[1] === "OR")
}
export function isFilterSingle<T extends Rec = Rec>(filter?: RecordFilter<T>): filter is FilterSingle<T> {
	return hasValue(filter) && filter[1] !== "AND" && filter[1] !== "OR"
}
