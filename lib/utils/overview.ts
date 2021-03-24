import dayjs from 'dayjs'
import IArticle from '../../interfaces/IArticle'
import ICombinedArticleStats from '../../interfaces/ICombinedArticleStats'
import IHistoricalArticleData from '../../interfaces/IHistoricalArticleData'
import IHistoricalFollowerData from '../../interfaces/IHistoricalFollowerData'
import IOverviewStats from '../../interfaces/IOverviewStats'

export const getOverviewStats = (
    latestArticle: IArticle,
    latestCombinedArticleStats: ICombinedArticleStats,
    historicCombinedArticleData: IHistoricalArticleData,
    historicCombinedFollowerData: IHistoricalFollowerData,
    latestFollowerCount: number
): IOverviewStats[] => {
    const overviewStats: IOverviewStats[] = [
        {
            type: 'stat',
            title: 'Total post reactions',
            headlineValue: latestCombinedArticleStats.reactions,
            stats: [
                { text: 'Last 7 days', value: historicCombinedArticleData.week.reactions },
                { text: 'Last 30 days', value: historicCombinedArticleData.month.reactions },
            ],
        },
        {
            type: 'stat',
            title: 'Total post views',
            headlineValue: latestCombinedArticleStats.views,
            stats: [
                { text: 'Last 24 hours', value: historicCombinedArticleData.day.views },
                { text: 'Last 7 days', value: historicCombinedArticleData.week.views },
            ],
        },
        {
            type: 'stat',
            title: 'Total followers',
            headlineValue: latestFollowerCount,
            stats: [
                { text: 'Last 24 hours', value: historicCombinedFollowerData.day.followers },
                { text: 'Last 7 days', value: historicCombinedFollowerData.week.followers },
            ],
        },
        {
            type: 'stat',
            title: 'Posts published',
            headlineValue: latestCombinedArticleStats.publishedPosts,
            stats: [
                {
                    text: 'Last posted',
                    value: dayjs(latestArticle.publishedAt).fromNow(),
                    small: true,
                },
                {
                    text: 'Last 30 days',
                    value: `${historicCombinedArticleData.month.publishedPosts}`,
                },
            ],
        },
    ]

    return overviewStats
}
