import { defineConfig } from 'vitepress';

function getSidebar(base = '', includePro = true) {
	return {
		[`${base}/guide/`]: [
			{
				text: 'Getting Started',
				items: [
					{ text: 'Introduction', link: `${base}/guide/introduction` },
					{ text: 'Requirements', link: `${base}/guide/requirements` },
					{ text: 'Installation', link: `${base}/guide/installation` },
					{ text: 'Quick Start', link: `${base}/guide/getting-started` },
					...(includePro ? [{ text: 'License Activation (Pro)', link: `${base}/guide/license-activation` }] : []),
				],
			},
			{
				text: 'Advanced',
				items: [
					{ text: 'Admin Bar', link: `${base}/guide/admin-bar` },
					{ text: 'Clear All Data', link: `${base}/guide/clear-all-data` },
					{ text: 'Uninstallation', link: `${base}/guide/uninstallation` },
				],
			},
		],
		[`${base}/features/`]: [
			{
				text: 'Core Features',
				items: [
					{ text: 'Table Dashboard', link: `${base}/features/table-dashboard` },
					{
						text: 'Create Table',
						link: `${base}/features/create-table`,
						items: [
							{ text: 'Guided Wizard', link: `${base}/features/creation-wizard` },
							{ text: 'Manual Methods', link: `${base}/features/create-page` },
						],
					},
					{
						text: 'Show Table',
						link: `${base}/features/show-table`,
						items: [
							{ text: 'Gutenberg Blocks', link: `${base}/features/gutenberg-blocks` },
							{ text: 'Shortcodes', link: `${base}/features/shortcodes` },
						],
					},
				],
			},
			{
				text: 'Table Configuration',
				items: [
					{ text: 'Product Sources', link: `${base}/features/product-sources` },
					{ 
						text: 'Column Editor', 
						link: `${base}/features/column-editor`,
						items: includePro ? [
							{ text: 'Custom Field Column (Pro)', link: `${base}/features/custom-field-column` },
							{ text: 'Combined Column (Pro)', link: `${base}/features/combined-column` },
						] : undefined
					},
					{ text: 'Design Customization', link: `${base}/features/design-customization` },
					...(includePro ? [{ text: 'Import / Export (Pro)', link: `${base}/features/import-export` }] : []),
				],
			},
			{
				text: 'Frontend',
				items: [
					{ 
						text: 'WooCommerce Integration', 
						link: `${base}/features/woocommerce`,
						items: includePro ? [
							{ text: 'Variable & Grouped Modes (Pro)', link: `${base}/features/variable-grouped-modes` },
						] : undefined
					},
					{ 
						text: 'Search & Filters', 
						link: `${base}/features/search-and-filters`,
						items: includePro ? [
							{ text: 'Price Filter (Pro)', link: `${base}/features/price-filter` },
						] : undefined
					},
				],
			},
			{
				text: 'Settings',
				collapsed: false,
				items: [
					{ text: 'Default Configuration', link: `${base}/features/default-configuration` },
					{ text: 'Plugin Settings', link: `${base}/features/plugin-settings` },
					{ text: 'Activity Log', link: `${base}/features/activity-log` },
				],
			},
		],
		[`${base}/developer/`]: [
			{
				text: 'Developer Reference',
				items: [
					{ text: 'Architecture', link: `${base}/developer/architecture` },
					{ text: 'REST API', link: `${base}/developer/rest-api` },
					{ text: 'Hooks & Filters', link: `${base}/developer/hooks` },
					{ text: 'Contributing', link: `${base}/developer/contributing` },
				],
			},
		],
	};
}

// v1.1.0 sidebar (no pro features)
function getSidebarV1_1(base = '/v1.1.0') {
	return getSidebar(base, false);
}

