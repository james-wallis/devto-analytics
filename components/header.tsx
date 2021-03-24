import { FiGithub, FiHelpCircle } from 'react-icons/fi';
import Link from 'next/link';
import IUser from '../interfaces/IUser';

interface IProps {
    user: IUser;
}

const Header = ({ user }: IProps): JSX.Element => (
    <header className="w-screen bg-white h-header shadow-sm">
        <div className="max-w-site m-auto px-2 lg:px-4 h-full flex flex-row items-center justify-between">
            <Link href="/">
                <a className="flex items-center">
                    <img src="/devto-icon.svg" alt="the dev.to logo" className="mr-4 h-full w-auto" />
                    <h1 className="text-lg">Analytics</h1>
                </a>
            </Link>
            <div className="flex items-center">
                <a
                    className="
                        mr-2 hidden md:block rounded-devto text-center py-2 px-4
                        bg-button-primary-bg hover:bg-button-primary-bg-hover
                        text-button-primary-color hover:text-button-primary-color-hover
                        transition-colors font-medium
                    "
                    href="https://dev.to/jameswallis"
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    Read the post
                </a>
                <a
                    href="https://wallis.dev"
                    className="mx-1 p-2 rounded-full hover:bg-ghost-light-hover transition-colors"
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    <FiHelpCircle className="text-2xl text-ghost"/>
                </a>
                <a
                    href="https://github.com/james-wallis/devto-analytics"
                    className="mx-1 p-2 rounded-full hover:bg-ghost-light-hover transition-colors"
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    <FiGithub className="text-2xl text-ghost"/>
                </a>
                <a
                    href={user.websiteUrl || user.devToUrl}
                    className="h-8 w-8 mx-3"
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    <img className="h-full w-full rounded-full" src={user.image} alt={`profile for ${user.username}`} />
                </a>
            </div>
        </div>
    </header>
)

export default Header;
