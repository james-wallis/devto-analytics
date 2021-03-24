import { PieChart, Pie, ResponsiveContainer, Tooltip } from 'recharts'
import IArticle from '../../interfaces/IArticle'

interface IProps {
    title: string
    articles: IArticle[]
}

const ArticleStatShare = ({ articles }: IProps): JSX.Element => {
    const articlesSortedByViews = articles.sort((a, b) =>
        a.pageViewsCount >= b.pageViewsCount ? 1 : -1
    )
    const articlesSortedByReactions = articles.sort((a, b) =>
        a.publicReactionsCount >= b.publicReactionsCount ? 1 : -1
    )
    return (
        <div className="flex items-center w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 5, bottom: 5 }}>
                    <Pie
                        data={articlesSortedByReactions}
                        dataKey="publicReactionsCount"
                        nameKey="title"
                        cx="50%"
                        cy="50%"
                        outerRadius="50%"
                        fill="#3B49DF"
                    />
                    <Pie
                        data={articlesSortedByViews}
                        dataKey="pageViewsCount"
                        nameKey="title"
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="100%"
                        fill="#82ca9d"
                    />
                    <Tooltip formatter={(views: string) => `${views}`} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

export default ArticleStatShare
