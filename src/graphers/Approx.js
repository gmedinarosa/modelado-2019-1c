function Approx(fn, h, xMin, xMax) {
  return new Promise((resolve) => {

    const fnXb = (Xa, Ta, h) => Xa + fn(Ta, Ta) * h

    let Ta = 0
    let Xa = 0

    let data = [{x: Ta, y: Xa}]

    for (let i = 1; i <= xMax; i++) {
      let Tb = i * h
      let Xb = fnXb(Xa, Ta, h)

      if (typeof Xb !== 'undefined' && typeof Xb !== 'object') {
        data.push({x: Tb, y: Xb})
      }

      Ta = Tb
      Xa = Xb
    }
    resolve(data)
  })
}

export default Approx
