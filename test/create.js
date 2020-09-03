var fs = require('fs')
var path = require('path')
var test = require('tape')
var tempDir = require('temporary-directory')
var DWebX = require('dwebx-node')
var spawn = require('./helpers/spawn.js')
var help = require('./helpers')

var dwebx = path.resolve(path.join(__dirname, '..', 'bin', 'cli.js'))
var fixtures = path.join(__dirname, 'fixtures')

// os x adds this if you view the fixtures in finder and breaks the file count assertions
try { fs.unlinkSync(path.join(fixtures, '.DS_Store')) } catch (e) { /* ignore error */ }

// start without dwebx.json
try { fs.unlinkSync(path.join(fixtures, 'dwebx.json')) } catch (e) { /* ignore error */ }

test('create - default opts no import', function (t) {
  tempDir(function (_, dir, cleanup) {
    var cmd = dwebx + ' create --title data --description thing'
    var st = spawn(t, cmd, { cwd: dir })

    st.stdout.match(function (output) {
      var datCreated = output.indexOf('Created empty DWebX') > -1
      if (!datCreated) return false

      t.ok(help.isDir(path.join(dir, '.dwebx')), 'creates dwebx directory')

      st.kill()
      return true
    })
    st.succeeds('exits after create finishes')
    st.stderr.empty()
    st.end(cleanup)
  })
})

test('create - errors on existing archive', function (t) {
  tempDir(function (_, dir, cleanup) {
    DWebX(dir, function (err, dwebx) {
      t.error(err, 'no error')
      dwebx.close(function () {
        var cmd = dwebx + ' create --title data --description thing'
        var st = spawn(t, cmd, { cwd: dir })
        st.stderr.match(function (output) {
          t.ok(output, 'errors')
          st.kill()
          return true
        })
        st.end()
      })
    })
  })
})

test('create - sync after create ok', function (t) {
  tempDir(function (_, dir, cleanup) {
    var cmd = dwebx + ' create --title data --description thing'
    var st = spawn(t, cmd, { cwd: dir, end: false })
    st.stdout.match(function (output) {
      var connected = output.indexOf('Created empty DWebX') > -1
      if (!connected) return false
      doSync()
      return true
    })

    function doSync () {
      var cmd = dwebx + ' sync '
      var st = spawn(t, cmd, { cwd: dir })

      st.stdout.match(function (output) {
        var connected = output.indexOf('Sharing') > -1
        if (!connected) return false
        st.kill()
        return true
      })
      st.stderr.empty()
      st.end(cleanup)
    }
  })
})

test('create - init alias', function (t) {
  tempDir(function (_, dir, cleanup) {
    var cmd = dwebx + ' init --title data --description thing'
    var st = spawn(t, cmd, { cwd: dir })

    st.stdout.match(function (output) {
      var datCreated = output.indexOf('Created empty DWebX') > -1
      if (!datCreated) return false

      t.ok(help.isDir(path.join(dir, '.dwebx')), 'creates dwebx directory')

      st.kill()
      return true
    })
    st.succeeds('exits after create finishes')
    st.stderr.empty()
    st.end(cleanup)
  })
})

test('create - with path', function (t) {
  tempDir(function (_, dir, cleanup) {
    var cmd = dwebx + ' init ' + dir + ' --title data --description thing'
    var st = spawn(t, cmd)
    st.stdout.match(function (output) {
      var datCreated = output.indexOf('Created empty DWebX') > -1
      if (!datCreated) return false

      t.ok(help.isDir(path.join(dir, '.dwebx')), 'creates dwebx directory')

      st.kill()
      return true
    })
    st.succeeds('exits after create finishes')
    st.stderr.empty()
    st.end(cleanup)
  })
})
