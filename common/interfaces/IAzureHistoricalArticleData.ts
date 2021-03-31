import IArticleStatTotals from "./IArticleStatTotals";

interface IAzureHistoricalArticleData {
    week: {
        fetchedAt: string
        totals: IArticleStatTotals
    }[]
    day: {
        fetchedAt: string
        totals: IArticleStatTotals
    }[]
}

export default IAzureHistoricalArticleData;
