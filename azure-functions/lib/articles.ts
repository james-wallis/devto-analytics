import { Container, SqlQuerySpec } from '@azure/cosmos'
import { Dayjs } from 'dayjs'
import IArticle from '../../common/interfaces/IArticle'
import IHistoricalData from '../../common/interfaces/IHistoricalData'
import IDevToArticle from '../interfaces/IDevToArticle'
import { ICosmosArticlesReponseBody } from '../interfaces/IResponseBody'

const createArticleQuerySpec = (where?: string): string => {
    return `SELECT * from c WHERE c.type = "articles" ${
        where ? `AND ${where} ` : ''
    }ORDER BY c.fetchedAt OFFSET 0 LIMIT 1`
}

export const getArticleDataForGivenDateTimeFromCosmosDB = async (
    container: Container,
    dateTime: Dayjs
): Promise<ICosmosArticlesReponseBody> => {
    const dateTimeIso = dateTime.toISOString()
    const dateTimePlusHourIso = dateTime.add(1, 'hour').toISOString()
    const querySpec: SqlQuerySpec = {
        query: createArticleQuerySpec(
            `c.fetchedAt >= "${dateTimeIso}" AND c.fetchedAt < "${dateTimePlusHourIso}"`
        ),
    }
    const { resources } = await container.items.query(querySpec).fetchAll()
    return resources[0]
}

export const getOldestArticleDataFromCosmosDB = async (
    container: Container
): Promise<ICosmosArticlesReponseBody> => {
    const querySpec: SqlQuerySpec = {
        query: createArticleQuerySpec(),
    }
    const { resources } = await container.items.query(querySpec).fetchAll()
    return resources[0]
}

export const addHistoricalDataToArticles = (
    latestDevToArticles: IDevToArticle[],
    dayAgoData: ICosmosArticlesReponseBody,
    weekAgoData: ICosmosArticlesReponseBody,
    monthAgoData: ICosmosArticlesReponseBody,
    oldestArticleData: ICosmosArticlesReponseBody
): IArticle[] => {
    const articlesWithHistoricalData: IArticle[] = latestDevToArticles.map(
        (article): IArticle => {
            const dayAgoArticle = dayAgoData
                ? dayAgoData.articles.find(({ id: _id }) => article.id === _id)
                : null
            const weekAgoArticle = weekAgoData
                ? weekAgoData.articles.find(({ id: _id }) => article.id === _id)
                : null
            const monthAgoArticle = monthAgoData
                ? monthAgoData.articles.find(({ id: _id }) => article.id === _id)
                : null
            const oldestArticle = oldestArticleData
                ? oldestArticleData.articles.find(({ id: _id }) => article.id === _id)
                : null

            return {
                id: article.id,
                title: article.title,
                published: article.published,
                publishedAt: article.published_at,
                url: article.url,
                canonicalUrl: article.canonical_url,
                coverImage: article.cover_image,
                comments: {
                    current: article.comments_count,
                    dayAgo: dayAgoArticle ? dayAgoArticle.comments_count : null,
                    weekAgo: weekAgoArticle ? weekAgoArticle.comments_count : null,
                    monthAgo: monthAgoArticle ? monthAgoArticle.comments_count : null,
                    oldestRecord: oldestArticle ? oldestArticle.comments_count : null,
                },
                reactions: {
                    current: article.positive_reactions_count,
                    dayAgo: dayAgoArticle ? dayAgoArticle.positive_reactions_count : null,
                    weekAgo: weekAgoArticle ? weekAgoArticle.positive_reactions_count : null,
                    monthAgo: monthAgoArticle ? monthAgoArticle.positive_reactions_count : null,
                    oldestRecord: oldestArticle ? oldestArticle.positive_reactions_count : null,
                },
                pageViews: {
                    current: article.page_views_count,
                    dayAgo: dayAgoArticle ? dayAgoArticle.page_views_count : null,
                    weekAgo: weekAgoArticle ? weekAgoArticle.page_views_count : null,
                    monthAgo: monthAgoArticle ? monthAgoArticle.page_views_count : null,
                    oldestRecord: oldestArticle ? oldestArticle.page_views_count : null,
                },
            }
        }
    )
    return articlesWithHistoricalData
}

const getCombined = (
    key: 'comments' | 'reactions' | 'pageViews',
    articles: IArticle[]
): IHistoricalData => {
    const combinedData: IHistoricalData = {
        current: 0,
        dayAgo: 0,
        weekAgo: 0,
        monthAgo: 0,
        oldestRecord: 0,
    }

    for (const article of articles) {
        combinedData.current += article[key].current || 0
        combinedData.dayAgo += article[key].dayAgo || 0
        combinedData.weekAgo += article[key].weekAgo || 0
        combinedData.monthAgo += article[key].monthAgo || 0
        combinedData.oldestRecord += article[key].oldestRecord || 0
    }

    return combinedData
}

export const getCombinedArticleStats = (
    articles: IArticle[]
): { comments: IHistoricalData; reactions: IHistoricalData; pageViews: IHistoricalData } => ({
    comments: getCombined('comments', articles),
    reactions: getCombined('reactions', articles),
    pageViews: getCombined('pageViews', articles),
})
