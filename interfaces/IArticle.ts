import IArticleDiffs from './IArticleDiffs';

interface IArticle {
    id: number
    title: string
    published: boolean
    publishedAt: string
    url: string
    canonicalUrl: string
    commentsCount: number
    publicReactionsCount: number
    positiveReactionsCount: number
    pageViewsCount: number
    coverImage: string
    tags: string[]
}

export interface IArticleWithDiffs extends IArticle {
    diffs: {
        day: IArticleDiffs;
        week: IArticleDiffs;
        month: IArticleDiffs;
    }
}

export default IArticle;
