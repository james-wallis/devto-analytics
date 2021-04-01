import IAzureHistoricalArticleData from '../../../common/interfaces/IAzureHistoricalArticleData'
import IAzureHistoricalFollowerData from '../../../common/interfaces/IAzureHistoricalFollowerData'
import SummaryChart from '../../components/graphs/summaryChart'
import IGraphData from '../../interfaces/IGraphData'

interface IProps {
    azureHistoricalArticleData: IAzureHistoricalArticleData
    azureHistoricalFollowerData: IAzureHistoricalFollowerData
}

const getArticleData = (
    azureHistoricalArticleData: IAzureHistoricalArticleData,
    diff: 'day' | 'week',
    type: 'pageViews' | 'comments' | 'reactions'
): { data: IGraphData[]; total: number; type: 'day' | 'week' } => {
    const data = azureHistoricalArticleData[diff]
        .slice(1)
        .map(({ fetchedAt, totals }, i: number) => {
            return {
                name: fetchedAt,
                value: totals[type] - azureHistoricalArticleData[diff][i].totals[type],
            }
        })
    const total = data.reduce((count: number, { value }) => count + value, 0)
    return {
        data,
        total,
        type: diff,
    }
}

const getFollowerData = (
    azureHistoricalFollowerData: IAzureHistoricalFollowerData,
    diff: 'day' | 'week'
): { data: IGraphData[]; total: number; type: 'day' | 'week' } => {
    const data = azureHistoricalFollowerData[diff]
        .slice(1)
        .map(({ fetchedAt, numFollowers }, i: number) => {
            return {
                name: fetchedAt,
                value: numFollowers - azureHistoricalFollowerData[diff][i].numFollowers,
            }
        })
    const total = data.reduce((count: number, { value }) => count + value, 0)
    return {
        data,
        total,
        type: diff,
    }
}

const SummaryGraphs = ({
    azureHistoricalArticleData,
    azureHistoricalFollowerData,
}: IProps): JSX.Element => {
    const sections = [
        {
            heading: 'Page Views',
            charts: [
                {
                    title: 'Last 24 hours',
                    color: 1,
                    ...getArticleData(azureHistoricalArticleData, 'day', 'pageViews'),
                },
                {
                    title: 'Last 7 days',
                    color: 2,
                    ...getArticleData(azureHistoricalArticleData, 'week', 'pageViews'),
                },
            ],
        },
        {
            heading: 'Reactions',
            charts: [
                {
                    title: 'Last 24 hours',
                    color: 3,
                    ...getArticleData(azureHistoricalArticleData, 'day', 'reactions'),
                },
                {
                    title: 'Last 7 days',
                    color: 4,
                    ...getArticleData(azureHistoricalArticleData, 'week', 'reactions'),
                },
            ],
        },
        {
            heading: 'Followers',
            charts: [
                {
                    title: 'Last 24 hours',
                    color: 1,
                    ...getFollowerData(azureHistoricalFollowerData, 'day'),
                },
                {
                    title: 'Last 7 days',
                    color: 2,
                    ...getFollowerData(azureHistoricalFollowerData, 'week'),
                },
            ],
        },
    ]

    return (
        <>
            {sections.map(({ heading, charts }) => (
                <div key={`daily-view-split-graph-${heading}`} className="w-full p-2 md:p-4">
                    <h3 className="font-bold text-devto-h3">{heading}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 w-full text-center py-2">
                        {charts.map(({ title, total, data, type, color }) => (
                            <SummaryChart
                                key={`summary-${heading}-${title}`}
                                title={title}
                                total={total}
                                colorNum={color}
                                tooltipValuePrefix={title}
                                data={data}
                                type={type}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </>
    )
}

export default SummaryGraphs
