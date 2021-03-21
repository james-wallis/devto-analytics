import { IconType } from 'react-icons';
import { FiEye, FiHeart, FiMessageCircle } from 'react-icons/fi';
import IArticleRowStat from '../interfaces/IArticleRowStat';

interface IProps {
    stats: IArticleRowStat[]
    small?: boolean;
    keyPrefix: string;
    position?: 'left' | 'center' | 'right';
}

const getIcon = (type: 'reaction' | 'comment' | 'view'): IconType => {
    switch (type) {
        case 'reaction':
            return FiHeart;
        case 'comment':
            return FiMessageCircle;
        case 'view':
            return FiEye;
    }
}

const StatRow = ({ stats, small = false, keyPrefix }: IProps) => (
    <>
        {stats.map(({ value, type }, i: number) => {
            const Icon = getIcon(type);
            const ml = small ? 'ml-1' : 'ml-2';
            return (
                <span
                    key={`${keyPrefix}-stat-row-${type}`}
                    className={`flex items-center p-1 ${i !== 0 ? ml : ''} ${small ? 'text-xs' : 'p-1 text-sm'}`}
                >
                    <Icon className={`${small ? 'mr-1 text-sm' : 'mr-2 text-lg'}`}/>
                    {value}
                </span>
            )
        })}
    </>
)

export default StatRow;
