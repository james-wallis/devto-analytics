import IOverviewStat from '../interfaces/IOverviewStat';
import StatCard from './statCard';

interface IProps {
    stats: IOverviewStat[];
}

const StatGrid = ({ stats }: IProps) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        {stats.map((stat) => (
            <StatCard stat={stat} />
        ))}
    </div>
)

export default StatGrid;