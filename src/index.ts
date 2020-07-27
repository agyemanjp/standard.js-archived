export {
	Primitive,
	Collection,
	Tuple,
	Ranker,
	Comparer,
	Predicate,
	Reducer, ReducerIndexed,
	Projector, ProjectorIndexed,
	UnwrapNestedIterable,
	ObjectLiteral,
	ArrayElementType,
	RecursivePartial,
	Zip,

	first,
	last,
	filter,
	skip,
	take,
	map,
	reduce,
	zip,
	forEach,
	chunk,
	union,
	compare,
	complement,
	intersection,
	indexesOf,
	getComparer,
	unique,
	sum,
	every,
	some,
	except,
	flatten,
	getRanker,
	hasValue

} from "./core"

export { stdSequence, stdTupleSequence } from "./sequence"
export { stdSet } from "./set"
export { stdArray, stdArrayNumeric } from "./array"
export { stdObject } from "./object"
export { stdChar, stdString } from "./string"
export { stdNumber } from "./number"

export {
	RequestData,
	BasicRequestData,
	GetRequest,
	PostRequest,
	asQueryParams,
	checkStatusCode,
	deleteAsync,
	getAsync,
	postAsync,
	putAsync,
	HttpStatusCodes,
	JSONData,
	Json,
	Method,
	MimeType
} from "./web"

//export { containers, stdChar, stdString, stdNumber, web }