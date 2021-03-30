import IArticleWithHistoricalData from "./IArticleWithHistorialData";
import ICombinedArticleStats from "./ICombinedArticleStats";
import IFollower from "./IFollower";

interface IReponseBody {
    type: 'articles' | 'followers';
    fetchedAt: string;
    count: number;
}

export interface ICosmosArticlesReponseBody extends IReponseBody {
    articles: object[];
}

export interface ICosmosFollowersReponseBody extends IReponseBody {
    followers: object[];
}

export interface IArticlesReponseBody {
    combined: ICombinedArticleStats;
    articles: IArticleWithHistoricalData[];
}

export interface IFollowersReponseBody extends IFollower {
}
