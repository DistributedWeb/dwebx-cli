module.exports = {
  name: 'doctor',
  help: [
    'Call the Doctor! Runs two tests:',
    '  1. Check if you can connect to a peer on a public server.',
    '  2. Gives you a link to test direct peer connections.',
    '',
    'Usage: dwebx doctor [<link>]'
  ].join('\n'),
  options: [],
  command: function (opts) {
    var doctor = require('dwebx-doctor')

    opts.peerId = opts._[0]
    doctor(opts)
  }
}
