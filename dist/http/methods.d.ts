import { Response } from "request";
import { GetRequest, PostRequest } from "./_types";
export declare function postAsync(request: PostRequest): Promise<Response>;
export declare function putAsync(request: PostRequest): Promise<Response>;
export declare function getAsync(request: GetRequest, opts?: {
    badHttpCodeAsError: boolean;
}): Promise<Response>;
export declare function deleteAsync(request: GetRequest): Promise<Response>;
