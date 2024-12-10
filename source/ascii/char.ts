import type { Digit } from "../numeric"
import type { Vowel, Consonant } from "./types"

export function charFrom(charCode: number) {
	if (charCode < 0)
		throw new Error(`Invalid argument: must be non-negative`)
	if (charCode > 128)
		throw new Error(`Invalid argument: must be less than 128`)

	return String.fromCharCode(charCode)
	//assert.ok(this.char.length === 1, `CharASCII can't be initialized with string of length greater than 1`)
}

export function isVowel(char: string): char is Vowel {
	return ["a", "e", "i", "o", "u"].includes(char.toLowerCase())
}

export function isConsonant(char: string): char is Consonant {
	return ["B", "C", "D", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "V", "W", "X", "Y", "Z"].includes(char.toUpperCase())
}

export function isDigit(char: string): char is `${Digit}` {
	return [...new Array(10).keys()].some(i => char === String(i))
}


/** ASCII-only character functionality */
export class Char {
	protected readonly char: string

	constructor(charCode: number) {
		if (charCode < 0)
			throw new Error(`Invalid argument: must be non-negative`)
		if (charCode > 128)
			throw new Error(`Invalid argument: must be less than 128`)

		this.char = String.fromCharCode(charCode)
		//assert.ok(this.char.length === 1, `CharASCII can't be initialized with string of length greater than 1`)
	}

	isDigit() { return isDigit(this.char) }
	isVowel() { return isVowel(this.char) }
	isConsonant() { return isConsonant(this.char) }
}
