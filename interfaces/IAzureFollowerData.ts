import IFollower from './IFollower'

export interface IAzureFollowerObject {
    fetchedAt: string
    count: number
    followers: IFollower[]
}

interface IAzureFollowerData {
    latest: IAzureFollowerObject
    day: IAzureFollowerObject
    week: IAzureFollowerObject
    month: IAzureFollowerObject
}

export default IAzureFollowerData
