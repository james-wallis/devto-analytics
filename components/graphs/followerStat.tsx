import dayjs from 'dayjs'
import {
    CartesianGrid,
    Legend,
    BarChart,
    Bar,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import IFollower from '../../interfaces/IFollower'
import IGraphFollowerData from '../../interfaces/IGraphFollowerData'

interface IProps {
    data: IGraphFollowerData[]
    latestFollowers: IFollower[]
}

const FollowersStat = ({ data: unfilteredData, latestFollowers }: IProps): JSX.Element => {
    const data: IGraphFollowerData[] = [
        ...unfilteredData.filter(
            ({ fetchedAt }) =>
                dayjs().subtract(1, 'week').hour(0).isBefore(fetchedAt) &&
                dayjs(fetchedAt).hour() === 23
        ),
        { fetchedAt: dayjs().toISOString(), followersCount: latestFollowers.length },
    ]

    for (let i = 1; i < data.length; i++) {
        const item = data[i]
        const prevItem = data[i - 1]
        data[i].followersDiff = item.followersCount - prevItem.followersCount
    }

    console.log(data)

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="fetchedAt"
                    tickFormatter={(date: string) => dayjs(date).format('DD MMM')}
                />
                <YAxis />
                <Tooltip labelFormatter={(date: string) => dayjs(date).format('DD/MM hha')} />
                <Legend />
                <Bar dataKey="followersDiff" fill="#3B49DF" />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default FollowersStat
