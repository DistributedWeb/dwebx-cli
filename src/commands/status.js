module.exports = {
  name: 'status',
  command: status,
  help: [
    'Get information on about the DWebX in a directory.',
    '',
    'Usage: dwebx status'
  ].join('\n'),
  options: []
}

function status (opts) {
  var DWebX = require('dwebx-node')
  var neatLog = require('neat-log')
  var statusUI = require('../ui/status')
  var onExit = require('../lib/exit')
  var parseArgs = require('../parse-args')
  var debug = require('debug')('dwebx')

  debug('dwebx status')
  if (!opts.dir) {
    opts.dir = parseArgs(opts).dir || process.cwd()
  }
  opts.createIfMissing = false // sync must always be a resumed archive

  var neat = neatLog(statusUI, { logspeed: opts.logspeed, quiet: opts.quiet, debug: opts.debug })
  neat.use(onExit)
  neat.use(function (state, bus) {
    state.opts = opts

    DWebX(opts.dir, opts, function (err, dwebx) {
      if (err && err.name === 'MissingError') return bus.emit('exit:warn', 'Sorry, could not find a dwebx in this directory.')
      if (err) return bus.emit('exit:error', err)

      state.dwebx = dwebx
      var stats = dwebx.trackStats()
      if (stats.get().version === dwebx.version) return exit()
      stats.on('update', function () {
        if (stats.get().version === dwebx.version) return exit()
      })

      function exit () {
        bus.render()
        process.exit(0)
      }
    })
  })
}
