/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable fp/no-unused-expression */

import assert from "assert"
import async from "../dist/async/index.js"

const { AsyncFn, promisify, sleep, notConcurrent, Mutex } = async

/*describe("Mutex", () => {
	it("", () => {
		const collectionMutex = new Mutex()

		async function set(collection: string, key: string, value: string): { [key: string]: string } {
			return await collectionMutex.dispatch(async () => {
				const data = await fetchCollection(collection)
				data[key] = val
				await sendCollection(collection, data)
				return data
			})
		}
	})
})

describe("notConcurrent", () => {
	it("", () => {
		export class Synchronizer {
			// ... other code elided ...
			synchronize = notConcurrent(async () => {
				const data = await this.gatherData()
				// more processing
				await this.sendDataToServer(data)
			});
		}

		// time A:
		synchronizer.synchronize() // => a promise

		// a few seconds later, but before the sync has finished:
		synchronizer.synchronize() // => the same promise as before, no additional sync triggered
	})
})

*/
