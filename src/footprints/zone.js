// Zone
const a = require('../assert')

const text_allowed = b => b ? 'allowed' : 'not_allowed'

module.exports = {
    params: {
      side: 'F', // F or B or F&B for keepout
      thermal_gap: 0.3,
      thermal_bridge_width: 0.3,
      connect_pads: '',
      keepout: false
      // either use keepout: true
      // or specify keepout.tracks/vias/copperpour: true individually
    },
    nets: {
      net: undefined
    },
    body: p => {
      // check  if all values are valid
      a.in(p.param.connect_pads, 'params.connect_pads', ['', 'yes', 'thru_hole_only', 'no'])
      thermal_bridge_width = a.sane(p.param.thermal_bridge_width, 'params.thermal_bridge_width', 'number')
      thermal_gap = a.sane(p.param.thermal_gap, 'params.thermal_gap', 'number')
      
      // generate extra keepout text, if necessary
      let keepout = ''
      if (p.param.keepout) {
        p.net.net = {name: '\"\"', index: 0, str: '(net 0 \"\")'}
        keepout_options = ['tracks', 'vias', 'copperpour']
        if (p.param.keepout === true) {
          p.param.keepout = {}
          for (opt of keepout_options) {
            p.param.keepout[opt] = true
          }
        } else {
          a.unexpected(p.param.keepout, 'params.keepout', keepout_options)
          for (opt of keepout_options) {
            a.sane(p.param.keepout[opt] || false, 'params.keepout.'+opt, 'boolean')
          }
        }
        keepout = `(keepout (tracks ${text_allowed(!p.param.keepout.tracks)}) (vias ${text_allowed(!p.param.keepout.vias)}) (copperpour ${text_allowed(!p.param.keepout.copperpour)}))`
      }
      
      // check if a net is given (it is provided automatically for keepout zones)
      a.assert('net' in p.net, 'nets.net of footprint \'zone\' needs to be specified')
      
      // get all points
      let points = ''
      for (point of Object.values(p.anchors)) {
        points += `(xy ${point.x} ${point.y}) `
      }
      return `
        (zone (net ${p.net.net.index}) (net_name ${p.net.net.name}) (layers ${p.param.side}.Cu) (tstamp 619FC252) (hatch edge 0.508)
          (connect_pads ${p.param.connect_pads} (clearance 0.2))
          (min_thickness 0.254)
          ${keepout}
          (fill yes (arc_segments 32) (thermal_gap ${p.param.thermal_gap}) (thermal_bridge_width ${p.param.thermal_bridge_width}))
          (polygon
            (pts
              ${points}
            )
          )
        )
      `
    }
}
