import { NextRouter } from 'next/router'
import IPageLink from '../interfaces/IPageLink';

export const getPageLinks = (numArticles: number, numGraphs: number): IPageLink[] => {
    return [
        { text: 'Posts', value: 'posts', href: '/', flairValue: numArticles },
        { text: 'Graphs', value: 'graphs', href: '/graphs', flairValue: numGraphs },
    ]
}

export const changePage = (value: string, links: IPageLink[], router: NextRouter) => {
    const link = links.find((link) => link.value === value);
    if (link) {
        router.push(link.href);
    }
}
