import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import { GetServerSideProps } from 'next';
import React, { ReactNode } from 'react';
import { FiChevronsRight } from 'react-icons/fi';

import GraphContainer from '../components/graphs/container';
import Layout from '../components/Layout';
import SideNav from '../components/sideNav';
import IArticle from '../interfaces/IArticle';
import IAzureArticleData from '../interfaces/IAzureArticleData';
import IAzureFollowerData from '../interfaces/IAzureFollowerData';
import IFollower from '../interfaces/IFollower';
import IUser from '../interfaces/IUser';
import { getAzureArticleData, getAzureFollowerData } from '../lib/azure';
import { getArticles, getFollowers, getUser } from '../lib/devto';

// Add .fromNow (relative times)
dayjs.extend(relativeTime)

interface IProps {
    azureArticleData: IAzureArticleData[];
    latestArticles: IArticle[];
    azureFollowerData: IAzureFollowerData[];
    latestFollowers: IFollower[];
    user: IUser;
}

const IndexPage = ({ latestArticles, azureArticleData, azureFollowerData, latestFollowers, user }: IProps): ReactNode => {

    return (
        <Layout title="Analytics Dashboard" user={user}>
            <h1 className="text-2xl md:text-3xl my-2 lg:my-4 px-2 lg:px-4 font-bold leading-normal md:leading-normal flex items-center">
                Dashboard
                <FiChevronsRight className="mx-1" />
                Graphs
            </h1>
            <div className="grid md:grid-cols-5 md:p-4 gap-4">
                <SideNav active="graphs" numArticles={latestArticles.length} />
                <div className="col-span-1 md:col-span-4">
                    <div className="bg-white shadow-card rounded-devto w-full">
                        <GraphContainer
                            azureArticleData={azureArticleData}
                            latestArticles={latestArticles}
                            azureFollowerData={azureFollowerData}
                            latestFollowers={latestFollowers}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    const promises: Promise<IAzureArticleData | IArticle[] | IAzureFollowerData | IFollower[] | IUser>[] = [
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
