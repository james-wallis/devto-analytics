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
