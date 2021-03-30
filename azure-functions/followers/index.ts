import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Container, CosmosClient, Database, SqlQuerySpec } from "@azure/cosmos";
import dayjs, { Dayjs } from "dayjs";
import { ICosmosFollowersReponseBody } from "../interfaces/IResponseBody";
import IAzureFollowerData from "../../common/interfaces/IAzureFollowerData";

const getFollowerDataForGivenDateTime = async (container: Container, dateTime: Dayjs) => {
    const dateTimeIso = dateTime.toISOString();
    const dateTimePlusHourIso = dateTime.add(1, 'hour').toISOString();
    const querySpec: SqlQuerySpec = {
        query: `SELECT * from c WHERE c.type = "followers" AND c.fetchedAt >= "${dateTimeIso}" AND c.fetchedAt < "${dateTimePlusHourIso}" OFFSET 0 LIMIT 1`
    };
    const { resources } = await container.items
        .query(querySpec)
        .fetchAll();
    return resources[0];
}

const getOldestFollowerData = async (container: Container) => {
    const querySpec: SqlQuerySpec = {
        query: `SELECT * FROM c WHERE c.type = "followers" ORDER BY c.fetchedAt OFFSET 0 LIMIT 1`,
    };
    const { resources } = await container.items
        .query(querySpec)
        .fetchAll() as { resources: ICosmosFollowersReponseBody[] };
    return resources[0];
}


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const endpoint = process.env['COSMOS_ENDPOINT'];
    const key = process.env['COSMOS_KEY'];
    const client: CosmosClient = new CosmosClient({ endpoint, key });

    const database: Database = client.database('devtostats');
    const container: Container = database.container('MyCollection');

    const date = req.query.date || dayjs().toISOString();

    // If the date is given, return the data available for day, week and month ago
    const sanitisedDate: Dayjs = dayjs(date).minute(0).second(0).millisecond(0);
    const dayAgo = sanitisedDate.subtract(1, 'day');
    const weekAgo = sanitisedDate.subtract(1, 'week');
    const monthAgo = sanitisedDate.subtract(1, 'month');
    const latest = dayjs().subtract(1, 'hour');

    const promises = [dayAgo, weekAgo, monthAgo, latest].map(async (dateTime) => {
        const result = await getFollowerDataForGivenDateTime(container, dateTime)
        if (result) {
            const { followers, ...otherData } = result;
            return otherData;
        }
        return undefined;
    });

    const [dayAgoData, weekAgoData, monthAgoData, latestArticleData, { followers: _f, ...oldestArticleData }] = await Promise.all([...promises, getOldestFollowerData(container)]);

    const body: IAzureFollowerData = {
        count: {
            current: latestArticleData.count,
            dayAgo: dayAgoData ? dayAgoData.count : null,
            weekAgo: weekAgoData ? weekAgoData.count : null,
            monthAgo: monthAgoData ? monthAgoData.count : null,
            oldestRecord: oldestArticleData ? oldestArticleData.count : null,
        }
    }

    context.res = {
        body,
    };
};

export default httpTrigger;