import dayjs from 'dayjs';
import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import IGraphArticleData from '../../interfaces/IGraphArticleData';
import { IViewIncreaseGraph } from '../../interfaces/IGraphs';

interface IProps {
    title: string;
    data: IGraphArticleData[];
    reaction?: boolean;
    daily?: boolean;
}

const PageViewReaction = ({ data: unfilteredData, reaction = false, daily = false }: IProps) => {
    const data = daily
        ? unfilteredData.filter(({ fetchedAt }) => dayjs().subtract(1, 'day').subtract(1, 'hour').isBefore(fetchedAt))
        : unfilteredData.filter(({ fetchedAt }) => (dayjs().subtract(1, 'week').hour(0).isBefore(fetchedAt)) && dayjs(fetchedAt).hour() === 0);

    const graphData: IViewIncreaseGraph[] = data.slice(1).map(({ fetchedAt, reactions, views }, i: number):IViewIncreaseGraph => {
        const prevItem = data[i]; // Using slice means that i will be the previous element in data
        const increase = reaction ? reactions - prevItem.reactions : views - prevItem.views;
        return {
            date: fetchedAt,
            increase,
        }
    });

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart height={300} width={600}
                data={graphData}
                margin={{ top: 5, right: 30, bottom: 5, left: -10 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(date: string) => dayjs(date).format(daily ? 'H' : 'DD MMM')} />
                <YAxis />
                <Tooltip labelFormatter={(date: string) => dayjs(date).format('DD/MM HH:mm')} />
                <Legend />
                <Line type="monotone" dataKey="increase" stroke="#3B49DF" />
            </LineChart>
        </ResponsiveContainer>
    )
}

export default PageViewReaction;
