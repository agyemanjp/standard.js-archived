"use strict";
/* eslint-disable indent */
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasValue = void 0;
function hasValue(value) {
    switch (typeof value) {
        case "function":
        case "boolean":
        case "bigint":
        case "object":
        case "symbol":
            return (value !== null);
        case "undefined":
            return false;
        case "number":
            return (value !== null && !isNaN(value) && !Number.isNaN(value) && value !== Number.NaN);
        case "string":
            return value !== undefined && value !== null && value.trim().length > 0 && !/^\s*$/.test(value);
        //if(str.replace(/\s/g,"") == "") return false
    }
    return true;
}
exports.hasValue = hasValue;
