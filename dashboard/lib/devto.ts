import axios, { AxiosResponse } from 'axios'
import IUser from '../interfaces/IUser'

export const getUser = async (): Promise<IUser> => {
    const headers = { 'api-key': process.env['DEVTO_APIKEY'] }
    const { data }: AxiosResponse = await axios.get(`https://dev.to/api/users/me`, { headers })
    const user: IUser = {
        username: data.username,
        name: data.name,
        image: data.profile_image,
        websiteUrl: data.website_url || '',
        devToUrl: `https://dev.to/${data.username}`,
    }
    return user
}
