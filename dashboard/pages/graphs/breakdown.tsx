import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { GetStaticProps } from 'next'
import React, { ReactNode } from 'react'
import { FiChevronsRight } from 'react-icons/fi'

import Layout from '../../components/common/Layout'
import SideNav from '../../components/common/sideNav'
import IAzureArticleData from '../../../common/interfaces/IAzureArticleData'
import IUser from '../../interfaces/IUser'
import { getAzureData } from '../../lib/azure'
import { getUser } from '../../lib/devto'
import IArticleWithDiffs from '../../interfaces/IArticleWithDiffs'
import { addDiffsToArticle } from '../../lib/utils/articles'
import DailyViewSplitGraph from '../../components/graphs/dailyViewSplitGraph'
import Select from '../../components/common/select'
import { getPageLinks, changePage } from '../../lib/navigation'
import { useRouter } from 'next/router'

// Add .fromNow (relative times)
dayjs.extend(relativeTime)

interface IProps {
    azureArticleData: IAzureArticleData
    user: IUser
}

const BreakdownGraphPage = ({ azureArticleData, user }: IProps): ReactNode => {
    const router = useRouter()
    const pageLinks = getPageLinks(azureArticleData.articles.length)
    const articlesWithDiffs: IArticleWithDiffs[] = addDiffsToArticle(azureArticleData.articles)
    return (
        <Layout title="Analytics Dashboard" user={user}>
            <div className="px-2 lg:px-4">
                <h1 className="text-2xl md:text-3xl my-2 lg:my-4 font-bold leading-normal md:leading-normal flex items-center">
                    Dashboard
                    <FiChevronsRight className="mx-1" />
                    Graphs
                </h1>
                <Select
                    options={pageLinks}
                    className="md:hidden w-full"
                    onChange={(e) => changePage(e.target.value, pageLinks, router)}
                    selected="breakdown-graphs"
                />
            </div>
            <div className="grid md:grid-cols-5 md:p-4">
                <SideNav active="breakdown-graphs" numArticles={azureArticleData.articles.length} />
                <div className="col-span-1 md:col-span-4 w-full">
                    <DailyViewSplitGraph articlesWithDiffs={articlesWithDiffs} />
                </div>
            </div>
        </Layout>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const [azureData, user] = await Promise.all([getAzureData(), getUser()])

    return {
        props: {
            azureArticleData: azureData.articles,
            user,
        },
        revalidate: 60, // In seconds
    }
}

export default BreakdownGraphPage
