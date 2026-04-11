# ProductBay Context & Guidelines

Welcome to **ProductBay**, a high-performance WooCommerce product tables plugin. This document serves as the core context provider for AI agents and developers working on this repository, containing all high-level rules and architecture index.

## Agent instructions
- you don't have to visit the browser. tell me what you need to confirm in step by step details, i will do that for you.
- if you absolately need to visit the browser. the username & password both is 'forhad' and the plugin url is "https://forhad.test/wp-admin/admin.php?page=productbay#/tables" 

---

## 🏗 Project Identity & Architecture
ProductBay utilizes a decoupled frontend/backend architecture with a strict **Free + Pro add-on model**:
- **Backend (PHP):** Fully Object-Oriented (OOP), utilizing Composer PSR-4 autoloading (`WpabProductBay\` mapped to `app/`). The backend functions as an API and Extensibility provider. It does not use procedural code.
- **Frontend (React/TypeScript):** Modern Single Page Application built on React, Zustand (state management), and Tailwind CSS v4 (scoped to `#productbay-root`).
- **Free/Pro Relationship:** The Pro plugin (`WpabProductBayPro\`) NEVER accesses the database directly. It piggybacks on the Free plugin via WordPress hooks and a **SlotFill** pattern in React. Pro code is totally separate and shipped independently.

## 📂 Directory Structure
- Free Directory: "/var/www/html/wp-content/plugins/productbay/"
- For following relative path, the base url is: "/var/www/html/wp-content/plugins/productbay/.meta-worktree/instructions/"
- [`app/`](../../app/) — Free versions PHP Backend logic (Admin, API, Core, Data, Frontend, Utils).
- [`src/`](../../src/) — Free versions React/TypeScript Frontend (Components, pages, store, hooks).
- [`assets/`](../../assets/) — Free versions compiled JS/CSS bundles (do not edit directly).
- [`languages/`](../../languages/) — Free versions i18n `.pot` and `.json` translation files.
- [`.meta-worktree/`](../) — Free versions central repository for all architectural documents, diagrams, and instructions.
- [Pro Directory](../../../productbay-pro/) (absolute path: /var/www/html/wp-content/plugins/productbay-pro/)
- [Pro meta-worktree](../../../productbay-pro/.meta-worktree/instructions/context.md)
- [Pro `app/`](../../../productbay-pro/app/) - Pro versions PHP Backend logic (Admin, API, Core, Data, Frontend, Utils).
- [Pro `src/`](../../../productbay-pro/src/) - Pro versions React/TypeScript Frontend (Components, pages, store, hooks).
- [Pro `assets/`](../../../productbay-pro/assets/) - Pro versions compiled JS/CSS bundles (do not edit directly).
- [Pro `languages/`](../../../productbay-pro/languages/) - Pro versions i18n `.pot` and `.json` translation files.

## ⚙️ Coding Standards & Formatting
1. **Frontend (React/TypeScript):** Modern React/TS standards. This project uses a root `.prettierrc` to override WordPress's default `wp-scripts` formatting. Specifically:
   - No spaces inside parentheses or brackets: `(state) => ({count})` instead of `( state ) => ( { count } )`.
   - Tabs for indentation (width 4).
   - Single quotes and semicolons required.
   - Use `bun run format` to enforce these rules across the `src/` directory.
2. **Backend (PHP):** Follows standard WordPress Coding Standards (WPCS). Indent with Tabs. Use `vendor/bin/phpcs` to check compliance.

## ⚠️ Core Development Rules
1. **Security ("Late Escaping"):** Validate early, sanitize on arrival (`sanitize_text_field`, `absint`), but ALWAYS escape data exactly at the moment of output (`esc_html`, `esc_attr`). Use Nonces for ALL forms and REST API requests.
2. **Data Persistence:** Never use `update_post_meta()` directly for WooCommerce Products/Orders; utilize `WC_Data` methods (e.g. `$product->save()`) and ensure HPOS compatibility.
3. **State Management:** React components must pull global state exclusively from `Zustand` stores (`src/store/`). Do not fetch data inside components directly without syncing store state.
4. **Code Quality:** Use strict typing in TypeScript. Enforce PHPDoc/JSDoc blocks. All strings must be internationalized (`__()`, `_e()`, or `@wordpress/i18n`).
5. **No Direct DB (Pro):** If you are working on the Pro version, rely strictly on the 30+ Free plugin hooks and React SlotFills.

- Follow [wp-wc-dev-guide.md](/.meta-worktree/instructions/wp-wc-dev-guide.md) for wordpress specific guidelines.
---

## 📚 Deep Dive Documentation Index

If you need deeper context on a specific subsystem, read the corresponding file below:

### Architecture & Tech Stack
- **[TECH_STACK.md](../notes/TECH_STACK.md)**: Detailed breakdown of the dependencies, build tools (`bun`, `wp-scripts`), and package versions.
- **[ARCHITECTURE.md](../notes/ARCHITECTURE.md)**: Complete system design, data flow diagrams, and design patterns.
- **[PRO_ARCHITECTURE.md](../../../productbay-pro/.meta-worktree/notes/PRO_ARCHITECTURE.md)**: Specifications for the Free/Pro SlotFill layer and hook implementations.

### Detailed Technical Specs
- **[wp-wc-dev-guide.md](./wp-wc-dev-guide.md)**: WordPress PHP and WooCommerce specific coding standards.
- **[API.md](../notes/API.md)**: Documentation on all registered REST API endpoints `/productbay/v1/`.
- **[ROUTING.md](../notes/ROUTING.md)**: React Router integration and WordPress Admin Menu synchronization protocols.
- **[SETTINGS.md](../notes/SETTINGS.md)**: Global settings architecture and the reload-required patterns.
- **[TABLE_STORE.md](../notes/TABLE_STORE.md)**: The core Zustand state engine for managing table configuration data.
- **[TRANSLATIONS.md](../notes/TRANSLATIONS.md)**: The i18n workflow using WP-CLI bundles and React JSON translation files.

### Development Workflow
- **[GIT.md](../notes/GIT.md)**: Git branching, naming conventions, and commit standards.
- **[DEVELOPMENT.md](../notes/DEVELOPMENT.md)**: Core development workflow, setup commands, and best practices.
- **[RELEASE.md](../notes/RELEASE.md)**: Release process and ZIP packaging procedures (`bun run release`).