import dayjs from 'dayjs';
import IAzureFollowerData from '../../interfaces/IAzureFollowerData';
import IFollower from '../../interfaces/IFollower';

export const getHistoricalFollowerDataForOverview = (azureData: IAzureFollowerData[], latestFollowers: IFollower[]) => {
    const sortedLatestArticleFirst = azureData.sort((a, b) => dayjs(a.fetchedAt).isBefore(b.fetchedAt, 'hour') ? 1 : -1);
    const oldestAzureDataAvailable = sortedLatestArticleFirst[sortedLatestArticleFirst.length - 1];

    const dayAgoAzureData = sortedLatestArticleFirst.find((data) => dayjs().subtract(1, 'day').isSame(data.fetchedAt, 'hour')) || oldestAzureDataAvailable;
    const weekAgoAzureData = sortedLatestArticleFirst.find((data) => dayjs().subtract(1, 'week').isSame(data.fetchedAt, 'hour')) || oldestAzureDataAvailable;
    const monthAgoAzureData = sortedLatestArticleFirst.find((data) => dayjs().subtract(1, 'month').isSame(data.fetchedAt, 'hour')) || oldestAzureDataAvailable;

    const dayAgoDiff = latestFollowers.length - dayAgoAzureData.count;
    const weekAgoDiff = latestFollowers.length - weekAgoAzureData.count;
    const monthAgoDiff = latestFollowers.length - monthAgoAzureData.count;
    return {
        day: dayAgoDiff,
        week: weekAgoDiff,
        month: monthAgoDiff,
    }
}