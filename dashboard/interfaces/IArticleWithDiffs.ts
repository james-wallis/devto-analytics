import IArticle from '../../common/interfaces/IArticle'

interface IArticleDiffs {
    pageViews: number
    reactions: number
    comments: number
}

interface IArticleWithDiffs extends IArticle {
    diffs: {
        day: IArticleDiffs
        week: IArticleDiffs
        month: IArticleDiffs
    }
}

export default IArticleWithDiffs
