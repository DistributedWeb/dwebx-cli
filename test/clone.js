var fs = require('fs')
var path = require('path')
var test = require('tape')
var tempDir = require('temporary-directory')
var spawn = require('./helpers/spawn.js')
var help = require('./helpers')

var dwebx = path.resolve(path.join(__dirname, '..', 'bin', 'cli.js'))

test('clone - default opts', function (t) {
  help.shareFixtures(function (_, shareDat) {
    var key = shareDat.key.toString('hex')
    tempDir(function (_, dir, cleanup) {
      var cmd = dwebx + ' clone ' + key
      var st = spawn(t, cmd, { cwd: dir })
      var datDir = path.join(dir, key)

      st.stdout.match(function (output) {
        var downloadFinished = output.indexOf('Exiting') > -1
        if (!downloadFinished) return false

        var stats = shareDat.stats.get()
        var fileRe = new RegExp(stats.files + ' files')
        var bytesRe = new RegExp(/1\.\d KB/)

        t.ok(output.match(fileRe), 'total size: files okay')
        t.ok(output.match(bytesRe), 'total size: bytes okay')
        t.ok(help.isDir(datDir), 'creates download directory')

        var fileList = help.fileList(datDir).join(' ')
        var hasCsvFile = fileList.indexOf('all_hour.csv') > -1
        t.ok(hasCsvFile, 'csv file downloaded')
        var hasDatFolder = fileList.indexOf('.dwebx') > -1
        t.ok(hasDatFolder, '.dwebx folder created')
        var hasSubDir = fileList.indexOf('folder') > -1
        t.ok(hasSubDir, 'folder created')
        var hasNestedDir = fileList.indexOf('nested') > -1
        t.ok(hasNestedDir, 'nested folder created')
        var hasHelloFile = fileList.indexOf('hello.txt') > -1
        t.ok(hasHelloFile, 'hello.txt file downloaded')

        st.kill()
        return true
      })
      st.succeeds('exits after finishing download')
      st.stderr.empty()
      st.end(function () {
        cleanup()
        shareDat.close()
      })
    })
  })
})

// Right now we aren't forcing this
// test('clone - errors on existing dir', function (t) {
//   tempDir(function (_, dir, cleanup) {
//     // make empty dwebx in directory
//     DWebX(dir, function (err, shareDat) {
//       t.error(err, 'no error')
//       // Try to clone to same dir
//       shareDat.close(function () {
//         var cmd = dwebx + ' clone ' + shareDat.key.toString('hex') + ' ' + dir
//         var st = spawn(t, cmd)
//         st.stdout.empty()
//         st.stderr.match(function (output) {
//           t.same(output.trim(), 'Existing archive in this directory. Use pull or sync to update.', 'Existing archive.')
//           st.kill()
//           return true
//         })
//         st.end(cleanup)
//       })
//     })
//   })
// })

test('clone - specify dir', function (t) {
  help.shareFixtures(function (_, shareDat) {
    tempDir(function (_, dir, cleanup) {
      var key = shareDat.key.toString('hex')
      var customDir = 'my_dir'
      var cmd = dwebx + ' clone ' + key + ' ' + customDir
      var st = spawn(t, cmd, { cwd: dir })
      st.stdout.match(function (output) {
        var downloadFinished = output.indexOf('Exiting') > -1
        if (!downloadFinished) return false

        t.ok(help.isDir(path.join(dir, customDir)), 'creates download directory')
        st.kill()
        return true
      })
      st.succeeds('exits after finishing download')
      st.stderr.empty()
      st.end(function () {
        cleanup()
        shareDat.close()
      })
    })
  })
})

test('clone - dwebx:// link', function (t) {
  help.shareFixtures(function (_, shareDat) {
    tempDir(function (_, dir, cleanup) {
      var key = 'dwebx://' + shareDat.key.toString('hex') + '/'
      var cmd = dwebx + ' clone ' + key + ' '
      var downloadDir = path.join(dir, shareDat.key.toString('hex'))
      var st = spawn(t, cmd, { cwd: dir })
      st.stdout.match(function (output) {
        var downloadFinished = output.indexOf('Exiting') > -1
        if (!downloadFinished) return false

        t.ok(help.isDir(path.join(downloadDir)), 'creates download directory')
        st.kill()
        return true
      })
      st.succeeds('exits after finishing download')
      st.stderr.empty()
      st.end(function () {
        cleanup()
        shareDat.close()
      })
    })
  })
})

