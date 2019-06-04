import React from 'react'
import './App.css'
import MathQuill, {addStyles as addMathquillStyles} from 'react-mathquill'
import TextField from '@material-ui/core/TextField'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Paper from '@material-ui/core/Paper'
import mqToMathJS from './utils/mqToMathJS'
import * as math from 'mathjs'
import FnxvsxChart from './charts/Fnxvsx'
import Fnxvsx from './graphers/Fnxvsx'
import XvstChart from './charts/Xvst'
import Xvst from './graphers/Xvst'
import Approx from './graphers/Approx'

addMathquillStyles()

const styles = {
  leftContainer: {
    width: 500,
    height: '100%',
    position: 'fixed',
    padding: 25,
    boxSizing: 'border-box',
    overflowY: 'scroll',
    backgroundColor: '#f8f8f8',
    boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)',
  },
  rightContainer: {
    width: 'calc(100% - 500px)',
    minHeight: '100vh',
    marginLeft: 500,
    padding: 25,
    boxSizing: 'border-box',
  },
}

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
      hInput: '0.01',
      xMin: -3,
      xMax: 3,
      yMin: -3,
      yMax: 3,
      h: 0.01,
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
      Xvst(fn, h, density, xMin, xMax, yMin, yMax),
    ])
      .then(results => {
        const fnxvsx = results[0]
        const xvst = results[1]
        this.setState({fnxvsx, xvst, xMin, xMax, yMin, yMax, h, density, lines: []})
      })
  }

  onClick = (point) => {
    const {xMin, xMax, yMin, yMax, h} = this.state
    Approx(this.fn, h, point.x, point.y, xMin, xMax, yMin, yMax)
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

  handleChangeH = e => {
    this.setState({hInput: e.target.value})
    const h = parseFloat(e.target.value)
    if (isNaN(h) === false && h > 0) {
      this.refreshData({...this.state, h})
    }
  }

  render() {
    const {xMin, xMax, yMin, yMax, density} = this.state
    const {xMinInput, xMaxInput, yMinInput, yMaxInput, hInput} = this.state
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
        <div style={styles.leftContainer}>
          <Typography variant="h3" gutterBottom>Sistemas autónomos 1D</Typography>
          <Paper style={{padding: '12px 24px', marginBottom: 24}}>
            <div style={{display: 'flex'}}>
              <Typography variant="body1" style={{alignSelf: 'center'}}>x' =&nbsp;</Typography>
              <div style={{border: '1px solid ' + (this.state.parseError ? '#FF9800' : '#FFF')}}>
                <MathQuill
                  latex={this.state.latex}
                  onChange={this.onExpressionChange}
                />
              </div>
            </div>
            <div style={{marginTop: 10}}>
              <Typography variant="body2" style={{color: 'gray'}}>potencia: ^</Typography>
              <Typography variant="body2" style={{color: 'gray'}}>raíz cuadrada: \sqrt</Typography>
            </div>
          </Paper>
          <div>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography>Configuración del Método</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <div style={{display: 'flex', marginBottom: 15}}>
                  <TextField type="number" value={hInput} label={'Valor de parámetro H'}
                             onChange={this.handleChangeH}/>
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography>Configuración de los Ejes</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails style={{flexWrap: 'wrap'}}>
                <div style={{minWidth: '100%', display: 'flex'}}>
                  <div style={{flex: 1, marginBottom: 15, paddingRight: 5}}>
                    <TextField type="number" value={xMinInput} label={'Valor mín. eje X'}
                               onChange={this.handleChange('xMin')}/>
                  </div>
                  <div style={{flex: 1, marginBottom: 15, paddingRight: 5}}>
                    <TextField type="number" value={xMaxInput} label={'Valor máx. eje X'}
                               onChange={this.handleChange('xMax')}/>
                  </div>
                </div>
                <div style={{minWidth: '100%', display: 'flex'}}>
                  <div style={{flex: 1, marginBottom: 15, paddingRight: 5}}>
                    <TextField type="number" value={yMinInput} label={'Valor mín. eje Y'}
                               onChange={this.handleChange('yMin')}/>
                  </div>
                  <div style={{flex: 1, marginBottom: 15, paddingRight: 5}}>
                    <TextField type="number" value={yMaxInput} label={'Valor máx. eje Y'}
                               onChange={this.handleChange('yMax')}/>
                  </div>
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
        </div>
        <div style={styles.rightContainer}>
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
