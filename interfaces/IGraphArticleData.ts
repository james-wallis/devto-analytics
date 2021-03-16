import ICombinedArticleStats from "./ICombinedArticleStats";

interface IGraphArticleData extends ICombinedArticleStats {
    fetchedAt: string;
    viewsDiff?: number;
    reactionsDiff?: number;
}

export default IGraphArticleData;
