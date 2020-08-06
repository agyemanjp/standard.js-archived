/** ASCII-only character functionality */
export declare class CharASCII {
    protected readonly char: string;
    constructor(charCode: number);
    isDigit(): boolean;
    isVowel(): boolean;
    isConsonant(): boolean;
}
export declare function from(charCode: number): string;
export declare function isDigit(char: string): boolean;
export declare function isVowel(char: string): boolean;
export declare function isConsonant(char: string): boolean;
