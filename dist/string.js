"use strict";
/* eslint-disable fp/no-mutating-methods */
/* eslint-disable fp/no-unused-expression */
/* eslint-disable fp/no-let */
/* eslint-disable fp/no-class */
/* eslint-disable no-unused-expressions */
/* eslint-disable fp/no-rest-parameters */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable fp/no-mutation */
/* eslint-disable fp/no-loops */
Object.defineProperty(exports, "__esModule", { value: true });
exports.stdChar = exports.stdString = void 0;
class stdString extends global.String {
    constructor(str) {
        super(str);
    }
    isWhiteSpace() {
        return this.replace(/^\s+|\s+$/g, '').length === 0;
    }
    isUpperCase() {
        return this.toUpperCase() === this.valueOf();
    }
    isLowerCase() {
        return this.toLowerCase() === this.valueOf();
    }
    isEmptyOrWhitespace() {
        return this.strip([" ", "\n", "\t", "\v", "\r"]).length === 0;
    }
    prependSpaceIfNotEmpty() {
        if (this.isEmptyOrWhitespace())
            return "";
        else
            return " " + this;
    }
    /** truncate this string by lopping a specified number of characters from the end */
    truncate(numChars) {
        return new stdString(this.substr(0, this.length - numChars));
    }
    toSnakeCase() {
        return new stdString([...this.tokenizeWords()].join("_"));
    }
    toCamelCase() {
        return new stdString([...this.tokenizeWords()].map(word => word.toTitleCase).join("_"));
    }
    toSpace() {
        return new stdString([...this.tokenizeWords({
                separateCaseBoundary: "upper",
                seperatorChars: ["-", "_", " ", "    ", "\t"]
            })].join(" "));
    }
    toTitleCase() {
        return new stdString(this.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase()));
    }
    /** Transforms single or multiple consecutive white-space characters into single spaces
     * @param chars
     */
    cleanWhitespace(chars) {
        if (["null", "undefined", "array"].indexOf(typeof (chars)) < 0)
            throw `String.cleanWhitespace(): Invalid chars argument type; expected 'null', 'undefined', or 'array'; found ${typeof (chars)}`;
        const _chars = !(chars) ? ["\n", "\t", "\v", "\r"] : chars;
        let result = "";
        for (let i = 0; i < this.length; i++) {
            const val = this[i];
            result += (_chars.indexOf(val) < 0 ? val : " ");
        }
        return result.split(/[ ]{2,}/g).join(" ");
    }
    isURL() {
        const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return pattern.test(this.toString());
    }
    getCharacters(container) {
        const arr = [...this].map(ch => new stdString(ch));
        return container(arr);
    }
    trimLeft(...strings) {
        let str = this.toString();
        strings.forEach(_str => {
            if (str.toLowerCase().startsWith(_str.toLowerCase()))
                str = str.substr(_str.length);
        });
        return str;
    }
    trimRight(...strings) {
        let str = this.toString();
        strings.forEach(_str => {
            if (str.toLowerCase().endsWith(_str.toLowerCase()))
                str = str.substr(0, str.length - _str.length);
        });
        return str;
    }
    tokenizeWords(args) {
        var _a, _b, _c;
        //console.log(`starting tokenizeWords for "${this.valueOf()}"`)
        const separateCaseBoundary = (_a = args === null || args === void 0 ? void 0 : args.separateCaseBoundary) !== null && _a !== void 0 ? _a : "upper";
        const seperatorChars = (_b = args === null || args === void 0 ? void 0 : args.seperatorChars) !== null && _b !== void 0 ? _b : ["-", "_", " ", "    ", "\t"];
        const container = (_c = args === null || args === void 0 ? void 0 : args.container) !== null && _c !== void 0 ? _c : (items => items);
        const words = [];
        let currentWord = "";
        let lastChar = this[0];
        const pushWord = (str = "") => {
            if (currentWord.length > 0) {
                words.push(currentWord);
                //console.log(`pushed ${currentWord} to words, now ${JSON.stringify(words)}`)
            }
            //console.log(`set currentWord to ${str}`)
            currentWord = str;
        };
        const chars = [...this.getCharacters(container)];
        // console.log(`chars array: ${JSON.stringify(chars)}`)
        for (const ch of chars) {
            console.assert(ch !== undefined, `String.tokenizeWords(): ch is undefined`);
            //console.log(`testing char "${ch.valueOf()}"`)
            if (seperatorChars.includes(ch.valueOf())) {
                //console.log(`separators include char tested, will push ${currentWord} to words`)
                pushWord();
            }
            else {
                //console.log(`separators do not include char tested, testing for case boundary`)
                const nowCase = ch.getCase();
                const lastCase = new stdString(lastChar).getCase();
                const test = ((separateCaseBoundary === "none") ||
                    (seperatorChars.includes(lastChar)) ||
                    (lastCase === undefined) ||
                    (nowCase === undefined) ||
                    (nowCase !== separateCaseBoundary) ||
                    (nowCase === lastCase));
                if (test === false) {
                    //console.log(`case boundary test is true, pushing `)
                    pushWord(ch.valueOf());
                }
                else {
                    //console.log(`case boundary test is false, concatenating char to currentWord`)
                    currentWord = currentWord.concat(ch.valueOf());
                    //console.log(`currentWord concatenated to ${currentWord}`)
                }
            }
            // TTLoUKmidiForm
            // TTL-o-UK-midi-F-orm
            lastChar = ch.valueOf();
            //console.log(`lastChar set to ${lastChar}`)
        }
        //console.log(`Outer loop, pushing currentWord "${currentWord}" to words`)
        pushWord();
        //let result = words.map(x => new String__(x))
        //console.log(`result of tokenizeWords(${this.valueOf()}) = ${words}`)
        return container(words.map(x => new stdString(x)));
    }
    /** Shorten a string by placing an ellipsis at the middle of it.
     * @param maxLen is the maximum length of the new shortened string
     */
    shorten(maxLen) {
        const title = this.toString();
        if (title.length <= maxLen)
            return new stdString(title);
        let i = 0, j = title.length - 1;
        let left = "", right = "";
        let leftCount = 0, rightCount = 0;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            left += title[i];
            leftCount += 1;
            i += 1;
            if (leftCount + rightCount + 3 >= maxLen)
                break;
            right += title[j];
            rightCount += 1;
            j -= 1;
            if (leftCount + rightCount + 3 >= maxLen)
                break;
        }
        // eslint-disable-next-line fp/no-mutating-methods
        right = right.split("").reverse().join("");
        return new String(left + "..." + right);
    }
    /** returns the case of input string
     * if string contains only special characters, 'upper' is returned
     * @param str the input string
     */
    getCase() {
        if (this.toLowerCase() === this.toUpperCase())
            return undefined;
        else if (this.isUpperCase())
            return "upper";
        else
            return "lower";
    }
    strip(chars) {
        if (!globalThis.Array.isArray(chars))
            throw `String.strip(): Invalid chars argument type; expected 'Array'; found ${typeof (chars)}`;
        let result = "";
        for (let i = 0; i < this.length; i++) {
            if (chars.indexOf(this[i]) < 0)
                result += this[i];
        }
        return result;
    }
    plural() {
        const thisLower = this.toString().toLowerCase();
        // eslint-disable-next-line init-declarations, fp/no-let
        let result;
        const singulars = ["sheep", "series", "species", "deer", "ox", "child", "goose", "man", "woman", "tooth", "foot", "mouse", "person"];
        const plurals = ["sheep", "series", "species", "deer", "oxen", "children", "geese", "men", "women", "teeth", "feet", "mice", "people"];
        const match = singulars.indexOf(this.toString().toLowerCase());
        if (match >= 0) {
            result = plurals[match];
        }
        else {
            if (this.toString() === "") {
                result = ("");
            }
            else if (thisLower.endsWith("us") && this.length > 4) {
                result = (this.truncate(2).concat("i"));
            }
            else if (thisLower.endsWith("sis")) {
                result = (this.truncate(2).concat("es"));
            }
            else if (["s", "ss", "sh", "ch", "x", "z"].some(x => thisLower.endsWith(x))) {
                result = (this.concat("es"));
            }
            else if (thisLower.endsWith("ife")) { // e.g., wife -> wives
                result = (this.truncate(3).concat("ives"));
            }
            else if (thisLower.endsWith("lf")) { // e.g., elf -> elves
                result = (this.truncate(2).concat("lves"));
            }
            else if (thisLower.endsWith("y") && new stdChar(this.charCodeAt(this.length - 2)).isConsonant()) {
                result = this.truncate(1).concat("ies");
            }
            else if (thisLower.endsWith("y") && new stdChar(this.charCodeAt(this.length - 2)).isVowel()) {
                result = (this.concat("s"));
            }
            else if (thisLower.endsWith("o") && !["photo", "piano", "halo"].includes(this.toString())) {
                result = (this.concat("es"));
            }
            else if (thisLower.endsWith("on") || this.toString() === ("criterion")) {
                result = (this.truncate(2).concat("a"));
            }
            else {
                result = this.concat("s");
            }
        }
        return new stdString(this.isUpperCase() ? result.toUpperCase() : result);
    }
    split(arg) {
        if (typeof arg === "object")
            return super.split(arg);
        else if (typeof arg !== "number") {
            return super.split(arg);
        }
        else {
            const numChunks = Math.ceil(this.length / arg);
            const chunks = new Array(numChunks);
            for (let i = 0, o = 0; i < numChunks; ++i, o += arg) {
                chunks[i] = this.substr(o, arg);
            }
            return chunks;
        }
    }
}
exports.stdString = stdString;
/** ASCII-only character functionality */
class stdChar {
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
exports.stdChar = stdChar;
//# sourceMappingURL=string.js.map