import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import { GetServerSideProps } from 'next';
import React from 'react';
import { IconType } from 'react-icons';
import { FiEye, FiHeart, FiMessageCircle } from 'react-icons/fi';

// import GraphContainer from '../components/graphs/container';
import Layout from '../components/Layout';
import StatGrid from '../components/statGrid';
import IArticle, { IArticleWithDiffs } from '../interfaces/IArticle';
import IAzureArticleData, { IDatedAzureArticleData } from '../interfaces/IAzureArticleData';
import IAzureFollowerData from '../interfaces/IAzureFollowerData';
import ICombinedArticleStats from '../interfaces/ICombinedArticleStats';
import IFollower from '../interfaces/IFollower';
import IHistoricalArticleData from '../interfaces/IHistoricalArticleData';
import IHistoricalFollowerData from '../interfaces/IHistoricalFollowerData';
import IOverviewStats from '../interfaces/IOverviewStats';
import IUser from '../interfaces/IUser';
import { getAzureArticleData, getAzureFollowerData } from '../lib/azure';
import { getArticles, getFollowers, getUser } from '../lib/devto';
import { getAzureArticleDataDayWeekMonth, getCombinedArticleViewsReactionsComments, getHistorialDiffsForLatestArticles, getHistoricalArticleDataForOverview, getLatestPublishedArticle, getPublishedArticles } from '../lib/utils/articles';
import { getHistoricalFollowerDataForOverview } from '../lib/utils/followers';
import { getOverviewStats } from '../lib/utils/overview';
import { latestArticleFirst } from '../lib/utils/sorting';

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
    const publishedLatestArticles = getPublishedArticles(latestArticles);
    const latestArticle = getLatestPublishedArticle(publishedLatestArticles);

    const azureArticleDataByDate: IDatedAzureArticleData = getAzureArticleDataDayWeekMonth(azureArticleData);

    // Add the day, week, month diffs into the latestArticles
    const latestArticlesWithDiffs: IArticleWithDiffs[] = getHistorialDiffsForLatestArticles(publishedLatestArticles, azureArticleDataByDate);

    const latestCombinedArticleStats: ICombinedArticleStats = getCombinedArticleViewsReactionsComments(latestArticles);

    const historicCombinedArticleData: IHistoricalArticleData = getHistoricalArticleDataForOverview(azureArticleData, latestArticles);
    const historicCombinedFollowerData: IHistoricalFollowerData = getHistoricalFollowerDataForOverview(azureFollowerData, latestFollowers);


    const overviewStats: IOverviewStats[] = getOverviewStats(
        latestArticle, latestCombinedArticleStats, historicCombinedArticleData, historicCombinedFollowerData, latestFollowers.length
    );

    const selectOpts = [
        { text: 'Recently published', value: 'published-desc' },
        // { text: 'Recently created', value: 'creation-desc' },
        { text: 'Most views', value: 'views-desc' },
        { text: 'Most reactions', value: 'reactions-desc' },
        { text: 'Most comments', value: 'comments-desc' },
    ];


    return (
        <Layout title="Analytics Dashboard" user={user}>
            <div className="pb-4 px-2 lg:px-4">
                <h1 className="text-2xl md:text-3xl my-2 lg:my-4 font-bold leading-normal">Dashboard</h1>
                <StatGrid stats={overviewStats} />
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
                                {
                                    selectOpts.map(({ text, value }) => (
                                        <option key={value} value={value}>{text}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div className="bg-white shadow-card rounded-devto w-full">
                        {latestArticlesWithDiffs.map(({ title, url, publishedAt, publicReactionsCount, commentsCount, pageViewsCount, diffs }: IArticleWithDiffs, i: number) => (
                            <div className={`grid grid-cols-2 md:grid-cols-4 gap-2 items-center p-4 ${i !== 0 ? 'border-t border-base-border' : ''}`}>
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
                                <div className="flex flex-nowrap whitespace-nowrap text-sm text-card-tertiary-color order-last md:order-none">
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
                                <div className="justify-self-end flex order-last md:order-none">
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
                                <div className="col-span-full flex justify-between md:justify-start ml-1 mr-3 md:mx-0 text-card-tertiary-color text-xs">
                                    <div className="flex flex-col md:flex-row items-start md:items-center md:justify-start md:mr-4">
                                        <p className="font-medium md:mr-1">24 hours<span className="hidden md:inline">:</span></p>
                                        <div className="flex flex-row text-xs items-center">
                                            {[diffs.day.reactions, diffs.day.pageViews].map((stat, i: number) => {
                                                const Icon: IconType = (i === 0) ? FiHeart : FiEye;
                                                return (
                                                    <span className={`flex items-center ${i !== 0 ? 'ml-2' : ''}`}>
                                                        <Icon className="mr-1 text-sm"/>
                                                        {stat}
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row items-center md:items-center justify-start md:mr-4">
                                        <p className="font-medium md:mr-1">7 days<span className="hidden md:inline">:</span></p>
                                        <div className="flex flex-row text-xs items-center">
                                            {[diffs.week.reactions, diffs.week.pageViews].map((stat, i: number) => {
                                                const Icon: IconType = (i === 0) ? FiHeart : FiEye;
                                                return (
                                                    <span className={`flex items-center ${i !== 0 ? 'ml-2' : ''}`}>
                                                        <Icon className="mr-1 text-sm"/>
                                                        {stat}
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row items-end md:items-center justify-start">
                                        <p className="font-medium md:mr-1">30 days<span className="hidden md:inline">:</span></p>
                                        <div className="flex flex-row text-xs items-center">
                                            {[diffs.month.reactions, diffs.month.pageViews].map((stat, i: number) => {
                                                const Icon: IconType = (i === 0) ? FiHeart : FiEye
                                                return (
                                                    <span className={`flex items-center ${i !== 0 ? 'ml-2' : ''}`}>
                                                        <Icon className="mr-1 text-sm"/>
                                                        {stat}
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    </div>
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
            azureArticleData: azureArticleData.sort(latestArticleFirst),
            latestArticles,
            azureFollowerData,
            latestFollowers,
            user,
        },
        // revalidate: 60, // In seconds
    }
}


export default IndexPage
