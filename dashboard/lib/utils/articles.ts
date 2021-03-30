import dayjs from 'dayjs'
import IArticle from '../../../common/interfaces/IArticle'
import IArticleWithDiffs from '../../interfaces/IArticleWithDiffs'

export const getPublishedArticles = (articles: IArticle[]): IArticle[] =>
    articles.filter(({ published }) => published)

export const isArticlePublishedSince = (
    range: dayjs.OpUnitType,
    published: boolean,
    publishedAt: string
): boolean =>
    !!published && !!publishedAt && dayjs().subtract(1, range).hour(0).isBefore(publishedAt)

export const getLatestPublishedArticle = (articles: IArticle[]): IArticle => {
    const publishedArticles = getPublishedArticles(articles)
    const [latestArticle] = publishedArticles.sort((a, b) =>
        dayjs(a.publishedAt).isBefore(b.publishedAt) ? 1 : -1
    )
    return latestArticle
}

export const orderMostViewedFirst = (articles: IArticle[]): IArticle[] => {
    const publishedArticles = getPublishedArticles(articles)
    return publishedArticles.sort((a, b) => (a.pageViews.current < b.pageViews.current ? 1 : -1))
}

export const orderMostReactedFirst = (articles: IArticle[]): IArticle[] => {
    const publishedArticles = getPublishedArticles(articles)
    return publishedArticles.sort((a, b) => (a.reactions.current < b.reactions.current ? 1 : -1))
}

export const addDiffsToArticle = (articles: IArticle[]): IArticleWithDiffs[] =>
    articles.map((article) => {
        return {
            ...article,
            diffs: {
                day: {
                    pageViews: article.pageViews.current - article.pageViews.dayAgo,
                    reactions: article.reactions.current - article.reactions.dayAgo,
                    comments: article.comments.current - article.comments.dayAgo,
                },
                week: {
                    pageViews: article.pageViews.current - article.pageViews.weekAgo,
                    reactions: article.reactions.current - article.reactions.weekAgo,
                    comments: article.comments.current - article.comments.weekAgo,
                },
                month: {
                    pageViews: article.pageViews.current - article.pageViews.monthAgo,
                    reactions: article.reactions.current - article.reactions.monthAgo,
                    comments: article.comments.current - article.comments.monthAgo,
                },
            },
        }
    })
