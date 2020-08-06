"use strict";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable fp/no-class */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNumber = exports.isNumber = exports.isInteger = exports.isFloat = void 0;
function isFloat(value) {
    const parsed = typeof value === "number"
        ? value : Number.parseFloat(String(value));
    return (!Number.isNaN(parsed)) && (!Number.isInteger(parsed));
}
exports.isFloat = isFloat;
function isInteger(value) {
    const parsed = typeof value === "number"
        ? value : Number.parseFloat(String(value));
    return (!Number.isNaN(parsed)) && (Number.isInteger(parsed));
}
exports.isInteger = isInteger;
function isNumber(x) {
    return typeof x === "number" && !isNaN(x);
}
exports.isNumber = isNumber;
function parseNumber(value) {
    const parsed = typeof value === "number"
        ? value
        : Number.parseFloat(String(value));
    return (!Number.isNaN(parsed)) ? parsed : undefined;
}
exports.parseNumber = parseNumber;
