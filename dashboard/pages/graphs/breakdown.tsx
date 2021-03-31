import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { GetServerSideProps } from 'next'
import React, { ReactNode } from 'react'
import { FiChevronsRight } from 'react-icons/fi'

import Layout from '../../components/common/Layout'
import SideNav from '../../components/common/sideNav'
import IAzureArticleData from '../../../common/interfaces/IAzureArticleData'
import IUser from '../../interfaces/IUser'
import { getAzureArticleData } from '../../lib/azure'
import { getUser } from '../../lib/devto'
import IArticleWithDiffs from '../../interfaces/IArticleWithDiffs'
import { addDiffsToArticle } from '../../lib/utils/articles'
import DailyViewSplitGraph from '../../components/graphs/dailyViewSplitGraph'

// Add .fromNow (relative times)
dayjs.extend(relativeTime)

interface IProps {
    azureArticleData: IAzureArticleData
    user: IUser
}

const BreakdownGraphPage = ({ azureArticleData, user }: IProps): ReactNode => {
    const articlesWithDiffs: IArticleWithDiffs[] = addDiffsToArticle(azureArticleData.articles)
    return (
        <Layout title="Analytics Dashboard" user={user}>
            <h1 className="text-2xl md:text-3xl my-2 lg:my-4 px-2 lg:px-4 font-bold leading-normal md:leading-normal flex items-center">
                Dashboard
                <FiChevronsRight className="mx-1" />
                Graphs
            </h1>
            <div className="grid md:grid-cols-5 md:p-4 gap-4">
                <SideNav active="breakdown-graphs" numArticles={azureArticleData.articles.length} />
                <div className="col-span-1 md:col-span-4">
                    <div className="w-full">
                        <DailyViewSplitGraph articlesWithDiffs={articlesWithDiffs} />
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    const promises: Promise<IAzureArticleData | IUser>[] = [getAzureArticleData(), getUser()]

    const [azureArticleData, user] = await Promise.all(promises)

    return {
        props: {
            azureArticleData,
            user,
        },
        // revalidate: 60, // In seconds
    }
}

export default BreakdownGraphPage
