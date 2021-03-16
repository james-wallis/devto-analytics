import axios, { AxiosResponse } from 'axios';
import IArticle from '../interfaces/IArticle';
import IFollower from '../interfaces/IFollower';
import IUser from '../interfaces/IUser';
import { parseArticle, parseFollower } from './utils/parse';

export const getArticles = async (): Promise<IArticle[]> => {
    const params = { per_page: 1000 };
    const headers = { 'api-key': process.env['DEVTO_APIKEY'] };
    const { data }: AxiosResponse = await axios.get(`https://dev.to/api/articles/me/all`, { params, headers });
    const articles: IArticle[] = data.map(parseArticle);
    return articles;
}

export const getFollowers = async (): Promise<IFollower[]> => {
    const params = { per_page: 1000 };
    const headers = { 'api-key': process.env['DEVTO_APIKEY'] };
    const { data }: AxiosResponse = await axios.get(`https://dev.to/api/followers/users`, { params, headers });
    const followers: IFollower[] = data.map(parseFollower);
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