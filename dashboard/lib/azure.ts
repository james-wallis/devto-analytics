import axios, { AxiosResponse } from 'axios'
import dayjs from 'dayjs'
import IAzureArticleData from '../../common/interfaces/IAzureArticleData'
import IAzureFollowerData from '../../common/interfaces/IAzureFollowerData'
import IAzureHistoricalArticleData from '../../common/interfaces/IAzureHistoricalArticleData'

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
    return data
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
    return data
}

export const getAzureHistoricalArticleData = async (): Promise<IAzureHistoricalArticleData> => {
    const headers = { 'x-functions-key': process.env['AZURE_HISTORICAL_ARTICLES_CODE'] }
    const { data }: AxiosResponse = await axios.get(
        'https://jwdevtoanalytics.azurewebsites.net/api/historicalArticles',
        {
            headers,
        }
    )
    return data
}
