import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Container } from "@azure/cosmos";
import dayjs, { Dayjs } from "dayjs";
import IArticle from "../../common/interfaces/IArticle";
import IAzureData from "../../common/interfaces/IAzureData";
import { addHistoricalDataToArticles, getArticleDataForGivenDateTimeFromCosmosDB, getCombinedArticleStats, getOldestArticleDataFromCosmosDB } from "../lib/articles";
import { getCosmosDBContainer } from "../lib/utils/cosmos";
import { getArticles } from "../lib/utils/devto";
import { getFollowerDataForGivenDateTime, getOldestFollowerData, getFollowerCountStats } from "../lib/followers";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const container: Container = getCosmosDBContainer();

    const date = req.query.date || dayjs().toISOString();
    const sanitisedDate: Dayjs = dayjs(date).minute(0).second(0).millisecond(0);

    const articlePromises = Promise.all([
        getArticles(),
        getArticleDataForGivenDateTimeFromCosmosDB(container, sanitisedDate.subtract(1, 'day')),
        getArticleDataForGivenDateTimeFromCosmosDB(container, sanitisedDate.subtract(1, 'week')),
        getArticleDataForGivenDateTimeFromCosmosDB(container, sanitisedDate.subtract(1, 'month')),
        getOldestArticleDataFromCosmosDB(container),
    ]);

    const followerPromises = Promise.all([
        getFollowerDataForGivenDateTime(container, dayjs().subtract(1, 'hour')),
        getFollowerDataForGivenDateTime(container, sanitisedDate.subtract(1, 'day')),
        getFollowerDataForGivenDateTime(container, sanitisedDate.subtract(1, 'week')),
        getFollowerDataForGivenDateTime(container, sanitisedDate.subtract(1, 'month')),
        getOldestFollowerData(container),
    ]);

    const [articleData, followerData] = await Promise.all([articlePromises, followerPromises]);

    const articlesWithHistoricalData: IArticle[] = addHistoricalDataToArticles(...articleData);

    const body: IAzureData = {
        articles: {
            combined: getCombinedArticleStats(articlesWithHistoricalData),
            articles: articlesWithHistoricalData,
        },
        followers: {
            count: getFollowerCountStats(...followerData),
        }
    }

    context.res = {
        body,
    };
    return;

};

export default httpTrigger;