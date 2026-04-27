import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docsDir = __dirname;
const publicDir = path.join(docsDir, 'public');

if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Order of directories/files to include in the full LLM doc
const sections = [
    { title: 'Introduction & Getting Started', path: 'guide' },
    { title: 'Features', path: 'features' },
    { title: 'Developer Reference', path: 'developer' },
    { title: 'FAQ', file: 'faq.md' },
    { title: 'Known Issues', file: 'known-issues.md' },
    { title: 'Changelog', file: 'changelog.md' },
];

let fullContent = '# ProductBay Full Documentation\n\n';
fullContent += '> This file contains the complete documentation for ProductBay, compiled for LLMs.\n\n';

function processFile(filePath, sectionTitle) {
    if (!fs.existsSync(filePath)) return '';
    const content = fs.readFileSync(filePath, 'utf-8');
    // Basic cleanup of Vue/VitePress specific syntax if needed, but raw MD is fine
    return `\n\n## Section: ${sectionTitle} - ${path.basename(filePath)}\n\n${content}`;
}

function processDirectory(dirPath, sectionTitle) {
    if (!fs.existsSync(dirPath)) return '';
    const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.md'));
    let content = '';
    // Sort files logically if possible, or just alphabetically
    files.sort().forEach(file => {
        content += processFile(path.join(dirPath, file), sectionTitle);
    });
    return content;
}

for (const section of sections) {
    if (section.path) {
        const fullDirPath = path.join(docsDir, section.path);
        fullContent += processDirectory(fullDirPath, section.title);
    } else if (section.file) {
        const fullFilePath = path.join(docsDir, section.file);
        fullContent += processFile(fullFilePath, section.title);
    }
}

fs.writeFileSync(path.join(publicDir, 'llms-full.txt'), fullContent);

const llmsTxtContent = `# ProductBay Documentation

> Official documentation for ProductBay — the fast, high-converting WooCommerce product table plugin with Gutenberg blocks and shortcodes.

ProductBay is a modern WordPress plugin that replaces standard WooCommerce grid views with interactive, AJAX-powered product tables. It is heavily optimized for wholesale, B2B, restaurant menus, and technical part catalogs.

## Full Documentation for LLMs
[Full Documentation (llms-full.txt)](https://docs.wpanchorbay.com/productbay/llms-full.txt)

## Quick Links
- Homepage & Getting Started: https://docs.wpanchorbay.com/productbay/guide/getting-started
- Native Gutenberg Blocks: https://docs.wpanchorbay.com/productbay/features/gutenberg-blocks
- Shortcode Integration: https://docs.wpanchorbay.com/productbay/features/shortcodes
- Hooks & Filters (Developer API): https://docs.wpanchorbay.com/productbay/developer/hooks
- Known Issues: https://docs.wpanchorbay.com/productbay/known-issues

## Core Features
1. **Interactive UI**: Search, sort, pagination, and category filters that work instantly without reloading the page.
2. **Setup**: Uses a 5-step guided wizard or direct manual creation inside the WordPress Admin.
3. **Display Methods**: Can be placed on any WordPress page via a native Gutenberg block (the \`Tabbed Product Table\` and \`Product Table\` blocks) or using legacy Shortcodes (\`[productbay id="123"]\`).
4. **Performance**: Built natively with a React SPA admin interface. The frontend is driven by Vanilla JS + HTML, equipped with intelligent 30-minute query caching for massive catalogs.
5. **WooCommerce Support**: Fully supports simple, variable, grouped, and external products. Supports inline variation selectors and bulk AJAX Add-to-Cart.

## Support & Reporting
If you encounter any bugs or need to review the plugin's code, please open an issue on our GitHub repository: \`wpanchorbay/productbay\`. You can also reach out to \`support@wpanchorbay.com\`.
`;

fs.writeFileSync(path.join(publicDir, 'llms.txt'), llmsTxtContent);

console.log('Successfully generated llms.txt and llms-full.txt');
