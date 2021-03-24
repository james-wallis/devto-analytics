import IArticle from '../../interfaces/IArticle'
import IAzureArticleData, { IAzureArticleObject } from '../../interfaces/IAzureArticleData'
import IAzureFollowerData, { IAzureFollowerObject } from '../../interfaces/IAzureFollowerData'
import IFollower from '../../interfaces/IFollower'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const parseArticle = (data: any): IArticle => ({
    id: data.id,
    title: data.title,
    published: data.published,
    publishedAt: data.published_at,
    url: data.url,
    canonicalUrl: data.canonical_url,
    commentsCount: data.comments_count,
    publicReactionsCount: data.public_reactions_count,
    positiveReactionsCount: data.positive_reactions_count,
    pageViewsCount: data.page_views_count,
    coverImage: data.cover_image,
    tags: data.tag_list,
})

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const parseAzureArticleData = (data: any): IAzureArticleData => {
    const [day, week, month] = ['dayAgo', 'weekAgo', 'monthAgo'].map(
        (key): IAzureArticleObject => ({
            fetchedAt: data[key].fetchedAt,
            count: data[key].count,
            articles: data[key].articles.map(parseArticle),
        })
    )
    return {
        day,
        week,
        month,
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const parseFollower = (item: any): IFollower => ({
    id: item.id,
    username: item.username,
})

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const parseAzureFollowerData = (data: any): IAzureFollowerData => {
    const [day, week, month] = ['dayAgo', 'weekAgo', 'monthAgo'].map(
        (key): IAzureFollowerObject => ({
            fetchedAt: data[key].fetchedAt,
            count: data[key].count,
            followers:
                data[key].followers && data[key].followers.length > 0
                    ? data[key].followers.map(parseFollower)
                    : [],
        })
    )
    return {
        day,
        week,
        month,
    }
}
