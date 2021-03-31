import React from 'react'
import { Tooltip, CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts'

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

const SummaryChart = ({ title, total, data, colorNum }: IProps): JSX.Element => (
    <div className="flex flex-col justify-center items-center bg-white shadow-card rounded-devto pt-2">
        <p className="mb-2 font-semibold">
            <span>{title}:</span>
            <span className="ml-1">{total.toLocaleString()}</span>
        </p>
        <LineChart
            width={730}
            height={250}
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke={getFill(colorNum)} />
        </LineChart>
    </div>
)

export default SummaryChart
