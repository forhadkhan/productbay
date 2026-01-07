/** @type {import('tailwindcss').Config} */
module.exports = {
    // This scopes all Tailwind utilities to our plugin wrapper
    important: '#productbay-root',

    content: [
        './**/*.php',
        './src/**/*.js',
        './src/**/*.ts',
        './src/**/*.jsx',
        './src/**/*.tsx',
    ],

    corePlugins: {
        // CRITICAL: Disable preflight so we don't break the WP Admin or Theme styles
        preflight: false,
    },
    theme: {
        extend: {},
    },
};