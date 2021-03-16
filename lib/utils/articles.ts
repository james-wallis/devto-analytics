import dayjs from 'dayjs';
import IArticle from '../../interfaces/IArticle';
import IAzureArticleData from '../../interfaces/IAzureArticleData';
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

export const getHistoricalDataForOverview = (azureData: IAzureArticleData[], latestArticles: IArticle[]) => {
    const sortedLatestArticleFirst = azureData.sort((a, b) => dayjs(a.fetchedAt).isBefore(b.fetchedAt, 'hour') ? 1 : -1);
    console.log(sortedLatestArticleFirst);
    const oldestAzureDataAvailable = sortedLatestArticleFirst[sortedLatestArticleFirst.length - 1];

    const dayAgoAzureData = sortedLatestArticleFirst.find((data) => dayjs().subtract(1, 'day').isSame(data.fetchedAt, 'hour')) || oldestAzureDataAvailable;
    const weekAgoAzureData = sortedLatestArticleFirst.find((data) => dayjs().subtract(1, 'week').isSame(data.fetchedAt, 'hour')) || oldestAzureDataAvailable;
    const monthAgoAzureData = sortedLatestArticleFirst.find((data) => dayjs().subtract(1, 'month').isSame(data.fetchedAt, 'hour')) || oldestAzureDataAvailable;
    console.log({ dayAgoAzureData, weekAgoAzureData, monthAgoAzureData });

    const dayAgoDiff = getCombinedCountDiffBetweenArticles(dayAgoAzureData.articles, latestArticles);
    const weekAgoDiff = getCombinedCountDiffBetweenArticles(weekAgoAzureData.articles, latestArticles);
    const monthAgoDiff = getCombinedCountDiffBetweenArticles(monthAgoAzureData.articles, latestArticles);
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