import axios, { AxiosResponse } from 'axios';
import IAzureArticleData from '../interfaces/IAzureArticleData';
import IAzureFollowerData from '../interfaces/IAzureFollowerData';
import { parseAzureArticleData, parseAzureFollowerData } from './utils/parse';

export const getAzureArticleData = async () => {
    const headers = { 'x-functions-key': process.env['AZURE_ARTICLES_CODE'] };
    const params = { since: '2020-03-14T16:00:00.631Z' };
    const { data }: AxiosResponse = await axios.get('https://jwdevtoanalytics.azurewebsites.net/api/articles', { headers, params });
    const azureArticleData: IAzureArticleData[] = data.map(parseAzureArticleData);
    return azureArticleData;
}

export const getAzureFollowerData = async () => {
    const headers = { 'x-functions-key': process.env['AZURE_FOLLOWERS_CODE'] };
    const params = { since: '2020-03-14T16:00:00.631Z' };
    const { data }: AxiosResponse = await axios.get('https://jwdevtoanalytics.azurewebsites.net/api/followers', { headers, params });
    const azureFollerData: IAzureFollowerData[] = data.map(parseAzureFollowerData);
    return azureFollerData;
}
