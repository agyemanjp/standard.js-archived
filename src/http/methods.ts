import { Response, post, get, put, del } from "request"
import { GetRequest, PostRequest } from "./_types"
import { getHttpData, getResponseHandler, asQueryParams } from "./utils"
import { String } from "../primitives/string"

export async function postAsync(request: PostRequest) {
	return new Promise<Response>((resolve, reject) => {
		const data = getHttpData(request.data)
		// eslint-disable-next-line fp/no-unused-expression
		post({
			uri: request.uri,
			body: data.body,
			headers: { ...request.headers, "Content-Type": data["Content-Type"] }
		}, getResponseHandler(resolve, reject))
	})
}

export async function putAsync(request: PostRequest) {
	return new Promise<Response>((resolve, reject) => {
		const data = getHttpData(request.data)
		// eslint-disable-next-line fp/no-unused-expression
		put({
			uri: request.uri,
			body: data.body,
			headers: { ...request.headers, "Content-Type": data["Content-Type"] }
		}, getResponseHandler(resolve, reject))
	})
}

export async function getAsync(request: GetRequest, opts?: { badHttpCodeAsError: boolean }): Promise<Response> {
	return new Promise<Response>((resolve, reject) => {
		const queryParams = request.query ? `?${asQueryParams(request.query)}` : ""
		// eslint-disable-next-line fp/no-unused-expression
		get({
			uri: `${new String(request.uri).trimRight("/")}${queryParams}`,
			headers: { ...request.headers }
		}, getResponseHandler(resolve, reject, opts))
	})
}

export async function deleteAsync(request: GetRequest) {
	return new Promise<Response>((resolve, reject) => {
		const queryParams = request.query ? asQueryParams(request.query) : ""
		// eslint-disable-next-line fp/no-unused-expression
		del({
			uri: `${request.uri}?${queryParams}`,
			headers: { ...request.headers }
		}, getResponseHandler(resolve, reject))
	})
}
