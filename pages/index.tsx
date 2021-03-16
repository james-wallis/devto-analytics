import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import React from 'react';
import Layout from '../components/Layout';
import StatGrid from '../components/statGrid';
import IArticle from '../interfaces/IArticle';
import IAzureArticleData from '../interfaces/IAzureArticleData';
import IFollower from '../interfaces/IFollower';
import IOverviewStat from '../interfaces/IOverviewStat';
import IUser from '../interfaces/IUser';
import { getAzureData } from '../lib/azure';
import { getArticles, getFollowers, getUser } from '../lib/devto';
import { getCombinedArticleViewsReactionsComments, getHistoricalDataForOverview, getLatestPublishedArticle } from '../lib/utils/articles';

// Add .fromNow (relative times)
dayjs.extend(relativeTime)

interface IProps {
    azureArticleData: IAzureArticleData[];
    latestArticles: IArticle[];
    user: IUser;
    followers: IFollower[];
}

const IndexPage = ({ azureArticleData, latestArticles, user, followers }: IProps) => {
    const lastestArticlesAsAzureData: IAzureArticleData = {
        fetchedAt: '',
        count: 1,
        articles: latestArticles,
    };

    const data = [...azureArticleData, lastestArticlesAsAzureData].map((item) => {
        const views = item.articles.reduce((count: number, article: IArticle) => article.pageViewsCount + count, 0);
        const reactions = item.articles.reduce((count: number, article: IArticle) => article.publicReactionsCount + count, 0);
        const comments = item.articles.reduce((count: number, article: IArticle) => article.commentsCount + count, 0);

        return {
            name: dayjs(item.fetchedAt).format('HH:mm'),
            views,
            viewsDiff: 0,
            reactions,
            reactionsDiff: 0,
            comments,
        }
    });

    for (let i = 1; i < data.length; i++) {
        const item = data[i];
        const prevItem = data[i - 1];
        data[i].viewsDiff = item.views - prevItem.views;
        data[i].reactionsDiff = item.reactions - prevItem.reactions;
    }

    const now = getCombinedArticleViewsReactionsComments(latestArticles);
    const { day, week, month } = getHistoricalDataForOverview(azureArticleData, latestArticles);

    const latestArticle = getLatestPublishedArticle(latestArticles);

    const mockStats: IOverviewStat[] = [
        { name: 'Total post reactions', value: now.reactions, weekly: week.reactions, monthly: month.reactions },
        { name: 'Total post views', value: now.views, daily: day.views, weekly: week.views },
        { name: 'Followers', value: followers.length, weekly: 43, monthly: 112 },
        { name: 'Posts published', value: now.publishedPosts, otherStats: [{ value: dayjs(latestArticle.publishedAt).fromNow(), desc: 'Last posted' }, { value: `${month.publishedPosts}`, desc: 'Last 30 days' }] },
    ]


    return (
        <Layout title="Analytics Dashboard" user={user}>
            <h1 className="text-3xl my-2 lg:my-4 font-bold leading-normal">Dashboard</h1>
            <div>
                <StatGrid stats={mockStats} />
            </div>
            <h2 className="text-2xl my-2 lg:my-4 font-bold leading-normal">Graphs</h2>
        </Layout>
    )
}

export async function getServerSideProps(): Promise<{ props: IProps }> {
    const azureArticleData: IAzureArticleData[] = await getAzureData();
    const latestArticles: IArticle[] = await getArticles();
    const followers: IFollower[] = await getFollowers();
    const user: IUser = await getUser();

    return {
        props: {
            azureArticleData,
            latestArticles,
            followers,
            user,
        },
    }
}


export default IndexPage
