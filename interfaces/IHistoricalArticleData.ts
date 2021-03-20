import ICombinedArticleStats from "./ICombinedArticleStats";

interface IHistoricalArticleData {
    day: ICombinedArticleStats;
    week: ICombinedArticleStats;
    month: ICombinedArticleStats;
}

export default IHistoricalArticleData;
