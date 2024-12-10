import { prependIfNotEmpty } from "../ascii"
import { Sequence } from "../collections/containers"
import { isError, stringify, type Rec, type Tuple } from "../common"
import { pick } from "../object"

export type ResultBasic<T = unknown, E = StdError> = (Pick<Err<T, E>, "type" | "error"> | Pick<Ok<T, E>, "type" | "value">)
export function getBasicResult<T = unknown, E = StdError>(result: Result<T, E>): ResultBasic<T, E> {
	return result.isOk()
		? { type: result.type, value: result.value }
		: { type: result.type, error: result.error }
}
export function unwrapOr<T = unknown, E = StdError>(result: ResultBasic<T, E>, defaultValue: T) {
	return result.type === "ok" ? result.value : defaultValue
}

/** Creates a successful Result with the given value.
 * @param value The value of the successful computation.
 * @returns A Result with the 'ok' type and the provided value.
 */
export function ok<T, E = StdError>(value: T): Ok<T, E> {
	return {
		type: 'ok',
		value,
		unwrap: () => value,
		unwrapOr: () => value,
		unwrapOrElse: () => value,
		isErr: (() => false) as any,
		isOk: (() => true) as any,

		valWithGenericError: function () { return this as Ok<T, any> },

		flatMap: (fn) => fn(value),
		match: (handlers) => handlers.Ok(value),
		map: <U>(fn: (value: T) => U): Result<U, E> => {
			try {
				return ok(fn(value))
			}
			catch (error) {
				return err(error as E)
			}
		},
		flatMapAsync: async (fn) => fn(value)
	}
}
/** Creates a failed Result with the given error.
 * @param error The error that caused the computation to fail.
 * @returns A Result with the 'error' type and the provided error.
 */
export function err<T = any, E = StdError>(error: E): Err<T, E> {
	return {
		type: 'error',
		error,
		unwrap: () => { throw error },
		unwrapOr: (defaultValue: T) => defaultValue,
		unwrapOrElse: (fn: (error: E) => T) => fn(error),
		isErr: (() => true) as any,
		isOk: (() => false) as any,

		errWithGenericValue: function () { return this as Err<any, E> },
		stringify(sanitized = false) { return stringifyError(error, { sanitized }) },

		flatMap: () => err(error),
		match: (handlers) => handlers.Err(error),
		map<U>(_fn: (value: T) => U): Result<T, E> { return this },
		flatMapAsync: async () => err(error)
	}
}

/** Result of a computation that eithers succeeds with a value of type T or fails with an error of type E.*/
export type Result<T = unknown, E = StdError> = (Err<T, E> | Ok<T, E>)

interface BaseResult<T, E> {
	/** Returns true if the Result is an error, false otherwise.*/
	isErr(this: Result<T, E>): this is Err<T, E>
	/** Returns true if the Result is successful, false otherwise.*/
	isOk(this: Result<T, E>): this is Ok<T, E>

	/** Returns the value of the Result if it is successful, otherwise throws an error.*/
	unwrap(): T
	/** Returns the value of the Result if it is successful, otherwise returns the provided default value.*/
	unwrapOr(defaultValue: T): T
	/** Returns the value of the Result if it is successful, otherwise calls the provided function with the error and returns its result.*/
	unwrapOrElse(fn: (error: E) => T): T
}

/** Represents a failed computation.*/
export interface Err<T = any, E = StdError> extends BaseResult<T, E>, MatchResult<T, E>, LeftFunctor<T, E> {
	type: 'error'
	error: E
	errWithGenericValue(): Err<any, E>
	stringify(): string
}
/** Represents a successful computation.*/
export interface Ok<T = any, E = StdError> extends BaseResult<T, E>, MatchResult<T, E>, RightFunctor<T, E> {
	type: 'ok'
	value: T
	valWithGenericError(): Ok<T, any>
}

export interface MatchResult<T, E> {
	match<R>(this: Result<T, E>, handlers: {
		Ok: (value: T) => R,
		Err: (error: E) => R
	}): R
}
export interface BaseResultFunctor<T, E> {
	flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E>
	flatMapAsync<U>(fn: (value: T) => Promise<Result<U, E>>): Promise<Result<U, E>>
}
export interface LeftFunctor<T, E> extends BaseResultFunctor<T, E> {
	map<U>(fn: (value: T) => U): Result<T, E>
}
export interface RightFunctor<T, E> extends BaseResultFunctor<T, E> {
	map<U>(fn: (value: T) => U): Result<U, E>
}

export function stringifyError(error: any, options?: { descOnly?: boolean, sanitized?: boolean }) {
	return isStdError(error)
		? options?.sanitized ?? false
			? (options?.descOnly ?? false) && error.errCode !== "internal"
				? ""
				: `${stdErrorCodes[error.errCode]}`
			: options?.descOnly ?? false
				? error.description ?? ""
				: `${stdErrorCodes[error.errCode]}${prependIfNotEmpty(String(error.description), ": ")}`

		: isError(error)
			? `${error.name}${error.message}${prependIfNotEmpty(stringify(error.cause ?? ""), ": ")}`
			: stringify(error)
}

export function isStdError(e: any): e is StdError {
	return (e !== null && typeof e === "object" && "errCode" in e)
}

export const errorCtors = {
	internal: function (reason?: string) {
		return { errCode: "internal", description: reason }
	},
	unspecified: function (reason?: string) {
		return { errCode: "general", description: reason }
	},
	badInput: function (reason?: string) {
		return { errCode: 'bad-input', description: reason }
	}
} satisfies Rec<(...args: any[]) => StdError>

