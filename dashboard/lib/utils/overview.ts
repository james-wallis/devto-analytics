import dayjs from 'dayjs'
import IAzureArticleData from '../../../common/interfaces/IAzureArticleData'
import IAzureFollowerData from '../../../common/interfaces/IAzureFollowerData'
import IArticle from '../../../common/interfaces/IArticle'
import IOverviewStats from '../../interfaces/IOverviewStats'
import { isArticlePublishedSince } from './articles'

export const getOverviewStats = (
    latestArticle: IArticle,
    azureArticleData: IAzureArticleData,
    azureFollowerData: IAzureFollowerData,
    numArticlesPublished: number
): IOverviewStats[] => {
    const { combined: combinedArticleStats, articles } = azureArticleData

    const numArticlesPublishedInLastMonth: number = articles.reduce(
        (count: number, { published, publishedAt }) =>
            isArticlePublishedSince('month', published, publishedAt) ? count + 1 : count,
        0
    )

    const overviewStats: IOverviewStats[] = [
        {
            title: 'Total post reactions',
            headlineValue: combinedArticleStats.reactions.current,
            stats: [
                {
                    text: 'Last 7 days',
                    value:
                        combinedArticleStats.reactions.current -
                        combinedArticleStats.reactions.weekAgo,
                },
                {
                    text: 'Last 30 days',
                    value:
                        combinedArticleStats.reactions.current -
                        combinedArticleStats.reactions.monthAgo,
                },
            ],
        },
        {
            title: 'Total post views',
            headlineValue: combinedArticleStats.pageViews.current,
            stats: [
                {
                    text: 'Last 24 hours',
                    value:
                        combinedArticleStats.pageViews.current -
                        combinedArticleStats.pageViews.dayAgo,
                },
                {
                    text: 'Last 7 days',
                    value:
                        combinedArticleStats.pageViews.current -
                        combinedArticleStats.pageViews.weekAgo,
                },
            ],
        },
        {
            title: 'Total followers',
            headlineValue: azureFollowerData.count.current,
            stats: [
                {
                    text: 'Last 24 hours',
                    value: azureFollowerData.count.current - azureFollowerData.count.dayAgo,
                },
                {
                    text: 'Last 7 days',
                    value: azureFollowerData.count.current - azureFollowerData.count.weekAgo,
                },
            ],
        },
        {
            title: 'Posts published',
            headlineValue: numArticlesPublished,
            stats: [
                {
                    text: 'Last posted',
                    value: dayjs(latestArticle.publishedAt).fromNow(),
                    small: true,
                },
                {
                    text: 'Last 30 days',
                    value: `${numArticlesPublishedInLastMonth}`,
                },
            ],
        },
    ]

    return overviewStats
}
