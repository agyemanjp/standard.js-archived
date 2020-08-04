
/** ASCII-only character functionality */
export class CharASCII {
	protected readonly char: string

	constructor(charCode: number) {
		if (charCode < 0)
			throw new Error(`Invalid argument: must be non-negative`)
		if (charCode > 128)
			throw new Error(`Invalid argument: must be less than 128`)

		this.char = String.fromCharCode(charCode)
		//assert.ok(this.char.length === 1, `CharASCII can't be initialized with string of length greater than 1`)
	}

	isDigit() {
		return [...new Array(10).keys()].some(i => this.char === String(i))
	}
	isVowel() {
		return ["a", "e", "i", "o", "u"].includes(this.char)
	}
	isConsonant() {
		return !this.isVowel()
	}
}

export function from(charCode: number) {
	if (charCode < 0)
		throw new Error(`Invalid argument: must be non-negative`)
	if (charCode > 128)
		throw new Error(`Invalid argument: must be less than 128`)

	return String.fromCharCode(charCode)
	//assert.ok(this.char.length === 1, `CharASCII can't be initialized with string of length greater than 1`)
}

export function isDigit(char: string) {
	return [...new Array(10).keys()].some(i => char === String(i))
}

export function isVowel(char: string) {
	return ["a", "e", "i", "o", "u"].includes(char)
}

export function isConsonant(char: string) {
	return !isVowel(char)
}

// function validate(str: string) {
// 	if (str.length > 1)
// 		throw new Error(`Invalid char: must have unit length`)
// }