"use strict";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable fp/no-class */
Object.defineProperty(exports, "__esModule", { value: true });
exports.stdNumber = void 0;
class stdNumber extends global.Number {
    constructor(num) {
        // eslint-disable-next-line fp/no-unused-expression
        super(num);
    }
    static isFloat(value) {
        const parsed = typeof value === "number"
            ? value : Number.parseFloat(String(value));
        return (!Number.isNaN(parsed)) && (!Number.isInteger(parsed));
    }
    static isInteger(value) {
        const parsed = typeof value === "number"
            ? value : Number.parseFloat(String(value));
        return (!Number.isNaN(parsed)) && (Number.isInteger(parsed));
    }
    static isNumber(x) {
        return typeof x === "number" && !isNaN(x);
    }
    static parse(value) {
        const parsed = typeof value === "number"
            ? value
            : Number.parseFloat(String(value));
        return (!Number.isNaN(parsed)) ? parsed : undefined;
    }
}
exports.stdNumber = stdNumber;
//# sourceMappingURL=number.js.map