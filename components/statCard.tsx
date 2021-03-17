import IOverviewStat from "../interfaces/IOverviewStat";

interface IProps {
    stat: IOverviewStat;
}

const Stat = ({ value, desc, larger = false }: { value: number | string, desc: string, larger?: boolean }) => (
    <div className="w-1/2">
        <strong className={`text-card-secondary-color font-semibold block overflow-hidden overflow-ellipsis ${larger ? 'text-xl' : 'text-base leading-7'}`}>
            {typeof value === 'number' ? `+${value.toLocaleString()}` : value}
        </strong>
        <span>{desc}</span>
    </div>
)

const StatCard = ({ stat: { name, value, otherStats, daily, weekly, monthly } }: IProps) => (
    <div className="p-3 md:p-6 bg-card-secondary-bg text-card-secondary-color flex flex-col shadow-card rounded-md">
        <strong className="text-2xl md:text-3xl leading-tight font-bold">{value.toLocaleString()}</strong>
        <span className="text-card-tertiary-color">{name}</span>
        <div className="text-sm text-card-tertiary-color mt-2 flex flex-row">
            {otherStats && otherStats.map(({ value, desc, larger = false }) => (
                <Stat value={value} desc={desc} larger={larger} />
            ))}
            {daily && <Stat value={daily} desc="Last 24 hours" larger />}
            {weekly && <Stat value={weekly} desc="Last 7 days" larger />}
            {monthly && <Stat value={monthly} desc="Last 30 days" larger />}
        </div>
    </div>
)

export default StatCard;
