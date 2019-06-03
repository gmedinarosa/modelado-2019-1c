function calcArrow(fn, h, Xa, Ta) {

  const fnXb = (Xa, Ta, h) => Xa + fn(Xa, Ta) * h

  let Tb = Ta + h
  let Xb = fnXb(Xa, Ta, h)

  if (typeof Xb === 'undefined' || typeof Xb === 'object') return []

  const vector = {a: Tb - Ta, b: Xb - Xa}
  const mod = Math.sqrt(Math.pow(vector.a, 2) + Math.pow(vector.b, 2))
  const uvector = {a: vector.a / mod, b: vector.b / mod}

  return [{x: Ta, y: Xa}, {x: Ta + uvector.a, y: Xa + uvector.b}]
}

function Xvst(fn, h, xMin, xMax) {
  return new Promise((resolve) => {
    const vectors = []
    for (let t = xMin; t <= xMax; t++) {
      for (let x = xMin; x <= xMax; x++) {
        vectors.push(calcArrow(fn, h, x, t))
      }
    }
    // console.log(vectors)
    resolve(vectors)
  })
}

export default Xvst
