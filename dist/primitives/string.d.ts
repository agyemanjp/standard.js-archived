export declare class String extends global.String {
    constructor(str: string);
    isWhiteSpace(): boolean;
    isUpperCase(): boolean;
    isLowerCase(): boolean;
    isEmptyOrWhitespace(): boolean;
    prependSpaceIfNotEmpty(): string;
    /** truncate this string by lopping a specified number of characters from the end */
    truncate(numChars: number): String;
    toSnakeCase(): String;
    toCamelCase(): String;
    toSpace(): String;
    toTitleCase(): String;
    /** Transforms single or multiple consecutive white-space characters into single spaces
     * @param chars
     */
    cleanWhitespace(chars?: string[]): string;
    isURL(): boolean;
    getCharacters<C extends Iterable<String>>(container: {
        (items: Iterable<String>): C;
    }): C;
    trimLeft(...strings: string[]): string;
    trimRight(...strings: string[]): string;
    tokenizeWords<C extends Iterable<String>>(args?: {
        separateCaseBoundary?: "upper" | "lower" | "all" | "none";
        seperatorChars?: string[];
        container?: {
            (items: Iterable<String>): C;
        };
    }): Iterable<String>;
    /** Shorten a string by placing an ellipsis at the middle of it.
     * @param maxLen is the maximum length of the new shortened string
     */
    shorten(maxLen: number): String;
    /** returns the case of input string
     * if string contains only special characters, 'upper' is returned
     * @param str the input string
     */
    getCase(): "upper" | "lower" | undefined;
    strip(chars: string[]): string;
    plural(): String;
    split(arg: {
        [Symbol.split](string: string, limit?: number): string[];
    } | string | RegExp | number): string[];
}
