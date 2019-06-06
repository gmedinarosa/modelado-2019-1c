function Approx(fn, h, T0, X0, xMin, xMax, yMin, yMax) {
  return new Promise((resolve) => {

    const fnXb = (Xa, Ta, h) => Xa + fn(Xa, Ta) * h

    let Ta = T0
    let Xa = X0

    let fdata = [{x: Ta, y: Xa}]

    // Forwards
    for (let i = 0; i <= xMax - T0; i += h) {
      let Tb = Ta + h
      let Xb = fnXb(Xa, Ta, h)

      if (typeof Xb !== 'undefined' && typeof Xb !== 'object' && isNaN(Xb) === false) {
        fdata.push({x: Tb, y: Xb})
      }

      // No need to keep going
      if (Xb > yMax) break
      if (Xb < yMin) break

      Ta = Tb
      Xa = Xb
    }

    Ta = T0
    Xa = X0

    let bdata = []

    // Backwards
    for (let i = 0; i >= xMin - T0; i -= h) {
      let Tb = Ta - h
      let Xb = fnXb(Xa, Ta, -h)

      if (typeof Xb !== 'undefined' && typeof Xb !== 'object' && isNaN(Xb) === false) {
        bdata.push({x: Tb, y: Xb})
      }

      //No need to keep going
      if (Xb > yMax) break
      if (Xb < yMin) break

      Ta = Tb
      Xa = Xb
    }

    let data = bdata.reverse()
    data = data.concat(...fdata)

    resolve(data)
  })
}

export default Approx
