# DWebX

> npm install -g dwebx

A distributed data community.
DWebX is a nonprofit-backed community & open protocol for building apps of the future.

Use DWebX command line to share files with version control, back up data to servers, browse remote files on demand, and automate long-term data preservation.

[<img src="https://datproject.github.io/design/downloads/dwebx-data-logo.png" align="right" width="140">][DWebX Project]

Have questions? Join our chat via IRC or Gitter:

[![#dwebx IRC channel on freenode][irc-badge]][irc-channel]
[![datproject/discussions][gitter-badge]][gitter-chat]

### Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Using DWebX](#usage)
- [Troubleshooting](#troubleshooting)
- [Javascript API](#js-api)
- [For Developers](#for-developers)

## Installation

DWebX can be used as a command line tool or a javascript library:

* Install the `$ dwebx` CLI to use in the command line.
* [require('dwebx')][dwebx-node] - dwebx-node, a library for downloading and sharing dwebx archives in javascript apps.

### Installing the `$ dwebx` command line tool

The recommended way to install the DWebX command line tool is with `npm`:

```
npm install -g dwebx
```

Make sure you have `node` and `npm` installed first. If not, see the prerequisites section below. We recommend `npm` because it makes it easy to install new versions of `dwebx` when they get released.

Once `npm install` finishes, you should be able to run the `$ dwebx` command. If not, see the [installation troubleshooting](#troubleshooting) for tips.

#### Installing without npm

If you are unable to use `npm` to install dwebx, you can also download a single file binary distribution version of `dwebx` using the one line install command below. The binary includes a copy of node and dwebx packaged inside a single file, so you just have to download one file in order to start sharing data, with no other dependencies needed on your system:

```
wget -qO- https://raw.githubusercontent.com/datproject/dwebx/master/download.sh | bash
```

#### NPM Prerequisites

* **Node**: You'll need to [install Node JS][install-node] before installing DWebX. DWebX needs `node` version 4 or above and `npm` installed. You can run `node -v` to check your version.
* **npm**: `npm` is installed with node. You can run `npm -v` to make sure it is installed.

Once you have `npm` ready, install `dwebx` from npm with the `--global, -g` option, `npm install -g dwebx`.

## Getting started

#### What is DWebX?

Share, backup, and publish your filesystem. You can turn any folder on your computer into a dwebx. DWebX scans your folder, allowing you to:

* Track your files with automatic version history.
* Share files with others over a secure peer to peer network.
* Automate live backups to external HDs or remote servers.
* Publish and share files with built in HTTP server.

DWebX allows you to focus on the fun work without worrying about moving files around. **Secure**, **distributed**, **fast**.

* Documentation: [docs.dwebx.org](https://docs.dwebx.org)
* [DatBase](https://dwebx.org)
* [DWebX white paper]

##### Other Applications

Rather not use the command line? Check out these options:

* [DWebX Desktop] - A desktop app to manage multiple dvaults on your desktop machine.
* [DBrowserX Browser] - An experimental p2p browser with built-in support for the DWebX protocol.

## dwebx command line

Share, download, and backup files with the command line! Automatically sync changes to datasets. Never worry about manually transferring files again.

Mac/Linux      | Windows      | Version
-------------- | ------------ | ------------
[![Travis][travis-badge]][travis-build] | [![Build status][appveyor-badge]][appveyor-build] | [![NPM version][npm-badge]][npm-package]

Have questions or need some guidance?
You can [chat with us](http://chat.dwebx.org) in IRC on [#dwebx][irc-channel] or [Gitter][gitter-chat]!

### JS Library

Add DWebX to your `package.json`, `npm install dwebx --save`. DWebX exports the [dwebx-node] API via `require('dwebx')`. Use it in your javascript applications! DWebX Desktop and DWebX command line both use dwebx-node to share and download dvaults.

Full API documentation is available in the [dwebx-node] repository on Github.

We have DWebX installed, let's use it!

DWebX's unique design works wherever you store your data. You can create a new dwebx from any folder on your computer.

A dwebx is some files from your computer and a `.dwebx` folder. Each dwebx has a unique `dwebx://` link. With your dwebx link, other users can download your files and live sync any updates.

### Sharing Data

You can start sharing your files with a single command. Unlike `git`, you do not have to initialize a repository first, `dwebx share` will do that for you:

```
dwebx share <dir>
```

Use `dwebx share` to create a dwebx and sync your files from your computer to other users. DWebX scans your files inside `<dir>`, creating metadata in `<dir>/.dwebx`. DWebX stores the public link, version history, and file information inside the dwebx folder.

![share-gif]

### Downloading Data

```
dwebx clone dwebx://<link> <download-dir>
```

Use `dwebx clone` to download files from a remote computer sharing files with DWebX. This will download the files from `dwebx://<link>` to your `<download-dir>`. The download exits after it completes but you can continue to update the files later after the clone is done. Use `dwebx pull` to update new files or `dwebx sync` to live sync changes.

![clone-gif]

Try out `dwebx clone` with the link above to read more about the protocol!

### Other Cool Commands

A few other highlights. Run `dwebx help` to see the full usage guide.

* `dwebx create` - Create an empty dwebx and `dwebx.json` file.
* `dwebx doctor` - DWebX network doctor! The doctor tries to connect to a public peer. The doctor also creates a key to test direct connections.
* `dwebx log ~/data/dwebx-folder/` or `dwebx log dwebx://<key>` - view the history and metadata information for a dwebx.

### Quick Demos

To get started using DWebX, you can try downloading a dwebx and then sharing a dwebx of your own.

#### Download Demo

We made a demo folder just for this exercise. Inside the demo folder is a `dwebx.json` file and a gif. We shared these files via DWebX and now you can download them with our dwebx key!

Similar to git, you can download somebody's dwebx by running `dwebx clone <link>`. You can also specify the directory:

```
❯ dwebx clone dwebx://778f8d955175c92e4ced5e4f5563f69bfec0c86cc6f670352c457943666fe639 ~/Downloads/dwebx-demo
dwebx v13.5.0
Created new dwebx in /Users/joe/Downloads/dwebx-demo/.dwebx
Cloning: 2 files (1.4 MB)

2 connections | Download 614 KB/s Upload 0 B/s

dwebx sync complete.
Version 4
```

This will download our demo files to the `~/Downloads/dwebx-demo` folder. These files are being shared by a server over DWebX (to ensure high availability) but you may connect to any number of users also hosting the content.

You can also also view the files online: [dwebx.org/778f8d955175c92e4ced5e4f5563f69bfec0c86cc6f670352c457943666fe639](https://dwebx.org/778f8d955175c92e4ced5e4f5563f69bfec0c86cc6f670352c457943666fe639/). dwebx.org can download files over DWebX and display them on HTTP as long as someone is hosting it. The website temporarily caches data for any visited links (do not view your dwebx on dwebx.org if you do not want us to cache your data).

#### Sharing Demo

DWebX can share files from your computer to anywhere. If you have a friend going through this demo with you, try sharing to them! If not we'll see what we can do.

Find a folder on your computer to share. Inside the folder can be anything, DWebX can handle all sorts of files (DWebX works with really big folders too!).

First, you can create a new dwebx inside that folder. Using the `dwebx create` command also walks us through making a `dwebx.json` file:

```
❯ dwebx create
Welcome to dwebx program!
You can turn any folder on your computer into a DWebX.
A DWebX is a folder with some magic.
```

This will create a new (empty) dwebx. DWebX will print a link, share this link to give others access to view your files.

Once we have our dwebx, run `dwebx share` to scan your files and sync them to the network. Share the link with your friend to instantly start downloading files.

You can also try viewing your files online. Go to [dwebx.org](https://dwebx.org) and enter your link to preview on the top left. *(Some users, including me when writing this, may have trouble connecting to dwebx.org initially. Don't be alarmed! It is something we are working on. Thanks.)*

#### Bonus HTTP Demo

DWebX makes it really easy to share live files on a HTTP server. This is a cool demo because we can also see how version history works! Serve dwebx files on HTTP with the `--http` option. For example, `dwebx sync --http`, serves your files to a HTTP website with live reloading and version history! This even works for dvaults you're downloading (add the `--sparse` option to only download files you select via HTTP). The default HTTP port is 8080.

*Hint: Use `localhost:8080/?version=10` to view a specific version.*

Get started using DWebX today with the `share` and `clone` commands or read below for more details.

## Usage

The first time you run a command, a `.dwebx` folder is created to store the dwebx metadata.
Once a dwebx is created, you can run all the commands inside that folder, similar to git.

DWebX keeps secret keys in the `~/.dwebx/secret_keys` folder. These are required to write to any dvaults you create.

#### Creating a dwebx & dwebx.json

```
dwebx create [<dir>]
```

The create command prompts you to make a `dwebx.json` file and creates a new dwebx. Import the files with sync or share.

Optionally bypass Title and Description prompt:

```sh
dwebx create --title "MY BITS" --description "are ready to synchronize! 😎"
```

Optionally bypass `dwebx.json` creation:

```sh
dwebx create --yes
dwebx create -y
```

### Sharing

The quickest way to get started sharing files is to `share`:

```
❯ dwebx share
dwebx://3e830227b4b2be197679ff1b573cc85e689f202c0884eb8bdb0e1fcecbd93119
Sharing dwebx: 24 files (383 MB)

0 connections | Download 0 B/s Upload 0 B/s

Importing 528 files to Archive (165 MB/s)
[=-----------------------------------------] 3%
ADD: data/expn_cd.csv (403 MB / 920 MB)
```

#### Syncing to Network

```
dwebx sync [<dir>] [--no-import] [--no-watch]
```

Start sharing your dwebx archive over the network.
Sync will import new or updated files since you last ran `create` or `sync`.
Sync watches files for changes and imports updated files.

* Use `--no-import` to not import any new or updated files.
* Use `--no-watch` to not watch directory for changes. `--import` must be true for `--watch` to work.

#### Ignoring Files

By default, DWebX will ignore any files in a `.dwebxignore` file, similar to git. Each file should be separated by a newline. DWebX also ignores all hidden folders and files.

DWebX uses [dwebx-ignore] to decide if a file should be ignored. Supports pattern wildcards (`/*.png`) and directory-wildcards (`/**/cache`).

#### Selecting Files

By default, DWebX will download all files. If you want to only download a subset, you can create a `.datdownload` file which downloads only the files and folders specified. Each should be separated by a newline.


### Downloading

Start downloading by running the `clone` command. This creates a folder, downloads the content and metadata, and a `.dwebx` folder inside. Once you started the download, you can resume using `clone` or the other download commands.

```
dwebx clone <link> [<dir>] [--temp]
```

Clone a remote dwebx archive to a local folder.
This will create a folder with the key name if no folder is specified.

#### Downloading via `dwebx.json` key

You can use a `dwebx.json` file to clone also. This is useful when combining DWebX and git, for example. To clone a dwebx you can specify the path to a folder containing a `dwebx.json`:

```
git clone git@github.com:joehand/dwebx-clone-sparse-test.git
dwebx clone ./dwebx-clone-sparse-test
```

This will download the dwebx specified in the `dwebx.json` file.

#### Updating Downloaded Archives

Once a dwebx is clone, you can run either `dwebx pull` or `dwebx sync` in the folder to update the archive.

```
dwebx pull [<dir>]
```

Update a cloned dwebx archive with the latest files and exit.

```
dwebx sync [<dir>]
```

Download latest files and keep connection open to continue updating as remote source is updated.

### Shortcut commands

* `dwebx <link> <dir>` will run `dwebx clone` for new dvaults or resume the existing dwebx in `<dir>`
* `dwebx <dir>` is the same as running `dwebx sync <dir>`

### DWebX Registry and Authentication

As part of our [Knight Foundation grant], we are building a registry for dwebx archives.
We will be running a dwebx registry at dwebx.org, but anyone will be able to create their own.
Once registered, you will be able to publish dwebx archives from our registry.
Anyone can clone archives published to a registry without registration:

```
dwebx clone dwebx.org/jhand/cli-demo
```

#### Auth (experimental)

You can also use the `dwebx` command line to register and publish to dwebx registries. DWebX plans to support any registry. Currently, `dwebx.org` is the only one available and the default.

To register and login you can use the following commands:

```
dwebx register [<registry>]
dwebx login
dwebx whoami
```

Once you are logged in to a registry, you can publish a dwebx archive:

```
cd my-data
dwebx create
dwebx publish --name my-dataset
```

All registry requests take the `<registry>` option if you'd like to publish to a different registry than dwebx.org.
You can deploy your own compatible [registry server] if you'd rather use your own service.

### Key Management & Moving dvaults

`dwebx keys` provides a few commands to help you move or backup your dvaults.

Writing to a dwebx requires the secret key, stored in the `~/.dwebx` folder. You can export and import these keys between dvaults. First, clone your dwebx to the new location:

* (original) `dwebx share`
* (duplicate) `dwebx clone <link>`

Then transfer the secret key:

* (original) `dwebx keys export` - copy the secret key printed out.
* (duplicate) `dwebx keys import` - this will prompt you for the secret key, paste it in here.

## Troubleshooting

We've provided some troubleshooting tips based on issues users have seen.
Please [open an issue][new-issue] or ask us in our [chat room][gitter-chat] if you need help troubleshooting and it is not covered here.

If you have trouble sharing/downloading in a directory with a `.dwebx` folder, try deleting it and running the command again.

#### Check Your DWebX Version

Knowing the version is really helpful if you run into any bugs, and will help us troubleshoot your issue.

Check your DWebX version:

```
dwebx -v
```

You should see the DWebX semantic version printed, e.g. `13.1.2`.

### Installation Issues

#### Node & npm

To use the DWebX command line tool you will need to have [node and npm installed][install-node-npm].
Make sure those are installed correctly before installing DWebX.
You can check the version of each:

```
node -v
npm -v
```

#### Global Install

The `-g` option installs DWebX globally, allowing you to run it as a command.
Make sure you installed with that option.

* If you receive an `EACCES` error, read [this guide][fixing-npm-permissions] on fixing npm permissions.
* If you receive an `EACCES` error, you may also install DWebX with sudo: `sudo npm install -g dwebx`.
* Have other installation issues? Let us know, you can [open an issue][new-issue] or ask us in our [chat room][gitter-chat].

### Debugging Output

If you are having trouble with a specific command, run with the debug environment variable set to `dwebx` (and optionally also `dwebx-node`).
This will help us debug any issues:

```
DEBUG=dwebx,dwebx-node dwebx clone dwebx://<link> dir
```

### Networking Issues

Networking capabilities vary widely with each computer, network, and configuration.
Whenever you run DWebX there are several steps to share or download files with peers:

1. Discovering Peers
2. Connecting to Peers
3. Sending & Receiving Data

With successful use, DWebX will show `Connected to 1 peer` after connection.
If you never see a peer connected, your network may be restricting discovery or connection.
Please try using the `dwebx --doctor` command (see below) between the two computers not connecting. This will help troubleshoot the networks.

* DWebX may [have issues][dwebx#503] connecting if you are using iptables.

#### DWebX Doctor

We've included a tool to identify network issues with DWebX, the DWebX doctor.
The DWebX doctor will run two tests:

1. Attempt to connect to a public server running a DWebX peer.
2. Attempt a direct connection between two peers. You will need to run the command on both the computers you are trying to share data between.

Start the doctor by running:

```
dwebx doctor
```

For direct connection tests, the doctor will print out a command to run on the other computer, `dwebx doctor <64-character-string>`.
The doctor will run through the key steps in the process of sharing data between computers to help identify the issue.

---

## JS API

You can use DWebX in your javascript application:

```js
var DWebX = require('dwebx')

DWebX('/data', function (err, dwebx) {
  // use dwebx
})
```

**[Read more][dwebx-node] about the JS usage provided via `dwebx-node`.**

## For Developers

Please see [guidelines on contributing] before submitting an issue or PR.

This command line library uses [dwebx-node] to create and manage the archives and networking.
If you'd like to build your own DWebX application that is compatible with this command line tool, we suggest using dwebx-node.

### Installing from source

Clone this repository and in a terminal inside of the folder you cloned run this command:

```
npm link
```

This should add a `dwebx` command line command to your PATH.
Now you can run the `dwebx` command to try it out.

The contribution guide also has more tips on our [development workflow].

* `npm run test` to run tests
* `npm run auth-server` to run a local auth server for testing

## License

BSD-3-Clause

[DWebX Project]: https://dwebx.org
[Code for Science & Society]: https://codeforscience.org
[DWebX white paper]: https://github.com/distributedweb/docs/blob/master/papers/dwebx-paper.pdf
[DWebX Desktop]: https://docs.dwebx.org/install#desktop-application
[DBrowserX Browser]: https://dbrowser.com
[registry server]: https://github.com/distributedweb/datbase
[share-gif]: https://raw.githubusercontent.com/datproject/docs/master/assets/cli-share.gif
[clone-gif]: https://raw.githubusercontent.com/datproject/docs/master/assets/cli-clone.gif
[Knight Foundation grant]: https://blog.dwebx.org/2016/02/01/announcing-publicbits-org/
[dwebx-node]: https://github.com/distributedweb/dwebx-node
[dwebx-ignore]: https://github.com/joehand/dwebx-ignore
[new-issue]: https://github.com/distributedweb/dwebx/issues/new
[dwebx#503]: https://github.com/distributedweb/dwebx/issues/503
[install-node]: https://nodejs.org/en/download/
[install-node-npm]: https://docs.npmjs.com/getting-started/installing-node
[fixing-npm-permissions]: https://docs.npmjs.com/getting-started/fixing-npm-permissions
[guidelines on contributing]: https://github.com/distributedweb/dwebx/blob/master/CONTRIBUTING.md
[development workflow]: https://github.com/distributedweb/dwebx/blob/master/CONTRIBUTING.md#development-workflow
[travis-badge]: https://travis-ci.org/datproject/dwebx.svg?branch=master
[travis-build]: https://travis-ci.org/datproject/dwebx
[appveyor-badge]: https://ci.appveyor.com/api/projects/status/github/datproject/dwebx?branch=master&svg=true
[appveyor-build]: https://ci.appveyor.com/project/joehand/dwebx/branch/master
[npm-badge]: https://img.shields.io/npm/v/dwebx.svg
[npm-package]: https://npmjs.org/package/dwebx
[irc-badge]: https://img.shields.io/badge/irc%20channel-%23dat%20on%20freenode-blue.svg
[irc-channel]: https://webchat.freenode.net/?channels=dwebx
[gitter-badge]: https://badges.gitter.im/Join%20Chat.svg
[gitter-chat]: https://gitter.im/datproject/discussions
