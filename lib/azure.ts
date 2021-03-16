import axios, { AxiosResponse } from 'axios';
import IAzureArticleData from '../interfaces/IAzureArticleData';
import { parseAzureArticleData } from './utils/parse';

export const getAzureData = async () => {
    const headers = { 'x-functions-key': process.env['AZURE_ARTICLES_CODE'] };
    const params = { since: '2020-03-14T16:00:00.631Z' };
    const { data }: AxiosResponse = await axios.get('https://jwdevtoanalytics.azurewebsites.net/api/articles', { headers, params });
    const azureArticleData: IAzureArticleData[] = data.map(parseAzureArticleData);
    return azureArticleData;
}
