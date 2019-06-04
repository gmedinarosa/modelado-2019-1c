function calcArrow(fn, h, Xa, Ta) {

  const fnXb = (Xa, Ta, h) => Xa + fn(Xa, Ta) * h

  let Tb = Ta + h
  let Xb = fnXb(Xa, Ta, h)

  if (typeof Xb === 'undefined' || typeof Xb === 'object') return {}

  const vector = {a: Tb - Ta, b: Xb - Xa}
  // const mod = Math.sqrt(Math.pow(vector.a, 2) + Math.pow(vector.b, 2))
  // const uvector = {a: vector.a / mod, b: vector.b / mod}

  // return [{x: Ta, y: Xa}, {x: Ta + uvector.a, y: Xa + uvector.b}]
  return {
    x: Ta,
    y: Xa,
    vx: vector.a,
    vy: vector.b,
  }
}

function Xvst(fn, h, density, xMin, xMax, yMin, yMax) {
  return new Promise((resolve) => {
    const vectors = []
    for (let t = xMin; t <= xMax; t += 1 / density) {
      for (let x = yMin; x <= yMax; x += 1 / density) {
        const a = calcArrow(fn, h, x, t)
        vectors.push(a)
      }
    }
    resolve(vectors)
  })
}

export default Xvst
