// var fs = require('fs')
// var path = require('path')
// var test = require('tape')
// var rimraf = require('rimraf')
// var spawn = require('./helpers/spawn.js')
// var help = require('./helpers')

// var dwebx = path.resolve(path.join(__dirname, '..', 'bin', 'cli.js'))
// if (process.env.TRAVIS) dwebx += ' --no-watch '
// var fixtures = path.join(__dirname, 'fixtures')

// // os x adds this if you view the fixtures in finder and breaks the file count assertions
// try { fs.unlinkSync(path.join(fixtures, '.DS_Store')) } catch (e) { /* ignore error */ }

// // start without dwebx.json
// try { fs.unlinkSync(path.join(fixtures, 'dwebx.json')) } catch (e) { /* ignore error */ }

// test('share - default opts', function (t) {
//   rimraf.sync(path.join(fixtures, '.dwebx'))
//   var cmd = dwebx + ' share'
//   var st = spawn(t, cmd, {cwd: fixtures})

//   st.stdout.match(function (output) {
//     var importFinished = output.indexOf('Total Size') > -1
//     if (!importFinished) return false

//     t.ok(help.isDir(path.join(fixtures, '.dwebx')), 'creates dwebx directory')
//     t.ok(output.indexOf('Looking for connections') > -1, 'network')

//     st.kill()
//     return true
//   })
//   st.stderr.empty()
//   st.end()
// })

// test('share - with dir arg', function (t) {
//   rimraf.sync(path.join(fixtures, '.dwebx'))
//   var cmd = dwebx + ' share ' + fixtures
//   var st = spawn(t, cmd)

//   st.stdout.match(function (output) {
//     var importFinished = output.indexOf('Total Size') > -1
//     if (!importFinished) return false

//     t.ok(help.isDir(path.join(fixtures, '.dwebx')), 'creates dwebx directory')
//     t.ok(output.indexOf('Looking for connections') > -1, 'network')

//     st.kill()
//     return true
//   })
//   st.stderr.empty()
//   st.end()
// })

// test.onFinish(function () {
//   rimraf.sync(path.join(fixtures, '.dwebx'))
// })
