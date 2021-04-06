import IAzureHistoricalArticleData from "./IAzureHistoricalArticleData";
import IAzureHistoricalFollowerData from "./IAzureHistoricalFollowerData";

interface IAzureHistoricalData {
    articles: IAzureHistoricalArticleData;
    followers: IAzureHistoricalFollowerData;
}

export default IAzureHistoricalData;
