# Standard
Standard library for JavaScript/TypeScript

## Features
- Lazy iterable combinators such as map, filter, reduce, etc.
- Lazy async iterable combinators such as mapAsync, filterAsync, etc.
- Functional combinators such as flip, curry, etc.
- Async combinators such as promisify, sleep, etc.
- Iterable fluent containers: Sequence, Group, Vector, Dictionary, and Table (for manipulation of tabular in-memory data)
- Http communication functionality
- Extensions of basic types: string, number, date, char
- Basic utilities: types, type guards, helpers


## Install
`npm install --save @hypothesize/standard`


## Usage
```ts
// import specific functions from specific modules
import { mapAsync, ZipAsync, isAsyncIterable /*, ...*/ } from "@agyemanjp/standard/collections/iterable-async"
import { map, filter, reduce, skip, take, chunk /*, ...*/ } from "@agyemanjp/standard/collections/iterable"
import { keys, entries, pick, omit, mapObject, fiterObject  /*, ...*/ } from "@agyemanjp/standard/collections/object"

// import everything from a module
import * as containers from "@agyemanjp/standard/collections/containers"
const numArray = new containers.Array([1, 2, 3])

// import everything from package
import * as stdlib from "@agyemanjp/standard"
type Predicate<T> = stdlib.Predicate<T>
```