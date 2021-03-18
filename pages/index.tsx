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
import IOverviewStats from '../interfaces/IOverviewStats';
import IStat from '../interfaces/IStat';
import IUser from '../interfaces/IUser';
import { getAzureArticleData, getAzureFollowerData } from '../lib/azure';
import { getArticles, getFollowers, getUser } from '../lib/devto';
import { getCombinedArticleViewsReactionsComments, getHistoricalArticleDataForOverview, getLatestPublishedArticle, orderMostReactedFirst, orderMostViewedFirst } from '../lib/utils/articles';
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
    const now = getCombinedArticleViewsReactionsComments(latestArticles);
    const { day, week, month } = getHistoricalArticleDataForOverview(azureArticleData, latestArticles);
    const historicFollowerData = getHistoricalFollowerDataForOverview(azureFollowerData, latestFollowers);

    const latestArticle = getLatestPublishedArticle(latestArticles);

    const mostViewedArticles = orderMostViewedFirst(latestArticles).slice(0, 3);
    const mostReactedArticles = orderMostReactedFirst(latestArticles).slice(0, 3);

    // const stats: IOverviewStat[] = [
    //     { type: 'stat', name: 'Total post reactions', value: now.reactions, weekly: week.reactions, monthly: month.reactions },
    //     { type: 'stat', name: 'Total post views', value: now.views, daily: day.views, weekly: week.views },
    //     { type: 'stat', name: 'Followers', value: latestFollowers.length, weekly: historicFollowerData.week, daily: historicFollowerData.day },
    //     { type: 'stat', name: 'Posts published', value: now.publishedPosts, otherStats: [{ value: dayjs(latestArticle.publishedAt).fromNow(), desc: 'Last posted' }, { value: `${month.publishedPosts}`, desc: 'Last 30 days', larger: true }] },
    //     { type: 'list', name: 'Top viewed posts', value: mostViewedArticles.map(({ pageViewsCount, title }) => `${pageViewsCount} - ${title}`) },
    //     { type: 'list', name: 'Top reacted posts', value: mostReactedArticles.map(({ publicReactionsCount, title }) => `${publicReactionsCount} - ${title}`) },
    // ]

    const stats: IOverviewStats[] = [
        { type: 'stat', title: 'Total post reactions', headlineValue: now.reactions, stats: [{ text: 'Last 7 days', value: week.reactions }, { text: 'Last 30 days', value: month.reactions }] },
        { type: 'stat', title: 'Total post views', headlineValue: now.views, stats: [{ text: 'Last 24 hours', value: day.views }, { text:  'Last 7 days', value: week.views }] },
        { type: 'stat', title: 'Followers', headlineValue: latestFollowers.length, stats: [{ text: 'Last 24 hours', value: historicFollowerData.day }, { text:  'Last 7 days', value: historicFollowerData.week }] },
        { type: 'stat', title: 'Posts published', headlineValue: now.publishedPosts, stats: [{ text: 'Last posted', value: dayjs(latestArticle.publishedAt).fromNow(), small: true }, { text: 'Last 30 days', value: `${month.publishedPosts}` }] },
        { type: 'list', title: latestArticle.title, subtitle: 'Latest article', headlineValue: -1, stats: [{ text: 'Post views', value: latestArticle.pageViewsCount }, { text: 'Post reactions', value: latestArticle.publicReactionsCount }] },
        { type: 'list', title: 'Top viewed posts', headlineValue: -1, stats: mostViewedArticles.map(({ pageViewsCount, title }): IStat => ({ text: title, value: pageViewsCount })) },
        { type: 'list', title: 'Top reacted posts', headlineValue: -1, stats: mostReactedArticles.map(({ publicReactionsCount, title }): IStat => ({ text: title, value: publicReactionsCount })) },
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
