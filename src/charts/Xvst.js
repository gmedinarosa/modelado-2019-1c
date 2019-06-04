import React from 'react'
import rd3 from 'react-d3-library'
import PropTypes from 'prop-types'
import draw from './d3'

const RD3Component = rd3.Component

class Xvst extends React.PureComponent {

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

  // shouldComponentUpdate(nextProps, nextState, nextContext) {
  //
  // }

  constructor(props) {
    super(props)
    this.state = {d3: ''}
  }

  // componentDidMount() {
  //   this.setState({d3: node})
  // }

  render() {
    const {data, density, xAxis, yAxis} = this.props
    const node = draw(data, density, xAxis.min, xAxis.max, yAxis.min, yAxis.max)
    // console.log(node)
    return (
      <div>
        <RD3Component data={node}/>
      </div>
    )
  }
}

export default Xvst
