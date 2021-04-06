import { AzureFunction, Context } from "@azure/functions"
import { ICosmosArticlesReponseBody } from "../interfaces/IResponseBody";
import { getArticles } from "../lib/utils/devto";

const httpTrigger: AzureFunction = async function (context: Context): Promise<void> {
    const retrievedArticles = await getArticles();
    const articles = retrievedArticles.map(({ body_markdown, user, ...article }) => article);
    const date = new Date();

    const body: ICosmosArticlesReponseBody = {
        type: 'articles',
        fetchedAt: date.toISOString(),
        count: articles.length,
        articles,
    };

    context.bindings.outputDocument = body;
    context.res = {
        body,
    };

};

export default httpTrigger;