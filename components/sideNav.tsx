import Link from 'next/link';

interface IProps {
    numArticles: number;
    active: 'posts' | 'graphs';
}

const SideNav = ({ numArticles, active }: IProps) => (
    <aside>
        <nav className="hidden md:block">
            {[
                { text: 'Posts', type: 'posts', href: '/', value: numArticles },
                { text: 'Graphs', type: 'graphs', href: '/graphs', value: 4 },
            ].map(({ text, type, href, value }) => (
                <Link key={`side-nav-${href}`} href={href}>
                    <a
                        className={`
                            p-3 sm:p-2 flex items-center rounded-devto w-full hover:text-link transition-colors
                            ${active === type ? 'bg-white font-medium' : 'hover:bg-link-gray'}
                        `}
                    >
                        {text}
                        <span
                            className="
                                font-mono text-xs bg-indicator-background p-1 rounded-devto text-center ml-auto
                                text-indicator-text border border-indicator-background
                            "
                        >
                            {value}
                        </span>
                    </a>
                </Link>
            ))}
        </nav>
    </aside>
)

export default SideNav;