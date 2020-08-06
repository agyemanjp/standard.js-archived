"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConsonant = exports.isVowel = exports.isDigit = exports.from = exports.CharASCII = void 0;
/** ASCII-only character functionality */
class CharASCII {
    constructor(charCode) {
        if (charCode < 0)
            throw new Error(`Invalid argument: must be non-negative`);
        if (charCode > 128)
            throw new Error(`Invalid argument: must be less than 128`);
        this.char = String.fromCharCode(charCode);
        //assert.ok(this.char.length === 1, `CharASCII can't be initialized with string of length greater than 1`)
    }
    isDigit() {
        return [...new Array(10).keys()].some(i => this.char === String(i));
    }
    isVowel() {
        return ["a", "e", "i", "o", "u"].includes(this.char);
    }
    isConsonant() {
        return !this.isVowel();
    }
}
exports.CharASCII = CharASCII;
function from(charCode) {
    if (charCode < 0)
        throw new Error(`Invalid argument: must be non-negative`);
    if (charCode > 128)
        throw new Error(`Invalid argument: must be less than 128`);
    return String.fromCharCode(charCode);
    //assert.ok(this.char.length === 1, `CharASCII can't be initialized with string of length greater than 1`)
}
exports.from = from;
function isDigit(char) {
    return [...new Array(10).keys()].some(i => char === String(i));
}
exports.isDigit = isDigit;
function isVowel(char) {
    return ["a", "e", "i", "o", "u"].includes(char);
}
exports.isVowel = isVowel;
function isConsonant(char) {
    return !isVowel(char);
}
exports.isConsonant = isConsonant;
// function validate(str: string) {
// 	if (str.length > 1)
// 		throw new Error(`Invalid char: must have unit length`)
// }
