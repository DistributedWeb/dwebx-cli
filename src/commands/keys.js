module.exports = {
  name: 'keys',
  command: keys,
  help: [
    'View & manage dwebx keys',
    '',
    'Usage:',
    '',
    '  dwebx keys              view dwebx key and discovery key',
    '  dwebx keys export       export dwebx secret key',
    '  dwebx keys import       import dwebx secret key to make a dwebx writable',
    ''
  ].join('\n'),
  options: [
    {
      name: 'discovery',
      boolean: true,
      default: false,
      help: 'Print Discovery Key'
    }
  ]
}

function keys (opts) {
  var DWebX = require('dwebx-node')
  var parseArgs = require('../parse-args')
  var debug = require('debug')('dwebx')

  debug('dwebx keys')
  if (!opts.dir) {
    opts.dir = parseArgs(opts).dir || process.cwd()
  }
  opts.createIfMissing = false // keys must always be a resumed archive

  DWebX(opts.dir, opts, function (err, dwebx) {
    if (err && err.name === 'MissingError') return exit('Sorry, could not find a dwebx in this directory.')
    if (err) return exit(err)
    run(dwebx, opts)
  })
}

function run (dwebx, opts) {
  var subcommand = require('subcommand')
  var prompt = require('prompt')

  var config = {
    root: {
      command: function () {
        console.log(`dwebx://${dwebx.key.toString('hex')}`)
        if (opts.discovery) console.log(`Discovery key: ${dwebx.archive.discoveryKey.toString('hex')}`)
        process.exit()
      }
    },
    commands: [
      {
        name: 'export',
        command: function foo (args) {
          if (!dwebx.writable) return exit('DWebX must be writable to export.')
          console.log(dwebx.archive.metadata.secretKey.toString('hex'))
        }
      },
      {
        name: 'import',
        command: function bar (args) {
          if (dwebx.writable) return exit('DWebX is already writable.')
          importKey()
        }
      }
    ]
  }

  subcommand(config)(process.argv.slice(3))

  function importKey () {
    // get secret key & write

    var schema = {
      properties: {
        key: {
          pattern: /^[a-z0-9]{128}$/,
          message: 'Use `dwebx keys export` to get the secret key (128 character hash).',
          hidden: true,
          required: true,
          description: 'dwebx secret key'
        }
      }
    }
    prompt.message = ''
    prompt.start()
    prompt.get(schema, function (err, data) {
      if (err) return done(err)
      var secretKey = data.key
      if (typeof secretKey === 'string') secretKey = Buffer.from(secretKey, 'hex')
      // Automatically writes the metadata.ogd file
      dwebx.archive.metadata._storage.secretKey.write(0, secretKey, done)
    })

    function done (err) {
      if (err) return exit(err)
      console.log('Successful import. DWebX is now writable.')
      exit()
    }
  }
}

function exit (err) {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  process.exit(0)
}
