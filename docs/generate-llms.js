import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docsDir = __dirname;
const publicDir = path.join(docsDir, 'public');
const BASE_URL = 'https://docs.wpanchorbay.com/productbay';

if (!fs.existsSync(publicDir)) {
	fs.mkdirSync(publicDir, { recursive: true });
}

// ──────────────────────────────────────────────────
// Ordered page manifest — matches the sidebar order
// Each entry: { title, file (relative to docsDir), section }
// ──────────────────────────────────────────────────
const pages = [
	// Guide
	{ section: 'Guide — Getting Started', title: 'Introduction', file: 'guide/introduction.md' },
	{ section: 'Guide — Getting Started', title: 'Requirements', file: 'guide/requirements.md' },
	{ section: 'Guide — Getting Started', title: 'Installation', file: 'guide/installation.md' },
	{ section: 'Guide — Getting Started', title: 'Quick Start', file: 'guide/getting-started.md' },
	{ section: 'Guide — Advanced', title: 'Admin Bar', file: 'guide/admin-bar.md' },
	{ section: 'Guide — Advanced', title: 'Clear All Data', file: 'guide/clear-all-data.md' },
	{ section: 'Guide — Advanced', title: 'Uninstallation', file: 'guide/uninstallation.md' },

	// Features — Core
	{ section: 'Features — Core', title: 'Table Dashboard', file: 'features/table-dashboard.md' },
	{ section: 'Features — Core', title: 'Create Table', file: 'features/create-table.md' },
	{ section: 'Features — Core', title: 'Creation Wizard', file: 'features/creation-wizard.md' },
	{ section: 'Features — Core', title: 'Manual Table Creation', file: 'features/create-page.md' },
	{ section: 'Features — Core', title: 'Show Table', file: 'features/show-table.md' },
	{ section: 'Features — Core', title: 'Gutenberg Blocks', file: 'features/gutenberg-blocks.md' },
	{ section: 'Features — Core', title: 'Shortcodes', file: 'features/shortcodes.md' },

	// Features — Table Configuration
	{ section: 'Features — Table Configuration', title: 'Product Sources', file: 'features/product-sources.md' },
	{ section: 'Features — Table Configuration', title: 'Column Editor', file: 'features/column-editor.md' },
	{ section: 'Features — Table Configuration', title: 'Custom Field Column (Pro)', file: 'features/custom-field-column.md' },
	{ section: 'Features — Table Configuration', title: 'Combined Column (Pro)', file: 'features/combined-column.md' },
	{ section: 'Features — Table Configuration', title: 'Display Customization', file: 'features/display-customization.md' },
	{ section: 'Features — Table Configuration', title: 'Available Options', file: 'features/available-options.md' },
	{ section: 'Features — Table Configuration', title: 'Import / Export (Pro)', file: 'features/import-export.md' },

	// Features — Frontend
	{ section: 'Features — Frontend', title: 'WooCommerce Integration', file: 'features/woocommerce.md' },
	{ section: 'Features — Frontend', title: 'Variable & Grouped Modes (Pro)', file: 'features/variable-grouped-modes.md' },
	{ section: 'Features — Frontend', title: 'Search & Filters', file: 'features/search-and-filters.md' },
	{ section: 'Features — Frontend', title: 'Price Filter (Pro)', file: 'features/price-filter.md' },

	// Features — Settings
	{ section: 'Features — Settings', title: 'Default Configuration', file: 'features/default-configuration.md' },
	{ section: 'Features — Settings', title: 'Plugin Settings', file: 'features/plugin-settings.md' },
	{ section: 'Features — Settings', title: 'Activity Log', file: 'features/activity-log.md' },
	{ section: 'Features — Settings', title: 'License', file: 'features/license.md' },

	// Developer
	{ section: 'Developer Reference', title: 'Architecture', file: 'developer/architecture.md' },
	{ section: 'Developer Reference', title: 'REST API', file: 'developer/rest-api.md' },
	{ section: 'Developer Reference', title: 'Hooks & Filters', file: 'developer/hooks.md' },
	{ section: 'Developer Reference', title: 'Contributing', file: 'developer/contributing.md' },

	// Standalone pages
	{ section: 'Support', title: 'FAQ', file: 'faq.md' },
	{ section: 'Support', title: 'Known Issues', file: 'known-issues.md' },
	{ section: 'Release History', title: 'Changelog', file: 'changelog.md' },
	{ section: 'Release History', title: 'Pro Changelog', file: 'pro-changelog.md' },
];


