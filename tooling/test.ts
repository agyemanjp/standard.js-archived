#!/usr/bin/env -S node -r "ts-node/register"

import * as shell from 'shelljs'

shell.exec("npm run build")
let output = shell.exec("TS_NODE_PROJECT='./tsconfig.json' npx mocha ./lib/test.ts")
//console.log(`\x1b[32mSuccess\x1b[0m\n`)
