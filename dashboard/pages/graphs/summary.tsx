import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { GetStaticProps } from 'next'
import React, { ReactNode } from 'react'
import { FiChevronsRight } from 'react-icons/fi'
import useSWR from 'swr'

import Layout from '../../components/common/Layout'
import SideNav from '../../components/common/sideNav'
import IUser from '../../interfaces/IUser'
import { azureHistoricalDataRoute, getAzureHistoricalData } from '../../lib/azure'
import { getUser } from '../../lib/devto'
import { useRouter } from 'next/router'
import Select from '../../components/common/select'
import { getPageLinks, changePage } from '../../lib/navigation'
import SummaryGraphs from '../../components/graphs/summaryGraphs'
import IAzureHistoricalData from '../../../common/interfaces/IAzureHistoricalData'
import fetcher from '../../lib/utils/fetcher'

// Add .fromNow (relative times)
dayjs.extend(relativeTime)

interface IProps {
    azureHistoricalData: IAzureHistoricalData
    user: IUser
}

const SummaryGraphPage = ({ azureHistoricalData, user }: IProps): ReactNode => {
    const { data } = useSWR<IAzureHistoricalData, Error>(azureHistoricalDataRoute, fetcher)

    const azureHistoricalArticleData = data ? data.articles : azureHistoricalData.articles
    const azureHistoricalFollowerData = data ? data.followers : azureHistoricalData.followers

    const totalPosts =
        azureHistoricalArticleData.day[azureHistoricalArticleData.day.length - 1].totals.articles

    const router = useRouter()
    const pageLinks = getPageLinks(totalPosts)

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
                    selected="summary-graphs"
                />
            </div>
            <div className="grid md:grid-cols-5 md:p-4">
                <SideNav active="summary-graphs" numArticles={totalPosts} />
                <div className="col-span-1 md:col-span-4 flex flex-col w-screen md:w-full">
                    <SummaryGraphs
                        azureHistoricalArticleData={azureHistoricalArticleData}
                        azureHistoricalFollowerData={azureHistoricalFollowerData}
                    />
                </div>
            </div>
        </Layout>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const [azureHistoricalData, user] = await Promise.all([getAzureHistoricalData(), getUser()])

    return {
        props: {
            azureHistoricalData,
            user,
        },
        revalidate: 60, // In seconds
    }
}

export default SummaryGraphPage
