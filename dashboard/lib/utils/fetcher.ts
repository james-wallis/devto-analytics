import axios, { AxiosResponse } from 'axios'

const fetcher = (url: string): AxiosResponse['data'] => axios.get(url).then((res) => res.data)

export default fetcher
