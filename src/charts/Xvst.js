import React from 'react'
import rd3 from 'react-d3-library'
import PropTypes from 'prop-types'
import {SizeMe} from 'react-sizeme'
import { draw } from './d3'

const RD3Component = rd3.Component

class Xvst extends React.Component {

  static propTypes = {
    data: PropTypes.array,
    lines: PropTypes.array,
    density: PropTypes.number,
    xAxis: PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
    }),
    yAxis: PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
    }),
    onClick: PropTypes.func,
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) return true
    if (JSON.stringify(nextProps.lines) !== JSON.stringify(this.props.lines)) return true
    if (nextProps.density !== this.props.density) return true
    if (nextProps.xAxis.min !== this.props.xAxis.min) return true
    if (nextProps.xAxis.max !== this.props.xAxis.max) return true
    if (nextProps.yAxis.min !== this.props.yAxis.min) return true
    if (nextProps.yAxis.max !== this.props.yAxis.max) return true
    return false
  }

  render() {
    // const {data, lines, density, onClick, xAxis, yAxis} = this.props
    return (
      <SizeMe monitorHeight={true}>
        {({size}) => <div style={{width: '100%', height: '100%'}}>
          <NoNeedlessUpdates {...this.props} width={size.width} height={size.height}/>
        </div>}
      </SizeMe>
    )
  }
}

export default Xvst

class NoNeedlessUpdates extends React.Component {

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) return true
    if (JSON.stringify(nextProps.lines) !== JSON.stringify(this.props.lines)) return true
    if (nextProps.density !== this.props.density) return true
    if (nextProps.xAxis.min !== this.props.xAxis.min) return true
    if (nextProps.xAxis.max !== this.props.xAxis.max) return true
    if (nextProps.yAxis.min !== this.props.yAxis.min) return true
    if (nextProps.yAxis.max !== this.props.yAxis.max) return true
    if (nextProps.width !== this.props.width) return true
    if (nextProps.height !== this.props.height) return true
    return false
  }

  render() {
    const {data, lines, density, onClick, xAxis, yAxis, width, height} = this.props

    return (
      <RD3Component data={
        draw(data, lines, density, onClick, xAxis.min, xAxis.max, yAxis.min, yAxis.max, width, height)
      }/>
    )
  }
}
