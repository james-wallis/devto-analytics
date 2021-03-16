import IArticles from './IArticle';
import IFollower from './IFollower';

interface IAzureFollowerData {
    fetchedAt: string;
    count: number;
    followers: IFollower[];
}

export default IAzureFollowerData;
