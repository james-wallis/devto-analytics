import axios, { AxiosResponse } from 'axios'
import IDevToArticle from '../../interfaces/IDevToArticle'
import IDevToFollower from '../../interfaces/IDevToFollower'

const token: string = process.env['DEVTO_TOKEN']

export const getArticles = async (): Promise<IDevToArticle[]> => {
    const params = { per_page: 1000 }
    const headers = { 'api-key': token }
    const { data }: AxiosResponse = await axios.get(`https://dev.to/api/articles/me/all`, {
        params,
        headers,
    })
    return data
}

export const getFollowers = async (): Promise<IDevToFollower[]> => {
    const params = { per_page: 1000 }
    const headers = { 'api-key': token }
    const { data }: AxiosResponse = await axios.get(`https://dev.to/api/followers/users`, {
        params,
        headers,
    })
    return data
}
