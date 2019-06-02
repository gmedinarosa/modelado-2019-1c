import React from 'react'
import './App.css'
import MathQuill, {addStyles as addMathquillStyles} from 'react-mathquill'
import Typography from '@material-ui/core/Typography'
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'
import mqToMathJS from './utils/mqToMathJS'
import * as math from 'mathjs'
import 'chart.js'

addMathquillStyles()

const XMin = -3
const XMax = 3
const H = 1

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
    }
  }

  calcFn(exp) {
    return new Promise((resolve) => {
      let data = []
      let parseError = false
      try {
        for (let x = XMin; x <= XMax; x++) {
          const y = math.eval(exp, {x})
          if (typeof y !== 'undefined' && typeof y !== 'object') {
            data.push({
              'name': x,
              'y': y,
            })
          }
        }
      } catch (err) {
        data = this.state.fnxvsx
        parseError = true
        console.warn('Parse error')
      }
      this.setState({fnxvsx: data, parseError})
      resolve(parseError)
    })
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

    return (
      <div style={{display: 'flex', width: '100%', height: '100%'}}>
        <div style={{flex: 1}}>
          <Typography variant="h3" gutterBottom>Sistemas autónomos 1D</Typography>
          <div style={{display: 'flex'}}>
            <Typography variant="body1" style={{alignSelf: 'center'}}>x' = </Typography>
            <MathQuill
              style={{color: 'red'}}
              latex={this.state.latex}
              onChange={latex => {
                const exp = mqToMathJS(latex)
                console.log(exp, latex)
                this.calcFn(exp)
                const fn = (x, t) => math.eval(exp, {x, t})
                this.calcAproxFn(fn, H)
                this.calcXvsT(fn, H)
                this.setState({latex, exp})
              }}
            />
          </div>
          <div style={{display: 'flex'}}>
            {this.state.parseError ? 'parse error' : null}
          </div>
        </div>
        <div style={{flex: 1, height: '100vh'}}>
          <div style={{height: '33vh'}}>
            <ResponsiveContainer>
              <LineChart data={this.state.fnxvsx}
                         margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name" domain={[XMin, XMax]} scale={'linear'} type={'number'} allowDataOverflow={true}/>
                <YAxis domain={[XMin, XMax]} scale={'linear'} allowDataOverflow={true}/>
                <Tooltip/>
                <Line type="linear" dataKey="y" stroke="#82ca9d"/>
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{height: '33vh'}}>
            <ResponsiveContainer>
              <LineChart data={this.state.aproxData}
                         margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name" domain={[XMin, XMax]} scale={'linear'} type={'number'} allowDataOverflow={true}/>
                <YAxis domain={[XMin, XMax]} scale={'linear'} allowDataOverflow={true}/>
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
