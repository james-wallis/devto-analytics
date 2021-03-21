import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import ArticleCard from '../components/articleCard';

import Layout from '../components/Layout';
import Select from '../components/select';
import SideNav from '../components/sideNav';
import StatGrid from '../components/statGrid';
import IArticle, { IArticleWithDiffs } from '../interfaces/IArticle';
import IAzureArticleData, { IDatedAzureArticleData } from '../interfaces/IAzureArticleData';
import IAzureFollowerData from '../interfaces/IAzureFollowerData';
import ICombinedArticleStats from '../interfaces/ICombinedArticleStats';
import IFollower from '../interfaces/IFollower';
import IHistoricalArticleData from '../interfaces/IHistoricalArticleData';
import IHistoricalFollowerData from '../interfaces/IHistoricalFollowerData';
import IOverviewStats from '../interfaces/IOverviewStats';
import ISelectOption from '../interfaces/ISelectOption';
import IUser from '../interfaces/IUser';
import { getAzureArticleData, getAzureFollowerData } from '../lib/azure';
import { getArticles, getFollowers, getUser } from '../lib/devto';
import { getAzureArticleDataDayWeekMonth, getCombinedArticleViewsReactionsComments, getHistorialDiffsForLatestArticles, getHistoricalArticleDataForOverview, getLatestPublishedArticle, getPublishedArticles } from '../lib/utils/articles';
import { getHistoricalFollowerDataForOverview } from '../lib/utils/followers';
import { getOverviewStats } from '../lib/utils/overview';
import { latestAzureArticleDataFirst, sortArticlesWithDiff } from '../lib/utils/sorting';
import { DiffTypes } from '../types';

// Add .fromNow (relative times)
dayjs.extend(relativeTime)

interface IProps {
    azureArticleData: IAzureArticleData[];
    latestArticles: IArticle[];
    azureFollowerData: IAzureFollowerData[];
    latestFollowers: IFollower[];
    user: IUser;
}

const articleSelectOpts: ISelectOption[] = [
    { text: 'Recently published', value: 'published-desc' },
    { text: 'Most views', value: 'views-desc' },
    { text: 'Most reactions', value: 'reactions-desc' },
    { text: 'Most comments', value: 'comments-desc' },
];

const diffSelectionOpts: ISelectOption[] = [
    { text: 'All time', value: '' },
    { text: 'Past day', value: 'day' as DiffTypes },
    { text: 'Past week', value: 'week' as DiffTypes },
    { text: 'Past month', value: 'month' as DiffTypes },
];

const IndexPage = ({ azureArticleData, latestArticles, azureFollowerData, latestFollowers, user }: IProps) => {
    const [articleSortingOrder, setArticleSortingOrder] = useState(articleSelectOpts[0].value);
    const [diffSortingOrder, setDiffSortingOrder] = useState(diffSelectionOpts[0].value);


    const publishedArticles = getPublishedArticles(latestArticles);

    const latestArticle = getLatestPublishedArticle(publishedArticles);

    const azureArticleDataByDate: IDatedAzureArticleData = getAzureArticleDataDayWeekMonth(azureArticleData);

    // Add the day, week, month diffs into the latestArticles
    const latestArticlesWithDiffs: IArticleWithDiffs[] = getHistorialDiffsForLatestArticles(publishedArticles, azureArticleDataByDate);

    const latestCombinedArticleStats: ICombinedArticleStats = getCombinedArticleViewsReactionsComments(latestArticles);

    const historicCombinedArticleData: IHistoricalArticleData = getHistoricalArticleDataForOverview(azureArticleData, latestArticles);
    const historicCombinedFollowerData: IHistoricalFollowerData = getHistoricalFollowerDataForOverview(azureFollowerData, latestFollowers);

    const overviewStats: IOverviewStats[] = getOverviewStats(
        latestArticle, latestCombinedArticleStats, historicCombinedArticleData, historicCombinedFollowerData, latestFollowers.length
    );

    const sortedArticles: IArticleWithDiffs[] = sortArticlesWithDiff(latestArticlesWithDiffs, articleSortingOrder, diffSortingOrder as DiffTypes | '');
    return (
        <Layout title="Analytics Dashboard" user={user}>
            <div className="pb-4 px-2 lg:px-4">
                <h1 className="text-2xl md:text-3xl my-2 lg:my-4 font-bold leading-normal md:leading-normal">Dashboard</h1>
                <StatGrid stats={overviewStats} />
            </div>
            <div className="grid md:grid-cols-5 md:p-4 gap-4">
                <SideNav active="posts" numArticles={latestArticles.length} />
                <div className="col-span-1 md:col-span-4">
                    <div className="flex flex-row justify-between mb-3 items-center leading-loose">
                        <h2 className="hidden md:block text-xl font-bold">Posts</h2>
                        <div className="flex flex-row md:flex-row-reverse">
                            <Select options={articleSelectOpts} onChange={(e) => setArticleSortingOrder(e.target.value)}/>
                            {articleSortingOrder !== articleSelectOpts[0].value && (
                                <Select options={diffSelectionOpts} onChange={(e) => setDiffSortingOrder(e.target.value)}/>
                            )}
                        </div>
                    </div>
                    <div className="bg-white shadow-card rounded-devto w-full">
                        {sortedArticles.map(({
                            title, url, publishedAt, publicReactionsCount, commentsCount, pageViewsCount, diffs,
                        }: IArticleWithDiffs, i: number) => (
                            <ArticleCard
                                title={title}
                                url={url}
                                publishedAt={publishedAt}
                                publicReactionsCount={publicReactionsCount}
                                commentsCount={commentsCount}
                                pageViewsCount={pageViewsCount}
                                diffs={diffs}
                                border={i !== 0}
                            />
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
            azureArticleData: azureArticleData.sort(latestAzureArticleDataFirst),
            latestArticles,
            azureFollowerData,
            latestFollowers,
            user,
        },
        // revalidate: 60, // In seconds
    }
}


export default IndexPage
