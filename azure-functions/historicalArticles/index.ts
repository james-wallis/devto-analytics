import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Container, CosmosClient, Database, SqlQuerySpec } from "@azure/cosmos";
import dayjs from "dayjs";
import { ICosmosArticlesReponseBody } from "../interfaces/IResponseBody";
import IAzureHistoricalArticleData from "../../common/interfaces/IAzureHistoricalArticleData";
import IArticleStatTotals from "../../common/interfaces/IArticleStatTotals";

const getAllArticles = async (container: Container): Promise<ICosmosArticlesReponseBody[]> => {
    const querySpec: SqlQuerySpec = {
        query: `SELECT * FROM c WHERE c.type = "articles"`,
    };
    const { resources } = await container.items
        .query(querySpec)
        .fetchAll() as { resources: ICosmosArticlesReponseBody[] };
    return resources;
}

const convertArticleToHistoricalArticleData = ({ fetchedAt, articles }: ICosmosArticlesReponseBody): IAzureHistoricalArticleData['day'][0] | IAzureHistoricalArticleData['week'][0] => {
    const initialTotals: IArticleStatTotals = {
        articles: articles.length,
        published: articles.filter(({ published, published_at }) => published && published_at).length,
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

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const endpoint = process.env['COSMOS_ENDPOINT'];
    const key = process.env['COSMOS_KEY'];
    const client: CosmosClient = new CosmosClient({ endpoint, key });
    const database: Database = client.database('devtostats');
    const container: Container = database.container('MyCollection');

    const articles: ICosmosArticlesReponseBody[] = await getAllArticles(container);

    const week: IAzureHistoricalArticleData['week'] = articles
        .filter(({ fetchedAt }) => dayjs(fetchedAt).hour() === 0  && dayjs().subtract(1, 'week').subtract(1, 'day').isBefore(fetchedAt))
        .map(convertArticleToHistoricalArticleData);

    const day: IAzureHistoricalArticleData['day'] = articles
        .filter(({ fetchedAt }) => dayjs().subtract(1, 'day').subtract(1, 'hour').isBefore(fetchedAt))
        .map(convertArticleToHistoricalArticleData);

    const body: IAzureHistoricalArticleData = {
        week,
        day,
    }

    context.res = {
        body,
    };
    return;

};

export default httpTrigger;