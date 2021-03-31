import { PieChart, Pie, Tooltip } from 'recharts'
import CustomTooltip from './tooltip'

interface IProps {
    title: string
    total: number
    data: { name: string; value: number }[]
    colorNum: number
    tooltipValuePrefix: string
}

const getFill = (num: number): string => {
    switch (num) {
        case 1:
            return '#4BC0C0'
        case 2:
            return '#E46464'
        case 3:
            return '#9D39E9'
        case 4:
            return '#1184FF'
        default:
            return '#8884d8'
    }
}

const BreakdownChart = ({
    title,
    total,
    data,
    colorNum,
    tooltipValuePrefix,
}: IProps): JSX.Element => (
    <div className="flex flex-col justify-center items-center bg-white shadow-card rounded-devto pt-2">
        <p className="mb-2 font-semibold">
            <span>{title}:</span>
            <span className="ml-1">{total.toLocaleString()}</span>
        </p>
        <PieChart width={350} height={300}>
            <Pie data={data} dataKey="value" cx="50%" cy="50%" fill={getFill(colorNum)} label />
            <Tooltip content={<CustomTooltip tooltipValuePrefix={tooltipValuePrefix} />} />
        </PieChart>
    </div>
)

export default BreakdownChart