test('clone - dwebx.org/key link', function (t) {
  help.shareFixtures(function (_, shareDat) {
    tempDir(function (_, dir, cleanup) {
      var key = 'dwebx.org/' + shareDat.key.toString('hex') + '/'
      var cmd = dwebx + ' clone ' + key + ' '
      var downloadDir = path.join(dir, shareDat.key.toString('hex'))
      var st = spawn(t, cmd, { cwd: dir })
      st.stdout.match(function (output) {
        var downloadFinished = output.indexOf('Exiting') > -1
        if (!downloadFinished) return false

        t.ok(help.isDir(path.join(downloadDir)), 'creates download directory')
        st.kill()
        return true
      })
      st.succeeds('exits after finishing download')
      st.stderr.empty()
      st.end(function () {
        cleanup()
        shareDat.close()
      })
    })
  })
})

// TODO: fix --temp for clones
// test('clone - with --temp', function (t) {
//   // cmd: dwebx clone <link>
//   help.shareFixtures(function (_, fixturesDat) {
//     shareDat = fixturesDat
//     var key = shareDat.key.toString('hex')
//     var cmd = dwebx + ' clone ' + key + ' --temp'
//     var st = spawn(t, cmd, {cwd: baseTestDir})
//     var datDir = path.join(baseTestDir, key)
//     st.stdout.match(function (output) {
//       var downloadFinished = output.indexOf('Download Finished') > -1
//       if (!downloadFinished) return false

//       var stats = shareDat.stats.get()
//       var fileRe = new RegExp(stats.filesTotal + ' files')
//       var bytesRe = new RegExp(/1\.\d{1,2} kB/)

//       t.ok(help.matchLink(output), 'prints link')
//       t.ok(output.indexOf('dwebx-download-folder/' + key) > -1, 'prints dir')
//       t.ok(output.match(fileRe), 'total size: files okay')
//       t.ok(output.match(bytesRe), 'total size: bytes okay')
//       t.ok(help.isDir(datDir), 'creates download directory')

//       var fileList = help.fileList(datDir).join(' ')
//       var hasCsvFile = fileList.indexOf('all_hour.csv') > -1
//       t.ok(hasCsvFile, 'csv file downloaded')
//       var hasDatFolder = fileList.indexOf('.dwebx') > -1
//       t.ok(!hasDatFolder, '.dwebx folder not created')
//       var hasSubDir = fileList.indexOf('folder') > -1
//       t.ok(hasSubDir, 'folder created')
//       var hasNestedDir = fileList.indexOf('nested') > -1
//       t.ok(hasNestedDir, 'nested folder created')
//       var hasHelloFile = fileList.indexOf('hello.txt') > -1
//       t.ok(hasHelloFile, 'hello.txt file downloaded')

//       st.kill()
//       return true
//     })
//     st.succeeds('exits after finishing download')
//     st.stderr.empty()
//     st.end()
//   })
// })

test('clone - invalid link', function (t) {
  var key = 'best-key-ever'
  var cmd = dwebx + ' clone ' + key
  tempDir(function (_, dir, cleanup) {
    var st = spawn(t, cmd, { cwd: dir })
    var datDir = path.join(dir, key)
    st.stderr.match(function (output) {
      var error = output.indexOf('Could not resolve link') > -1
      if (!error) return false
      t.ok(error, 'has error')
      t.ok(!help.isDir(datDir), 'download dir removed')
      st.kill()
      return true
    })
    st.end(cleanup)
  })
})

test('clone - shortcut/stateless clone', function (t) {
  help.shareFixtures(function (_, shareDat) {
    var key = shareDat.key.toString('hex')
    tempDir(function (_, dir, cleanup) {
      var datDir = path.join(dir, key)
      var cmd = dwebx + ' ' + key + ' ' + datDir + ' --exit'
      var st = spawn(t, cmd)

      st.stdout.match(function (output) {
        var downloadFinished = output.indexOf('Exiting') > -1
        if (!downloadFinished) return false

        t.ok(help.isDir(datDir), 'creates download directory')

        var fileList = help.fileList(datDir).join(' ')
        var hasCsvFile = fileList.indexOf('all_hour.csv') > -1
        t.ok(hasCsvFile, 'csv file downloaded')
        var hasDatFolder = fileList.indexOf('.dwebx') > -1
        t.ok(hasDatFolder, '.dwebx folder created')
        var hasSubDir = fileList.indexOf('folder') > -1
        t.ok(hasSubDir, 'folder created')
        var hasNestedDir = fileList.indexOf('nested') > -1
        t.ok(hasNestedDir, 'nested folder created')
        var hasHelloFile = fileList.indexOf('hello.txt') > -1
        t.ok(hasHelloFile, 'hello.txt file downloaded')

        st.kill()
        return true
      })
      st.succeeds('exits after finishing download')
      st.stderr.empty()
      st.end(function () {
        cleanup()
        shareDat.close()
      })
    })
  })
})