// ──────────────────────────────────────────────────
// Content cleaning — strip VitePress-specific syntax
// ──────────────────────────────────────────────────
function cleanContent(raw) {
	let content = raw;

	// Remove YAML frontmatter (--- blocks at the very top)
	content = content.replace(/^---[\s\S]*?---\n*/m, '');

	// Convert VitePress custom containers to standard blockquotes
	// ::: tip Title  →  > **Tip:** Title
	content = content.replace(
		/^:::\s*(tip|info|warning|danger|details)\s*(.*)\n([\s\S]*?)^:::?\s*$/gm,
		(_, type, title, body) => {
			const label = type.charAt(0).toUpperCase() + type.slice(1);
			const heading = title ? `**${label}: ${title.trim()}**` : `**${label}**`;
			const quotedBody = body.trim().split('\n').map(l => `> ${l}`).join('\n');
			return `> ${heading}\n${quotedBody}`;
		}
	);

	// Replace Vue components with plain text equivalents
	content = content.replace(/<ProBadge\s*\/?>/g, '[Pro]');
	content = content.replace(/<Badge\s+type="[^"]*"\s+text="([^"]*)"\s*\/?>/g, '[$1]');

	// Remove image references (they are not useful for LLMs reading text)
	content = content.replace(/!\[.*?\]\(.*?\)\s*/g, '');

	// Clean any leftover HTML tags that are purely presentational
	content = content.replace(/<br\s*\/?>/g, '\n');

	// Collapse triple+ blank lines into double
	content = content.replace(/\n{4,}/g, '\n\n\n');

	return content.trim();
}


// ──────────────────────────────────────────────────
// Derive the live URL for a page from its file path
// ──────────────────────────────────────────────────
function getPageUrl(filePath) {
	// guide/introduction.md → /guide/introduction
	const slug = filePath.replace(/\.md$/, '').replace(/\/index$/, '');
	return `${BASE_URL}/${slug}`;
}


// ──────────────────────────────────────────────────
// Generate llms-full.txt
// ──────────────────────────────────────────────────
function generateFullDoc() {
	const lines = [];

	lines.push('# ProductBay — Complete Documentation');
	lines.push('');
	lines.push('> This file contains the complete documentation for ProductBay,');
	lines.push('> compiled into a single text file for consumption by AI assistants and LLMs.');
	lines.push('> Generated automatically — do not edit by hand.');
	lines.push('');
	lines.push(`> Documentation website: ${BASE_URL}`);
	lines.push(`> Plugin homepage: https://wpanchorbay.com/plugins/productbay/`);
	lines.push(`> WordPress.org: https://wordpress.org/plugins/productbay/`);
	lines.push(`> GitHub: https://github.com/wpanchorbay/productbay/`);
	lines.push('');

	// Table of Contents
	lines.push('## Table of Contents');
	lines.push('');
	let currentSection = '';
	for (const page of pages) {
		if (page.section !== currentSection) {
			currentSection = page.section;
			lines.push(`### ${currentSection}`);
		}
		lines.push(`- ${page.title}: ${getPageUrl(page.file)}`);
	}
	lines.push('');
	lines.push('---');
	lines.push('');

	// Full content
	currentSection = '';
	for (const page of pages) {
		const filePath = path.join(docsDir, page.file);
		if (!fs.existsSync(filePath)) {
			console.warn(`  ⚠ Skipping missing file: ${page.file}`);
			continue;
		}

		if (page.section !== currentSection) {
			currentSection = page.section;
			lines.push(`\n${'='.repeat(60)}`);
			lines.push(`SECTION: ${currentSection.toUpperCase()}`);
			lines.push(`${'='.repeat(60)}\n`);
		}

		const raw = fs.readFileSync(filePath, 'utf-8');
		const cleaned = cleanContent(raw);

		lines.push(`## ${page.title}`);
		lines.push(`> Source: ${getPageUrl(page.file)}`);
		lines.push('');
		lines.push(cleaned);
		lines.push('');
		lines.push('---');
		lines.push('');
	}

	return lines.join('\n');
}


// ──────────────────────────────────────────────────
// Generate llms.txt (summary / entry point)
// ──────────────────────────────────────────────────
function generateSummary() {
	const lines = [];

	lines.push('# ProductBay');
	lines.push('');
	lines.push('> ProductBay is a modern WordPress / WooCommerce plugin that replaces');
	lines.push('> standard grid views with interactive, AJAX-powered product tables.');
	lines.push('> Optimized for wholesale, B2B, restaurant menus, and technical part catalogs.');
	lines.push('');
	lines.push('## Links');
	lines.push('');
	lines.push(`- Documentation: ${BASE_URL}`);
	lines.push(`- Plugin homepage: https://wpanchorbay.com/plugins/productbay/`);
	lines.push(`- WordPress.org: https://wordpress.org/plugins/productbay/`);
	lines.push(`- GitHub: https://github.com/wpanchorbay/productbay/`);
	lines.push(`- Support: support@wpanchorbay.com`);
	lines.push('');
	lines.push('## Docs');
	lines.push('');

	// List every page with URL
	let currentSection = '';
	for (const page of pages) {
		if (page.section !== currentSection) {
			currentSection = page.section;
			lines.push(`### ${currentSection}`);
		}
		lines.push(`- [${page.title}](${getPageUrl(page.file)})`);
	}
	lines.push('');
	lines.push('## Full Documentation');
	lines.push('');
	lines.push(`For the complete documentation compiled into a single file, see:`);
	lines.push(`${BASE_URL}/llms-full.txt`);
	lines.push('');

	return lines.join('\n');
}


// ──────────────────────────────────────────────────
// Write files
// ──────────────────────────────────────────────────
const fullDoc = generateFullDoc();
const summary = generateSummary();

fs.writeFileSync(path.join(publicDir, 'llms-full.txt'), fullDoc);
fs.writeFileSync(path.join(publicDir, 'llms.txt'), summary);

const pageCount = pages.filter(p => fs.existsSync(path.join(docsDir, p.file))).length;
const fullSize = (Buffer.byteLength(fullDoc) / 1024).toFixed(1);
console.log(`✓ Generated llms.txt and llms-full.txt (${pageCount} pages, ${fullSize} KB)`);
