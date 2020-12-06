module.exports = {
  name: 'unpublish',
  command: unpublish,
  options: [
    {
      name: 'server',
      help: 'Unpublish dwebx from this Registry.'
    },
    {
      name: 'confirm',
      default: false,
      boolean: true,
      abbr: 'y',
      help: 'Confirm you want to unpublish'
    }
  ]
}

function unpublish (opts) {
  var prompt = require('prompt')
  var path = require('path')
  var DWebX = require('dwebx-node')
  var output = require('neat-log/output')
  var chalk = require('chalk')
  var DatJson = require('dwebx-json')
  var Registry = require('../registry')

  if (opts._[0]) opts.server = opts._[0]
  if (!opts.dir) opts.dir = process.cwd() // run in dir for `dwebx unpublish`

  var client = Registry(opts)
  var whoami = client.whoami()
  if (!whoami || !whoami.token) {
    var loginErr = output(`
      Welcome to ${chalk.green(`dwebx`)} program!

      ${chalk.bold('You must login before unpublishing.')}
      ${chalk.green('dwebx login')}
    `)
    return exitErr(loginErr)
  }

  opts.createIfMissing = false // unpublish dont try to create new one
  DWebX(opts.dir, opts, function (err, dwebx) {
    if (err) return exitErr(err)
    // TODO better error msg for non-existing archive
    if (!dwebx.writable) return exitErr('Sorry, you can only publish a dwebx that you created.')

    var dwebxjson = DatJson(dwebx.archive, { file: path.join(dwebx.path, 'dwebx.json') })
    dwebxjson.read(function (err, data) {
      if (err) return exitErr(err)
      if (!data.name) return exitErr('Try `dwebx unpublish <name>` with this dwebx, we are having trouble reading it.')
      confirm(data.name)
    })
  })

  function confirm (name) {
    console.log(`Unpublishing '${chalk.bold(name)}' from ${chalk.green(whoami.server)}.`)
    prompt.message = ''
    prompt.colors = false
    prompt.start()
    prompt.get([{
      name: 'sure',
      description: 'Are you sure? This cannot be undone. [y/n]',
      pattern: /^[a-zA-Z\s-]+$/,
      message: '',
      required: true
    }], function (err, results) {
      if (err) return console.log(err.message)
      if (results.sure === 'yes' || results.sure === 'y') makeRequest(name)
      else exitErr('Cancelled.')
    })
  }

  function makeRequest (name) {
    client.dvaults.delete({ name: name }, function (err, resp, body) {
      if (err && err.message) exitErr(err.message)
      else if (err) exitErr(err.toString())
      if (body.statusCode === 400) return exitErr(new Error(body.message))
      console.log(`Removed your dwebx from ${whoami.server}`)
      process.exit(0)
    })
  }
}

function exitErr (err) {
  console.error(err)
  process.exit(1)
}
