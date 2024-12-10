// import assert from "assert"
import type { CaseOf, SnakeCase, DashCase, CamelCase, Concat, CharAlphaNumeric } from "./types"
import { isConsonant, isVowel, isDigit, charFrom, Char } from "./char"
import { hasValue } from "../common"

const whitespaceChars = ["\n", "\t", "\v", "\r"]
const wordTokenSeperatorChars = [
	...whitespaceChars,
	"-", "_", "+", "^", "%", "=", " ", "\\", "/", "\t", "\n", "*", "$", "#", "@", "&", "(", ")", "!"
]
const singulars = ["sheep", "series", "species", "deer", "ox", "child", "goose", "man", "woman", "tooth", "foot", "mouse", "person"]
const plurals = ["sheep", "series", "species", "deer", "oxen", "children", "geese", "men", "women", "teeth", "feet", "mice", "people"]

export const tokenizeWords = (str: string, args?:
	{
		sepCaseChanges?: | "upper" | "lower" | "all" | "none", // default is "upper"
		sepChars?: Array<string>, // default is whitespace
	}): string[] => {

	const seperatorChars = new Set(args?.sepChars ?? [" ", "	", "\t", "\n", "-", "_"])
	const sepCaseChanges = args?.sepCaseChanges ?? "upper"

	const caseChanged = (_ch: string, _lastChar: string) => {
		const nowCase = getCase(_ch)
		const lastCase = getCase(_lastChar)
		return (
			(sepCaseChanges !== "none") && // we are considering case changes
			(!seperatorChars.has(_lastChar)) && // previous char is not a separator
			(lastCase !== undefined) && (lastCase !== "none" as any) &&
			(nowCase !== undefined) && (nowCase !== "none" as any) &&
			(nowCase === sepCaseChanges || sepCaseChanges === "all") &&
			(nowCase !== lastCase)
		)
	}
	const result: string[] = []
	let word = ""

	const strLength = str.length
	for (let i = 0; i < strLength; i++) {
		const ch = str[i] as string
		const lastChar = ((i > 0) ? str[i - 1] : str[0]) as string

		if (seperatorChars.has(ch) && word.length > 0) {
			result.push(word)
			word = ""
		}
		else if (caseChanged(ch, lastChar) && word.length > 0) {
			result.push(word)
			word = ch
		}
		else if (!seperatorChars.has(ch)) {
			word += ch
		}
	}

	if (word.length > 0) {
		result.push(word)
	}

	return result
}

export const isUpperCase = (str: string) => str.toUpperCase() === str.valueOf()
export const isLowerCase = (str: string) => str.toLowerCase() === str.valueOf()

/** Returns the case of input string; if string contains only special characters, undefined is returned */
export const getCase = <S extends string = string>(str: S): CaseOf<S> => (
	str.toLowerCase() === str.toUpperCase()
		? "none"
		: isUpperCase(str)
			? "upper"
			: "lower"
) as any

/** Convert the 1st character of input string to upper case, optionally converting rest of string to lowercase */
export const initialCaps = (str: string, lowerTail = true) => ((str[0] ?? "").toUpperCase() + (lowerTail
	? str.substring(1).toLowerCase()
	: str.substring(1))
)

/** Convert each token to sentence case */
export const titleCase = (str: string, lowerTail = true) => (
	[...tokenizeWords(str, { sepChars: [" "] })].map(s => initialCaps(s.toLowerCase(), lowerTail)).join(" ")
)

export const snakeCase = <S extends string = string>(str: S): SnakeCase<S> => (
	[...tokenizeWords(str)].map(token => token.toLowerCase()).join("_") as any
)

export const dashCase = <S extends string = string>(str: S): DashCase<S> => (
	[...tokenizeWords(str)].map(token => token.toLowerCase()).join("-") as any
)

export const camelCase = <S extends string = string>(str: S): CamelCase<S> => (
	[...tokenizeWords(str, { sepChars: wordTokenSeperatorChars })].map((word, index) => index > 0
		? initialCaps(word, true)
		: word.toLowerCase()).join("") as any
)

export const spaceCase = (str: string) => [...tokenizeWords(str)].join(" ")

export const isWhitespace = (str: string): boolean => str.replace(/^\s+|\s+$/g, '').length === 0
export const isEmptyOrWhitespace = (str: string) => stripChars(str, [" ", ...whitespaceChars]).length === 0

/** Transforms single or multiple consecutive white-space characters into single spaces */
export const cleanWhitespace = (str: string, chars?: string[]) => ([...str].map(ch => (chars ?? whitespaceChars).indexOf(ch) < 0 ? ch : " ")
	.join("")
	.split(/[ ]{2,}/g)
	.join(" ")
)
/** Prepends a string to input if input does not already start with that string */
export const ensureStartsWith = (str: string, prefix: string) => str.startsWith(prefix) ? str : `${prefix}{str}`

/** Prepend a prefix to input string if it is not empty */
export const prependIfNotEmpty = (str: string, prefix = " ") => isEmptyOrWhitespace(str) ? "" : `${prefix}${str}`

/** Strip out a set of chars from a string */
export const stripChars = (str: string, chars: string[]) => [...str].filter(ch => chars.indexOf(ch) < 0).join("")

/** Truncate this string by removing a specified number of characters from the end */
export const truncate = (str: string, numChars: number) => str.substr(0, str.length - numChars)

