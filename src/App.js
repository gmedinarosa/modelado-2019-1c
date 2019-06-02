import React from 'react'
import './App.css'
import MathQuill, {addStyles as addMathquillStyles} from 'react-mathquill'
import Typography from '@material-ui/core/Typography'
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend} from 'recharts'
import mqToMathJS from './utils/mqToMathJS'

addMathquillStyles()

const data = [
	{
		'name': 'Page A',
		'uv': 4000,
		'pv': 2400,
		'amt': 2400,
	},
	{
		'name': 'Page B',
		'uv': 3000,
		'pv': 1398,
		'amt': 2210,
	},
	{
		'name': 'Page C',
		'uv': 2000,
		'pv': 9800,
		'amt': 2290,
	},
	{
		'name': 'Page D',
		'uv': 2780,
		'pv': 3908,
		'amt': 2000,
	},
	{
		'name': 'Page E',
		'uv': 1890,
		'pv': 4800,
		'amt': 2181,
	},
	{
		'name': 'Page F',
		'uv': 2390,
		'pv': 3800,
		'amt': 2500,
	},
	{
		'name': 'Page G',
		'uv': 3490,
		'pv': 4300,
		'amt': 2100,
	},
]

class App extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			latex: '\\frac{1}{\\sqrt{2}}\\cdot 2',
		}
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
							latex={this.state.latex} // Initial latex value for the input field
							onChange={latex => {
								// Called every time the input changes
								this.setState({latex})
							}}
						/>
					</div>
					<div style={{display: 'flex'}}>
						<div style={{width: '100%'}}>
							{this.state.latex}
						</div>
						<div style={{width: '100%'}}>
							{mqToMathJS(this.state.latex)}
						</div>
					</div>
				</div>
				<div style={{flex: 1}}>
					<LineChart width={730} height={250} data={data}
										 margin={{top: 5, right: 30, left: 20, bottom: 5}}>
						<CartesianGrid strokeDasharray="3 3"/>
						<XAxis dataKey="name"/>
						<YAxis/>
						<Tooltip/>
						<Legend/>
						<Line type="monotone" dataKey="pv" stroke="#8884d8"/>
						<Line type="monotone" dataKey="uv" stroke="#82ca9d"/>
					</LineChart>
				</div>
			</div>
		)
	}
}

export default App
