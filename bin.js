#!/usr/bin/env node

const daemon = require('daemon')

if (process.argv.slice(2)[0] === '--debug') {
  daemon({ stdout: 'inherit' })
} else {
  daemon()
}

console.log(`Starting hi8 in daemon mode. PID: ${process.pid}`)

const spawn = require('child_process').spawn
const electron = require('electron')
const path = require('path')
const hi8 = path.join(__dirname, 'index.js')

let proc = spawn(electron, [ hi8 ], { stdio: 'inherit' })

proc.on('close', code => process.exit(code))
