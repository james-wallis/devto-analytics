import axios, { AxiosResponse } from 'axios'
import IDevToArticle from '../../interfaces/IDevToArticle'
import IDevToFollower from '../../interfaces/IDevToFollower'

const token: string = process.env['DEVTO_TOKEN']
const perPage = 1000

export const getArticles = async (): Promise<IDevToArticle[]> => {
    const params = { per_page: perPage }
    const headers = { 'api-key': token }
    const { data }: AxiosResponse = await axios.get(`https://dev.to/api/articles/me/all`, {
        params,
        headers,
    })
    return data
}

const getPageOfFollowers = async (page: number): Promise<IDevToFollower[]> => {
    const params = { per_page: perPage, page }
    const headers = { 'api-key': token }
    const { data }: AxiosResponse = await axios.get(`https://dev.to/api/followers/users`, {
        params,
        headers,
    })
    return data
}

export const getFollowers = async (): Promise<IDevToFollower[]> => {
    let numReturned = perPage
    let page = 1
    const totalFollowers = []
    while (numReturned === perPage) {
        const followers = await getPageOfFollowers(page)
        totalFollowers.push(...followers)

        numReturned = followers.length
        page++
    }
    return totalFollowers
}
