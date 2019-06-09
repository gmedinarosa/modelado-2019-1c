import * as d3 from "d3";

const axisHeight = 20
const axisWidth = 25
let xScale
let yScale

export function drawFnxvsx(data, density, xMin, xMax, yMin, yMax, width = 0, height = 0) {
    const node = document.createElement('div')
    d3.select(node).append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('id', 'svgFnxvsx')
    // .attr('transform', 'translate(' + margin + ',' + margin + ')')

    xScale = d3.scaleLinear().range([0, width]).domain([xMin, xMax])
    yScale = d3.scaleLinear().range([height, 0]).domain([yMin, yMax])

    const svg = d3.select(node).select('#svgFnxvsx')

    svg.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'white')
    svg.append('g')
        .attr('id', 'linesFnxvsx')
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


    const lineGroup = d3.select(node).select('#linesFnxvsx')

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

export default drawFnxvsx