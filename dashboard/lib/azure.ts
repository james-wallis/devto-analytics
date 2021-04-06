import axios, { AxiosResponse } from 'axios'
import dayjs from 'dayjs'
import IAzureData from '../../common/interfaces/IAzureData'
import IAzureHistoricalData from '../../common/interfaces/IAzureHistoricalData'

export const azureDataRoute = 'https://jwdevtoanalytics.azurewebsites.net/api/data'
export const azureHistoricalDataRoute = 'https://jwdevtoanalytics.azurewebsites.net/api/historical'

export const getAzureData = async (): Promise<IAzureData> => {
    const headers = { 'x-functions-key': process.env['AZURE_CODE'] }
    const params = { date: dayjs().toISOString() }
    const { data }: AxiosResponse = await axios.get(azureDataRoute, {
        headers,
        params,
    })
    return data
}

export const getAzureHistoricalData = async (): Promise<IAzureHistoricalData> => {
    const headers = { 'x-functions-key': process.env['AZURE_CODE'] }
    const { data }: AxiosResponse = await axios.get(azureHistoricalDataRoute, {
        headers,
    })
    return data
}