// TODO: fix this
// test('clone - ddatabase link', function (t) {
//   help.shareFeed(function (_, key, close) {
//     tempDir(function (_, dir, cleanup) {
//       var cmd = dwebx + ' clone ' + key
//       var st = spawn(t, cmd, {cwd: dir})
//       var datDir = path.join(dir, key)
//       st.stderr.match(function (output) {
//         var error = output.indexOf('not a DWebX Archive') > -1
//         if (!error) return false
//         t.ok(error, 'has error')
//         t.ok(!help.isDir(datDir), 'download dir removed')
//         st.kill()
//         return true
//       })
//       st.end(function () {
//         cleanup()
//         close()
//       })
//     })
//   })
// })

test('clone - specify directory containing dwebx.json', function (t) {
  help.shareFixtures(function (_, shareDat) {
    tempDir(function (_, dir, cleanup) {
      fs.writeFileSync(path.join(dir, 'dwebx.json'), JSON.stringify({ url: shareDat.key.toString('hex') }), 'utf8')

      // dwebx clone /dir
      var cmd = dwebx + ' clone ' + dir
      var st = spawn(t, cmd)
      var datDir = dir

      st.stdout.match(function (output) {
        var downloadFinished = output.indexOf('Exiting') > -1
        if (!downloadFinished) return false

        var fileList = help.fileList(datDir).join(' ')
        var hasCsvFile = fileList.indexOf('all_hour.csv') > -1
        t.ok(hasCsvFile, 'csv file downloaded')
        var hasDatFolder = fileList.indexOf('.dwebx') > -1
        t.ok(hasDatFolder, '.dwebx folder created')
        var hasSubDir = fileList.indexOf('folder') > -1
        t.ok(hasSubDir, 'folder created')
        var hasNestedDir = fileList.indexOf('nested') > -1
        t.ok(hasNestedDir, 'nested folder created')
        var hasHelloFile = fileList.indexOf('hello.txt') > -1
        t.ok(hasHelloFile, 'hello.txt file downloaded')

        st.kill()
        return true
      })
      st.succeeds('exits after finishing download')
      st.stderr.empty()
      st.end(function () {
        cleanup()
        shareDat.close()
      })
    })
  })
})

test('clone - specify directory containing dwebx.json with cwd', function (t) {
  help.shareFixtures(function (_, shareDat) {
    tempDir(function (_, dir, cleanup) {
      fs.writeFileSync(path.join(dir, 'dwebx.json'), JSON.stringify({ url: shareDat.key.toString('hex') }), 'utf8')

      // cd dir && dwebx clone /dir/dwebx.json
      var cmd = dwebx + ' clone ' + dir
      var st = spawn(t, cmd, { cwd: dir })
      var datDir = dir

      st.stdout.match(function (output) {
        var downloadFinished = output.indexOf('Exiting') > -1
        if (!downloadFinished) return false

        var fileList = help.fileList(datDir).join(' ')
        var hasCsvFile = fileList.indexOf('all_hour.csv') > -1
        t.ok(hasCsvFile, 'csv file downloaded')
        var hasDatFolder = fileList.indexOf('.dwebx') > -1
        t.ok(hasDatFolder, '.dwebx folder created')
        var hasSubDir = fileList.indexOf('folder') > -1
        t.ok(hasSubDir, 'folder created')
        var hasNestedDir = fileList.indexOf('nested') > -1
        t.ok(hasNestedDir, 'nested folder created')
        var hasHelloFile = fileList.indexOf('hello.txt') > -1
        t.ok(hasHelloFile, 'hello.txt file downloaded')

        st.kill()
        return true
      })
      st.succeeds('exits after finishing download')
      st.stderr.empty()
      st.end(function () {
        cleanup()
        shareDat.close()
      })
    })
  })
})

