function Approx(fn, h, T0, X0, xMin, xMax, yMin, yMax) {
  return new Promise((resolve) => {

    const fnXb = (Xa, Ta, h) => Xa + fn(Xa, Ta) * h

    let Ta = T0
    let Xa = X0

    let data = [{x: Ta, y: Xa}]

    for (let i = 1; i <= xMax; i += h) {
      let Tb = Ta + h
      let Xb = fnXb(Xa, Ta, h)

      if (typeof Xb !== 'undefined' && typeof Xb !== 'object') {
        data.push({x: Tb, y: Xb})
      }

      //No need to keep going
      if (Xb > yMax) break
      if (Xb < yMin) break

      Ta = Tb
      Xa = Xb
    }
    resolve(data)
  })
}

export default Approx
