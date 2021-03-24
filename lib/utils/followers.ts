import IAzureFollowerData, { IAzureFollowerObject } from '../../interfaces/IAzureFollowerData'
import ICombinedFollowerStats from '../../interfaces/ICombinedFollowerStats'
import IFollower from '../../interfaces/IFollower'
import IHistoricalFollowerData from '../../interfaces/IHistoricalFollowerData'

export const getHistoricalFollowerDataForOverview = (
    azureData: IAzureFollowerData,
    latestFollowers: IFollower[]
): IHistoricalFollowerData => {
    const { day, week, month } = azureData
    const [dayAgoDiff, weekAgoDiff, monthAgoDiff] = [day, week, month].map(
        (azureFollowerObject: IAzureFollowerObject): ICombinedFollowerStats => {
            return {
                followers: latestFollowers.length - azureFollowerObject.count,
            }
        }
    )

    return {
        day: dayAgoDiff,
        week: weekAgoDiff,
        month: monthAgoDiff,
    }
}
