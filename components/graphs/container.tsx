import dayjs from 'dayjs';
import IArticle from '../../interfaces/IArticle';
import IAzureArticleData from '../../interfaces/IAzureArticleData';
import IAzureFollowerData from '../../interfaces/IAzureFollowerData';
import IFollower from '../../interfaces/IFollower';
import IGraphArticleData from '../../interfaces/IGraphArticleData';
import IGraphFollowerData from '../../interfaces/IGraphFollowerData';
import { getCombinedArticleViewsReactionsComments } from '../../lib/utils/articles';
import ArticleStatShare from './articleStatShare';
import ArticleStatViewReaction from './articleStatViewReaction';
import FollowerStat from './followerStat';

interface IProps {
    azureArticleData: IAzureArticleData[];
    latestArticles: IArticle[];
    azureFollowerData: IAzureFollowerData[];
    latestFollowers: IFollower[];
}

const sortAzureDataOldestFirst = (a: IAzureArticleData | IAzureFollowerData, b: IAzureArticleData | IAzureFollowerData) => (
    dayjs(a.fetchedAt).isBefore(b.fetchedAt, 'hour') ? -1 : 1
);

const GraphContainer = ({ azureArticleData, latestArticles, azureFollowerData, latestFollowers }: IProps) => {
    const sortedOldestArticleDataFirst = azureArticleData.sort(sortAzureDataOldestFirst);
    const articleData: IGraphArticleData[] = sortedOldestArticleDataFirst.map(({ fetchedAt, articles }): IGraphArticleData => ({
        ...getCombinedArticleViewsReactionsComments(articles),
        fetchedAt: fetchedAt,
    }));

    const sortedOldestFollowerDataFirst: IAzureFollowerData[] = azureFollowerData.sort(sortAzureDataOldestFirst);
    const followerData: IGraphFollowerData[] = sortedOldestFollowerDataFirst.map(({ fetchedAt, count }) => ({
        fetchedAt,
        followersCount: count,
    }));


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
            <ArticleStatViewReaction title="Post view difference" data={articleData} daily />
            <ArticleStatViewReaction title="Post reaction difference" data={articleData} reaction />
            <ArticleStatShare title="Article Stat Share" articles={latestArticles} />
            <FollowerStat data={followerData} latestFollowers={latestFollowers} />
        </div>
    )
}

export default GraphContainer;
