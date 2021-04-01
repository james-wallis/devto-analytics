interface IAzureHistoricalFollowerData {
    week: {
        fetchedAt: string
        numFollowers: number
    }[]
    day: {
        fetchedAt: string
        numFollowers: number
    }[]
}

export default IAzureHistoricalFollowerData;
