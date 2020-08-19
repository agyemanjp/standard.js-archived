/* eslint-disable indent */
/* eslint-disable brace-style */
/* eslint-disable fp/no-rest-parameters */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Tuple, Obj, isArray } from "../utility"
import { Predicate, Projector } from "../functional"


export function keys<T extends Obj>(obj: T): (keyof T)[]
export function keys<K extends string, V>(obj: Record<K, V>): K[]
export function keys(obj: any) { return Object.keys(obj) }

export function fromKeyValues<T, K extends string = string>(keyValues: Tuple<K, T>[]) {
	const obj = {} as Record<K, T>
	// eslint-disable-next-line fp/no-unused-expression
	keyValues.forEach(kvp => {
		// eslint-disable-next-line fp/no-mutation
		obj[kvp[0]] = kvp[1]
	})
	return obj
}

export function entries<V, K extends string>(obj: Record<K, V>): Tuple<K, V>[]
export function entries<V, K extends string, T extends Record<K, V>>(obj: T): Tuple<K, V>[]
export function entries(obj: Obj) { return keys(obj).map(key => new Tuple(key, obj[key])) }

export function map<K extends string, X, Y>(obj: Record<K, X>, projector: Projector<X, Y, K>): Record<K, Y>
export function map<K extends string, X, Y, T extends Record<K, X>>(obj: T, projector: Projector<X, Y, K>): Record<K, Y>
export function map<X, Y>(obj: Obj<string, X>, projector: Projector<X, Y, string>) {
	const _entries = entries(obj)
	const mapped = _entries.map(kv => new Tuple(kv[0], projector(kv[1], kv[0])))
	const newObj = fromKeyValues(mapped)
	return newObj
}

export function filter<K extends string, V>(obj: Obj<K, V>, predicate: Predicate<V>): Partial<Obj<K, V>>
export function filter<T extends Obj>(obj: T, predicate: Predicate<T[keyof T]>): Partial<T>
export function filter(obj: Obj, predicate: Predicate<unknown>) {
	return fromKeyValues(entries(obj).filter(predicate))
}

export function pick<T extends Obj, K extends keyof T>(obj: T, ..._keys: K[]): Record<K, T[K]> {
	const result = {} as Pick<T, K>
	// eslint-disable-next-line fp/no-unused-expression, fp/no-mutation
	_keys.forEach(k => result[k] = obj[k])
	return result
}

export function omit<T extends Obj, K extends keyof T>(obj: T, ..._keys: K[]): Omit<T, K> {
	const result = obj
	// eslint-disable-next-line fp/no-unused-expression, fp/no-mutation, fp/no-delete
	_keys.forEach(k => delete result[k])
	return result
}

// const _ = filter({ str: "", num: 1 }, x => x === undefined)

export function cloneShallow<T>(val: T): T {
	return Object.assign({}, val)
}

export function isMergeableObject(value: unknown) {
	const isNonNullObject = (_value: unknown) => !!_value && typeof _value === 'object'

	// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
	const canUseSymbol = typeof Symbol === 'function' && Symbol.for
	const REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7
	const isReactElement = (_value: any) => _value.$$typeof === REACT_ELEMENT_TYPE

	const isSpecial = (x: unknown) => ['[object RegExp]', '[object Date]'].includes(Object.prototype.toString.call(x)) || isReactElement(x)

	return isNonNullObject(value) && !isSpecial(value)
}

export interface ObjectMergeOptions {
	arrayMerge?(target: unknown[], source: unknown[], options?: ObjectMergeOptions): any[];
	clone?: boolean;
	customMerge?: (key: string, options?: ObjectMergeOptions) => ((x: any, y: any) => any) | undefined;
	isMergeableObject?(value: unknown): boolean;
}

