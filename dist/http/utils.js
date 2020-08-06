"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkStatusCode = exports.getResponseHandler = exports.getHttpData = exports.asQueryParams = void 0;
const mime_types_1 = require("./mime-types");
const status_codes_1 = require("./status-codes");
function asQueryParams(obj, excludedValues = [undefined, null]) {
    return Object.keys(obj)
        .filter(k => /*obj.hasOwnProperty(k) &&*/ !excludedValues.includes(obj[k]))
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
        .join("&");
}
exports.asQueryParams = asQueryParams;
function getHttpData(data) {
    switch (data.type) {
        case "url":
            return {
                "Content-Type": "x-www-form-urlencoded",
                body: asQueryParams(data.body)
            };
        case "json":
            return {
                "Content-Type": "application/json",
                body: JSON.stringify(data.body)
            };
        case "raw":
            return {
                //"Content-Type": HttpMimeType.Octet,
                body: data.body
            };
        case "text":
            return {
                "Content-Type": mime_types_1.MimeType.Text,
                body: data.body.toString()
            };
        case "stream":
            return {
                //"Content-Type": HttpMimeType.Octet,
                body: data.body
            };
        case "buffer":
            return {
                //"Content-Type": HttpMimeType.Octet,
                body: data.body
            };
        case "multi":
            return {
                "Content-Type": mime_types_1.MimeType.Multi,
                body: data.body
            };
        default:
            throw new Error("Unknown data");
    }
}
exports.getHttpData = getHttpData;
exports.getResponseHandler = (resolve, reject, opts) => ((err, response) => {
    if (err) {
        // eslint-disable-next-line fp/no-unused-expression
        reject(err);
    }
    else {
        if ((opts === null || opts === void 0 ? void 0 : opts.badHttpCodeAsError) === true && response.statusCode.toString().startsWith("2")) {
            // eslint-disable-next-line fp/no-unused-expression
            reject(new Error(`HTTP Get: ${status_codes_1.HttpStatusCodes[response.statusCode]}`));
        }
        else {
            // eslint-disable-next-line fp/no-unused-expression
            resolve(response);
        }
    }
});
function checkStatusCode(response, errMessage) {
    if (!response.statusCode.toString().startsWith("2")) {
        const error = new Error(`${errMessage}: ${response.body}`);
        // eslint-disable-next-line fp/no-mutation
        error.name = response.statusCode.toString();
        throw error;
    }
}
exports.checkStatusCode = checkStatusCode;
