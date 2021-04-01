import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Container, CosmosClient, Database, SqlQuerySpec } from "@azure/cosmos";
import dayjs from "dayjs";
import { ICosmosFollowersReponseBody } from "../interfaces/IResponseBody";
import IAzureHistoricalFollowerData from "../../common/interfaces/IAzureHistoricalFollowerData";

const getAllArticles = async (container: Container): Promise<ICosmosFollowersReponseBody[]> => {
    const querySpec: SqlQuerySpec = {
        query: `SELECT * FROM c WHERE c.type = "followers"`,
    };
    const { resources } = await container.items
        .query(querySpec)
        .fetchAll() as { resources: ICosmosFollowersReponseBody[] };
    return resources;
}

const convertArticleToHistoricalArticleData = ({ fetchedAt, count }: ICosmosFollowersReponseBody): IAzureHistoricalFollowerData['day'][0] | IAzureHistoricalFollowerData['week'][0] => {
    return {
        fetchedAt,
        numFollowers: count,
    }
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const endpoint = process.env['COSMOS_ENDPOINT'];
    const key = process.env['COSMOS_KEY'];
    const client: CosmosClient = new CosmosClient({ endpoint, key });
    const database: Database = client.database('devtostats');
    const container: Container = database.container('MyCollection');

    const articles: ICosmosFollowersReponseBody[] = await getAllArticles(container);

    const week: IAzureHistoricalFollowerData['week'] = articles
        .filter(({ fetchedAt }) => dayjs(fetchedAt).hour() === 0  && dayjs().subtract(1, 'week').subtract(1, 'day').isBefore(fetchedAt))
        .map(convertArticleToHistoricalArticleData);

    const day: IAzureHistoricalFollowerData['day'] = articles
        .filter(({ fetchedAt }) => dayjs().subtract(1, 'day').subtract(1, 'hour').isBefore(fetchedAt))
        .map(convertArticleToHistoricalArticleData);

    const body: IAzureHistoricalFollowerData = {
        week,
        day,
    }

    context.res = {
        body,
    };
    return;

};

export default httpTrigger;