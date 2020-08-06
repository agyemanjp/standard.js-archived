"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComparer = exports.getRanker = exports.compare = void 0;
function compare(x, y, comparer, tryNumeric = false) {
    // eslint-disable-next-line fp/no-let
    let _x = comparer ? comparer(x) : x;
    // eslint-disable-next-line fp/no-let
    let _y = comparer ? comparer(y) : y;
    if (typeof _x === "string" && typeof _y === "string") {
        if (tryNumeric === true) {
            const __x = parseFloat(_x);
            const __y = parseFloat(_y);
            if ((!Number.isNaN(__x)) && (!Number.isNaN(__y))) {
                return __x - __y;
            }
        }
        return new Intl.Collator().compare(_x || "", _y || "");
    }
    else if (typeof _x === "number" && typeof _y === "number") {
        return (_x || 0) - (_y || 0);
    }
    else if (_x instanceof Date && _y instanceof Date) {
        // eslint-disable-next-line fp/no-mutation
        _x = _x || new Date();
        // eslint-disable-next-line fp/no-mutation
        _y = _y || new Date();
        if (_x > _y)
            return 1;
        else if (_x === _y)
            return 0;
        else
            return -1;
    }
    else
        return _x === _y ? 0 : 1;
}
exports.compare = compare;
function getRanker(args) {
    //console.log(`generating comparer, try numeric is ${tryNumeric}, reversed is ${reverse} `)
    return (x, y) => {
        return compare(x, y, args.projector, args.tryNumeric) * (args.reverse === true ? -1 : 1);
    };
}
exports.getRanker = getRanker;
function getComparer(projector, tryNumeric = false /*, reverse = false*/) {
    //console.log(`generating comparer, try numeric is ${tryNumeric}, reversed is ${reverse} `)
    return (x, y) => {
        return compare(x, y, projector, tryNumeric) === 0;
    };
}
exports.getComparer = getComparer;
