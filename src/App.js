import React from 'react'
import './App.css'
import MathQuill, {addStyles as addMathquillStyles} from 'react-mathquill'
import Typography from '@material-ui/core/Typography'
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'
import mqToMathJS from './utils/mqToMathJS'
import * as math from 'mathjs'
import FnxvsxChart from './charts/Fnxvsx'
import Fnxvsx from './graphers/Fnxvsx'

addMathquillStyles()

const XMin = -3
const XMax = 3
const H = 0.5

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      latex: 'x^2',
      exp: 'x^2',
      fnxvsx: [],
      aproxData: [],
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
    if (this.isFnValid(exp) === true) {
      this.refreshData(exp)
    }
    this.setState({exp, latex})
  }
  
  refreshData(exp) {
    const {xMin, xMax} = this.state
    
    const fn = (x, t) => math.eval(exp, {x, t})

    Fnxvsx(fn, xMin, xMax).then(fnxvsx => this.setState({fnxvsx}))

    this.calcAproxFn(fn, H)
    this.calcXvsT(fn, H)
  }

  calcAproxFn(fn, h) {
    return new Promise((resolve) => {

      const fnXb = (Xa, Ta, h) => Xa + fn(Ta, Ta) * h

      let Ta = 0
      let Xa = 0

      let data = [{'name': Ta, 'y': Xa}]

      try {
        for (let i = 1; i <= XMax; i++) {
          let Tb = i * h
          let Xb = fnXb(Xa, Ta, h)

          if (typeof Xb !== 'undefined' && typeof Xb !== 'object') {
            data.push({
              'name': Tb,
              'y': Xb,
            })
          }

          Ta = Tb
          Xa = Xb
        }
      } catch (err) {
        data = this.state.aproxData
        console.warn('Parse error')
      }
      this.setState({aproxData: data})
      resolve()
    })
  }

  calcArrow(fn, h, Xa, Ta) {

    const fnXb = (Xa, Ta, h) => Xa + fn(Xa, Ta) * h

    try {
      let Tb = Ta + h
      let Xb = fnXb(Xa, Ta, h)

      if (typeof Xb === 'undefined' || typeof Xb === 'object') return []

      const vector = {a: Tb - Ta, b: Xb - Xa}
      const mod = Math.sqrt(Math.pow(vector.a, 2) + Math.pow(vector.b, 2))
      const uvector = {a: vector.a / mod, b: vector.b / mod}

      return [{x: Ta, y: Xa}, {x: Ta + uvector.a, y: Xa + uvector.b}]
    } catch (err) {
      console.warn('Parse error')
      return []
    }
  }

  calcXvsT(fn, h) {

    const vectors = []

    for (let t = XMin; t <= XMax; t++) {
      for (let x = XMin; x <= XMax; x++) {
        vectors.push(this.calcArrow(fn, h, x, t))
      }
    }
    console.log(vectors)
    this.setState({xvst: vectors})
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
          <div style={{display: 'flex'}}>
            {this.state.parseError ? 'parse error' : null}
          </div>
        </div>
        <div style={{flex: 1, height: '100vh'}}>
          <div style={{height: '33vh'}}>
            <FnxvsxChart data={this.state.fnxvsx} xAxis={{min: xMin, max: xMax}} yAxis={{min: yMin, max: yMax}}/>
          </div>
          <div style={{height: '33vh'}}>
            <ResponsiveContainer>
              <LineChart data={this.state.aproxData}
                         margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name" domain={[xMin, xMax]} scale={'linear'} type={'number'} allowDataOverflow={true}/>
                <YAxis domain={[yMin, yMax]} scale={'linear'} allowDataOverflow={true}/>
                <Tooltip/>
                <Line type="linear" dataKey="y" stroke="#82ca9d"/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    )
  }
}

export default App
