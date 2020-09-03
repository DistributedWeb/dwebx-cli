var test = require('tape')
var ram = require('random-access-memory')
var DWebX = require('..')

test('dwebx-node: require dwebx-node + make a dwebx', function (t) {
  DWebX(ram, function (err, dwebx) {
    t.error(err, 'no error')
    t.ok(dwebx, 'makes dwebx')
    t.pass('yay')
    t.end()
  })
})
