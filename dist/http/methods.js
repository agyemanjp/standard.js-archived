"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAsync = exports.getAsync = exports.putAsync = exports.postAsync = void 0;
const request_1 = require("request");
const utils_1 = require("./utils");
const string_1 = require("../primitives/string");
function postAsync(request) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const data = utils_1.getHttpData(request.data);
            // eslint-disable-next-line fp/no-unused-expression
            request_1.post({
                uri: request.uri,
                body: data.body,
                headers: Object.assign(Object.assign({}, request.headers), { "Content-Type": data["Content-Type"] })
            }, utils_1.getResponseHandler(resolve, reject));
        });
    });
}
exports.postAsync = postAsync;
function putAsync(request) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const data = utils_1.getHttpData(request.data);
            // eslint-disable-next-line fp/no-unused-expression
            request_1.put({
                uri: request.uri,
                body: data.body,
                headers: Object.assign(Object.assign({}, request.headers), { "Content-Type": data["Content-Type"] })
            }, utils_1.getResponseHandler(resolve, reject));
        });
    });
}
exports.putAsync = putAsync;
function getAsync(request, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const queryParams = request.query ? `?${utils_1.asQueryParams(request.query)}` : "";
            // eslint-disable-next-line fp/no-unused-expression
            request_1.get({
                uri: `${new string_1.String(request.uri).trimRight("/")}${queryParams}`,
                headers: Object.assign({}, request.headers)
            }, utils_1.getResponseHandler(resolve, reject, opts));
        });
    });
}
exports.getAsync = getAsync;
function deleteAsync(request) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const queryParams = request.query ? utils_1.asQueryParams(request.query) : "";
            // eslint-disable-next-line fp/no-unused-expression
            request_1.del({
                uri: `${request.uri}?${queryParams}`,
                headers: Object.assign({}, request.headers)
            }, utils_1.getResponseHandler(resolve, reject));
        });
    });
}
exports.deleteAsync = deleteAsync;
