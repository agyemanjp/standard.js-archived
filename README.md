# standard.js
Standard library for JavaScript/TypeScript

## Features
- Lazy iterable combinators such as _map_, _filter_, _reduce_, etc.
- Lazy async iterable combinators such as _mapAsync_, _filterAsync_, etc.
- Fluent iterable containers: _Sequence_, _Set_, _Array_, _Dictionary_, and _DataTable_
- Functional combinators such as _flip_, _curry_, etc.
- Async combinators such as _promisify_, _sleep_, etc.
- Statistical functions such as _mean_, _median_, _quartiles_, _variance/standard deviation_, etc.
- Advanced _string_, _date-time_, and _numeric_ functions
- Utility _types_, _type guards_, and _value helpers_


## Install
`npm install --save @agyemanjp/standard`


## Usage
```ts
// import specific functions from specific modules
import { mapAsync, ZipAsync, isAsyncIterable /*, ...*/ } from "@agyemanjp/standard/collections/combinators"
import { keys, entries, pick, omit  /*, ...*/ } from "@agyemanjp/standard/object"
import { sleep, promisify } from "@agyemanjp/standard/async"

// import everything from a module
import * as containers from "@agyemanjp/standard/collections/containers"
const numArray = new containers.Array([1, 2, 3])

// import everything from package
import * as stdlib from "@agyemanjp/standard"
type Predicate<T> = stdlib.Predicate<T>
```