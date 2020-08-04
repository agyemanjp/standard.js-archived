/* eslint-disable indent */
import { Response } from "request"
import { RequestData } from "./types"
import { MimeType } from "./mime-types"
import { HttpStatusCodes } from "./status-codes"

export function asQueryParams<T extends Record<string, string> = Record<string, string>>(obj: T, excludedValues: unknown[] = [undefined, null]) {
	return Object.keys(obj)
		.filter(k => /*obj.hasOwnProperty(k) &&*/ !excludedValues.includes(obj[k]))
		.map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
		.join("&")
}
export function getHttpData(data: RequestData): { "Content-Type"?: string, body: unknown } {
	switch (data.type) {
		case "url":
			return {
				"Content-Type": "x-www-form-urlencoded",
				body: asQueryParams(data.body)
			}
		case "json":
			return {
				"Content-Type": "application/json",
				body: JSON.stringify(data.body)
			}

		case "raw":
			return {
				//"Content-Type": HttpMimeType.Octet,
				body: data.body
			}
		case "text":
			return {
				"Content-Type": MimeType.Text,
				body: data.body.toString()
			}

		case "stream":
			return {
				//"Content-Type": HttpMimeType.Octet,
				body: data.body
			}

		case "buffer":
			return {
				//"Content-Type": HttpMimeType.Octet,
				body: data.body
			}

		case "multi":
			return {
				"Content-Type": MimeType.Multi,
				body: data.body
			}

		default:
			throw new Error("Unknown data")
	}
}


type resolveFn = (x: Response | PromiseLike<Response> | undefined) => unknown
type rejectFn = (x: Error | unknown) => unknown
export const getResponseHandler = (resolve: resolveFn, reject: rejectFn, opts?: { badHttpCodeAsError: boolean }) => (
	(err: Error, response: Response) => {
		if (err) {
			// eslint-disable-next-line fp/no-unused-expression
			reject(err)
		}
		else {
			if (opts?.badHttpCodeAsError === true && response.statusCode.toString().startsWith("2")) {
				// eslint-disable-next-line fp/no-unused-expression
				reject(new Error(`HTTP Get: ${HttpStatusCodes[response.statusCode]}`))
			}
			else {
				// eslint-disable-next-line fp/no-unused-expression
				resolve(response)
			}
		}
	}
)
export function checkStatusCode(response: Response, errMessage: string) {
	if (!response.statusCode.toString().startsWith("2")) {
		const error = new Error(`${errMessage}: ${response.body}`)
		// eslint-disable-next-line fp/no-mutation
		error.name = response.statusCode.toString()
		throw error
	}
}

