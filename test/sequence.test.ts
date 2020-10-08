/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable fp/no-unused-expression */

import * as assert from "assert"
import { Sequence } from "../dist/collections/containers"

describe('Sequence', () => {
    describe('integers()', () => {
        it("should yield a sequence including both 'from' and 'to' arguments when going upwards ", () => {
            const actual = [...Sequence.integers({ from: 3, to: 6 })]
            const expected = [3, 4, 5, 6]
            assert.deepEqual(expected, actual)
        })
        it("should yield a sequence including both 'from' and 'to' arguments when going downwards ", () => {
            const actual = [...Sequence.integers({ from: 4, to: -1 })]
            const expected = [4, 3, 2, 1, 0, -1]
            assert.deepEqual(expected, actual)
        })
    })
})
