import IOverviewStats from '../../interfaces/IOverviewStats'
import StatCard from './overviewCard'

interface IProps {
    stats: IOverviewStats[]
}

const OverviewGrid = ({ stats }: IProps): JSX.Element => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-2 md:mt-0">
        {stats.map(({ title, subtitle, headlineValue, stats }: IOverviewStats) => (
            <StatCard
                key={title}
                title={title}
                subtitle={subtitle}
                headlineValue={headlineValue}
                stats={stats}
            />
        ))}
    </div>
)

export default OverviewGrid
