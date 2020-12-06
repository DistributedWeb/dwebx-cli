module.exports = {
  name: 'publish',
  command: publish,
  help: [
    'Publish your dwebx to a DWebX registry',
    'Usage: dwebx publish [<registry>]',
    '',
    'By default it will publish to your active registry.',
    'Specify the server to change where the dwebx is published.'
  ].join('\n'),
  options: [
    {
      name: 'server',
      help: 'Publish dwebx to this registry. Defaults to active login.'
    }
  ]
}

function publish (opts) {
  var path = require('path')
  var DWebX = require('dwebx-node')
  var encoding = require('dwebx-encoding')
  var output = require('neat-log/output')
  var prompt = require('prompt')
  var chalk = require('chalk')
  var DatJson = require('dwebx-json')
  var xtend = Object.assign
  var Registry = require('../registry')

  if (!opts.dir) opts.dir = process.cwd()
  if (opts._[0]) opts.server = opts._[0]
  if (!opts.server) opts.server = 'dwebx.org' // nicer error message if not logged in

  var client = Registry(opts)
  var whoami = client.whoami()
  if (!whoami || !whoami.token) {
    var loginErr = output(`
      Welcome to ${chalk.green(`dwebx`)} program!
      Publish your dvaults to ${chalk.green(opts.server)}.

      ${chalk.bold('Please login before publishing')}
      ${chalk.green('dwebx login')}

      New to ${chalk.green(opts.server)} and need an account?
      ${chalk.green('dwebx register')}

      Explore public dvaults at ${chalk.blue('dwebx.org/explore')}
    `)
    return exitErr(loginErr)
  }

  opts.createIfMissing = false // publish must always be a resumed archive
  DWebX(opts.dir, opts, function (err, dwebx) {
    if (err && err.name === 'MissingError') return exitErr('No existing dwebx in this directory. Create a dwebx before publishing.')
    else if (err) return exitErr(err)

    dwebx.joinNetwork() // join network to upload metadata

    var dwebxjson = DatJson(dwebx.archive, { file: path.join(dwebx.path, 'dwebx.json') })
    dwebxjson.read(publish)

    function publish (_, data) {
      // ignore dwebxjson.read() err, we'll prompt for name

      // xtend dwebx.json with opts
      var datInfo = xtend({
        name: opts.name,
        url: 'dwebx://' + encoding.toStr(dwebx.key), // force correct url in publish? what about non-dwebx urls?
        title: opts.title,
        description: opts.description
      }, data)
      var welcome = output(`
        Publishing dwebx to ${chalk.green(opts.server)}!

      `)
      console.log(welcome)

      if (datInfo.name) return makeRequest(datInfo)

      prompt.message = ''
      prompt.start()
      prompt.get({
        properties: {
          name: {
            description: chalk.magenta('dwebx name'),
            pattern: /^[a-zA-Z0-9-]+$/,
            message: `A dwebx name can only have letters, numbers, or dashes.\n Like ${chalk.bold('cool-cats-12meow')}`,
            required: true
          }
        }
      }, function (err, results) {
        if (err) return exitErr(err)
        datInfo.name = results.name
        makeRequest(datInfo)
      })
    }

    function makeRequest (datInfo) {
      console.log(`Please wait, '${chalk.bold(datInfo.name)}' will soon be ready for its great unveiling...`)
      client.dvaults.create(datInfo, function (err, resp, body) {
        if (err) {
          if (err.message) {
            if (err.message === 'timed out') {
              return exitErr(output(`${chalk.red('\nERROR: ' + opts.server + ' could not connect to your computer.')}
              Troubleshoot here: ${chalk.green('https://docs.dwebx.org/troubleshooting#networking-issues')}
              `))
            }
            var str = err.message.trim()
            if (str === 'jwt expired') return exitErr(`Session expired, please ${chalk.green('dwebx login')} again`)
            return exitErr('ERROR: ' + err.message) // node error
          }

          // server response errors
          return exitErr('ERROR: ' + err.toString())
        }
        if (body.statusCode === 400) return exitErr(new Error(body.message))

        dwebxjson.write(datInfo, function (err) {
          if (err) return exitErr(err)
          // TODO: write published url to dwebx.json (need spec)
          var msg = output(`

            We ${body.updated === 1 ? 'updated' : 'published'} your dwebx!
            ${chalk.blue.underline(`${opts.server}/${whoami.username}/${datInfo.name}`)}
          `)// TODO: get url back? it'd be better to confirm link than guess username/datname structure

          console.log(msg)
          if (body.updated === 1) {
            console.log(output(`

              ${chalk.dim.green('Cool fact #21')}
              ${opts.server} will live update when you are sharing your dwebx!
              You only need to publish again if your dwebx link changes.
            `))
          } else {
            console.log(output(`

              Remember to use ${chalk.green('dwebx share')} before sharing.
              This will make sure your dwebx is available.
            `))
          }
          process.exit(0)
        })
      })
    }
  })
}

function exitErr (err) {
  console.error(err)
  process.exit(1)
}
