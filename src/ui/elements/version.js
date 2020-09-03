var chalk = require('chalk')

module.exports = function (version) {
  return `${chalk.green(`dwebx v${version}`)}`
}
