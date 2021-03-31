import React from 'react'
import IArticleWithDiffs from '../../interfaces/IArticleWithDiffs'
import { DiffTypes } from '../../types'
import BreakdownChart from './breakdownChart'

interface IProps {
    articlesWithDiffs: IArticleWithDiffs[]
}

const getData = (
    articles: IArticleWithDiffs[],
    diff: DiffTypes | 'allTime',
    type: 'pageViews' | 'comments' | 'reactions'
): { data: { name: string; value: number }[]; total: number } => {
    if (diff === 'allTime') {
        const allTimeData: { name: string; value: number }[] = articles
            .map((article) => ({
                name: article.title,
                value: article[type].current,
            }))
            .sort((a, b) => (a.value > b.value ? 1 : -1))
        const allTimeTotal = allTimeData.reduce((count: number, { value }) => count + value, 0)
        return {
            data: allTimeData,
            total: allTimeTotal,
        }
    }
    const filteredArticles: IArticleWithDiffs[] = articles.filter(
        ({ diffs }) => diffs[diff][type] > 0
    )
    const data: { name: string; value: number }[] = filteredArticles
        .map(({ title, diffs }) => ({
            name: title,
            value: diffs[diff][type],
        }))
        .sort((a, b) => (a.value > b.value ? 1 : -1))
    const total = data.reduce((count: number, { value }) => count + value, 0)
    return {
        data,
        total,
    }
}

const DailyViewSplitGraph = ({ articlesWithDiffs }: IProps): JSX.Element => {
    const sections = [
        {
            heading: 'Page Views',
            charts: [
                {
                    title: 'Last 24 hours',
                    ...getData(articlesWithDiffs, 'day', 'pageViews'),
                },
                {
                    title: 'Last 7 days',
                    ...getData(articlesWithDiffs, 'week', 'pageViews'),
                },
                {
                    title: 'Last 30 days',
                    ...getData(articlesWithDiffs, 'month', 'pageViews'),
                },
                {
                    title: 'All time',
                    ...getData(articlesWithDiffs, 'allTime', 'pageViews'),
                },
            ],
        },
        {
            heading: 'Reactions',
            charts: [
                {
                    title: 'Last 24 hours',
                    ...getData(articlesWithDiffs, 'day', 'reactions'),
                },
                {
                    title: 'Last 7 days',
                    ...getData(articlesWithDiffs, 'week', 'reactions'),
                },
                {
                    title: 'Last 30 days',
                    ...getData(articlesWithDiffs, 'month', 'reactions'),
                },
                {
                    title: 'All time',
                    ...getData(articlesWithDiffs, 'allTime', 'reactions'),
                },
            ],
        },
        {
            heading: 'Comments',
            charts: [
                {
                    title: 'Last 30 days',
                    ...getData(articlesWithDiffs, 'month', 'comments'),
                },
                {
                    title: 'All time',
                    ...getData(articlesWithDiffs, 'allTime', 'comments'),
                },
            ],
        },
    ]

    return (
        <>
            {sections.map(({ heading, charts }) => (
                <div key={`daily-view-split-graph-${heading}`} className="w-full p-2 md:p-4">
                    <h3 className="font-bold text-devto-h3">{heading}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 w-full text-center py-2">
                        {charts.map(({ title, total, data }, i: number) => (
                            <BreakdownChart
                                key={`${heading}-${title}`}
                                title={title}
                                total={total}
                                data={data}
                                colorNum={i + 1}
                                tooltipValuePrefix={heading}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </>
    )
}

export default DailyViewSplitGraph
