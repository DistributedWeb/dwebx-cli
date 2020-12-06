module.exports = {
  name: 'create',
  command: create,
  help: [
    'Create an empty dwebx and dwebx.json',
    '',
    'Usage: dwebx create [directory]'
  ].join('\n'),
  options: [
    {
      name: 'yes',
      boolean: true,
      default: false,
      abbr: 'y',
      help: 'Skip dwebx.json creation.'
    },
    {
      name: 'title',
      help: 'the title property for dwebx.json'
    },
    {
      name: 'description',
      help: 'the description property for dwebx.json'
    }
  ]
}

function create (opts) {
  var path = require('path')
  var fs = require('fs')
  var DWebX = require('dwebx-node')
  var output = require('neat-log/output')
  var DatJson = require('dwebx-json')
  var prompt = require('prompt')
  var chalk = require('chalk')
  var parseArgs = require('../parse-args')
  var debug = require('debug')('dwebx')

  debug('dwebx create')
  if (!opts.dir) {
    opts.dir = parseArgs(opts).dir || process.cwd()
  }

  var welcome = `Welcome to ${chalk.green(`dwebx`)} program!`
  var intro = output(`
    You can turn any folder on your computer into a DWebX.
    A DWebX is a folder with some magic.

    Your dwebx is ready!
    We will walk you through creating a 'dwebx.json' file.
    (You can skip dwebx.json and get started now.)

    Learn more about dwebx.json: ${chalk.blue(`https://github.com/datprotocol/dwebx.json`)}

    ${chalk.dim('Ctrl+C to exit at any time')}

  `)
  var outro

  // Force certain options
  opts.errorIfExists = true

  console.log(welcome)
  DWebX(opts.dir, opts, function (err, dwebx) {
    if (err && err.name === 'ExistsError') return exitErr('\nArchive already exists.\nYou can use `dwebx sync` to update.')
    if (err) return exitErr(err)

    outro = output(`

      Created empty DWebX in ${dwebx.path}/.dwebx

      Now you can add files and share:
      * Run ${chalk.green(`dwebx share`)} to create metadata and sync.
      * Copy the unique dwebx link and securely share it.

      ${chalk.blue(`dwebx://${dwebx.key.toString('hex')}`)}
    `)

    if (opts.yes) return done()

    console.log(intro)
    var dwebxjson = DatJson(dwebx.archive, { file: path.join(opts.dir, 'dwebx.json') })
    fs.readFile(path.join(opts.dir, 'dwebx.json'), 'utf-8', function (err, data) {
      if (err || !data) return doPrompt()
      data = JSON.parse(data)
      debug('read existing dwebx.json data', data)
      doPrompt(data)
    })

    function doPrompt (data) {
      if (!data) data = {}

      var schema = {
        properties: {
          title: {
            description: chalk.magenta('Title'),
            default: data.title || '',
            // pattern: /^[a-zA-Z\s\-]+$/,
            // message: 'Name must be only letters, spaces, or dashes',
            required: false
          },
          description: {
            description: chalk.magenta('Description'),
            default: data.description || ''
          }
        }
      }

      prompt.override = { title: opts.title, description: opts.description }
      prompt.message = '' // chalk.green('> ')
      // prompt.delimiter = ''
      prompt.start()
      prompt.get(schema, writeDatJson)

      function writeDatJson (err, results) {
        if (err) return exitErr(err) // prompt error
        if (!results.title && !results.description) return done()
        dwebxjson.create(results, done)
      }
    }

    function done (err) {
      if (err) return exitErr(err)
      console.log(outro)
    }
  })

  function exitErr (err) {
    if (err && err.message === 'canceled') {
      console.log('')
      console.log(outro)
      process.exit(0)
    }
    console.error(err)
    process.exit(1)
  }
}
