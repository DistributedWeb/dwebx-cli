module.exports = {
  name: 'login',
  command: login,
  help: [
    'Login to a DWebX registry server',
    'Usage: dwebx login [<registry>]',
    '',
    'Publish your dvaults so other users can discovery them.',
    'Please register before trying to login.'
  ].join('\n'),
  options: [
    {
      name: 'server',
      help: 'Your DWebX registry server (must be registered to login).'
    }
  ]
}

function login (opts) {
  var prompt = require('prompt')
  var output = require('neat-log/output')
  var chalk = require('chalk')
  var Registry = require('../../registry')

  if (opts._[0]) opts.server = opts._[0]
  var welcome = output(`
    Welcome to ${chalk.green(`dwebx`)} program!
    Login to publish your dvaults.

  `)
  console.log(welcome)

  var schema = {
    properties: {
      server: {
        description: chalk.magenta('DWebX registry'),
        default: opts.server || 'dwebx.org',
        required: true
      },
      email: {
        description: chalk.magenta('Email'),
        message: 'Email required',
        required: true
      },
      password: {
        description: chalk.magenta('Password'),
        message: 'Password required',
        required: true,
        hidden: true,
        replace: '*'
      }
    }
  }

  prompt.override = opts
  prompt.message = ''
  prompt.start()
  prompt.get(schema, function (err, results) {
    if (err) return exitErr(err)
    opts.server = results.server
    makeRequest(results)
  })

  function makeRequest (user) {
    var client = Registry(opts)
    client.login({
      email: user.email,
      password: user.password
    }, function (err, resp, body) {
      if (err && err.message) return exitErr(err.message)
      else if (err) return exitErr(err.toString())

      console.log(output(`
        Logged you in to ${chalk.green(opts.server)}!

        Now you can publish dvaults and share:
        * Run ${chalk.green(`dwebx publish`)} to publish a dwebx!
        * View & Share your dvaults at ${opts.server}
      `))
      process.exit(0)
    })
  }
}

function exitErr (err) {
  console.error(err)
  process.exit(1)
}
