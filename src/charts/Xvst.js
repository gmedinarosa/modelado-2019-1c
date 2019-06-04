import React from 'react'
import rd3 from 'react-d3-library'
import PropTypes from 'prop-types'
import draw from './d3'

const RD3Component = rd3.Component

class Xvst extends React.Component {

  static propTypes = {
    data: PropTypes.array,
    density: PropTypes.number,
    xAxis: PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
    }),
    yAxis: PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
    })
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) return true
    if (nextProps.density !== this.props.density) return true
    if (nextProps.xAxis.min !== this.props.xAxis.min) return true
    if (nextProps.xAxis.max !== this.props.xAxis.max) return true
    if (nextProps.yAxis.min !== this.props.yAxis.min) return true
    if (nextProps.yAxis.max !== this.props.yAxis.max) return true
    return false
  }

  constructor(props) {
    super(props)
    this.state = {d3: ''}
  }

  render() {
    const {data, density, xAxis, yAxis} = this.props
    const node = draw(data, density, xAxis.min, xAxis.max, yAxis.min, yAxis.max)
    return (
      <div>
        <RD3Component data={node}/>
      </div>
    )
  }
}

export default Xvst
