import IDevToArticle from './IDevToArticle'
import IDevToFollower from './IDevToFollower'

interface IReponseBody {
    type: 'articles' | 'followers'
    fetchedAt: string
    count: number
}

export interface ICosmosArticlesReponseBody extends IReponseBody {
    articles: IDevToArticle[]
}

export interface ICosmosFollowersReponseBody extends IReponseBody {
    followers: IDevToFollower[]
}
