import IDevToArticle from "./IDevToArticle";

interface IReponseBody {
    type: 'articles' | 'followers';
    fetchedAt: string;
    count: number;
}

export interface ICosmosArticlesReponseBody extends IReponseBody {
    articles: IDevToArticle[];
}

export interface ICosmosFollowersReponseBody extends IReponseBody {
    followers: object[];
}
