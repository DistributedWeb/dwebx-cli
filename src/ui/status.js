var output = require('neat-log/output')
var stringKey = require('dwebx-encoding').toStr
var pretty = require('prettier-bytes')
var chalk = require('chalk')

module.exports = statusUI

function statusUI (state) {
  if (!state.dwebx) return 'Starting DWebX program...'

  var dwebx = state.dwebx
  var stats = dwebx.stats.get()

  return output(`
    ${chalk.blue('dwebx://' + stringKey(dwebx.key))}
    ${stats.files} files (${pretty(stats.byteLength)})
    Version: ${chalk.bold(stats.version)}
  `)
}
