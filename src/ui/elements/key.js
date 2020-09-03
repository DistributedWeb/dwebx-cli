var stringKey = require('dwebx-encoding').toStr
var chalk = require('chalk')

module.exports = function (key) {
  return `${chalk.blue(`dwebx://${stringKey(key)}`)}`
}
