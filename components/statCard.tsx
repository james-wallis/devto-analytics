import IOverviewStats from '../interfaces/IOverviewStats';
import IStat from '../interfaces/IStat';

const Stat = ({ value, text, small = false }: { value: number | string, text: string, small?: boolean }) => (
    <div className="w-1/2">
        <strong className={`text-card-secondary-color font-semibold block overflow-hidden overflow-ellipsis ${small ? 'text-sm md:text-base leading-7' : 'text-base md:text-xl'}`}>
            {typeof value === 'number' ? `+${value.toLocaleString()}` : value}
        </strong>
        <span className="text-xs md:text-sm">{text}</span>
    </div>
)

const StatCard = ({ type, title, subtitle, headlineValue, stats }: IOverviewStats) => {
    const isList = type === 'list';
    return (
        <div className="p-3 md:p-6 bg-card-secondary-bg text-card-secondary-color flex flex-col shadow-card rounded-devto">
            <strong className={`${isList ? 'text-base md:text-xl' : 'text-2xl md:text-3xl'} leading-tight md:leading-tight font-bold`}>{isList ? title : headlineValue.toLocaleString()}</strong>
            {subtitle && <span className="mt-1 text-xs md:text-sm text-card-tertiary-color">{subtitle}</span>}
            {isList ? (
                <div className="mt-2 w-full grid grid-rows-1 gap-1 gap">
                    {stats.map(({ text, value }: IStat) => (
                        <div className="w-full grid gap-2 grid-cols-3 md:grid-cols-4">
                            <span className="text-card-secondary-color font-semibold self-center text-base md:text-lg">{value}</span>
                            <span className="col-span-2 md:col-span-3 text-xs md:text-sm leading-5 max-h-10 overflow-hidden">{text}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <span className="text-card-tertiary-color">{title}</span>
                    <div className="text-sm text-card-tertiary-color mt-1 md:mt-2 flex flex-row">
                        {stats && stats.map(({ value, text, small = false }) => (
                            <Stat key={`${text}-${value}`} value={value} text={text} small={small} />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default StatCard;
