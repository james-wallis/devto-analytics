import React, { ReactNode } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Header from './header'
import IUser from '../interfaces/IUser'

interface IProps {
  children?: ReactNode;
  title?: string;
  user: IUser;
}

const Layout = ({ children, title = 'This is the default title', user }: IProps) => (
  <div className="bg-body h-screen w-screen text-body">
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Header user={user} />
    <main className="max-w-site m-auto px-2 lg:px-4">
      {children}
    </main>
  </div>
)

export default Layout
