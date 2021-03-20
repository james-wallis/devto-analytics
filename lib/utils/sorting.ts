import dayjs from 'dayjs';
import IAzureArticleData from '../../interfaces/IAzureArticleData';

export const latestArticleFirst = (article1: IAzureArticleData, article2: IAzureArticleData) => (
    dayjs(article1.fetchedAt).isBefore(article2.fetchedAt, 'hour') ? 1 : -1
);
