import dayjs from 'dayjs';
import IArticle, { IArticleWithDiffs } from '../../interfaces/IArticle';
import IArticleDiffs from '../../interfaces/IArticleDiffs';
import IAzureArticleData, { IDatedAzureArticleData } from '../../interfaces/IAzureArticleData';
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

export const getHistoricalArticleDataForOverview = (azureData: IAzureArticleData[], latestArticles: IArticle[]) => {
    const sortedLatestArticleFirst = azureData.sort((a, b) => dayjs(a.fetchedAt).isBefore(b.fetchedAt, 'hour') ? 1 : -1);
    const oldestAzureDataAvailable = sortedLatestArticleFirst[sortedLatestArticleFirst.length - 1];

    const ranges: dayjs.OpUnitType[] = ['day', 'week', 'month'];
    const [dayAgoDiff, weekAgoDiff, monthAgoDiff] = ranges.map((range: dayjs.OpUnitType): ICombinedArticleStats => {
        const azureDataWithinRange = sortedLatestArticleFirst.find((data) => dayjs().subtract(1, range).isSame(data.fetchedAt, 'hour')) || oldestAzureDataAvailable;
        const articleDiffInRange = getCombinedCountDiffBetweenArticles(azureDataWithinRange.articles, latestArticles);

        // Use latestArticles to get amount of articles published since the range start
        const publishedPostsSinceRangeStart = latestArticles.filter(({ published, publishedAt }) => getArticlesPublishedSince(range, published, publishedAt));
        return {
            ...articleDiffInRange,
            publishedPosts: publishedPostsSinceRangeStart.length,
        }
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

export const getAzureArticleDataDayWeekMonth = (azureData: IAzureArticleData[]) => {
    const oldestAzureDataAvailable = azureData[azureData.length - 1];
    const units: dayjs.OpUnitType[] = ['day', 'week', 'month'];
    const [day, week, month] = units.map((unit) => (
        // returns the azure data for a day/week/month ago or the oldest azure data
        azureData.find(({ fetchedAt }) => dayjs().subtract(1, unit).isSame(fetchedAt, 'hour')) || oldestAzureDataAvailable
    ));
    return {
        day,
        week,
        month,
    }
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

export const getHistorialDiffsForLatestArticles = (latestArticles: IArticle[], datedAzureData: IDatedAzureArticleData) => {
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