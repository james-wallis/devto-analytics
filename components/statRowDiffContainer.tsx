import IArticleRowStat from '../interfaces/IArticleRowStat';
import StatRow from './statRow';

interface IProps {
    text: string;
    stats: IArticleRowStat[];
    position?: 'left' | 'center' | 'right';
}

const getPosition = (position: 'left' | 'center' | 'right'): string => {
    switch (position) {
        case 'left':
            return 'items-start';
        case 'center':
            return 'items-center';
        case 'right':
            return 'items-end';
        default:
            return 'items-start';
    }
}

const StatRowDiffContainer = ({ text, stats, position = 'left' }: IProps): JSX.Element => (
    <div
        key={`stat-row-container-${text}`}
        className={`flex flex-col md:flex-row ${getPosition(position)} md:items-center md:justify-start md:mr-4`}
    >
        <p className="font-medium md:mr-1">{text}<span className="hidden md:inline">:</span></p>
        <div className="flex flex-row text-xs items-center">
            <StatRow stats={stats} small keyPrefix={text} />
        </div>
    </div>
)

export default StatRowDiffContainer;
