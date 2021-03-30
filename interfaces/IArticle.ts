import IHistoricalData from './IHistoricalData'

interface IArticle {
    id: number
    title: string
    published: boolean
    publishedAt: string
    url: string
    canonicalUrl: string
    coverImage: string
    comments: IHistoricalData
    reactions: IHistoricalData
    pageViews: IHistoricalData
}

export default IArticle