// Ensure the old v1.0.0 sidebar doesn't have the new v1.1.0 Gutenberg blocks link
function getSidebarV1_0(base = '/v1.0.0') {
	const sidebar: any = getSidebar(base, false);
	sidebar[`${base}/features/`][0].items[2].items = sidebar[`${base}/features/`][0].items[2].items.filter(
		(item: any) => item.text !== 'Gutenberg Blocks'
	);
	return sidebar;
}

export default defineConfig({
	title: 'ProductBay Documentation',
	description:
		'Official documentation for ProductBay — the fast, high-converting WooCommerce product table plugin with Gutenberg blocks and shortcodes.',
	lang: 'en-US',
	base: '/productbay/',
	sitemap: {
		hostname: 'https://docs.wpanchorbay.com/productbay/',
	},

	head: [
		[
			'link',
			{
				rel: 'icon',
				href: '/productbay/icon.svg',
				type: 'image/svg+xml',
			},
		],
		['meta', { name: 'theme-color', content: '#2271b1' }],
		['meta', { property: 'og:type', content: 'website' }],
		['meta', { property: 'og:title', content: 'ProductBay Documentation' }],
		[
			'meta',
			{
				property: 'og:description',
				content:
					'Official documentation for ProductBay — the fast, high-converting WooCommerce product table plugin with Gutenberg blocks and shortcodes.',
			},
		],
		['meta', { property: 'og:image', content: '/productbay/logo.svg' }],
		['meta', { property: 'twitter:card', content: 'summary_large_image' }],
		['meta', { property: 'twitter:title', content: 'ProductBay Documentation' }],
		[
			'meta',
			{
				property: 'twitter:description',
				content:
					'Official documentation for ProductBay — the fast, high-converting WooCommerce product table plugin with Gutenberg blocks and shortcodes.',
			},
		],
	],

	themeConfig: {
		logo: '/icon.svg',
		siteTitle: false,

		nav: [
			{
				text: 'v1.2.1',
				items: [
					{
						text: 'v1.2.1 (Latest)',
						link: '/guide/introduction',
						activeMatch: '^/(?!v\\d)',
					},
					{
						text: 'v1.1.0',
						link: '/v1.1.0/guide/introduction',
						activeMatch: '^/v1\\.1\\.0/',
					},
					{
						text: 'v1.0.0',
						link: '/v1.0.0/guide/introduction',
						activeMatch: '^/v1\\.0\\.0/',
					},
					{
						text: 'Changelog',
						link: '/changelog',
					},
				],
			},
			{ text: 'Guide', link: '/guide/introduction' },
			{ text: 'Features', link: '/features/table-dashboard' },
			{ text: 'Developer', link: '/developer/architecture' },
			{
				text: 'More',
				items: [
					{ text: 'FAQ', link: '/faq' },
					{ text: 'Changelog', link: '/changelog' },
					{ text: 'Pro Changelog', link: '/pro-changelog' },
					{ text: 'Known Issues', link: '/known-issues' },
					{ text: 'Request a Feature', link: '/feature-request' },
				],
			},
		],

		sidebar: {
			...getSidebar(''),
			...getSidebarV1_1('/v1.1.0'),
			...getSidebarV1_0('/v1.0.0'),
		},

		socialLinks: [
			{
				icon: 'github',
				link: 'https://github.com/wpanchorbay/productbay',
			},
			{
				icon: {
					svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><image href="/productbay/wpanchorbay.png" width="24" height="24" /></svg>',
				},
				link: 'https://wpanchorbay.com/',
				ariaLabel: 'WPAnchorBay',
			},
		],

		footer: {
			message: 'Released under the GPL-2.0+ License.',
			copyright:
				'Copyright © 2026 <a href="https://wpanchorbay.com" target="_blank">WPAnchorBay</a>',
		},

		search: {
			provider: 'local',
			options: {
				detailedView: true,
			},
		},

		editLink: {
			pattern: 'https://github.com/wpanchorbay/productbay/edit/main/docs/:path',
			text: 'Edit this page on GitHub',
		},

		lastUpdated: {
			text: 'Last updated',
		},
	},

	lastUpdated: true,
});
