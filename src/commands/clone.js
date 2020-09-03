module.exports = {
  name: 'clone',
  command: clone,
  help: [
    'Clone a remote DWebX archive',
    '',
    'Usage: dwebx clone <link> [download-folder]'
  ].join('\n'),
  options: [
    {
      name: 'empty',
      boolean: false,
      default: false,
      help: 'Do not download files by default. Files must be synced manually.'
    },
    {
      name: 'upload',
      boolean: true,
      default: true,
      help: 'announce your address on link (improves connection capability) and upload data to other downloaders.'
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

function clone (opts) {
  var fs = require('fs')
  var path = require('path')
  var rimraf = require('rimraf')
  var DWebX = require('dwebx-node')
  var linkResolve = require('dwebx-link-resolve')
  var neatLog = require('neat-log')
  var archiveUI = require('../ui/archive')
  var trackArchive = require('../lib/archive')
  var discoveryExit = require('../lib/discovery-exit')
  var onExit = require('../lib/exit')
  var parseArgs = require('../parse-args')
  var debug = require('debug')('dwebx')

  var parsed = parseArgs(opts)
  opts.key = parsed.key || opts._[0] // pass other links to resolver
  opts.dir = parsed.dir
  opts.showKey = opts['show-key'] // using abbr in option makes printed help confusing
  opts.sparse = opts.empty

  debug('clone()')

  // cmd: dwebx /path/to/dwebx.json (opts.key is path to dwebx.json)
  if (fs.existsSync(opts.key)) {
    try {
      opts.key = getDatJsonKey()
    } catch (e) {
      debug('error reading dwebx.json key', e)
    }
  }

  debug(Object.assign({}, opts, { key: '<private>', _: null })) // don't show key

  var neat = neatLog(archiveUI, { logspeed: opts.logspeed, quiet: opts.quiet, debug: opts.debug })
  neat.use(trackArchive)
  neat.use(discoveryExit)
  neat.use(onExit)
  neat.use(function (state, bus) {
    if (!opts.key) return bus.emit('exit:warn', 'key required to clone')

    state.opts = opts
    var createdDirectory = null // so we can delete directory if we get error

    // Force these options for clone command
    opts.exit = (opts.exit !== false)
    // opts.errorIfExists = true // TODO: do we want to force this?

    linkResolve(opts.key, function (err, key) {
      if (err && err.message.indexOf('Invalid key') === -1) return bus.emit('exit:error', 'Could not resolve link')
      else if (err) return bus.emit('exit:warn', 'Link is not a valid DWebX link.')

      opts.key = key
      createDir(opts.key, function () {
        bus.emit('key', key)
        runDat()
      })
    })

    function createDir (key, cb) {
      debug('Checking directory for clone')
      // Create the directory if it doesn't exist
      // If no dir is specified, we put dwebx in a dir with name = key
      if (!opts.dir) opts.dir = key
      if (!Buffer.isBuffer(opts.dir) && typeof opts.dir !== 'string') {
        return bus.emit('exit:error', 'Directory path must be a string or Buffer')
      }
      fs.access(opts.dir, fs.F_OK, function (err) {
        if (!err) {
          createdDirectory = false
          return cb()
        }
        debug('No existing directory, creating it.')
        createdDirectory = true
        fs.mkdir(opts.dir, cb)
      })
    }

    function runDat () {
      DWebX(opts.dir, opts, function (err, dwebx) {
        if (err && err.name === 'ExistsError') return bus.emit('exit:warn', 'Existing archive in this directory. Use pull or sync to update.')
        if (err) {
          if (createdDirectory) rimraf.sync(dwebx.path)
          return bus.emit('exit:error', err)
        }
        if (dwebx.writable) return bus.emit('exit:warn', 'Archive is writable. Cannot clone your own archive =).')

        state.dwebx = dwebx
        state.title = 'Cloning'
        bus.emit('dwebx')
        bus.emit('render')
      })
    }
  })

  function getDatJsonKey () {
    var datPath = opts.key
    var stat = fs.lstatSync(datPath)

    if (stat.isDirectory()) datPath = path.join(datPath, 'dwebx.json')

    if (!fs.existsSync(datPath) || path.basename(datPath) !== 'dwebx.json') {
      if (stat.isFile()) throw new Error('must specify existing dwebx.json file to read key')
      throw new Error('directory must contain a dwebx.json')
    }

    debug('reading key from dwebx.json:', datPath)
    return JSON.parse(fs.readFileSync(datPath, 'utf8')).url
  }
}
