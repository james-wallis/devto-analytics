import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import { GetServerSideProps } from 'next';
import React from 'react';
import { IconType } from 'react-icons';
import { FiEye, FiHeart, FiMessageCircle } from 'react-icons/fi';

// import GraphContainer from '../components/graphs/container';
import Layout from '../components/Layout';
import StatGrid from '../components/statGrid';
import IArticle from '../interfaces/IArticle';
import IAzureArticleData from '../interfaces/IAzureArticleData';
import IAzureFollowerData from '../interfaces/IAzureFollowerData';
import IFollower from '../interfaces/IFollower';
import IOverviewStats from '../interfaces/IOverviewStats';
import IUser from '../interfaces/IUser';
import { getAzureArticleData, getAzureFollowerData } from '../lib/azure';
import { getArticles, getFollowers, getUser } from '../lib/devto';
import { getCombinedArticleViewsReactionsComments, getHistoricalArticleDataForOverview, getLatestPublishedArticle, getPublishedArticles } from '../lib/utils/articles';
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

    // const mostViewedArticles = orderMostViewedFirst(latestArticles).slice(0, 3);
    // const mostReactedArticles = orderMostReactedFirst(latestArticles).slice(0, 3);

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
        // { type: 'list', title: latestArticle.title, subtitle: 'Latest article', headlineValue: -1, stats: [{ text: 'Post views', value: latestArticle.pageViewsCount }, { text: 'Post reactions', value: latestArticle.publicReactionsCount }] },
        // { type: 'list', title: 'Top viewed posts', headlineValue: -1, stats: mostViewedArticles.map(({ pageViewsCount, title }): IStat => ({ text: title, value: pageViewsCount })) },
        // { type: 'list', title: 'Top reacted posts', headlineValue: -1, stats: mostReactedArticles.map(({ publicReactionsCount, title }): IStat => ({ text: title, value: publicReactionsCount })) },
    ]

    const sortedLatestArticleFirst = getPublishedArticles(latestArticles).sort((a, b) => dayjs(a.publishedAt).isBefore(b.publishedAt, 'hour') ? 1 : -1);

    return (
        <Layout title="Analytics Dashboard" user={user}>
            <div className="pb-4 px-2 lg:px-4">
                <h1 className="text-3xl my-2 lg:my-4 font-bold leading-normal">Dashboard</h1>
                <StatGrid stats={stats} />
            </div>
            <div className="grid md:grid-cols-5 md:p-4 gap-4">
                <aside>
                    <nav className="hidden md:block">
                        <button className="p-3 sm:p-2 flex items-center rounded-devto bg-white w-full font-medium">
                            Posts
                            <span
                                className="
                                    font-mono text-xs bg-indicator-background p-1 rounded-devto text-center ml-auto
                                    text-indicator-text border border-indicator-background
                                "
                            >
                                {latestArticles.length}
                            </span>
                        </button>
                        <button className="p-3 sm:p-2 flex items-center rounded-devto w-full">
                            Graphs
                            <span
                                className="
                                    font-mono text-xs bg-indicator-background p-1 rounded-devto text-center ml-auto
                                    text-indicator-text border border-indicator-background
                                "
                            >
                                {4}
                            </span>
                        </button>
                        <a
                            href="https://dev.to/dashboard/user_followers"
                            rel="noreferrer noopener"
                            target="_blank"
                            className="p-3 sm:p-2 flex items-center rounded-devto w-full"
                        >
                            Followers
                            <span
                                className="
                                    font-mono text-xs bg-indicator-background p-1 rounded-devto text-center ml-auto
                                    text-indicator-text border border-indicator-background
                                "
                            >
                                {latestFollowers.length}
                            </span>
                        </a>
                    </nav>
                </aside>
                <div className="col-span-1 md:col-span-4">
                    <div className="flex flex-row justify-between mb-3 items-center leading-loose">
                        <h2 className="hidden md:block text-xl font-bold">Posts</h2>
                        <div className="block">
                            <select
                                className="
                                    ml-2 my-1 p-2 pr-7 relative text-base bg-form-background-color border-form-border-color
                                    outline-none appearance-none rounded-devto border leading-normal
                                    focus:bg-white focus:shadow-form-hover focus:border-form-background-hover
                                "
                            >
                                <option value="published-desc">Recently published</option>
                            </select>
                        </div>
                    </div>
                    <div className="bg-white shadow-card rounded-devto w-full">
                        {sortedLatestArticleFirst.map(({ title, url, publishedAt, publicReactionsCount, commentsCount, pageViewsCount }: IArticle, i: number) => (
                            <div className={`grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 items-center p-4 ${i !== 0 ? 'border-t border-base-border' : ''}`}>
                                <div className="col-span-2">
                                    <h3 className="flex items-center text-link font-bold text-devto-h3">
                                        <a href={url} rel="noreferrer noopener" target="_blank">
                                            {title}
                                        </a>
                                    </h3>
                                    <p className="text-sm text-card-tertiary-color">
                                        <strong className="font-medium mr-1">Published:</strong>
                                        <time dateTime={publishedAt}>{dayjs(publishedAt).format('D MMM')}</time>
                                    </p>
                                </div>
                                <div className="flex flex-nowrap whitespace-nowrap text-sm text-card-tertiary-color">
                                    {[publicReactionsCount, commentsCount, pageViewsCount].map((stat: number, i: number) => {
                                        let Icon: IconType;
                                        if (i === 0) Icon = FiHeart;
                                        else if (i === 1) Icon = FiMessageCircle;
                                        else Icon = FiEye;

                                        return (
                                            <span className={`flex items-center p-1 ${i !== 0 ? 'ml-2' : ''}`}>
                                                <Icon className="mr-2 text-lg"/>
                                                {stat}
                                            </span>
                                        )
                                    })}
                                </div>
                                <div className="justify-self-end flex">
                                    {['Manage', 'Edit'].map((str: string) => (
                                        <a
                                            href={`${url}/${str.toLowerCase()}`}
                                            rel="noreferrer noopener"
                                            target="_blank"
                                            className="px-3 py-1 rounded-devto text-sm text-ghost-dark"
                                        >
                                            {str}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}

                    </div>

                </div>
            </div>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
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
        // revalidate: 60, // In seconds
    }
}


export default IndexPage
