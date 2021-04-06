import { Container, SqlQuerySpec } from "@azure/cosmos";
import { Dayjs } from "dayjs";
import { ICosmosFollowersReponseBody } from "../interfaces/IResponseBody";

export const getFollowerDataForGivenDateTime = async (container: Container, dateTime: Dayjs) => {
    const dateTimeIso = dateTime.toISOString();
    const dateTimePlusHourIso = dateTime.add(1, 'hour').toISOString();
    const querySpec: SqlQuerySpec = {
        query: `SELECT c.count from c WHERE c.type = "followers" AND c.fetchedAt >= "${dateTimeIso}" AND c.fetchedAt < "${dateTimePlusHourIso}" OFFSET 0 LIMIT 1`
    };
    const { resources } = await container.items
        .query(querySpec)
        .fetchAll();
    return resources[0];
}

export const getOldestFollowerData = async (container: Container) => {
    const querySpec: SqlQuerySpec = {
        query: `SELECT c.count FROM c WHERE c.type = "followers" ORDER BY c.fetchedAt OFFSET 0 LIMIT 1`,
    };
    const { resources } = await container.items
        .query(querySpec)
        .fetchAll() as { resources: ICosmosFollowersReponseBody[] };
    return resources[0];
}

export const getFollowerCountStats = (latestArticleData, dayAgoData, weekAgoData, monthAgoData, oldestArticleData) => {
    return {
        current: latestArticleData.count,
        dayAgo: dayAgoData ? dayAgoData.count : null,
        weekAgo: weekAgoData ? weekAgoData.count : null,
        monthAgo: monthAgoData ? monthAgoData.count : null,
        oldestRecord: oldestArticleData ? oldestArticleData.count : null,
    }
}