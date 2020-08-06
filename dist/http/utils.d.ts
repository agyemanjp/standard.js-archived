import { Response } from "request";
import { RequestData } from "./_types";
export declare function asQueryParams<T extends Record<string, string> = Record<string, string>>(obj: T, excludedValues?: unknown[]): string;
export declare function getHttpData(data: RequestData): {
    "Content-Type"?: string;
    body: unknown;
};
declare type resolveFn = (x: Response | PromiseLike<Response> | undefined) => unknown;
declare type rejectFn = (x: Error | unknown) => unknown;
export declare const getResponseHandler: (resolve: resolveFn, reject: rejectFn, opts?: {
    badHttpCodeAsError: boolean;
} | undefined) => (err: Error, response: Response) => void;
export declare function checkStatusCode(response: Response, errMessage: string): void;
export {};
