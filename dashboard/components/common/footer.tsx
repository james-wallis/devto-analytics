const Footer = (): JSX.Element => (
    <footer className="mt-10 h-28	bg-footer-bg w-screen bottom-0 px-4 text-center text-sm text-gray-700 flex flex-col justify-center items-center">
        <span>
            Advanced Dev.to Dashboard by
            <a
                href="https://wallis.dev"
                target="_blank"
                rel="noreferrer noopener"
                className="ml-1 text-black font-medium hover:text-button-primary-bg-hover transition-colors"
            >
                James Wallis
            </a>
        </span>
        <span className="mt-2">
            Want more? Checkout my
            <a
                href="https://devto-writing-streak-calculator.wallis.dev/"
                target="_blank"
                rel="noreferrer noopener"
                className="ml-1 text-black font-medium hover:text-button-primary-bg-hover transition-colors"
            >
                Dev.to Writing Streak Calculator
            </a>
        </span>
    </footer>
)

export default Footer
