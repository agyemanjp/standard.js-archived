
export interface Json { [x: string]: string | number | boolean | Date | Json | JsonArray }
type JsonArray = Array<string | number | boolean | Date | Json | JsonArray>
type Obj<TValue = unknown, TKey extends string = string> = { [key in TKey]: TValue }

interface EncodedUrlData { type: "url", body: Obj<string> }
export interface JSONData { type: "json", body: Json }
interface TextData { type: "text", body: string }
interface RawData { type: "raw", body: Uint8Array[] }
interface StreamData { type: "stream", body: NodeJS.ReadableStream }
interface FileData { type: "file", name: string, body: NodeJS.ReadableStream }
interface BufferData { type: "buffer", body: Buffer }
interface MultiPartFormData { type: "multi", body: Obj<unknown> }
interface MultiPartRelatedData { type: "related", body: BasicRequestData[] }
interface ChunkedMultiPartRelatedData { chunked: true, type: "multi-related-chunked", body: RawData[] }

export type BasicRequestData = EncodedUrlData | JSONData | RawData | StreamData | BufferData | FileData | TextData
export type RequestData = BasicRequestData | MultiPartFormData | MultiPartRelatedData

export type Method = "GET" | "POST" | "DELETE" | "PATCH" | "PUT"


interface RequestBase {
	uri: string,
	//method?: "GET" | "POST" | DELETE | PATCH | PUT,
	headers?: Obj<string | string[]>
	auth?: { userName: string, passWord: string, sendImmediately?: boolean } | { bearer: string /* token */ },
	security?: {
		certificate: Buffer, // fs.readFileSync(certFile),
		privateKey: Buffer, //fs.readFileSync(keyFile),
		passphrase: string,
		certAuthority: string | Buffer | string[] | Buffer[] // fs.readFileSync(caFile)
	}
}
export interface GetRequest extends RequestBase {
	query?: Obj<string>
}
export interface PostRequest extends RequestBase {
	data: RequestData
}