import { AzureFunction, Context } from "@azure/functions"
import { ICosmosFollowersReponseBody } from "../interfaces/IResponseBody";
import { getFollowers } from "../lib/devto";

const httpTrigger: AzureFunction = async function (context: Context): Promise<void> {
    const followers = await getFollowers();
    const date = new Date();

    const body: ICosmosFollowersReponseBody = {
        type: 'followers',
        fetchedAt: date.toISOString(),
        count: followers.length,
        followers,
    };

    context.bindings.outputDocument = body;
    context.res = {
        body,
    };

};

export default httpTrigger;