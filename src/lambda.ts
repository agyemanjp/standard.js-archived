
/** Returns -1 if a is smaller than b; 0 if a & b are equal, and 1 if a is bigger than b */
export type Ranker<X = unknown> = (a: X, b: X) => number
/** Returns true if a and b are equal, otherwise returne false */
export type Comparer<X = unknown> = (a: X, b: X) => boolean
export type Hasher<X = unknown, Y extends string | number | symbol = number> = (a?: X) => Y
export type Projector<X = unknown, Y = unknown> = (value: X) => Y
export type ProjectorIndexed<X = unknown, Y = unknown, I = unknown> = (value: X, indexOrKey: I) => Y
export type Predicate<X = unknown> = (value: X) => boolean
export type Reducer<X = unknown, Y = unknown> = (prev: Y, current: X) => Y
export type ReducerIndexed<X = unknown, Y = unknown, I = unknown> = (prev: Y, current: X, indexOrKey: I) => Y


export function compare<T>(x: T, y: T, comparer?: Projector<T, unknown>, tryNumeric = false): number {
	// eslint-disable-next-line fp/no-let
	let _x: unknown = comparer ? comparer(x) : x
	// eslint-disable-next-line fp/no-let
	let _y: unknown = comparer ? comparer(y) : y

	if (typeof _x === "string" && typeof _y === "string") {

		if (tryNumeric === true) {
			const __x = parseFloat(_x)
			const __y = parseFloat(_y)
			if ((!Number.isNaN(__x)) && (!Number.isNaN(__y))) {
				return __x - __y
			}
		}

		return new Intl.Collator().compare(_x || "", _y || "")
	}
	else if (typeof _x === "number" && typeof _y === "number") {
		return (_x || 0) - (_y || 0)
	}
	else if (_x instanceof Date && _y instanceof Date) {
		// eslint-disable-next-line fp/no-mutation
		_x = _x || new Date()
		// eslint-disable-next-line fp/no-mutation
		_y = _y || new Date()
		if ((_x as Date) > (_y as Date))
			return 1
		else if (_x === _y)
			return 0
		else
			return -1
	}
	else
		return _x === _y ? 0 : 1
}
export function getRanker<T>(args: { projector: Projector<T, unknown>, tryNumeric?: boolean/*=false*/, reverse?: boolean/*=false*/ }): Ranker<T> {
	//console.log(`generating comparer, try numeric is ${tryNumeric}, reversed is ${reverse} `)
	return (x: T, y: T) => {
		return compare(x, y, args.projector, args.tryNumeric) * (args.reverse === true ? -1 : 1)
	}
}
export function getComparer<T>(projector: Projector<T, unknown>, tryNumeric = false/*, reverse = false*/): Comparer<T> {
	//console.log(`generating comparer, try numeric is ${tryNumeric}, reversed is ${reverse} `)
	return (x: T, y: T) => {
		return compare(x, y, projector, tryNumeric) === 0
	}
}
