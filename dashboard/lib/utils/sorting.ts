import IArticleWithDiffs from '../../interfaces/IArticleWithDiffs'
import { DiffTypes } from '../../types'

const mostViewsFirst = (
    article1: IArticleWithDiffs,
    article2: IArticleWithDiffs,
    diffType?: DiffTypes | ''
): number => {
    if (diffType) {
        const a1 = article1 as IArticleWithDiffs
        const a2 = article2 as IArticleWithDiffs
        return a1.diffs[diffType].pageViews < a2.diffs[diffType].pageViews ? 1 : -1
    }
    return article1.pageViews.current < article2.pageViews.current ? 1 : -1
}

const mostReactionsFirst = (
    article1: IArticleWithDiffs,
    article2: IArticleWithDiffs,
    diffType?: DiffTypes | ''
): number => {
    if (diffType) {
        const a1 = article1 as IArticleWithDiffs
        const a2 = article2 as IArticleWithDiffs
        return a1.diffs[diffType].reactions < a2.diffs[diffType].reactions ? 1 : -1
    }
    return article1.reactions.current < article2.reactions.current ? 1 : -1
}

const mostCommentsFirst = (
    article1: IArticleWithDiffs,
    article2: IArticleWithDiffs,
    diffType?: DiffTypes | ''
): number => {
    if (diffType) {
        const a1 = article1 as IArticleWithDiffs
        const a2 = article2 as IArticleWithDiffs
        return a1.diffs[diffType].comments < a2.diffs[diffType].comments ? 1 : -1
    }
    return article1.comments.current < article2.comments.current ? 1 : -1
}

export const sortArticlesWithDiff = (
    articles: IArticleWithDiffs[],
    order: string,
    diffOrder: DiffTypes | ''
): IArticleWithDiffs[] => {
    switch (order) {
        case 'views-desc':
            return articles.sort((a, b) => mostViewsFirst(a, b, diffOrder))
        case 'reactions-desc':
            return articles.sort((a, b) => mostReactionsFirst(a, b, diffOrder))
        case 'comments-desc':
            return articles.sort((a, b) => mostCommentsFirst(a, b, diffOrder))
        default:
            return articles
    }
}
