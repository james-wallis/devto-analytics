import React from 'react'
import { Pie, PieChart, ResponsiveContainer, Tooltip, TooltipProps } from 'recharts'
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'
import IArticle from '../../../common/interfaces/IArticle'
import IAzureArticleData from '../../../common/interfaces/IAzureArticleData'
import IAzureFollowerData from '../../../common/interfaces/IAzureFollowerData'

interface IProps {
    azureArticleData: IAzureArticleData
    azureFollowerData: IAzureFollowerData
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

const DailyViewSplitGraph = ({ azureArticleData, azureFollowerData }: IProps): JSX.Element => {
    console.log(azureArticleData, azureFollowerData)
    const articlesWithDailyPageViews: IArticle[] = azureArticleData.articles.filter(
        (article) => article.pageViews.current - article.pageViews.dayAgo > 0
    )

    const data: { name: string; value: number }[] = articlesWithDailyPageViews
        .map(({ title, pageViews }) => ({
            name: title,
            value: pageViews.current - pageViews.dayAgo,
        }))
        .sort((a, b) => (a.value > b.value ? 1 : -1))

    console.log(articlesWithDailyPageViews)

    const totalViewsToday = data.reduce((count: number, { value }) => count + value, 0)

    return (
        <div className="flex flex-col w-full items-center justify-between p-4">
            <h3 className="font-bold text-devto-h3">Page Views</h3>
            <div className="flex justify-around w-full text-center">
                <div>
                    <p className="mb-2">
                        Last day:<span className="ml-2">{totalViewsToday}</span>
                    </p>
                    <PieChart width={400} height={300}>
                        <Pie data={data} dataKey="value" cx="50%" cy="50%" fill="#8884d8" label />
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </div>
            </div>
        </div>
    )
}

export default DailyViewSplitGraph
