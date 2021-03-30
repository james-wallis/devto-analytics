import IHistoricalData from './IHistoricalData'
import IArticle from './IArticle'

interface IAzureArticleData {
    combined: {
        comments: IHistoricalData
        pageViews: IHistoricalData
        reactions: IHistoricalData
    }
    articles: IArticle[]
}

export default IAzureArticleData
