import { ReactNode } from "react";

interface IProps {
    href: string;
    children: ReactNode;
    className?: string;
}

const ExternalLink = ({ href, children, className }: IProps) => (
    <a
        href={href}
        rel="noreferrer noopener"
        target="_blank"
        className={className}
    >
        {children}
    </a>
)

export default ExternalLink;
