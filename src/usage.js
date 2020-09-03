module.exports = function (opts, help, usage) {
  if (opts.version) {
    var pkg = require('../package.json')
    console.error(pkg.version)
    process.exit(1)
  }
  var msg = `
Usage: dwebx <cmd> [<dir>] [options]

Sharing Files:
   dwebx share                   create dwebx, import files, share to network
   dwebx create                  create empty dwebx and dwebx.json
   dwebx sync                    import files to existing dwebx & sync with network

Downloading Files:
   dwebx clone <link> [<dir>]    download a dwebx via link to <dir>
   dwebx pull                    update dwebx & exit
   dwebx sync                    live sync files with the network

Info:
   dwebx log                     log history for a dwebx
   dwebx status                  get key & info about a local dwebx

DWebX public registries:
   dwebx <cmd> [<registry>]      All commands take <registry> option
   dwebx register                register new account
   dwebx login                   login to your account
   dwebx publish                 publish a dwebx
   dwebx whoami                  print active login information
   dwebx logout                  logout from active login

Stateless/Shortcut Commands:
   dwebx <link> [<dir>]          clone or sync link to <dir>
   dwebx <dir>                   create and sync dwebx in directory

Troubleshooting & Help:
   dwebx doctor                  run the dwebx network doctor
   dwebx help                    print this usage guide
   dwebx <command> --help, -h    print help for a specific command
   dwebx --version, -v           print the dwebx version

  `
  console.error(msg)
  if (usage) {
    console.error('General Options:')
    console.error(usage)
  }
  console.error('Have fun using DWebX! Learn more at docs.dwebx.org')
  process.exit(1)
}
