import IAzureFollowerData, { IAzureFollowerObject } from '../../interfaces/IAzureFollowerData'
import ICombinedFollowerStats from '../../interfaces/ICombinedFollowerStats'
import IHistoricalFollowerData from '../../interfaces/IHistoricalFollowerData'

export const getHistoricalFollowerDataForOverview = (
    azureData: IAzureFollowerData,
    latestFollowerCount: number
): IHistoricalFollowerData => {
    const { day, week, month } = azureData
    const [dayAgoDiff, weekAgoDiff, monthAgoDiff] = [day, week, month].map(
        (azureFollowerObject: IAzureFollowerObject): ICombinedFollowerStats => {
            return {
                followers: latestFollowerCount - azureFollowerObject.count,
            }
        }
    )

    return {
        day: dayAgoDiff,
        week: weekAgoDiff,
        month: monthAgoDiff,
    }
}
