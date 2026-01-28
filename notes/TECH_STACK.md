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

## Internationalization
- **@wordpress/i18n** — React translation package
- **WP-CLI (Local Bundle)** — PHP-based CLI via Composer for POT/JSON management
- **Standard WP Functions** — `__()`, `_e()`, `_x()`, `_n()` in PHP and React

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
