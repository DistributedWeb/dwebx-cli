module.exports = {
  name: 'pull',
  command: pull,
  help: [
    'Pull updates from a cloned DWebX archive',
    '',
    'Usage: dwebx pull'
  ].join('\n'),
  options: [
    {
      name: 'exit',
      boolean: false,
      help: 'exit after specified number of seconds (gives the dwebx network time to find updates). defaults to 12 seconds.'
    },

    {
      name: 'upload',
      boolean: true,
      default: true,
      help: 'announce your address on link (improves connection capability) and upload data to other downloaders.'
    },
    {
      name: 'selectFromFile',
      boolean: false,
      default: '.datdownload',
      help: 'Sync only the list of selected files or directories in the given file.',
      abbr: 'select-from-file'
    },
    {
      name: 'select',
      boolean: false,
      default: false,
      help: 'Sync only the list of selected files or directories.'
    },
    {
      name: 'show-key',
      boolean: true,
      default: false,
      abbr: 'k',
      help: 'print out the dwebx key'
    }
  ]
}

function pull (opts) {
  var DWebX = require('dwebx-node')
  var neatLog = require('neat-log')
  var archiveUI = require('../ui/archive')
  var trackArchive = require('../lib/archive')
  var selectiveSync = require('../lib/selective-sync')
  var discoveryExit = require('../lib/discovery-exit')
  var onExit = require('../lib/exit')
  var parseArgs = require('../parse-args')
  var debug = require('debug')('dwebx')

  debug('dwebx pull')
  if (!opts.dir) {
    var parsed = parseArgs(opts)
    opts.key = parsed.key
    opts.dir = parsed.dir || process.cwd()
  }

  opts.showKey = opts['show-key'] // using abbr in option makes printed help confusing

  // Force these options for pull command
  opts.createIfMissing = false

  // If --exit is specified without a number of seconds, default to 12
  if (opts.exit === true) {
    opts.exit = 12
  }

  var neat = neatLog(archiveUI, { logspeed: opts.logspeed, quiet: opts.quiet, debug: opts.debug })
  neat.use(trackArchive)
  neat.use(discoveryExit)
  neat.use(onExit)
  neat.use(function (state, bus) {
    state.opts = opts
    selectiveSync(state, opts)

    DWebX(opts.dir, opts, function (err, dwebx) {
      if (err && err.name === 'MissingError') return bus.emit('exit:warn', 'No existing archive in this directory. Use clone to download a new archive.')
      if (err) return bus.emit('exit:error', err)
      if (dwebx.writable) return bus.emit('exit:warn', 'Archive is writable. Cannot pull your own archive.')

      state.dwebx = dwebx
      bus.emit('dwebx')
      bus.emit('render')
    })
  })
}
