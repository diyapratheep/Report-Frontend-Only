/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html",
    ],
    theme: {
        extend: {
            colors: {
                'primaryBlue': '#01416d',
                'primaryGreen': '#01bd71',
                'sidebarBg': '#fef7ff',
                'sidebarActiveBg': '#d2ffff',
                'textMuted': '#49454f',
                'borderPurple': '#6750a4',
                'buttonGreen': '#aee2bb',
                'buttonGreenHover': '#9ad3a7',
            },
        },
    },
    plugins: [],
};