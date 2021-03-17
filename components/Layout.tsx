import React, { ReactNode } from 'react'
import Head from 'next/head'
import Header from './header'
import IUser from '../interfaces/IUser'

interface IProps {
    children?: ReactNode;
    title?: string;
    user: IUser;
}

const Layout = ({ children, title = 'This is the default title', user }: IProps) => (
    <div className="">
        <Head>
            <title>{title}</title>
            <meta charSet="utf-8" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <Header user={user} />
        <main className="max-w-site m-auto px-2 lg:px-4">
            {children}
        </main>
        <footer className="h-36 flex items-end justify-center mb-6">

        </footer>
    </div>
)

export default Layout
