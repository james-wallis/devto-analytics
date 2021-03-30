import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { GetServerSideProps } from 'next'
import React, { ReactNode } from 'react'
import { FiChevronsRight } from 'react-icons/fi'

import GraphContainer from '../components/graphs/container'
import Layout from '../components/common/Layout'
import SideNav from '../components/common/sideNav'
import IAzureArticleData from '../../common/interfaces/IAzureArticleData'
import IAzureFollowerData from '../../common/interfaces/IAzureFollowerData'
import IUser from '../interfaces/IUser'
import { getAzureArticleData, getAzureFollowerData } from '../lib/azure'
import { getUser } from '../lib/devto'

// Add .fromNow (relative times)
dayjs.extend(relativeTime)

interface IProps {
    azureArticleData: IAzureArticleData
    azureFollowerData: IAzureFollowerData
    user: IUser
}

const IndexPage = ({ azureArticleData, azureFollowerData, user }: IProps): ReactNode => {
    return (
        <Layout title="Analytics Dashboard" user={user}>
            <h1 className="text-2xl md:text-3xl my-2 lg:my-4 px-2 lg:px-4 font-bold leading-normal md:leading-normal flex items-center">
                Dashboard
                <FiChevronsRight className="mx-1" />
                Graphs
            </h1>
            <div className="grid md:grid-cols-5 md:p-4 gap-4">
                <SideNav active="graphs" numArticles={azureArticleData.articles.length} />
                <div className="col-span-1 md:col-span-4">
                    <div className="bg-white shadow-card rounded-devto w-full">
                        <GraphContainer
                            azureArticleData={azureArticleData}
                            azureFollowerData={azureFollowerData}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
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
        // revalidate: 60, // In seconds
    }
}

export default IndexPage
