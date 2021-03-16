import IArticle from '../../interfaces/IArticle';
import IAzureArticleData from '../../interfaces/IAzureArticleData';

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
});

export const parseAzureArticleData = (data: any): IAzureArticleData => ({
    fetchedAt: data.fetchedAt,
    count: data.count,
    articles: data.articles.map(parseArticle),
});

