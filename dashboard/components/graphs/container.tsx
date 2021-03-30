import IAzureArticleData from '../../../common/interfaces/IAzureArticleData'
import IAzureFollowerData from '../../../common/interfaces/IAzureFollowerData'

interface IProps {
    azureArticleData: IAzureArticleData
    azureFollowerData: IAzureFollowerData
}

const GraphContainer = ({ azureArticleData, azureFollowerData }: IProps): JSX.Element => {
    console.log(azureArticleData, azureFollowerData)
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
            {/* <ArticleStatViewReaction title="Post view difference" data={articleData} daily />
            <ArticleStatViewReaction title="Post reaction difference" data={articleData} reaction />
            <ArticleStatShare title="Article Stat Share" articles={latestArticles} />
            <FollowerStat data={followerData} latestFollowers={latestFollowers} /> */}
            coming soon!
        </div>
    )
}

export default GraphContainer
