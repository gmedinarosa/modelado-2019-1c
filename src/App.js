import React from 'react'
import './App.css'
import MathQuill, {addStyles as addMathquillStyles} from 'react-mathquill'
import Typography from '@material-ui/core/Typography'
import mqToMathJS from './utils/mqToMathJS'
import * as math from 'mathjs'
import FnxvsxChart from './charts/Fnxvsx'
import Fnxvsx from './graphers/Fnxvsx'
import ApproxChart from './charts/Approx'
import Approx from './graphers/Approx'
import Xvst from './graphers/Xvst'

addMathquillStyles()

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      latex: 'x^2',
      exp: 'x^2',
      fnxvsx: [],
      approx: [],
      xvst: [],
      parseError: false,
      xMin: -3,
      xMax: 3,
      yMin: -3,
      yMax: 3,
      h: 1,
    }
  }

  componentDidMount() {
    const exp = this.state.exp
    this.refreshData(exp)
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
      this.refreshData(exp)
    }
    this.setState({exp, latex, parseError: !isFnValid})
  }
  
  refreshData(exp) {
    const {xMin, xMax, h} = this.state
    
    const fn = (x, t) => math.eval(exp, {x, t})

    Fnxvsx(fn, xMin, xMax).then(fnxvsx => this.setState({fnxvsx}))
    Approx(fn, h, xMin, xMax).then(approx => this.setState({approx}))
    Xvst(fn, h, xMin, xMax).then(xvst => this.setState({xvst}))
  }

  render() {
    const {xMin, xMax, yMin, yMax} = this.state

    return (
      <div style={{display: 'flex', width: '100%', height: '100%'}}>
        <div style={{flex: 1}}>
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
            <Typography variant="h6" gutterBottom>Configuracion de ejes</Typography>
          </div>
          <div style={{display: 'flex'}}>
            <Typography variant="body1" gutterBottom>X mínimo = </Typography>
            <MathQuill
                latex={this.state.xMin}
                onChange={latex => {
                  this.setState({xMin: latex})
                  this.refreshData(this.state.exp)
                }}
            />
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
        <div style={{flex: 1, height: '100vh'}}>
          <div style={{height: '33vh'}}>
            <FnxvsxChart data={this.state.fnxvsx} xAxis={{min: xMin, max: xMax}} yAxis={{min: yMin, max: yMax}}/>
          </div>
          <div style={{height: '33vh'}}>
            <ApproxChart data={this.state.approx} xAxis={{min: xMin, max: xMax}} yAxis={{min: yMin, max: yMax}}/>
          </div>
        </div>
      </div>
    )
  }
}

export default App
