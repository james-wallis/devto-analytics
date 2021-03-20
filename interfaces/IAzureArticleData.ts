import IArticles from './IArticle';

interface IAzureArticleData {
    fetchedAt: string;
    count: number;
    articles: IArticles[];
}

export interface IDatedAzureArticleData {
    day: IAzureArticleData;
    week: IAzureArticleData;
    month: IAzureArticleData;
}

export default IAzureArticleData;