// function merge<X>(target: X, source: Partial<X> | undefined | null): X
// function merge<X>(target: Partial<X> | undefined | null, source: X): X
// function merge<X>(target: X, source: undefined | null): X
// function merge<X>(target: undefined | null, source: X): X
// function merge<X, Y>(target: X, source: Y): X & Y
export function deepmerge<T1, T2>(x: T1, y: T2, options?: ObjectMergeOptions): T1 & T2
export function deepmerge<T1, T2, T3>(x: T1, y: T2, options?: ObjectMergeOptions): T1 & T2 & T3
export function deepmerge<T1, T2, T3, T4>(x: T1, y: T2, options?: ObjectMergeOptions): T1 & T2 & T3 & T4
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deepmerge(options?: ObjectMergeOptions, ...args: any[]) {
	function emptyTarget(val: unknown) {
		return Array.isArray(val) ? [] : {}
	}

	type Key = | string | number | symbol
	type Any = object | string | number | symbol | boolean | bigint


	function cloneUnlessOtherwiseSpecified(value: unknown, _options: ObjectMergeOptions) {
		return (_options.clone !== false && _options.isMergeableObject && _options.isMergeableObject(value))
			? deepmerge(emptyTarget(value), value, _options)
			: value
	}

	function defaultArrayMerge(target: unknown[], source: unknown[], _options: ObjectMergeOptions) {
		return target.concat(source).map(function (element) {
			return cloneUnlessOtherwiseSpecified(element, _options)
		})
	}

	function getMergeFunction(key: string, _options: ObjectMergeOptions) {
		if (!_options.customMerge) {
			return deepmerge
		}
		const customMerge = _options.customMerge(key)
		return typeof customMerge === 'function' ? customMerge : deepmerge
	}

	function getEnumerableOwnPropertySymbols(target: Any) {
		return Object.getOwnPropertySymbols
			? Object.getOwnPropertySymbols(target).filter(function (symbol) {
				// eslint-disable-next-line no-prototype-builtins
				return target.propertyIsEnumerable(symbol)
			})
			: []
	}

	function getKeys(target: Any) {
		return (Object.keys(target) as (string | symbol)[]).concat(getEnumerableOwnPropertySymbols(target))
	}

	function propertyIsOnObject(object: object, property: string | number | symbol) {
		try {
			return property in object
		}
		catch (_) {
			return false
		}
	}

	// Protects from prototype poisoning and unexpected merging up the prototype chain.
	function propertyIsUnsafe(target: object, key: Key) {
		return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
			&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
				&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
	}

	function mergeObject(target: Obj, source: Obj, _options: ObjectMergeOptions & { isMergeableObject: (x: unknown) => boolean }) {
		const destination = {} as Obj
		if (_options.isMergeableObject(target)) {
			// eslint-disable-next-line fp/no-unused-expression
			getKeys(target).forEach(function (key) {
				// eslint-disable-next-line fp/no-mutation
				destination[key as any] = cloneUnlessOtherwiseSpecified(target[key as any], _options)
			})
		}
		// eslint-disable-next-line fp/no-unused-expression
		getKeys(source).forEach(function (key: any) {
			if (propertyIsUnsafe(target, key)) {
				return
			}

			if (propertyIsOnObject(target, key) && _options.isMergeableObject(source[key])) {
				// eslint-disable-next-line fp/no-mutation
				destination[key] = getMergeFunction(key, _options)(target[key], source[key], _options)
			}
			else {
				destination[key] = cloneUnlessOtherwiseSpecified(source[key], _options)
			}
		})
		return destination
	}

	const _deepmerge = (target: any, source: any, _options: ObjectMergeOptions) => {
		const __options = {
			arrayMerge: defaultArrayMerge,
			isMergeableObject: isMergeableObject,
			// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
			// implementations can use it. The caller may not replace it.
			cloneUnlessOtherwiseSpecified,
			..._options
		}

		if (isArray(source) !== isArray(target)) {
			return cloneUnlessOtherwiseSpecified(source, __options)
		}
		else if (isArray(source) && isArray(target)) {
			return __options.arrayMerge(target, source, __options)
		}
		else {
			return mergeObject(target, source, __options)
		}
	}

	return args.reduce(function (prev, next) {
		return _deepmerge(prev, next, options || {})
	}, {})
}
