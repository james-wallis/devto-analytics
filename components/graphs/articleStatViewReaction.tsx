import dayjs from 'dayjs';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import IGraphArticleData from '../../interfaces/IGraphArticleData';

interface IProps {
    title: string;
    data: IGraphArticleData[];
    reaction?: boolean;
    daily?: boolean;
}

const PageView = ({ data: unfilteredData, reaction = false, daily = false }: IProps) => {
    const pastDayData = unfilteredData.filter(({ fetchedAt }) => dayjs().subtract(1, 'day').subtract(1, 'hour').isBefore(fetchedAt));
    const pastWeekData = unfilteredData.filter(({ fetchedAt }) => (dayjs().subtract(1, 'week').hour(0).isBefore(fetchedAt)) && dayjs(fetchedAt).hour() === 0);

    const data = daily ? pastDayData : pastWeekData;

    for (let i = 1; i < data.length; i++) {
        const item = data[i];
        const prevItem = data[i - 1];
        data[i].viewsDiff = item.views - prevItem.views;
        data[i].reactionsDiff = item.reactions - prevItem.reactions;
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart
                data={data.slice(1)}
                margin={{ top: 5, right: 30, bottom: 5, left: -10 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fetchedAt" tickFormatter={(date: string) => dayjs(date).format(daily ? 'HH' : 'DD MMM')} />
                <YAxis />
                <Tooltip labelFormatter={(date: string) => dayjs(date).format('DD/MM HH:mm')} />
                <Legend />
                <Line type="monotone" dataKey={reaction ? 'reactionsDiff' : 'viewsDiff'} stroke="#3B49DF" />
            </LineChart>
        </ResponsiveContainer>
    )
}

export default PageView;
