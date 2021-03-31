import React from 'react'
import { Pie, PieChart, Tooltip, TooltipProps } from 'recharts'
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'
import IArticleWithDiffs from '../../interfaces/IArticleWithDiffs'

interface IProps {
    articlesWithDiffs: IArticleWithDiffs[]
}

const CustomTooltip = ({
    active,
    payload,
}: TooltipProps<ValueType, NameType>): JSX.Element | null => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-1 rounded border shadow-sm text-sm">
                <p className="mb-1">{payload[0].name}</p>
                <p className="">{`Page views: ${payload[0].value}`}</p>
            </div>
        )
    }

    return null
}

const DailyViewSplitGraph = ({ articlesWithDiffs }: IProps): JSX.Element => {
    const articlesWithDailyPageViews: IArticleWithDiffs[] = articlesWithDiffs.filter(
        ({ diffs }) => diffs.day.pageViews > 0
    )
    const dailyData: { name: string; value: number }[] = articlesWithDailyPageViews
        .map(({ title, diffs }) => ({
            name: title,
            value: diffs.day.pageViews,
        }))
        .sort((a, b) => (a.value > b.value ? 1 : -1))
    const totalViewsToday = dailyData.reduce((count: number, { value }) => count + value, 0)

    const articlesWithWeeklyPageViews: IArticleWithDiffs[] = articlesWithDiffs.filter(
        ({ diffs }) => diffs.week.pageViews > 0
    )
    const weeklyData: { name: string; value: number }[] = articlesWithWeeklyPageViews
        .map(({ title, diffs }) => ({
            name: title,
            value: diffs.week.pageViews,
        }))
        .sort((a, b) => (a.value > b.value ? 1 : -1))
    const totalViewsThisWeek = weeklyData.reduce((count: number, { value }) => count + value, 0)

    const articlesWithMonthlyPageViews: IArticleWithDiffs[] = articlesWithDiffs.filter(
        ({ diffs }) => diffs.week.pageViews > 0
    )
    const monthlyData: { name: string; value: number }[] = articlesWithMonthlyPageViews
        .map(({ title, diffs }) => ({
            name: title,
            value: diffs.week.pageViews,
        }))
        .sort((a, b) => (a.value > b.value ? 1 : -1))
    const totalViewsThisMonth = monthlyData.reduce((count: number, { value }) => count + value, 0)

    const allTimeData: { name: string; value: number }[] = articlesWithDiffs
        .map(({ title, pageViews }) => ({
            name: title,
            value: pageViews.current,
        }))
        .sort((a, b) => (a.value > b.value ? 1 : -1))
    const totalViewsAllTime = allTimeData.reduce((count: number, { value }) => count + value, 0)

    return (
        <div className="flex flex-col w-full items-center justify-between p-4">
            <h3 className="font-bold text-devto-h3">Page Views</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-center">
                <div className="flex flex-col justify-center items-center">
                    <p className="mb-2">
                        Last day:<span className="ml-1">{totalViewsToday}</span>
                    </p>
                    <PieChart width={350} height={300}>
                        <Pie
                            data={dailyData}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            fill="#8884d8"
                            label
                        />
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <p className="mb-2">
                        Last week:<span className="ml-1">{totalViewsThisWeek}</span>
                    </p>
                    <PieChart width={350} height={300}>
                        <Pie
                            data={weeklyData}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            fill="#8884d8"
                            label
                        />
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <p className="mb-2">
                        Last month:<span className="ml-1">{totalViewsThisMonth}</span>
                    </p>
                    <PieChart width={350} height={300}>
                        <Pie
                            data={monthlyData}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            fill="#8884d8"
                            label
                        />
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <p className="mb-2">
                        All time:<span className="ml-1">{totalViewsAllTime}</span>
                    </p>
                    <PieChart width={350} height={300}>
                        <Pie
                            data={allTimeData}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            fill="#8884d8"
                            label
                        />
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </div>
            </div>
        </div>
    )
}

export default DailyViewSplitGraph
