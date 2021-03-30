import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Container, CosmosClient, Database, SqlQuerySpec } from "@azure/cosmos";
import { IArticlesReponseBody } from "../interfaces/IResponseBody";
import dayjs, { Dayjs } from "dayjs";
import IArticleWithHistoricalData from "../interfaces/IArticleWithHistorialData";
import IHistoricalData from "../interfaces/IHistoricalData";
import axios, { AxiosResponse } from "axios";

const getArticleDataForGivenDateTime = async (container: Container, dateTime: Dayjs) => {
    const dateTimeIso = dateTime.toISOString();
    const dateTimePlusHourIso = dateTime.add(1, 'hour').toISOString();
    const querySpec: SqlQuerySpec = {
        query: `SELECT * from c WHERE c.type = "articles" AND c.fetchedAt >= "${dateTimeIso}" AND c.fetchedAt < "${dateTimePlusHourIso}" OFFSET 0 LIMIT 1`
    };
    const { resources } = await container.items
        .query(querySpec)
        .fetchAll();
    return resources[0];
}

const getOldestArticleData = async (container: Container) => {
    const querySpec: SqlQuerySpec = {
        query: `SELECT * FROM c WHERE c.type = "articles" ORDER BY c.fetchedAt OFFSET 0 LIMIT 1`,
    };
    const { resources } = await container.items
        .query(querySpec)
        .fetchAll() as { resources: IArticlesReponseBody[] };
    return resources[0];
}

const getArticles = async () => {
    const params = { per_page: 1000 }
    const headers = { 'api-key': process.env['DEVTO_TOKEN'] }
    const { data }: AxiosResponse = await axios.get(`https://dev.to/api/articles/me/all`, {
        params,
        headers,
    })
    return data
}

// const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
//     const endpoint = process.env['COSMOS_ENDPOINT'];
//     const key = process.env['COSMOS_KEY'];
//     const client: CosmosClient = new CosmosClient({ endpoint, key });
//     const database: Database = client.database('devtostats');
//     const container: Container = database.container('MyCollection');

//     const date = req.query.date || dayjs().toISOString();


//     // If the date is given, return the data available for day, week and month ago
//     const sanitisedDate: Dayjs = dayjs(req.query.date).minute(0).second(0).millisecond(0);
//     const dayAgo = sanitisedDate.subtract(1, 'day');
//     const weekAgo = sanitisedDate.subtract(1, 'week');
//     const monthAgo = sanitisedDate.subtract(1, 'month');
//     const latest = dayjs().subtract(1, 'hour');

//     const promises = [dayAgo, weekAgo, monthAgo, latest].map(async (dateTime) => (
//         getArticleDataForGivenDateTime(container, dateTime)
//     ));

//     const [dayAgoData, weekAgoData, monthAgoData, latestArticleData, oldestArticleData] = await Promise.all([...promises, getOldestArticleData(container)]);

//     context.res = {
//         body: {
//             latest: latestArticleData,
//             dayAgo: dayAgoData || oldestArticleData || '',
//             weekAgo: weekAgoData || oldestArticleData || '',
//             monthAgo: monthAgoData || oldestArticleData || '',
//         }
//     };
//     return;

// };

const getCombined = (key: 'comments' | 'reactions' | 'pageViews', articlesWithHistoricalData: IArticleWithHistoricalData[]): IHistoricalData => {
    const combinedData: IHistoricalData = {
        current: 0,
        dayAgo: 0,
        weekAgo: 0,
        monthAgo: 0,
        oldestRecord: 0,
    }

    for (const article of articlesWithHistoricalData) {
        combinedData.current += article[key].current || 0;
        combinedData.dayAgo += article[key].dayAgo || 0;
        combinedData.weekAgo += article[key].weekAgo || 0;
        combinedData.monthAgo += article[key].monthAgo || 0;
        combinedData.oldestRecord += article[key].oldestRecord || 0;
    }

    return combinedData;
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
    // const latest = dayjs().subtract(1, 'hour');

    const promises = [dayAgo, weekAgo, monthAgo].map(async (dateTime) => (
        getArticleDataForGivenDateTime(container, dateTime)
    ));

    const [dayAgoData, weekAgoData, monthAgoData, oldestArticleData, latestDevToArticles] = await Promise.all([...promises, getOldestArticleData(container), getArticles()]);

    const articlesWithHistoricalData: IArticleWithHistoricalData[] = latestDevToArticles.map((article): IArticleWithHistoricalData => {
        const dayAgoArticle = dayAgoData ? dayAgoData.articles.find(({ id: _id }) => article.id === _id) : null;
        const weekAgoArticle = weekAgoData ? weekAgoData.articles.find(({ id: _id }) => article.id === _id) : null;
        const monthAgoArticle = monthAgoData ? monthAgoData.articles.find(({ id: _id }) => article.id === _id) : null;
        const oldestArticle = oldestArticleData ? oldestArticleData.articles.find(({ id: _id }) => article.id === _id) : null;

        return {
            id: article.id,
            title: article.title,
            published: article.published,
            publishedAt: article.published_at,
            url: article.url,
            canonicalUrl: article.canonical_url,
            coverImage: article.cover_image,
            comments: {
                current: article.comments_count,
                dayAgo: dayAgoArticle ? dayAgoArticle.comments_count : null,
                weekAgo: weekAgoArticle ? weekAgoArticle.comments_count : null,
                monthAgo: monthAgoArticle ? monthAgoArticle.comments_count : null,
                oldestRecord: oldestArticle ? oldestArticle.comments_count : null,
            },
            reactions: {
                current: article.positive_reactions_count,
                dayAgo: dayAgoArticle ? dayAgoArticle.positive_reactions_count : null,
                weekAgo: weekAgoArticle ? weekAgoArticle.positive_reactions_count : null,
                monthAgo: monthAgoArticle ? monthAgoArticle.positive_reactions_count : null,
                oldestRecord: oldestArticle ? oldestArticle.positive_reactions_count : null,
            },
            pageViews: {
                current: article.page_views_count,
                dayAgo: dayAgoArticle ? dayAgoArticle.page_views_count : null,
                weekAgo: weekAgoArticle ? weekAgoArticle.page_views_count : null,
                monthAgo: monthAgoArticle ? monthAgoArticle.page_views_count : null,
                oldestRecord: oldestArticle ? oldestArticle.page_views_count : null,
            },
        }
    });

    const combined: { comments: IHistoricalData, reactions: IHistoricalData, pageViews: IHistoricalData } = {
        comments: getCombined('comments', articlesWithHistoricalData),
        reactions: getCombined('reactions', articlesWithHistoricalData),
        pageViews: getCombined('pageViews', articlesWithHistoricalData),
    }

    const body: IArticlesReponseBody = {
        combined,
        articles: articlesWithHistoricalData,
    }

    context.res = {
        body,
    };
    return;

};

export default httpTrigger;