export const isURL = (str: string): boolean => new RegExp('^(https?:\\/\\/)?' + // protocol
	'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.+)+[a-z]{2,}|' + // domain name
	'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
	'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
	'(\\?[;&a-z\\d%_.~+=\\*()-]*)?' + // query string
	'(\\#[-a-z\\d_]*)?$', 'i' // fragment locator
).test(str)

export const trimLeft = (str: string, ...strings: string[]) => strings.reduce((prev, curr) =>
	(prev.toUpperCase().startsWith(curr.toUpperCase()))
		? prev.substring(curr.length)
		: prev,
	str // initial value
)
export const trimRight = (str: string, ...strings: string[]) => strings.reduce((prev, curr) =>
	(prev.toUpperCase().endsWith(curr.toUpperCase()))
		? prev.substring(0, prev.length - curr.length)
		: prev,
	str // initial value
)
export const plural = (str: string) => {

	const match = singulars.indexOf(str.toString().toLowerCase())
	if (match >= 0) {
		const chars = [...str]
		return [...plurals[match]!]
			.map((ch, i) => isUpperCase(chars[i < chars.length ? i : chars.length - 1]!)
				? ch.toUpperCase()
				: ch.toLowerCase()
			)
			.join("")
	}

	const lower = str.toLowerCase()
	return (() => {
		const _ = (nTruncate: number, suffix: string,) => {
			const truncated = truncate(str, nTruncate)
			const effectiveLastIndex = str.length - (nTruncate === 0 ? 1 : nTruncate)
			const ch = str[effectiveLastIndex]
			if (!ch) throw new Error(`${effectiveLastIndex} is not a valid index for ${str}`)
			return getCase(ch) === "upper"
				? truncated + suffix.toUpperCase()
				: truncated + suffix.toLowerCase()
		}

		switch (true) {
			case str.toString() === "":
				return ""
			case lower.endsWith("us") && str.length > 4:
				return _(2, "i")
			case (lower.endsWith("sis")):
				return _(2, "es")
			case ["s", "ss", "sh", "ch", "x", "z"].some(x => lower.endsWith(x)):
				return _(0, "es")
			case lower.endsWith("ife"):
				return _(2, "ves")
			case lower.endsWith("lf"):
				return _(2, "lves")
			case lower.endsWith("y") && isConsonant(charFrom(str.charCodeAt(str.length - 2))):
				return _(1, "ies")
			case lower.endsWith("y") && isVowel(charFrom(str.charCodeAt(str.length - 2))):
				return _(0, "s")
			case lower.endsWith("o") && !["photo", "piano", "halo"].includes(str.toString()):
				return _(0, "es")
			case lower.endsWith("on") || str.toString() === ("criterion"):
				return _(2, "a")
			default:
				return _(0, "s")
		}

	})()
}
export const split = (str: string, arg: { [Symbol.split](string: string, limit?: number): string[] } | string | RegExp | number) => {
	if (typeof arg === "object") { return str.split(arg) }
	else if (typeof arg !== "number") {
		return str.split(arg)
	}
	else {
		const numChunks = Math.ceil(str.length / arg)
		const chunks: string[] = new Array(numChunks)
		for (let i = 0, o = 0; i < numChunks; ++i, o += arg) {
			chunks[i] = str.substr(o, arg)
		}
		return chunks
	}
}
export const concat = <A extends string, B extends string>(a: A, b: B) => a.concat(b) as Concat<A, B>



export class String<Str extends string = string> extends globalThis.String {
	constructor(str: string) { super(str) }

	protected wrap<T, A extends any[]>(fn: <S extends string = string>(str: S, ..._args: A) => T): (..._args: A) => T extends string ? String<T> : T {
		return (..._args: A) => {
			const out = fn(this.toString(), ..._args)
			return (typeof out === "string" ? new String(out) : out) as any
		}
	}

	override toString(): Str {
		return super.toString() as any
	}

	isWhiteSpace = this.wrap(isWhitespace)
	isUpperCase = this.wrap(isUpperCase)
	isLowerCase = this.wrap(isLowerCase)
	isEmptyOrWhitespace = this.wrap(isEmptyOrWhitespace)
	ensureStartsWith = this.wrap(ensureStartsWith)
	prependSpaceIfNotEmpty = this.wrap(prependIfNotEmpty)
	// stripChars = this.wrap(stripChars)
	xyz = this.wrap(stripChars)

	getCase = this.wrap(getCase as (str: string) => "upper" | "lower" | "none")
	toTitleCase = this.wrap(titleCase)
	toSnakeCase = this.wrap(snakeCase)
	toCamelCase = this.wrap(camelCase)
	toSpace = this.wrap(spaceCase)

	/** Truncate this string by removing a specified number of characters from the end */
	truncate = this.wrap(truncate)

	// getCharacters = (): Iterable<String> => [...this].map(ch => new String(ch))

	/** Transforms single or multiple consecutive white-space characters into single spaces
	 * @param chars
	 */
	cleanWhitespace = this.wrap(cleanWhitespace)

	isURL = this.wrap(isURL)
	// trimLeft = this.wrap(trimLeft)
	// trimRight = this.wrap(trimRight)
	plural = this.wrap(plural)
	split = this.wrap(split)

	append = <S extends string = string>(str: S) => concat(this.toString(), str)
}

