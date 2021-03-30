import IArticleWithHistoricalData from './IArticle'

interface IArticleDiffs {
    pageViews: number
    reactions: number
    comments: number
}

interface IArticleWithDiffs extends IArticleWithHistoricalData {
    diffs: {
        day: IArticleDiffs
        week: IArticleDiffs
        month: IArticleDiffs
    }
}

export default IArticleWithDiffs
