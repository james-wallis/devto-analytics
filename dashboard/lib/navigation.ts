import { NextRouter } from 'next/router'
import IPageLink from '../interfaces/IPageLink'

export const getPageLinks = (numArticles: number): IPageLink[] => {
    return [
        { text: 'Posts', value: 'posts', href: '/', flairValue: numArticles },
        {
            text: 'Breakdowns graphs',
            value: 'breakdown-graphs',
            href: '/graphs/breakdown',
            flairValue: 10,
        },
        // {
        //     text: 'Summary graphs',
        //     value: 'summary-graphs',
        //     href: '/graphs/summary',
        //     flairValue: 4,
        // },
    ]
}

export const changePage = (value: string, links: IPageLink[], router: NextRouter): void => {
    const link = links.find((link) => link.value === value)
    if (link) {
        router.push(link.href)
    }
}
