import dayjs from 'dayjs'
import React from 'react'
import {
    Tooltip,
    CartesianGrid,
    Line,
    LineChart,
    XAxis,
    YAxis,
    ResponsiveContainer,
} from 'recharts'
import IGraphData from '../../interfaces/IGraphData'
import CustomTooltip from './tooltip'

interface IProps {
    title: string
    total: number
    data: IGraphData[]
    colorNum: number
    tooltipValuePrefix: string
    type: 'day' | 'week'
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

const SummaryChart = ({ title, total, data, colorNum, type }: IProps): JSX.Element => {
    const dayjsFormatShort = type == 'day' ? 'ha' : 'DD/MM'
    const dayjsFormatLong = type == 'day' ? 'ha on dddd, D MMMM' : 'dddd, D MMMM'

    return (
        <div className="flex flex-col justify-center items-center bg-white shadow-card rounded-devto pt-2 mb-2 md:mb-4">
            <p className="mb-2 font-semibold">
                <span>{title}:</span>
                <span className="ml-1">{total.toLocaleString()}</span>
            </p>
            <ResponsiveContainer height={300} width="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="4 4" />
                    <XAxis
                        dataKey="name"
                        tickFormatter={(date) =>
                            dayjs(date).hour() % 2 === 0 || type == 'week'
                                ? dayjs(date).format(dayjsFormatShort)
                                : ''
                        }
                        tick={{ fontSize: 10 }}
                        minTickGap={-8}
                    />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip
                        content={
                            <CustomTooltip
                                tooltipValuePrefix={title}
                                dayjsFormat={dayjsFormatLong}
                            />
                        }
                    />
                    <Line type="monotone" dataKey="value" stroke={getFill(colorNum)} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default SummaryChart
