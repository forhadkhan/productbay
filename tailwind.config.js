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
        extend: {
            colors: {
                wp: {
                    bg: '#f0f0f1',      // Primary BG
                    card: '#ffffff',    // Secondary BG
                    highlight: '#f0f6fc', // Highlight BG
                    info: '#fcf9e8',    // Info BG
                    btn: {
                        DEFAULT: '#2271b1', // Button BG
                        hover: '#135e96',
                        disabled: '#a7aaad'
                    },
                    text: '#3c434a'     // Standard WP Text
                },
                productbay: {
                    primary: '#3858e9',
                    secondary: '#f5f5f5',
                    success: '#4ab866',
                    error: '#dc2626',
                    warning: '#fbbf24',
                    info: '#93c5fd',
                }
            }
        },
    },
};