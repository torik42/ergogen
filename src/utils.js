const m = require('makerjs')

const deepcopy = exports.deepcopy = value => {
    if (value === undefined) return undefined
    return JSON.parse(JSON.stringify(value))
}

const deep = exports.deep = (obj, key, val) => {
    const levels = key.split('.')
    const last = levels.pop()
    let step = obj
    for (const level of levels) {
        step[level] = step[level] || {}
        step = step[level]
    }
    if (val === undefined) return step[last]
    step[last] = val
    return obj
}

const eq = exports.eq = (a=[], b=[]) => {
    return a[0] === b[0] && a[1] === b[1]
}

const line = exports.line = (a, b) => {
    return new m.paths.Line(a, b)
}

exports.circle = (p, r) => {
    return {paths: {circle: new m.paths.Circle(p, r)}}
}

exports.rect = (w, h, o=[0, 0]) => {
    const res = {
        top:    line([0, h], [w, h]),
        right:  line([w, h], [w, 0]),
        bottom: line([w, 0], [0, 0]),
        left:   line([0, 0], [0, h])
    }
    return m.model.move({paths: res}, o)
}

exports.poly = (arr) => {
    let counter = 0
    let prev = arr[arr.length - 1]
    const res = {
        paths: {}
    }
    for (const p of arr) {
        if (eq(prev, p)) continue
        res.paths['p' + (++counter)] = line(prev, p)
        prev = p
    }
    return res
}

exports.poly_line = (arr) => {
    let counter = 0
    let prev = arr[0]
    const res = {
        paths: {}
    }
    for (const p of arr) {
        if (eq(prev, p)) continue
        res.paths['p' + (++counter)] = line(prev, p)
        prev = p
    }
    return res
}

// A coordinate system made from two little arrows.
// l specifies the lenght of the arrows.
exports.coord = (l=3) => {
  const arrow_tip = {
    tip1: line([.9*l,.1*l], [l,0]),
    tip2: line([l,0], [.9*l,-.1*l])
  }
  const arrow_model = {paths: arrow_tip}
  let x_tip = deepcopy(arrow_model)
  let y_tip = m.model.rotate(arrow_model, 90, [0,0])
  const x_line = {paths: {line: line([-l/5,0], [l,0])}}
  const y_line = {paths: {line: line([0,0], [0,l])}}
  let model = {models: {x_tip, y_tip, x_line, y_line}}
  model.layer = "green"
  return model
}

const farPoint = [1234.1234, 2143.56789]

exports.union = (a, b) => {
    return m.model.combine(a, b, false, true, false, true, {
        farPoint
    })
}

exports.subtract = (a, b) => {
    return m.model.combine(a, b, false, true, true, false, {
        farPoint
    })
}

exports.intersect = (a, b) => {
    return m.model.combine(a, b, true, false, true, false, {
        farPoint
    })
}

exports.stack = (a, b) => {
    return {
        models: {
            a, b
        }
    }
}

exports.stack_array = (arr) => {
    const res = {models: {}}
    for ([ind, elem] of arr.entries()) {
      res.models["elem"+ind] = elem
    }
    return res
}
