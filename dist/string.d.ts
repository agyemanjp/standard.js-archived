export declare class stdString extends global.String {
    constructor(str: string);
    isWhiteSpace(): boolean;
    isUpperCase(): boolean;
    isLowerCase(): boolean;
    isEmptyOrWhitespace(): boolean;
    prependSpaceIfNotEmpty(): string;
    /** truncate this string by lopping a specified number of characters from the end */
    truncate(numChars: number): stdString;
    toSnakeCase(): stdString;
    toCamelCase(): stdString;
    toSpace(): stdString;
    toTitleCase(): stdString;
    /** Transforms single or multiple consecutive white-space characters into single spaces
     * @param chars
     */
    cleanWhitespace(chars?: string[]): string;
    isURL(): boolean;
    getCharacters<C extends Iterable<stdString>>(container: {
        (items: Iterable<stdString>): C;
    }): C;
    trimLeft(...strings: string[]): string;
    trimRight(...strings: string[]): string;
    tokenizeWords<C extends Iterable<stdString>>(args?: {
        separateCaseBoundary?: "upper" | "lower" | "all" | "none";
        seperatorChars?: string[];
        container?: {
            (items: Iterable<stdString>): C;
        };
    }): Iterable<stdString>;
    /** Shorten a string by placing an ellipsis at the middle of it.
     * @param maxLen is the maximum length of the new shortened string
     */
    shorten(maxLen: number): String | stdString;
    /** returns the case of input string
     * if string contains only special characters, 'upper' is returned
     * @param str the input string
     */
    getCase(): "upper" | "lower" | undefined;
    strip(chars: string[]): string;
    plural(): stdString;
    split(arg: {
        [Symbol.split](string: string, limit?: number): string[];
    } | string | RegExp | number): string[];
}
/** ASCII-only character functionality */
export declare class stdChar {
    protected readonly char: string;
    constructor(charCode: number);
    isDigit(): boolean;
    isVowel(): boolean;
    isConsonant(): boolean;
}
