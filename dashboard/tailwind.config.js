module.exports = {
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            height: {
                header: '56px',
            },
            maxWidth: {
                site: '1280px',
            },
            backgroundColor: (theme) => ({
                ...theme('colors'),
                body: '#eef0f1',
                card: '#64707d',
            }),
            colors: {
                body: '#08090a',
                'ghost-dark': '#363d44',
                'ghost-light-hover': '#eef0f1',
                'button-primary-bg': '#3b49df',
                'button-primary-bg-hover': '#323ebe',
                'button-primary-color': '#f9fafa',
                'button-primary-color-hover': '#f9fafa',
                'card-secondary-color': '#202428',
                'card-secondary-bg': '#f9fafa',
                'card-tertiary-color': '#64707d',
                'form-background-color': '#f9fafa',
                'form-border-color': '#b5bdc4',
                'form-background-hover': '#3b49df',
                link: '#3b49df',
                'link-gray': 'rgba(8, 9, 10, 0.05)',
                'indicator-text': '#363d44',
                'indicator-background': '#d2d6db',
                'base-border': '#eef0f1',
            },
            boxShadow: {
                card: '0 0 0 1px rgba(8, 9, 10, 0.05)',
                'form-hover': '1px 1px #3b49df',
            },
            borderRadius: {
                devto: '5px',
            },
            fontSize: {
                'devto-h3': '1.17em',
            },
            backgroundImage: (theme) => ({
                'down-arrow': 'url("/down-arrow.svg")',
            }),
            backgroundPosition: {
                select: 'calc(100% - 0.5rem) calc(50% - 1px)',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