test('clone - specify dwebx.json path', function (t) {
  help.shareFixtures(function (_, shareDat) {
    tempDir(function (_, dir, cleanup) {
      var datJsonPath = path.join(dir, 'dwebx.json')
      fs.writeFileSync(datJsonPath, JSON.stringify({ url: shareDat.key.toString('hex') }), 'utf8')

      // dwebx clone /dir/dwebx.json
      var cmd = dwebx + ' clone ' + datJsonPath
      var st = spawn(t, cmd)
      var datDir = dir

      st.stdout.match(function (output) {
        var downloadFinished = output.indexOf('Exiting') > -1
        if (!downloadFinished) return false

        var fileList = help.fileList(datDir).join(' ')
        var hasCsvFile = fileList.indexOf('all_hour.csv') > -1
        t.ok(hasCsvFile, 'csv file downloaded')
        var hasDatFolder = fileList.indexOf('.dwebx') > -1
        t.ok(hasDatFolder, '.dwebx folder created')
        var hasSubDir = fileList.indexOf('folder') > -1
        t.ok(hasSubDir, 'folder created')
        var hasNestedDir = fileList.indexOf('nested') > -1
        t.ok(hasNestedDir, 'nested folder created')
        var hasHelloFile = fileList.indexOf('hello.txt') > -1
        t.ok(hasHelloFile, 'hello.txt file downloaded')

        st.kill()
        return true
      })
      st.succeeds('exits after finishing download')
      st.stderr.empty()
      st.end(function () {
        cleanup()
        shareDat.close()
      })
    })
  })
})

test('clone - specify dwebx.json path with cwd', function (t) {
  help.shareFixtures(function (_, shareDat) {
    tempDir(function (_, dir, cleanup) {
      var datJsonPath = path.join(dir, 'dwebx.json')
      fs.writeFileSync(datJsonPath, JSON.stringify({ url: shareDat.key.toString('hex') }), 'utf8')

      // cd /dir && dwebx clone /dir/dwebx.json
      var cmd = dwebx + ' clone ' + datJsonPath
      var st = spawn(t, cmd, { cwd: dir })
      var datDir = dir

      st.stdout.match(function (output) {
        var downloadFinished = output.indexOf('Exiting') > -1
        if (!downloadFinished) return false

        var fileList = help.fileList(datDir).join(' ')
        var hasCsvFile = fileList.indexOf('all_hour.csv') > -1
        t.ok(hasCsvFile, 'csv file downloaded')
        var hasDatFolder = fileList.indexOf('.dwebx') > -1
        t.ok(hasDatFolder, '.dwebx folder created')
        var hasSubDir = fileList.indexOf('folder') > -1
        t.ok(hasSubDir, 'folder created')
        var hasNestedDir = fileList.indexOf('nested') > -1
        t.ok(hasNestedDir, 'nested folder created')
        var hasHelloFile = fileList.indexOf('hello.txt') > -1
        t.ok(hasHelloFile, 'hello.txt file downloaded')

        st.kill()
        return true
      })
      st.succeeds('exits after finishing download')
      st.stderr.empty()
      st.end(function () {
        cleanup()
        shareDat.close()
      })
    })
  })
})

test('clone - specify dwebx.json + directory', function (t) {
  help.shareFixtures(function (_, shareDat) {
    tempDir(function (_, dir, cleanup) {
      var datDir = path.join(dir, 'clone-dest')
      var datJsonPath = path.join(dir, 'dwebx.json') // make dwebx.json in different dir

      fs.mkdirSync(datDir)
      fs.writeFileSync(datJsonPath, JSON.stringify({ url: shareDat.key.toString('hex') }), 'utf8')

      // dwebx clone /dir/dwebx.json /dir/clone-dest
      var cmd = dwebx + ' clone ' + datJsonPath + ' ' + datDir
      var st = spawn(t, cmd)

      st.stdout.match(function (output) {
        var downloadFinished = output.indexOf('Exiting') > -1
        if (!downloadFinished) return false

        var fileList = help.fileList(datDir).join(' ')
        var hasCsvFile = fileList.indexOf('all_hour.csv') > -1
        t.ok(hasCsvFile, 'csv file downloaded')
        var hasDatFolder = fileList.indexOf('.dwebx') > -1
        t.ok(hasDatFolder, '.dwebx folder created')
        var hasSubDir = fileList.indexOf('folder') > -1
        t.ok(hasSubDir, 'folder created')
        var hasNestedDir = fileList.indexOf('nested') > -1
        t.ok(hasNestedDir, 'nested folder created')
        var hasHelloFile = fileList.indexOf('hello.txt') > -1
        t.ok(hasHelloFile, 'hello.txt file downloaded')

        st.kill()
        return true
      })
      st.succeeds('exits after finishing download')
      st.stderr.empty()
      st.end(function () {
        cleanup()
        shareDat.close()
      })
    })
  })
})
