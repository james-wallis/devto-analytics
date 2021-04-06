import { CosmosClient, Database, Container, SqlQuerySpec } from "@azure/cosmos";
import { ICosmosArticlesReponseBody, ICosmosFollowersReponseBody } from "../../interfaces/IResponseBody";

export const getCosmosDBContainer = (): Container => {
    const endpoint = process.env['COSMOS_ENDPOINT'];
    const key = process.env['COSMOS_KEY'];
    const client: CosmosClient = new CosmosClient({ endpoint, key });
    const database: Database = client.database('devtostats');
    const container: Container = database.container('MyCollection');
    return container;
}

export const getAllArticlesFromCosmosDB = async (container: Container): Promise<ICosmosArticlesReponseBody[]> => {
    const querySpec: SqlQuerySpec = {
        query: `SELECT * FROM c WHERE c.type = "articles"`,
    };
    const { resources } = await container.items
        .query(querySpec)
        .fetchAll() as { resources: ICosmosArticlesReponseBody[] };
    return resources;
}

export const getAllFollowersFromCosmosDB = async (container: Container): Promise<ICosmosFollowersReponseBody[]> => {
    const querySpec: SqlQuerySpec = {
        query: `SELECT c.fetchedAt, c.count FROM c WHERE c.type = "followers"`,
    };
    const { resources } = await container.items
        .query(querySpec)
        .fetchAll() as { resources: ICosmosFollowersReponseBody[] };
    return resources;
}