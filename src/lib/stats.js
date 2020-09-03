var xtend = Object.assign

module.exports = trackStats

function trackStats (state, bus) {
  if (state.dwebx) return track()
  bus.once('dwebx', track)

  function track () {
    var stats = state.dwebx.trackStats(state.opts)
    state.stats = xtend(stats, state.stats)
    stats.on('update', function () {
      bus.emit('stats:update')
      bus.emit('render')
    })
    bus.emit('stats')
  }
}
