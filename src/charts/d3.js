import * as d3 from 'd3'

function defaultVectors(density, xMin, xMax, yMin, yMax) {
  const data = []
  for (let i = xMin; i <= xMax; i += 1 / density) {
    for (let j = yMin; j <= yMax; j += 1 / density) {
      let pt = {
        x: i,
        y: j,
        vx: -j,
        vy: i,
      }
      pt.magnitude = Math.sqrt(pt.vx * pt.vx + pt.vy * pt.vy)
      data.push(pt)
    }
  }
  return data
}

const axisHeight = 20
const axisWidth = 25

function draw(data, lines, density, onClick, xMin, xMax, yMin, yMax, width = 0, height = 0) {
  let added = 0
  let xScale
  let yScale

  const node = document.createElement('div')
  d3.select(node).append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('id', 'svg')
  // .attr('transform', 'translate(' + margin + ',' + margin + ')')

  xScale = d3.scaleLinear().range([0, width]).domain([xMin, xMax])
  yScale = d3.scaleLinear().range([height, 0]).domain([yMin, yMax])

  const svg = d3.select(node).select('#svg')

  svg.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'white')
  svg.append('g')
    .attr('id', 'vectors')
  svg.append('g')
    .attr('id', 'lines')
  svg.append('rect')
    .attr('width', width)
    .attr('height', axisHeight)
    .attr('fill', 'white')
    .attr('transform', 'translate(0,' + (height - axisHeight) + ')')
  svg.append('g')
    .attr('transform', 'translate(0,' + (height - axisHeight) + ')')
    .call(d3.axisBottom(xScale))
  svg.append('rect')
    .attr('width', axisWidth)
    .attr('height', height)
    .attr('fill', 'white')
    .attr('transform', 'translate(0,0)')
  svg.append('g')
    .attr('transform', 'translate(' + axisWidth + ',0)')
    .call(d3.axisLeft(yScale))

  // I don't know why, but this prevents the event from firing constantly
  added++
  if (added < 4) {
    svg.on('click', function() {
      const coords = d3.mouse(this)
      const point = {
        x: xScale.invert(coords[0]),
        y: yScale.invert(coords[1]),
      }
      onClick(point)
    })
  }

  const vectorGroup = d3.select(node).select('#vectors')
  const lineGroup = d3.select(node).select('#lines')

  const valueline = d3.line()
    .x(function(d) { return xScale(d.x) })
    .y(function(d) { return yScale(d.y) })

  lines.forEach(line => {
    lineGroup.append("path")
      .data([line])
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr("d", valueline)
  })

  let maxMagnitude = 0
  let vectors = []
  if (data === null) {
    vectors = defaultVectors(density, xMin, xMax, yMin, yMax)
  } else {
    vectors = data.map(v => {
      const magnitude = Math.sqrt(v.vx * v.vx + v.vy * v.vy)
      if (magnitude > maxMagnitude) maxMagnitude = magnitude
      return {
        x: v.x,
        y: v.y,
        vx: v.vx,
        vy: v.vy,
        magnitude,
      }
    })
  }

  const vscale = d3.scaleLinear().domain([0, 1]).range([0, 1 / density])
  // const colorScale = d3.scaleSequential(d3.interpolateInferno).domain([0, maxMagnitude])

  vectors.forEach(function(p) {
    // we first scale down to a unit vector
    p.ux = p.vx / p.magnitude
    p.uy = p.vy / p.magnitude
    // and now scale it to our own scale
    p.ux *= vscale(1)
    p.uy *= vscale(1)

    // vector
    vectorGroup.append('g')
      .append('path')
      .attr('d', 'M' + xScale(0) + ' ' + yScale(0) + ' L' + xScale(p.ux) + ' ' + yScale(p.uy))
      // .attr('stroke', colorScale(p.magnitude))
      .attr('stroke', 'rgba(100, 100, 100, 0.75)')
      .attr('stroke-width', 1)
      .attr('fill', 'none')
      .attr('transform', 'translate(' + (xScale(p.x) - xScale(0)) + ',' + (yScale(p.y) - yScale(0)) + ')')

    // pinhead
    vectorGroup.append('g')
      .append('circle')
      .attr('r', 2)
      .attr('cx', xScale(p.ux))
      .attr('cy', yScale(p.uy))
      .attr('fill', 'rgba(100, 100, 100, 0.75)')
      .attr('transform', 'translate(' + (xScale(p.x) - xScale(0)) + ',' + (yScale(p.y) - yScale(0)) + ')')

  })

  return node
}

export function drawFnxvsx(data, density, xMin, xMax, yMin, yMax, width = 0, height = 0) {
  let xScale
  let yScale

  const node = document.createElement('div')
  d3.select(node).append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('id', 'svg')
  // .attr('transform', 'translate(' + margin + ',' + margin + ')')

  xScale = d3.scaleLinear().range([0, width]).domain([xMin, xMax])
  yScale = d3.scaleLinear().range([height, 0]).domain([yMin, yMax])

  const svg = d3.select(node).select('#svg')

  svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'white')
  svg.append('g')
      .attr('id', 'vectors')
  svg.append('g')
      .attr('id', 'lines')
  svg.append('rect')
      .attr('width', width)
      .attr('height', axisHeight)
      .attr('fill', 'white')
      .attr('transform', 'translate(0,' + (height - axisHeight) + ')')
  svg.append('g')
      .attr('transform', 'translate(0,' + (height - axisHeight) + ')')
      .call(d3.axisBottom(xScale))
  svg.append('rect')
      .attr('width', axisWidth)
      .attr('height', height)
      .attr('fill', 'white')
      .attr('transform', 'translate(0,0)')
  svg.append('g')
      .attr('transform', 'translate(' + axisWidth + ',0)')
      .call(d3.axisLeft(yScale))


  const lineGroup = d3.select(node).select('#lines')

  const valueline = d3.line()
      .x(function(d) { return xScale(d.x) })
      .y(function(d) { return yScale(d.y) })

    lineGroup.append("path")
        .data([data])
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr("d", valueline)

  return node
}

export default draw
