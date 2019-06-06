function calcArrow(fn, h, Xa, Ta) {

  const fnXb = (Xa, Ta, h) => Xa + fn(Xa, Ta) * h

  let Tb = Ta + h
  let Xb = fnXb(Xa, Ta, h)

  if (typeof Xb === 'undefined' || typeof Xb === 'object' || isNaN(Xb)) return null

  const vector = {a: Tb - Ta, b: Xb - Xa}

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
        if (a) vectors.push(a)
      }
    }
    resolve(vectors)
  })
}

export default Xvst
