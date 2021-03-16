module.exports = {
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            height: {
                header: '56px',
            },
            maxWidth: {
                'site': '1280px',
            },
            backgroundColor: theme => ({
                ...theme('colors'),
                'body': '#eef0f1',
                'card': '#64707d',
            }),
            colors: {
                'body': '#08090a',
                'ghost-dark': '#363d44',
                'ghost-light-hover': '#eef0f1',
                'button-primary-bg': '#3b49df',
                'button-primary-bg-hover': '#323ebe',
                'button-primary-color': '#f9fafa',
                'button-primary-color-hover': '#f9fafa',
                'card-secondary-color': '#202428',
                'card-secondary-bg': '#f9fafa',
                'card-tertiary-color': '#64707d',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}