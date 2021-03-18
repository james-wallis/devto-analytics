import IOverviewStats from '../interfaces/IOverviewStats';
import StatCard from './statCard';

interface IProps {
    stats: IOverviewStats[];
}

const StatGrid = ({ stats }: IProps) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        {stats.map(({ type, title, subtitle, headlineValue, stats }: IOverviewStats) => (
            <StatCard key={title} type={type} title={title} subtitle={subtitle} headlineValue={headlineValue} stats={stats} />
        ))}
    </div>
)

export default StatGrid;