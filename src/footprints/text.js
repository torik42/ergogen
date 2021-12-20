const a = require('../assert')

module.exports = {
  params: {
    class: 'S',
    text: '',
    height: 1.5,
    width: 1.5,
    thickness: 0.3,
    layer: 'F.SilkS',
    mirrored: 'auto',
    alignment: 'center'
  },
  body: p => {
    a.in(p.param.mirrored, 'params.mirrored', ['auto', true, false])
    var mirrored = ''
    if (p.param.mirrored == 'auto' && p.param.layer[0] == 'B' || p.param.mirrored == true) {
      mirrored = ' mirror'
    }
    
    a.in(p.param.alignment, 'params.alignment', ['left', 'right', 'center'])
    var aligned = ''
    if (['left', 'right'].includes(p.param.alignment)) {
      aligned = ' ' + p.param.alignment
    }
    
    var justify = ''
    if (mirrored != '' || aligned != '') {
      justify = `(justify${aligned}${mirrored})`
    }
    
    return `
      (gr_text "${p.param.text}" ${p.at} (layer ${p.param.layer})
        (effects (font (size ${p.param.height} ${p.param.width}) (thickness ${p.param.thickness})) ${justify})
      )`
  }
}
