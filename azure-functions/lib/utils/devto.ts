import axios, { AxiosResponse } from "axios";

const token: string = process.env['DEVTO_TOKEN'];

export const getArticles = async () => {
    const params = { per_page: 1000 };
    const headers = { 'api-key': token };
    const { data }: AxiosResponse = await axios.get(`https://dev.to/api/articles/me/all`, { params, headers });
    return data;
};

export const getFollowers = async () => {
    const params = { per_page: 1000 };
    const headers = { 'api-key': token };
    const { data }: AxiosResponse = await axios.get(`https://dev.to/api/followers/users`, { params, headers });
    return data;
};
