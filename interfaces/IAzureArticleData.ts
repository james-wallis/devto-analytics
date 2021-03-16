import IArticles from './IArticle';

interface IAzureArticleData {
    fetchedAt: string;
    count: number;
    articles: IArticles[];
}

export default IAzureArticleData;
