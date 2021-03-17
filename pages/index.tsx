import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import { GetStaticProps } from 'next';
import React from 'react';
import GraphContainer from '../components/graphs/container';
import Layout from '../components/Layout';
import StatGrid from '../components/statGrid';
import IArticle from '../interfaces/IArticle';
import IAzureArticleData from '../interfaces/IAzureArticleData';
import IAzureFollowerData from '../interfaces/IAzureFollowerData';
import IFollower from '../interfaces/IFollower';
import IOverviewStat from '../interfaces/IOverviewStat';
import IUser from '../interfaces/IUser';
import { getAzureArticleData, getAzureFollowerData } from '../lib/azure';
import { getArticles, getFollowers, getUser } from '../lib/devto';
import { getCombinedArticleViewsReactionsComments, getHistoricalArticleDataForOverview, getLatestPublishedArticle } from '../lib/utils/articles';
import { getHistoricalFollowerDataForOverview } from '../lib/utils/followers';

// Add .fromNow (relative times)
dayjs.extend(relativeTime)

interface IProps {
    azureArticleData: IAzureArticleData[];
    latestArticles: IArticle[];
    azureFollowerData: IAzureFollowerData[];
    latestFollowers: IFollower[];
    user: IUser;
}

const IndexPage = ({ azureArticleData, latestArticles, azureFollowerData, latestFollowers, user }: IProps) => {
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
    const { day, week, month } = getHistoricalArticleDataForOverview(azureArticleData, latestArticles);
    const historicFollowerData = getHistoricalFollowerDataForOverview(azureFollowerData, latestFollowers);

    const latestArticle = getLatestPublishedArticle(latestArticles);

    const stats: IOverviewStat[] = [
        { name: 'Total post reactions', value: now.reactions, weekly: week.reactions, monthly: month.reactions },
        { name: 'Total post views', value: now.views, daily: day.views, weekly: week.views },
        { name: 'Followers', value: latestFollowers.length, weekly: historicFollowerData.week, daily: historicFollowerData.day },
        { name: 'Posts published', value: now.publishedPosts, otherStats: [{ value: dayjs(latestArticle.publishedAt).fromNow(), desc: 'Last posted' }, { value: `${month.publishedPosts}`, desc: 'Last 30 days', larger: true }] },
    ]


    return (
        <Layout title="Analytics Dashboard" user={user}>
            <h1 className="text-3xl my-2 lg:my-4 font-bold leading-normal">Dashboard</h1>
            <div>
                <StatGrid stats={stats} />
            </div>
            <h2 className="text-2xl my-2 lg:my-4 font-bold leading-normal">Graphs</h2>
            <GraphContainer
                azureArticleData={azureArticleData}
                latestArticles={latestArticles}
                azureFollowerData={azureFollowerData}
                latestFollowers={latestFollowers}
            />
        </Layout>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const promises: Promise<any>[] = [
        getAzureArticleData(),
        getArticles(),
        getAzureFollowerData(),
        getFollowers(),
        getUser(),
    ];

    const [
        azureArticleData,
        latestArticles,
        azureFollowerData,
        latestFollowers,
        user,
    ] = await Promise.all(promises);

    return {
        props: {
            azureArticleData,
            latestArticles,
            azureFollowerData,
            latestFollowers,
            user,
        },
        revalidate: 60, // In seconds
    }
}


export default IndexPage
