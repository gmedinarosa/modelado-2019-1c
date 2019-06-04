import React from 'react'
import PropTypes from 'prop-types'
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'

class FnxvsxChart extends React.Component {

  static propTypes = {
    data: PropTypes.array,
    xAxis: PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
    }),
    yAxis: PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
    })
  }

  render() {
    const {xAxis, yAxis} = this.props

    return (
      <ResponsiveContainer>
        <LineChart data={this.props.data} margin={{top: 5, right: 0, left: 0, bottom: 5}}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="x" domain={[xAxis.min, xAxis.max]} scale={'linear'} type={'number'}/>
          <YAxis domain={[yAxis.min, yAxis.max]} scale={'linear'} allowDataOverflow={true} interval="preserveStartEnd" type={'number'}/>
          <Tooltip/>
          <Line type="monotone" dataKey="y" stroke="#82ca9d"/>
        </LineChart>
      </ResponsiveContainer>
    )
  }
}

export default FnxvsxChart
