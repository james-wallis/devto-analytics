import dayjs from 'dayjs'
import StatRow from './statRow'
import IArticleRowStat from '../../interfaces/IArticleRowStat'
import ExternalLink from '../common/externalLink'
import StatRowDiffContainer from './statRowDiffContainer'
import IArticleWithDiffs from '../../interfaces/IArticleWithDiffs'

interface IProps {
    title: string
    url: string
    publishedAt: string
    reactionsCount: number
    commentsCount: number
    pageViewsCount: number
    diffs: IArticleWithDiffs['diffs']
    border: boolean
}

const ArticleCard = ({
    title,
    url,
    publishedAt,
    reactionsCount,
    commentsCount,
    pageViewsCount,
    diffs,
    border,
}: IProps): JSX.Element => {
    const mainStats: IArticleRowStat[] = [
        { value: reactionsCount, type: 'reaction' },
        { value: commentsCount, type: 'comment' },
        { value: pageViewsCount, type: 'view' },
    ]

    const diffsAsArr = [diffs.day, diffs.week, diffs.month]
    const [
        dayIncreaseStats,
        weekIncreaseStats,
        monthIncreaseStats,
    ]: IArticleRowStat[][] = diffsAsArr.map(({ reactions, pageViews }): IArticleRowStat[] => [
        { value: reactions, type: 'reaction' },
        { value: pageViews, type: 'view' },
    ])
    return (
        <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-2 items-center p-4 ${
                border ? 'border-t border-base-border' : ''
            }`}
        >
            <div className="col-span-2">
                <h3 className="flex items-center text-link font-bold text-devto-h3">
                    <ExternalLink href={url}>{title}</ExternalLink>
                </h3>
                <p className="text-sm text-card-tertiary-color">
                    <strong className="font-medium mr-1">Published:</strong>
                    <time dateTime={publishedAt}>{dayjs(publishedAt).format('D MMM')}</time>
                    <span className="ml-1">({dayjs(publishedAt).fromNow()})</span>
                </p>
            </div>
            <div className="flex flex-nowrap whitespace-nowrap text-sm text-card-tertiary-color order-last md:order-none">
                <StatRow stats={mainStats} keyPrefix="main-stats" />
            </div>
            <div className="justify-self-end flex order-last md:order-none">
                {['Manage', 'Edit'].map((str: string) => (
                    <ExternalLink
                        key={`manage-edit-${str}`}
                        href={`${url}/${str.toLowerCase()}`}
                        className="px-3 py-1 rounded-devto text-sm text-ghost-dark"
                    >
                        {str}
                    </ExternalLink>
                ))}
            </div>
            <div className="col-span-full flex justify-between md:justify-start ml-1 mr-3 md:mx-0 text-card-tertiary-color text-xs">
                {[
                    { text: '24 hours', stats: dayIncreaseStats, position: 'left' },
                    { text: '7 days', stats: weekIncreaseStats, position: 'center' },
                    { text: '30 days', stats: monthIncreaseStats, position: 'right' },
                ].map(({ text, stats, position }) => (
                    <StatRowDiffContainer
                        key={`stat-container-${text}`}
                        text={text}
                        stats={stats}
                        position={position as 'left' | 'center' | 'right'}
                    />
                ))}
            </div>
        </div>
    )
}

export default ArticleCard
