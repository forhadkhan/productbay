---
trigger: always_on
---

# Technical Requirements 

## Object-Oriented Programming:  
- Follow OOP principles (no procedural "spaghetti" code). Organize code into classes with clear responsibilities. Avoid procedural or global-style functions scattered across files.  
- Maintain consistent indentation (tabs), naming conventions (`snake_case` for functions/variables, `PascalCase` for classes), and file organization.  
- Use meaningful function and variable names.  


## Documentation:  
- Document all classes and methods with proper PHPDoc blocks.  
- Keep updated changelog and `notes\DEVELOPMENT.md` file.  
- We document our system architecture in `notes\ARCHITECTURE.md` file. Keep it updated. For modularity we create individual architecture files in `notes\` directory and reference them in `notes\  ARCHITECTURE.md` file.  


## WordPress Coding Standards (applicable to wordpress codes)  
- Follow the [WordPress PHP Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/).  
- Sanitize all inputs: 
    - `sanitize_text_field()` for text strings.  
    - `absint()` for integers.  
    - `floatval()` for decimal numbers.  
    - `sanitize_textarea_field()` for multi-line text.  
    - `wp_kses_post()` for HTML content.  
- Escape all outputs:  
    - `esc_html()` for plain text.  
    - `esc_attr()` for attribute values.  
    - `esc_url()` for URLs.  
- Protect admin forms with nonces:  
    - Use `wp_nonce_field('action_name', 'nonce_name')` in forms.  
    - Verify with `check_admin_referer('action_name', 'nonce_name')` or `wp_verify_nonce()`.  
- Restrict access:  
    - Check `current_user_can('manage_options')` or `current_user_can('manage_woocommerce')` before allowingadmin actions.  
- WooCommerce Integration:  
    - This plugin is build for WooCommerce.  
    - Use official, latest, updated and recommended WooCommerce hooks, filters, and methods.  
    - Never modify product data directly in the `wp_posts` or `wp_postmeta` tables.  
    - Ensure compatibility with both simple and variable products.  
- Helpful Resources:  
    - [WordPress Plugin DeveloperHandbook](https://developer.wordpress.org/plugins/)  
    - [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/)  
    - [WooCommerce REST API /WC_Product_Query](https://woocommerce.github.io/code-reference/classes/WC_Product_Query.html)  
    - [WooCommerce Hooks](https://woocommerce.github.io/code-reference/hooks.html)  
    - [WooCommerce Filters](https://woocommerce.github.io/code-reference/filters.html)  
    - [WooCommerce Actions](https://woocommerce.github.io/code-reference/actions.html)  
    - [WooCommerce Constants](https://woocommerce.github.io/code-reference/constants.html)  
    - [WooCommerce Functions](https://woocommerce.github.io/code-reference/functions.html)  
    - [WooCommerce Classes](https://woocommerce.github.io/code-reference/classes.html)  
    - [WooCommerce Methods](https://woocommerce.github.io/code-reference/methods.html)  
    - [WooCommerce Properties](https://woocommerce.github.io/code-reference/properties.html)  
    - [WooCommerce Traits](https://woocommerce.github.io/code-reference/traits.html)  
    - [WooCommerce Interfaces](https://woocommerce.github.io/code-reference/interfaces.html)  
    - [WooCommerce Exceptions](https://woocommerce.github.io/code-reference/exceptions.html)  


## Internationalization (i18n)  
Make all user-facing strings translatable:  
- **@wordpress/i18n** — React translation package
- **WP-CLI (Local Bundle)** — PHP-based CLI via Composer for POT/JSON management
- **Standard WP Functions** — `__()`, `_e()`, `_x()`, `_n()` in PHP and React
- Wrap strings with `__('Text', 'your-text-domain')` for returning translated strings.
- Use `_e('Text', 'your-text-domain')` for echoing translated strings.  
- We have a `languages\productbay.pot` file for translations.  
- We also need to handle translations for our react codes. import and use { __ } from '@wordpress/i18n';


# ProductBay Tech Stack

## Platform
- **WordPress 6.0+** — Core CMS
- **WooCommerce 6.1+** — Required e-commerce dependency
- **PHP 7.4+** — Backend language

## Package Managers
- **Bun** — JavaScript packages & script runner
- **Composer** — PHP dependencies with PSR-4 autoloading (`WpabProductBay\`)

## Frontend
- **React** — UI library (via `@wordpress/element`)
- **TypeScript** — Type-safe JS (ES2020, strict mode)
- **Tailwind CSS v4** — Utility-first styling, scoped to `#productbay-root`
- **Zustand** — Lightweight state management
- **React Router DOM v7** — Client-side SPA routing
- **Lucide React** — Icon library
- **dnd-kit** — Drag-and-drop functionality
- **CVA + clsx + tailwind-merge** — Dynamic className utilities

## Build Tools
- **Webpack** — Module bundler (extends `@wordpress/scripts`)
- **@wordpress/scripts** — WP build toolchain (JS/TS transpilation, dependency extraction)
- **@tailwindcss/cli v4** — CSS compilation
- **npm-run-all** — Parallel dev/build scripts

## Code Quality
- **PHPCS + WPCS** — WordPress Coding Standards
- **PHPCompatibilityWP** — PHP version compatibility
- **WordPress/WooCommerce Stubs** — IDE autocompletion

## Path Aliases
- `@/*` → `src/*` (configured in Webpack + tsconfig)

## Key Scripts
- `bun start` — Dev mode (Webpack + Tailwind watch in parallel)
- `bun build` — Production build
- `bun release` — Package plugin ZIP
- `bun run i18n:make-pot` — Extract strings (requires compiled assets in `assets/`)
- `bun run i18n:make-json` — Convert PO files to JSON for React

## Directory Structure
- `app/` — PHP backend (Admin, Api, Core, Data, Frontend, Http, Utils)
- `src/` — React/TS frontend (components, pages, store, hooks, layouts, types)
- `assets/` — Compiled JS/CSS output