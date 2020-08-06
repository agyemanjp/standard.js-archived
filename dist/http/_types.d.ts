/// <reference types="node" />
export interface Json {
    [x: string]: string | number | boolean | Date | Json | JsonArray;
}
declare type JsonArray = Array<string | number | boolean | Date | Json | JsonArray>;
declare type Obj<TValue = unknown, TKey extends string = string> = {
    [key in TKey]: TValue;
};
interface EncodedUrlData {
    type: "url";
    body: Obj<string>;
}
export interface JSONData {
    type: "json";
    body: Json;
}
interface TextData {
    type: "text";
    body: string;
}
interface RawData {
    type: "raw";
    body: Uint8Array[];
}
interface StreamData {
    type: "stream";
    body: NodeJS.ReadableStream;
}
interface FileData {
    type: "file";
    name: string;
    body: NodeJS.ReadableStream;
}
interface BufferData {
    type: "buffer";
    body: Buffer;
}
interface MultiPartFormData {
    type: "multi";
    body: Obj<unknown>;
}
interface MultiPartRelatedData {
    type: "related";
    body: BasicRequestData[];
}
export declare type BasicRequestData = EncodedUrlData | JSONData | RawData | StreamData | BufferData | FileData | TextData;
export declare type RequestData = BasicRequestData | MultiPartFormData | MultiPartRelatedData;
export declare type Method = "GET" | "POST" | "DELETE" | "PATCH" | "PUT";
interface RequestBase {
    uri: string;
    headers?: Obj<string | string[]>;
    auth?: {
        userName: string;
        passWord: string;
        sendImmediately?: boolean;
    } | {
        bearer: string;
    };
    security?: {
        certificate: Buffer;
        privateKey: Buffer;
        passphrase: string;
        certAuthority: string | Buffer | string[] | Buffer[];
    };
}
export interface GetRequest extends RequestBase {
    query?: Obj<string>;
}
export interface PostRequest extends RequestBase {
    data: RequestData;
}
export {};
