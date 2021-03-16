import dayjs from 'dayjs';
import React from 'react';
import Layout from '../components/Layout';
import StatGrid from '../components/statGrid';
import IFollower from '../interfaces/IFollower';
import IOverviewStat from '../interfaces/IOverviewStat';
import IUser from '../interfaces/IUser';
import { getAzureData } from '../lib/azure';
import { getArticles, getFollowers, getUser } from '../lib/devto';

interface IProps {
    items: any[];
    latestArticles: any[];
    user: IUser;
    followers: IFollower[];
}

const IndexPage = ({ items, latestArticles, user, followers }: IProps) => {
    const data = [...items, { articles: latestArticles }].map((item) => {
        const views = item.articles.reduce((count: number, article: { page_views_count: number }) => article.page_views_count + count, 0);
        const reactions = item.articles.reduce((count: number, article: { public_reactions_count: number }) => article.public_reactions_count + count, 0);
        const comments = item.articles.reduce((count: number, article: { comments_count: number }) => article.comments_count + count, 0);

        return {
            name: item.fetchedAt ? dayjs(item.fetchedAt).format('HH:mm') : dayjs().format('HH:mm'),
            views,
            viewsDiff: 0,
            reactions,
            reactionsDiff: 0,
            comments,
        }
    });

    for (let i = 1; i < data.length; i++) {
        const item = data[i];
        const prevItem = data[i - 1];
        data[i].viewsDiff = item.views - prevItem.views;
        data[i].reactionsDiff = item.reactions - prevItem.reactions;
    }

    const mockStats: IOverviewStat[] = [
        { name: 'Total post reactions', value: data[data.length-1].reactions },
        { name: 'Total post views', value: data[data.length-1].views },
        { name: 'Followers', value: followers.length },
        { name: 'Total comments', value: data[data.length-1].comments },
    ]


    return (
        <Layout title="Analytics Dashboard" user={user}>
            <h1 className="text-3xl my-2 lg:my-4 font-bold leading-normal">Dashboard</h1>
            <div>
                <StatGrid stats={mockStats} />
            </div>
            <h2 className="text-2xl my-2 lg:my-4 font-bold leading-normal">Graphs</h2>
        </Layout>
    )
}

export async function getServerSideProps() {
    const azureItems = await getAzureData();
    const latestArticles = await getArticles();
    const followers = await getFollowers();
    const user = await getUser();

    return {
        props: {
            items: azureItems,
            latestArticles,
            followers,
            user,
        },
    }
}


export default IndexPage
