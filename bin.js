#!/usr/bin/env node

var daemon = require('daemon')

if (process.argv.slice(2)[0] === '--debug') {
  daemon({ stdout: 'inherit' })
} else {
  daemon()
}

console.log('Starting hi8 in daemon mode. PID: ' + process.pid)

var spawn = require('child_process').spawn
var electron = require('electron')
var path = require('path')
var hi8 = path.join(__dirname, 'index.js')
var proc = spawn(electron, [ hi8 ], { stdio: 'inherit' })

proc.on('close', code => process.exit(code))
