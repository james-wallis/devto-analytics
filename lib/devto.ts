import axios, { AxiosResponse } from 'axios';
import IFollower from '../interfaces/IFollower';
import IUser from '../interfaces/IUser';

export const getArticles = async () => {
    const params = { per_page: 1000 };
    const headers = { 'api-key': process.env['DEVTO_APIKEY'] };
    const { data }: AxiosResponse = await axios.get(`https://dev.to/api/articles/me/all`, { params, headers });
    return data;
}

export const getFollowers = async () => {
    const params = { per_page: 1000 };
    const headers = { 'api-key': process.env['DEVTO_APIKEY'] };
    const { data }: AxiosResponse = await axios.get(`https://dev.to/api/followers/users`, { params, headers });
    const followers: IFollower[] = data.map((item: any): IFollower => ({ id: item.id, username: item.username }));
    return followers;
}

export const getUser = async (): Promise<IUser> => {
    const headers = { 'api-key': process.env['DEVTO_APIKEY'] };
    const { data }: AxiosResponse = await axios.get(`https://dev.to/api/users/me`, { headers });
    const user: IUser = {
        username: data.username,
        name: data.name,
        image: data.profile_image,
        websiteUrl: data.website_url || '',
        devToUrl: `https://dev.to/${data.username}`,
    }
    return user;
}