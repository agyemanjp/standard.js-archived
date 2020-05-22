#!/usr/bin/env -S node -r "ts-node/register"

import * as shell from 'shelljs'
//import * as util from 'util'

shell.exec("echo $PWD")
shell.rm('-rf', "./dist")
shell.exec('npx tsc')
shell.cp('./src/types.d.ts', "./dist/types.d.ts")

console.log(`\x1b[32mSuccess\x1b[0m\n`)

