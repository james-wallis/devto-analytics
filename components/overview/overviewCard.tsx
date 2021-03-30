import IOverviewStats from '../../interfaces/IOverviewStats'

const OverviewCard = ({ title, subtitle, headlineValue, stats }: IOverviewStats): JSX.Element => {
    return (
        <div className="p-3 md:p-6 bg-card-secondary-bg text-card-secondary-color flex flex-col shadow-card rounded-devto">
            <strong className="text-2xl md:text-3xl leading-tight md:leading-tight font-bold">
                {headlineValue.toLocaleString()}
            </strong>
            {subtitle && (
                <span className="mt-1 text-xs md:text-sm text-card-tertiary-color">{subtitle}</span>
            )}
            <span className="text-card-tertiary-color">{title}</span>
            <div className="text-sm text-card-tertiary-color mt-1 md:mt-2 flex flex-row">
                {stats &&
                    stats.map(({ value, text, small = false }) => (
                        <div key={`${text}-${value}`} className="w-1/2">
                            <strong
                                className={`text-card-secondary-color font-semibold block overflow-hidden overflow-ellipsis ${
                                    small
                                        ? 'text-sm md:text-base leading-7'
                                        : 'text-base md:text-xl'
                                }`}
                            >
                                {typeof value === 'number' ? `+${value.toLocaleString()}` : value}
                            </strong>
                            <span className="text-xs md:text-sm">{text}</span>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default OverviewCard
