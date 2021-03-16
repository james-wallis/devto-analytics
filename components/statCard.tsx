import IOverviewStat from "../interfaces/IOverviewStat";

interface IProps {
    stat: IOverviewStat;
}

const StatCard = ({ stat: { name, value } }: IProps) => (
    <div className="p-3 md:p-6 bg-card-secondary-bg text-card-secondary-color flex flex-col shadow-sm rounded-md">
        <strong className="text-2xl md:text-3xl leading-tight font-bold">{value.toLocaleString()}</strong>
        <span className="text-card-tertiary-color">{name}</span>
    </div>
)

export default StatCard;
