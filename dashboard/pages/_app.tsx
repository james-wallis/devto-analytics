import App, { AppContext, AppProps } from 'next/app'
import IAzureArticleData from '../../common/interfaces/IAzureArticleData'
import IAzureFollowerData from '../../common/interfaces/IAzureFollowerData'
import IUser from '../interfaces/IUser'
import { getAzureArticleData, getAzureFollowerData } from '../lib/azure'
import { getUser } from '../lib/devto'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return <Component {...pageProps} />
}

MyApp.getInitialProps = async (context: AppContext) => {
    const appProps = await App.getInitialProps(context)
    const promises: Promise<IAzureArticleData | IAzureFollowerData | IUser>[] = [
        getAzureArticleData(),
        getAzureFollowerData(),
        getUser(),
    ]

    const [azureArticleData, azureFollowerData, user] = await Promise.all(promises)

    return { pageProps: { ...appProps.pageProps, azureArticleData, azureFollowerData, user } }
}

export default MyApp
