import IArticles from './IArticle'

export interface IAzureArticleObject {
    fetchedAt: string
    count: number
    articles: IArticles[]
}

interface IAzureArticleData {
    day: IAzureArticleObject
    week: IAzureArticleObject
    month: IAzureArticleObject
}

export default IAzureArticleData
