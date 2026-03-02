import { defineConfig } from 'vitepress'

export default defineConfig({
    title: 'ProductBay',
    description: 'Official documentation for ProductBay — the modern WooCommerce product table plugin.',
    lang: 'en-US',
    base: '/productbay/',

    head: [
        ['link', { rel: 'icon', href: '/productbay/icon.svg', type: 'image/svg+xml' }],
        ['meta', { name: 'theme-color', content: '#2271b1' }],
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:title', content: 'ProductBay Documentation' }],
        ['meta', { property: 'og:description', content: 'Official documentation for ProductBay — the modern WooCommerce product table plugin.' }],
        ['meta', { property: 'og:image', content: '/productbay/logo.svg' }],
    ],

    themeConfig: {
        logo: '/icon.svg',
        siteTitle: false,

        nav: [
            {
                text: 'v1.0.0',
                items: [
                    {
                        text: 'v1.0.0 (Latest)',
                        link: '/guide/introduction',
                        activeMatch: '^/(?!v\\d)'
                    },
                    {
                        text: 'Changelog',
                        link: '/changelog'
                    }
                ]
            },
            { text: 'Guide', link: '/guide/introduction' },
            { text: 'Features', link: '/features/table-dashboard' },
            { text: 'Developer', link: '/developer/architecture' },
            {
                text: 'More',
                items: [
                    { text: 'FAQ', link: '/faq' },
                    { text: 'Changelog', link: '/changelog' },
                    { text: 'Request a Feature', link: '/feature-request' },
                ]
            }
        ],

        sidebar: {
            '/guide/': [
                {
                    text: 'Getting Started',
                    items: [
                        { text: 'Introduction', link: '/guide/introduction' },
                        { text: 'Requirements', link: '/guide/requirements' },
                        { text: 'Installation', link: '/guide/installation' },
                        { text: 'Quick Start', link: '/guide/getting-started' },
                    ]
                },
                {
                    text: 'Advanced',
                    items: [
                        { text: 'Uninstallation', link: '/guide/uninstallation' },
                    ]
                }
            ],
            '/features/': [
                {
                    text: 'Core Features',
                    items: [
                        { text: 'Table Dashboard', link: '/features/table-dashboard' },
                        { text: 'Creation Wizard', link: '/features/creation-wizard' },
                        { text: 'Shortcodes', link: '/features/shortcodes' },
                    ]
                },
                {
                    text: 'Table Configuration',
                    items: [
                        { text: 'Product Sources', link: '/features/product-sources' },
                        { text: 'Column Editor', link: '/features/column-editor' },
                        { text: 'Design Customization', link: '/features/design-customization' },
                    ]
                },
                {
                    text: 'Frontend',
                    items: [
                        { text: 'WooCommerce Integration', link: '/features/woocommerce' },
                        { text: 'Search & Filters', link: '/features/search-and-filters' },
                    ]
                }
            ],
            '/settings/': [
                {
                    text: 'Settings',
                    items: [
                        { text: 'Global Settings', link: '/settings/global-settings' },
                    ]
                }
            ],
            '/developer/': [
                {
                    text: 'Developer Reference',
                    items: [
                        { text: 'Architecture', link: '/developer/architecture' },
                        { text: 'REST API', link: '/developer/rest-api' },
                        { text: 'Contributing', link: '/developer/contributing' },
                    ]
                }
            ],
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/forhadkhan/productbay' }
        ],

        footer: {
            message: 'Released under the GPL-2.0+ License.',
            copyright: 'Copyright © 2026 <a href="https://wpanchorbay.com" target="_blank">WPAnchorBay</a>'
        },

        search: {
            provider: 'local',
            options: {
                detailedView: true,
            }
        },

        editLink: {
            pattern: 'https://github.com/forhadkhan/productbay/edit/main/docs/:path',
            text: 'Edit this page on GitHub'
        },

        lastUpdated: {
            text: 'Last updated',
        },
    },

    lastUpdated: true,
})