export const errorResultCtors = {
	internal: function (reason?: string) {
		return err({ errCode: "internal", description: reason })
	},
	unspecified: function (reason?: string) {
		return err({ errCode: "internal", description: reason })
	},
	badInput: function (reason?: string) {
		return err({ errCode: "bad-input", description: reason })
	},
} satisfies Rec<(...args: any[]) => Result<any, StdError>>

export type StdError<E extends keyof typeof stdErrorCodes = keyof typeof stdErrorCodes, D = any> = {
	errCode: E,
	description?: string,
	details?: D
}
export const stdErrorCodes = Object.freeze({
	"bad-input": "Input understood but invalid or incomplete for intended action",
	"malformed-input": "Input not understood or not parseable",
	"no-connection": "Network connection cannot be establised",
	"access-denied": "Access to resource is denied",
	"not-found": "Resource not found",
	"conflict": "Action on resource conflicts with its current state",
	"time-out": "Time-out occured waiting for completion of action",
	"resources-exhausted": "System resources exhausted",
	"not-implemented": "Operation not implemented",
	"runtime": "Runtime error",
	"internal": "Internal system error",
	"general": "General error"
})


export function asResultFx<A extends any[], R>(fn: (..._: A) => R, getErr?: (e: any) => StdError): (..._: A) => Result<R> {
	return (..._: A) => {
		try {
			return ok(fn(..._))
		}
		catch (e) {
			return getErr
				? err(getErr(e))
				: errorResultCtors.unspecified(String(e))
		}
	}
}
export function asAsyncResultFx<A extends any[], R>(fn: (..._: A) => Promise<R>, getErr?: (e: any) => StdError): (..._: A) => Promise<Result<R>> {
	return async (..._: A) => {
		try {
			return ok(await fn(..._))
		}
		catch (e) {
			return getErr
				? err(getErr(e))
				: errorResultCtors.unspecified(String(e))
		}
	}
}

export async function expect<T, E, R>(_: Result<T, E> | Promise<Result<T, E>>, errorCallback: (error: E) => R) {
	const result = await _
	return (result.isErr())
		? errorCallback(result.error)
		: result.value
}
export async function inject<T, E, I extends Rec>(_: Result<T, E> | Promise<Result<T, E>>, injected: I) {
	const result = await _
	return (result.isErr())
		? result
		: ok({ ...result.value, ...injected }) satisfies Ok<T & I, any>
}

export function formatErrorMsgs(messages: string[], subsequentPrefix = `	Due to `) {
	const seqMsgs = new Sequence(messages)
	return `\n${seqMsgs.first()}.\n${seqMsgs
		.skip(1)
		.map(msg => `${subsequentPrefix}${msg}.`)
		.toArray()
		.join("\n")}`
}

// export type StdError = (typeof _StdErrors)[keyof typeof _StdErrors]
/*const _StdErrors = {
	NotFound: { errCode: "not-found" } as const,
	NoConnection: { errCode: "no-connection" } as const,
	NoAccess: { errCode: "access-denied" } as const,
	TimeOut: {
		errCode: "time-out", details: undefined as undefined | {
			elapsedTime?: number,
			unitsOfTime?: "milliseconds" | "seconds" | "hours" | "days"
		}
	} as const,
	ExhaustedResource: {
		errCode: "resources-exhausted",
		details: undefined as undefined | {
			resource?: (
				| "disk-space"
				| "connections"
				| "invocations"
				| "cursor"
				| "memory"
				| "stack"
				| "tokens"
				| "general"
			)
		}
	} as const,
	BadInput: {
		errCode: "bad-input",
		details: undefined as (
			| undefined
			| string
			| Tuple<string, `is-${("of-wrong-type" | "unparseable" | "out-of-range" | "missing" | "superflous")}`>[]
		)

	} as const,
	NotImplemented: {
		errCode: "not-implemented",
		details: undefined as undefined | {
			operation?: string // what operation is not implemented
		}
	} as const,
	Conflict: {
		errCode: "conflict"
	} as const,
	Runtime: {
		errCode: "runtime",
		details: undefined as undefined | {
			type?: "null-reference" | "index-out-of-bounds" | "divide-by-zero" | "integer-overflow" | "integer-underflow"
		}
	} as const,
	Internal: { errCode: "internal", details: undefined as undefined | { reason?: string } } as const,
	Unspecified: { errCode: "general", details: undefined as undefined | { reason?: string } } as const
} satisfies Rec<CodedError>
*/

/* export async function coalesceAsync<T, E>(results: Result<T, E>[] | Promise<Result<T, E>[]>): Promise<Result<T[], E>> {
	return Promise.resolve(results).then(r => {
		const okays = [...map(filter(r, _ => _.isOk()), r => r.value)]
		const errors = [...map(filter(r, _ => _.isErr()), r => r.error)]

		const ret = (okays.length === r.length
			? ok(okays)
			: err((1)) // ToDo: fix this!
		) satisfies Result<T[], E[]>

		return ret
	})
}*/

/*export type GeneralError = (
	| {
		code: "Not-Found"
	}
	| {
		code: "No-Connection" // Error connecting to storage
	}
	| {
		code: "No-Access" // Error gaining access to storage
	}
	| {
		code: "Multiple-Objects" // More than one object found
		details: { identifiers: string[] }
	}
	| {
		code: "Time-Out" // More than one object found
		details: {
			identifiers: string[]
		}
	} | {
		code: "Resources-Exhaused",
		details: {
			resource: string
		}
	}
)*/
/*export function reinterpretedError(error: TypedError, interpretation: string): TypedError {
	return {
		code: error.code,
		description: `${interpretation}\n${error.description}`
	}
}
export function internalizedError(err: TypedError, message?: string): { error: TypedError } {
	console.error(`${err.description}`)
	return {
		error: {
			code: "internal-bug",
			description: message ?? sentenceCase(spaceCase(err.code))
		}
	}
}*/



