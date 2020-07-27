"use strict";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable brace-style */
/* eslint-disable fp/no-unused-expression */
/* eslint-disable fp/no-mutation */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable init-declarations */
/* eslint-disable fp/no-let */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.asProgressiveGenerator = void 0;
const SLEEP_DURATION_MILLISECONDS = 100;
function asProgressiveGenerator(f, etaMillisecs) {
    return function wrappedFn(arg) {
        return __asyncGenerator(this, arguments, function* wrappedFn_1() {
            const worker = new Worker(URL.createObjectURL(new Blob([
                `(${function (_f) {
                    self.onmessage = (e) => { var e_1, _a; return __awaiter(this, void 0, void 0, function* () {
                        const generatorOrPromise = _f(e.data);
                        if ("then" in generatorOrPromise) {
                            const result = yield generatorOrPromise;
                            self.postMessage({ result, done: true }, "");
                        }
                        else {
                            try {
                                // eslint-disable-next-line fp/no-loops
                                for (var generatorOrPromise_1 = __asyncValues(generatorOrPromise), generatorOrPromise_1_1; generatorOrPromise_1_1 = yield generatorOrPromise_1.next(), !generatorOrPromise_1_1.done;) {
                                    const result = generatorOrPromise_1_1.value;
                                    self.postMessage(result, "");
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (generatorOrPromise_1_1 && !generatorOrPromise_1_1.done && (_a = generatorOrPromise_1.return)) yield _a.call(generatorOrPromise_1);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                            self.postMessage({ done: true }, "");
                        }
                    }); };
                }.toString()})(${f.toString()})`
            ], { type: 'text/javascript' })));
            let progress = { result: undefined, done: false, percentComplete: 0, message: "" };
            worker.onmessage = (e) => { progress = Object.assign({}, e.data); };
            worker.postMessage(arg);
            let iterations = 0;
            // eslint-disable-next-line fp/no-loops
            while (progress.done === false) {
                yield yield __await(Object.assign({ percentComplete: etaMillisecs
                        ? iterations++ * 100 / (etaMillisecs / SLEEP_DURATION_MILLISECONDS)
                        : 0, message: undefined }, progress));
                sleep(SLEEP_DURATION_MILLISECONDS);
            }
        });
    };
}
exports.asProgressiveGenerator = asProgressiveGenerator;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.sleep = sleep;
/* export const notConcurrent = <T>(proc: () => PromiseLike<T>): () => Promise<T> => {
    let inFlight: Promise<T> | false = false
    return () => {
        if (!inFlight) {
            inFlight = (async () => {
                try {
                    return await proc()
                }
                finally {
                    inFlight = false
                }
            })()
        }
        return inFlight
    }
}
*/ 
//# sourceMappingURL=async.js.map