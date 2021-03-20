import dayjs from 'dayjs';
import IAzureFollowerData from '../../interfaces/IAzureFollowerData';
import ICombinedFollowerStats from '../../interfaces/ICombinedFollowerStats';
import IFollower from '../../interfaces/IFollower';
import IHistoricalFollowerData from '../../interfaces/IHistoricalFollowerData';

export const getHistoricalFollowerDataForOverview = (azureData: IAzureFollowerData[], latestFollowers: IFollower[]): IHistoricalFollowerData => {
    const sortedLatestArticleFirst = azureData.sort((a, b) => dayjs(a.fetchedAt).isBefore(b.fetchedAt, 'hour') ? 1 : -1);
    const oldestAzureDataAvailable = sortedLatestArticleFirst[sortedLatestArticleFirst.length - 1];

    const ranges: dayjs.OpUnitType[] = ['day', 'week', 'month'];
    const [day, week, month] = ranges.map((range: dayjs.OpUnitType): ICombinedFollowerStats => {
        const azureDataWithinRange = sortedLatestArticleFirst.find(({ fetchedAt }) => dayjs().subtract(1, range).isSame(fetchedAt, 'hour')) || oldestAzureDataAvailable;
        return {
            followers: latestFollowers.length - azureDataWithinRange.count,
        }
    });

    return {
        day,
        week,
        month,
    }
}