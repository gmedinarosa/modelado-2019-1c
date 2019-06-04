import React from 'react'
import './App.css'
import TextField from '@material-ui/core/TextField';
import MathQuill, {addStyles as addMathquillStyles} from 'react-mathquill'
import Typography from '@material-ui/core/Typography'
import mqToMathJS from './utils/mqToMathJS'
import * as math from 'mathjs'
import FnxvsxChart from './charts/Fnxvsx'
import Fnxvsx from './graphers/Fnxvsx'
import XvstChart from './charts/Xvst'
import Xvst from './graphers/Xvst'
import Approx from './graphers/Approx'

addMathquillStyles()

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      latex: 'x^2',
      exp: 'x^2',
      fnxvsx: [],
      approx: [],
      lines: [],
      xvst: [],
      parseError: false,
      xMinInput: '-3',
      xMaxInput: '3',
      yMinInput: '-3',
      yMaxInput: '3',
      xMin: -3,
      xMax: 3,
      yMin: -3,
      yMax: 3,
      h: 1,
      density: 2,
    }
  }

  fn = () => {}

  componentDidMount() {
    this.refreshData(this.state)
  }

  isFnValid(exp) {
    try {
      math.eval(exp, {x: 0})
      return true
    } catch {
      return false
    }
  }

  onExpressionChange = (latex) => {
    const exp = mqToMathJS(latex)
    const isFnValid = this.isFnValid(exp)
    if (isFnValid) {
      this.refreshData({...this.state, exp})
      this.setState({lines: []})
    }
    this.setState({exp, latex, parseError: !isFnValid})
  }
  
  refreshData({exp, xMin, xMax, yMin, yMax, h, density}) {
    
    const fn = (x, t) => math.eval(exp, {x, t})
    this.fn = fn

    Promise.all([
      Fnxvsx(fn, xMin, xMax),
      Xvst(fn, h, density, xMin, xMax),
    ])
      .then(results => {
        const fnxvsx = results[0]
        const xvst = results[1]
        this.setState({fnxvsx, xvst, xMin, xMax, yMin, yMax, h, density})
      })
  }

  onClick = (point) => {
    const {xMin, xMax, yMin, yMax, density} = this.state
    Approx(this.fn, 1 / (density * 4), point.x, point.y, xMin, xMax, yMin, yMax)
      .then(data => {
        this.setState({lines: [...this.state.lines, data]})
      })
  }

  handleChange = name => e => {
    this.setState({[name + 'Input']: e.target.value})
    if (isNaN(parseInt(e.target.value)) === false) {
      this.refreshData({...this.state, [name]: parseInt(e.target.value)})
    }
  }

  render() {
    const {xMin, xMax, yMin, yMax, density} = this.state
    const {xMinInput, xMaxInput, yMinInput, yMaxInput} = this.state
    const xAxis = {
      min: xMin,
      max: xMax,
    }
    const yAxis = {
      min: yMin,
      max: yMax,
    }
    return (
      <div style={{width: '100%', minHeight: '100%'}}>
        <div style={{width: '50%', position: 'fixed'}}>
          <Typography variant="h3" gutterBottom>Sistemas autónomos 1D</Typography>
          <div style={{display: 'flex'}}>
            <Typography variant="body1" style={{alignSelf: 'center'}}>x' = </Typography>
            <MathQuill
              style={{color: 'red'}}
              latex={this.state.latex}
              onChange={this.onExpressionChange}
            />
          </div>
          <div style={{display: 'flex'}}>
            {this.state.parseError ? 'parse error' : null}
          </div>
          <div style={{display: 'flex'}}>
            <Typography variant="h6" gutterBottom>Configuración de ejes</Typography>
          </div>
          <div style={{display: 'flex'}}>
            <Typography variant="body1" gutterBottom>X mínimo = </Typography>
            <TextField type="number" value={xMinInput} onChange={this.handleChange('xMin')}/>
          </div>
          <div style={{display: 'flex'}}>
            <Typography variant="body1" gutterBottom>X máximo = </Typography>
            <MathQuill
                style={{color: 'red'}}
                latex={this.state.xMax}
                onChange={latex => {
                  this.setState({xMax: latex})
                  this.this.refreshData(this.state.exp)
                }}
            />
          </div>
          <div style={{display: 'flex'}}>
            <Typography variant="body1" gutterBottom>Y mínimo = </Typography>
            <MathQuill
                style={{color: 'red'}}
                latex={this.state.yMin}
                onChange={latex => {
                  this.setState({yMin: latex})
                  this.this.refreshData(this.state.exp)
                }}
            />
          </div>
          <div style={{display: 'flex'}}>
            <Typography variant="body1" gutterBottom>Y máximo = </Typography>
            <MathQuill
                style={{color: 'red'}}
                latex={this.state.yMax}
                onChange={latex => {
                  this.setState({yMax: latex})
                  this.this.refreshData(this.state.exp)
                }}
            />
          </div>
          <div style={{display: 'flex'}}>
            <Typography variant="body1" gutterBottom>H = </Typography>
            <MathQuill
                style={{color: 'red'}}
                latex={this.state.h}
                onChange={latex => {
                  this.setState({h: latex})
                  this.this.refreshData(this.state.exp)
                }}
            />
          </div>
        </div>
        <div style={{minWidth: '50%', minHeight: '100vh', marginLeft: '50%'}}>
          <div style={{height: '33vh'}}>
            <FnxvsxChart data={this.state.fnxvsx} xAxis={xAxis} yAxis={yAxis}/>
          </div>
          <div style={{width: '100%', height: '66vh'}}>
            <XvstChart
              data={this.state.xvst}
              lines={this.state.lines}
              density={density}
              onClick={this.onClick}
              xAxis={xAxis} yAxis={yAxis}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default App
