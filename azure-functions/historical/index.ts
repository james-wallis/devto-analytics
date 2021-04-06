import { AzureFunction, Context } from '@azure/functions'
import { Container } from '@azure/cosmos'
import dayjs from 'dayjs'
import {
    ICosmosArticlesReponseBody,
    ICosmosFollowersReponseBody,
} from '../interfaces/IResponseBody'
import IAzureHistoricalArticleData from '../../common/interfaces/IAzureHistoricalArticleData'
import IArticleStatTotals from '../../common/interfaces/IArticleStatTotals'
import IAzureHistoricalFollowerData from '../../common/interfaces/IAzureHistoricalFollowerData'
import IAzureHistoricalData from '../../common/interfaces/IAzureHistoricalData'
import {
    getAllArticlesFromCosmosDB,
    getAllFollowersFromCosmosDB,
    getCosmosDBContainer,
} from '../lib/utils/cosmos'

const convertArticleToHistoricalArticleData = ({
    fetchedAt,
    articles,
}: ICosmosArticlesReponseBody):
    | IAzureHistoricalArticleData['day'][0]
    | IAzureHistoricalArticleData['week'][0] => {
    const initialTotals: IArticleStatTotals = {
        articles: articles.length,
        published: articles.filter(({ published, published_at }) => published && published_at)
            .length,
        pageViews: 0,
        comments: 0,
        reactions: 0,
    }
    const totals = articles.reduce((accTotals: IArticleStatTotals, article): IArticleStatTotals => {
        return {
            ...accTotals,
            pageViews: accTotals.pageViews + article.page_views_count,
            comments: accTotals.comments + article.comments_count,
            reactions: accTotals.reactions + article.public_reactions_count,
        }
    }, initialTotals)

    return {
        fetchedAt,
        totals,
    }
}

const convertFollowersToHistoricalFollowerData = ({
    fetchedAt,
    count,
}: ICosmosFollowersReponseBody):
    | IAzureHistoricalFollowerData['day'][0]
    | IAzureHistoricalFollowerData['week'][0] => {
    return {
        fetchedAt,
        numFollowers: count,
    }
}

const filterForDay = (fetchedAt: string): boolean =>
    dayjs().subtract(1, 'day').subtract(1, 'hour').isBefore(fetchedAt)

const filterForWeek = (fetchedAt: string): boolean =>
    dayjs(fetchedAt).hour() === 0 &&
    dayjs().subtract(1, 'week').subtract(1, 'day').isBefore(fetchedAt)

const httpTrigger: AzureFunction = async function (context: Context): Promise<void> {
    const container: Container = getCosmosDBContainer()

    const [articles, followers] = await Promise.all([
        getAllArticlesFromCosmosDB(container),
        getAllFollowersFromCosmosDB(container),
    ])

    const articleWeek: IAzureHistoricalArticleData['week'] = articles
        .filter(({ fetchedAt }) => filterForWeek(fetchedAt))
        .map(convertArticleToHistoricalArticleData)

    const articleDay: IAzureHistoricalArticleData['day'] = articles
        .filter(({ fetchedAt }) => filterForDay(fetchedAt))
        .map(convertArticleToHistoricalArticleData)

    const followerWeek: IAzureHistoricalFollowerData['week'] = followers
        .filter(({ fetchedAt }) => filterForWeek(fetchedAt))
        .map(convertFollowersToHistoricalFollowerData)

    const followerDay: IAzureHistoricalFollowerData['day'] = followers
        .filter(({ fetchedAt }) => filterForDay(fetchedAt))
        .map(convertFollowersToHistoricalFollowerData)

    const body: IAzureHistoricalData = {
        articles: {
            day: articleDay,
            week: articleWeek,
        },
        followers: {
            day: followerDay,
            week: followerWeek,
        },
    }

    context.res = {
        body,
    }
    return
}

export default httpTrigger
