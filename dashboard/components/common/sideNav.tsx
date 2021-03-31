import Link from 'next/link'
import { getPageLinks } from '../../lib/navigation'

interface IProps {
    numArticles: number
    active: 'posts' | 'breakdown-graphs' | 'summary-graphs'
}

const SideNav = ({ numArticles, active }: IProps): JSX.Element => (
    <aside>
        <nav className="hidden md:block">
            {getPageLinks(numArticles).map(({ text, href, value, flairValue }) => (
                <Link key={`side-nav-${href}`} href={href}>
                    <a
                        className={`
                            p-3 sm:p-2 flex items-center rounded-devto w-full hover:text-link transition-colors
                            ${active === value ? 'bg-white font-medium' : 'hover:bg-link-gray'}
                        `}
                    >
                        {text}
                        <span
                            className="
                                font-mono text-xs bg-indicator-background p-1 rounded-devto text-center ml-auto
                                text-indicator-text border border-indicator-background
                            "
                        >
                            {flairValue}
                        </span>
                    </a>
                </Link>
            ))}
        </nav>
    </aside>
)

export default SideNav
