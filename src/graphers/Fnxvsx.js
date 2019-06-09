function Fnxvsx(fn, xMin, xMax) {
  return new Promise((resolve) => {
    let data = []
    for (let x = xMin; x <= xMax; x = x + 0.01) {
      const y = fn(x)
      if (typeof y !== 'undefined' && typeof y !== 'object') {
        data.push({x: x, y: y})
      }
    }
    resolve(data)
  })
}

export default Fnxvsx
