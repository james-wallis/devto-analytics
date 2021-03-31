import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { GetServerSideProps } from 'next'
import React, { ReactNode } from 'react'
import { FiChevronsRight } from 'react-icons/fi'

import Layout from '../../components/common/Layout'
import SideNav from '../../components/common/sideNav'
import IUser from '../../interfaces/IUser'
import { getAzureHistoricalArticleData } from '../../lib/azure'
import { getUser } from '../../lib/devto'
import IAzureHistoricalArticleData from '../../../common/interfaces/IAzureHistoricalArticleData'
import SummaryChart from '../../components/graphs/summaryChart'

// Add .fromNow (relative times)
dayjs.extend(relativeTime)

interface IProps {
    azureHistoricalArticleData: IAzureHistoricalArticleData
    user: IUser
}

const SummaryGraphPage = ({ azureHistoricalArticleData, user }: IProps): ReactNode => {
    const totalPosts =
        azureHistoricalArticleData.day[azureHistoricalArticleData.day.length - 1].totals.articles

    const dayData = azureHistoricalArticleData.week
        .slice(1)
        .map(({ fetchedAt, totals }, i: number) => {
            return {
                name: dayjs(fetchedAt).format('DD/MM/YYYY'),
                value: totals.pageViews - azureHistoricalArticleData.week[i].totals.pageViews,
            }
        })
    return (
        <Layout title="Analytics Dashboard" user={user}>
            <h1 className="text-2xl md:text-3xl my-2 lg:my-4 px-2 lg:px-4 font-bold leading-normal md:leading-normal flex items-center">
                Dashboard
                <FiChevronsRight className="mx-1" />
                Summary graphs
            </h1>
            <div className="grid md:grid-cols-5 md:p-4 gap-4">
                <SideNav active="summary-graphs" numArticles={totalPosts} />
                <div className="col-span-1 md:col-span-4">
                    <SummaryChart
                        title="Summary"
                        total={40}
                        colorNum={2}
                        tooltipValuePrefix=""
                        data={dayData}
                    />
                </div>
            </div>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    const promises: Promise<IAzureHistoricalArticleData | IUser>[] = [
        getAzureHistoricalArticleData(),
        getUser(),
    ]

    const [azureHistoricalArticleData, user] = await Promise.all(promises)

    return {
        props: {
            azureHistoricalArticleData,
            user,
        },
        // revalidate: 60, // In seconds
    }
}

export default SummaryGraphPage
