import dayjs from 'dayjs'
import IArticleWithHistoricalData from '../../interfaces/IArticle'

export const getPublishedArticles = (
    articles: IArticleWithHistoricalData[]
): IArticleWithHistoricalData[] => articles.filter(({ published }) => published)

export const isArticlePublishedSince = (
    range: dayjs.OpUnitType,
    published: boolean,
    publishedAt: string
): boolean =>
    !!published && !!publishedAt && dayjs().subtract(1, range).hour(0).isBefore(publishedAt)

export const getLatestPublishedArticle = (
    articles: IArticleWithHistoricalData[]
): IArticleWithHistoricalData => {
    const publishedArticles = getPublishedArticles(articles)
    const [latestArticle] = publishedArticles.sort((a, b) =>
        dayjs(a.publishedAt).isBefore(b.publishedAt) ? 1 : -1
    )
    return latestArticle
}

export const orderMostViewedFirst = (
    articles: IArticleWithHistoricalData[]
): IArticleWithHistoricalData[] => {
    const publishedArticles = getPublishedArticles(articles)
    return publishedArticles.sort((a, b) => (a.pageViews.current < b.pageViews.current ? 1 : -1))
}

export const orderMostReactedFirst = (
    articles: IArticleWithHistoricalData[]
): IArticleWithHistoricalData[] => {
    const publishedArticles = getPublishedArticles(articles)
    return publishedArticles.sort((a, b) => (a.reactions.current < b.reactions.current ? 1 : -1))
}
