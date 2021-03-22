import dayjs from 'dayjs';
import IArticle, { IArticleWithDiffs } from '../../interfaces/IArticle';
import IArticleDiffs from '../../interfaces/IArticleDiffs';
import IAzureArticleData, { IAzureArticleObject } from '../../interfaces/IAzureArticleData';
import ICombinedArticleStats from '../../interfaces/ICombinedArticleStats';

export const getPublishedArticles = (articles: IArticle[]) => (
    articles.filter(({ published }) => published)
)

export const getCombinedArticleViewsReactionsComments = (articles: IArticle[]): ICombinedArticleStats => {
    const combinedArticleStats: ICombinedArticleStats = {
        views: articles.reduce((count: number, { pageViewsCount }: IArticle) => pageViewsCount + count, 0),
        reactions: articles.reduce((count: number, { publicReactionsCount }: IArticle) => publicReactionsCount + count, 0),
        comments: articles.reduce((count: number, { commentsCount }: IArticle) => commentsCount + count, 0),
        publishedPosts: getPublishedArticles(articles).length,
    }
    return combinedArticleStats;
}

export const getCombinedCountDiffBetweenArticles = (olderArticles: IArticle[], newerArticles: IArticle[]): ICombinedArticleStats => {
    const olderArticleStats: ICombinedArticleStats = getCombinedArticleViewsReactionsComments(olderArticles);
    const newerArticleStats: ICombinedArticleStats = getCombinedArticleViewsReactionsComments(newerArticles);
    return {
        views: newerArticleStats.views - olderArticleStats.views,
        reactions: newerArticleStats.reactions - olderArticleStats.reactions,
        comments: newerArticleStats.comments - olderArticleStats.comments,
        publishedPosts: newerArticleStats.publishedPosts - olderArticleStats.publishedPosts,
    }
}

export const getArticlesPublishedSince = (range: dayjs.OpUnitType, published: boolean, publishedAt: string) => (
    published && publishedAt && dayjs().subtract(1, range).hour(0).isBefore(publishedAt)
)

export const getHistoricalArticleDataForOverview = (azureData: IAzureArticleData, latestArticles: IArticle[]) => {
    const { day, week, month } = azureData;
    const [dayAgoDiff, weekAgoDiff, monthAgoDiff] = [day, week, month].map((azureArticleObject: IAzureArticleObject): ICombinedArticleStats => {
        return getCombinedCountDiffBetweenArticles(azureArticleObject.articles, latestArticles);
    });

    return {
        day: dayAgoDiff,
        week: weekAgoDiff,
        month: monthAgoDiff,
    }
}

export const getLatestPublishedArticle = (articles: IArticle[]) => {
    const publishedArticles = getPublishedArticles(articles);
    const [latestArticle] = publishedArticles.sort((a, b) => dayjs(a.publishedAt).isBefore(b.publishedAt) ? 1 : -1);
    return latestArticle;
}

export const orderMostViewedFirst = (articles: IArticle[]) => {
    const publishedArticles = getPublishedArticles(articles);
    return publishedArticles.sort((a, b) => a.pageViewsCount < b.pageViewsCount ? 1 : -1);
}

export const orderMostReactedFirst = (articles: IArticle[]) => {
    const publishedArticles = getPublishedArticles(articles);
    return publishedArticles.sort((a, b) => a.publicReactionsCount < b.publicReactionsCount ? 1 : -1);
}

const getDiffsBetweenArticles = (latestArticle: IArticle, olderArticle: IArticle | undefined): IArticleDiffs => {
    if (!olderArticle) {
        // if the older article doesn't exist then just return the current counts
        return {
            pageViews: latestArticle.pageViewsCount,
            reactions: latestArticle.publicReactionsCount,
            comments: latestArticle.commentsCount,
        }
    }
    return {
        pageViews: latestArticle.pageViewsCount - olderArticle.pageViewsCount,
        reactions: latestArticle.publicReactionsCount - olderArticle.publicReactionsCount,
        comments: latestArticle.commentsCount - olderArticle.commentsCount,
    }
};

export const getHistorialDiffsForLatestArticles = (latestArticles: IArticle[], datedAzureData: IAzureArticleData) => {
    return latestArticles.map((article: IArticle): IArticleWithDiffs => {
        const dayAgoArticle = datedAzureData.day.articles.find(({ id }) => id === article.id);
        const weekAgoArticle = datedAzureData.week.articles.find(({ id }) => id === article.id);
        const monthAgoArticle = datedAzureData.month.articles.find(({ id }) => id === article.id);
        return {
            ...article,
            diffs: {
                day: getDiffsBetweenArticles(article, dayAgoArticle),
                week: getDiffsBetweenArticles(article, weekAgoArticle),
                month: getDiffsBetweenArticles(article, monthAgoArticle),
            }
        }
    });
}