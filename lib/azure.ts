import axios, { AxiosResponse } from 'axios'
import dayjs from 'dayjs'
import IAzureArticleData from '../interfaces/IAzureArticleData'
import IAzureFollowerData from '../interfaces/IAzureFollowerData'
import { parseAzureArticleData, parseAzureFollowerData } from './utils/parse'

export const getAzureArticleData = async (): Promise<IAzureArticleData> => {
    const headers = { 'x-functions-key': process.env['AZURE_ARTICLES_CODE'] }
    const params = { date: dayjs().toISOString() }
    const { data }: AxiosResponse = await axios.get(
        'https://jwdevtoanalytics.azurewebsites.net/api/articles',
        {
            headers,
            params,
        }
    )
    const azureArticleData: IAzureArticleData = parseAzureArticleData(data)
    return azureArticleData
}

export const getAzureFollowerData = async (): Promise<IAzureFollowerData> => {
    const headers = { 'x-functions-key': process.env['AZURE_FOLLOWERS_CODE'] }
    const params = { date: dayjs().toISOString() }
    const { data }: AxiosResponse = await axios.get(
        'https://jwdevtoanalytics.azurewebsites.net/api/followers',
        {
            headers,
            params,
        }
    )
    const azureFollowerData: IAzureFollowerData = parseAzureFollowerData(data)
    return azureFollowerData
}
