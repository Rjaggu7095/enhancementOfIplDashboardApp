import {PieChart as RePieChart, Pie, Legend} from 'recharts'

const PieChart = props => {
  const {data} = props

  return (
    <div className="pie-chart-container" testid="pieChart">
      <RePieChart width={300} height={300}>
        <Pie data={data} dataKey="value" nameKey="name" />
        <Legend />
      </RePieChart>
    </div>
  )
}

export default PieChart
