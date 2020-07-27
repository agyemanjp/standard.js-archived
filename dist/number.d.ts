export declare class stdNumber extends global.Number {
    constructor(num: number);
    static isFloat(value: unknown): boolean;
    static isInteger(value: unknown): boolean;
    static isNumber(x: unknown): boolean;
    static parse(value: unknown): number | undefined;
}
