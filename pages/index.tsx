import axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { ReactNode, useState } from 'react'
import useSWR from 'swr'
import ArticleCard from '../components/articleCard'

import Layout from '../components/Layout'
import Select from '../components/select'
import SideNav from '../components/sideNav'
import StatGrid from '../components/statGrid'
import IArticle, { IArticleWithDiffs } from '../interfaces/IArticle'
import IAzureArticleData from '../interfaces/IAzureArticleData'
import IAzureFollowerData from '../interfaces/IAzureFollowerData'
import ICombinedArticleStats from '../interfaces/ICombinedArticleStats'
import IFollower from '../interfaces/IFollower'
import IHistoricalArticleData from '../interfaces/IHistoricalArticleData'
import IHistoricalFollowerData from '../interfaces/IHistoricalFollowerData'
import IOverviewStats from '../interfaces/IOverviewStats'
import ISelectOption from '../interfaces/ISelectOption'
import IUser from '../interfaces/IUser'
import { getAzureArticleData, getAzureFollowerData } from '../lib/azure'
import { getUser } from '../lib/devto'
import { changePage, getPageLinks } from '../lib/navigation'
import {
    getCombinedArticleViewsReactionsComments,
    getHistorialDiffsForLatestArticles,
    getHistoricalArticleDataForOverview,
    getLatestPublishedArticle,
    getPublishedArticles,
} from '../lib/utils/articles'
import { getHistoricalFollowerDataForOverview } from '../lib/utils/followers'
import { getOverviewStats } from '../lib/utils/overview'
import { sortArticlesWithDiff } from '../lib/utils/sorting'
import { DiffTypes } from '../types'

// Add .fromNow (relative times)
dayjs.extend(relativeTime)

interface IProps {
    azureArticleData: IAzureArticleData
    latestArticles: IArticle[]
    azureFollowerData: IAzureFollowerData
    latestFollowers: IFollower[]
    user: IUser
}

const articleSelectOpts: ISelectOption[] = [
    { text: 'Recently published', value: 'published-desc' },
    { text: 'Most views', value: 'views-desc' },
    { text: 'Most reactions', value: 'reactions-desc' },
    { text: 'Most comments', value: 'comments-desc' },
]

const diffSelectionOpts: ISelectOption[] = [
    { text: 'All time', value: '' },
    { text: 'Past day', value: 'day' as DiffTypes },
    { text: 'Past week', value: 'week' as DiffTypes },
    { text: 'Past month', value: 'month' as DiffTypes },
]

const fetcher = (url: string): Promise<IArticle[] | IFollower[]> =>
    axios.get(url).then((res) => res.data)

const IndexPage = ({ azureArticleData, azureFollowerData, user }: IProps): ReactNode => {
    const { data: articleData } = useSWR('/api/articles', fetcher, {
        initialData: azureArticleData.latest.articles,
        revalidateOnMount: true,
    })
    const latestArticles: IArticle[] = articleData as IArticle[]

    const { data: lastestFollowers } = useSWR('/api/followers', fetcher)
    const latestFollowerCount: number = lastestFollowers
        ? lastestFollowers.length
        : azureFollowerData.latest.count

    const [articleSortingOrder, setArticleSortingOrder] = useState(articleSelectOpts[0].value)
    const [diffSortingOrder, setDiffSortingOrder] = useState(diffSelectionOpts[0].value)

    const publishedArticles = getPublishedArticles(latestArticles)

    const latestArticle = getLatestPublishedArticle(publishedArticles)

    // Add the day, week, month diffs into the latestArticles
    const latestArticlesWithDiffs: IArticleWithDiffs[] = getHistorialDiffsForLatestArticles(
        publishedArticles,
        azureArticleData
    )

    const latestCombinedArticleStats: ICombinedArticleStats = getCombinedArticleViewsReactionsComments(
        latestArticles
    )

    const historicCombinedArticleData: IHistoricalArticleData = getHistoricalArticleDataForOverview(
        azureArticleData,
        latestArticles
    )
    const historicCombinedFollowerData: IHistoricalFollowerData = getHistoricalFollowerDataForOverview(
        azureFollowerData,
        latestFollowerCount
    )

    const overviewStats: IOverviewStats[] = getOverviewStats(
        latestArticle,
        latestCombinedArticleStats,
        historicCombinedArticleData,
        historicCombinedFollowerData,
        latestFollowerCount
    )

    const sortedArticles: IArticleWithDiffs[] = sortArticlesWithDiff(
        latestArticlesWithDiffs,
        articleSortingOrder,
        diffSortingOrder as DiffTypes | ''
    )

    const pageLinks = getPageLinks(publishedArticles.length, 4)
    const router = useRouter()
    return (
        <Layout title="Analytics Dashboard" user={user}>
            <div className="pb-2 md:pb-4 px-2 lg:px-4 grid gap-2 md:gap-4 grid-cols-1">
                <h1 className="text-2xl md:text-3xl mt-2 lg:mt-4 font-bold leading-normal md:leading-normal">
                    Dashboard
                </h1>
                <Select
                    options={pageLinks}
                    className="md:hidden"
                    onChange={(e) => changePage(e.target.value, pageLinks, router)}
                />
                <StatGrid stats={overviewStats} />
            </div>
            <div className="grid md:grid-cols-5 md:p-4 gap-2 md:gap-4">
                <SideNav active="posts" numArticles={latestArticles.length} />
                <div className="col-span-1 md:col-span-4">
                    <div className="flex flex-row justify-between mb-3 items-center leading-loose">
                        <h2 className="hidden md:block text-xl font-bold">Posts</h2>
                        <div className="flex flex-row md:flex-row-reverse">
                            <Select
                                options={articleSelectOpts}
                                className="ml-2 md:ml-4 my-1"
                                onChange={(e) => setArticleSortingOrder(e.target.value)}
                            />
                            {articleSortingOrder !== articleSelectOpts[0].value && (
                                <Select
                                    options={diffSelectionOpts}
                                    className="ml-2 md:ml-4 my-1"
                                    onChange={(e) => setDiffSortingOrder(e.target.value)}
                                />
                            )}
                        </div>
                    </div>
                    <div className="bg-white shadow-card rounded-devto w-full">
                        {sortedArticles.map(
                            (
                                {
                                    title,
                                    url,
                                    publishedAt,
                                    publicReactionsCount,
                                    commentsCount,
                                    pageViewsCount,
                                    diffs,
                                }: IArticleWithDiffs,
                                i: number
                            ) => (
                                <ArticleCard
                                    key={url}
                                    title={title}
                                    url={url}
                                    publishedAt={publishedAt}
                                    publicReactionsCount={publicReactionsCount}
                                    commentsCount={commentsCount}
                                    pageViewsCount={pageViewsCount}
                                    diffs={diffs}
                                    border={i !== 0}
                                />
                            )
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const promises: Promise<IAzureArticleData | IAzureFollowerData | IUser>[] = [
        getAzureArticleData(),
        getAzureFollowerData(),
        getUser(),
    ]

    const [azureArticleData, azureFollowerData, user] = await Promise.all(promises)

    return {
        props: {
            azureArticleData,
            azureFollowerData,
            user,
        },
        revalidate: 60, // In seconds
    }
}

export default IndexPage
