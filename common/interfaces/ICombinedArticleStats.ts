import IHistoricalData from "./IHistoricalData";

interface ICombinedArticleStats {
    comments: IHistoricalData
    reactions: IHistoricalData
    pageViews: IHistoricalData
}

export default ICombinedArticleStats;
