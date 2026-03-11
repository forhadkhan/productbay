# Release Process & Build Architecture

This document details the technical implementation of the ProductBay release process, specifically focusing on the build script (`scripts/package-plugin.js`) and our dependency management strategy.

## Overview

The release process is designed to be **fast**, **safe**, and **reproducible**. It produces a production-ready zip file containing optimized assets and autoloader maps, without requiring manual cleanup of the development environment.

### Command

```bash
bun run release
```

## Build Strategy

### 1. Parallel Asset Compilation
We use `npm-run-all --parallel` to run independent build tasks simultaneously, significantly reducing build time.

- **Webpack (`wpbuild`)**: Compiles React and builds the `admin.js` bundle.
- **Tailwind CLI (`tailwindbuild`)**: Compiles `src/styles/main.css` to `assets/css/admin.css`.

### 2. Staging Folder Strategy (Dependency Management)
A common challenge in WordPress plugin development is managing `composer` dependencies. We need development tools (like `phpcs`) locally but must exclude them from the production zip.

**Traditional Approach (Slow & Risky):**
1. Uninstall dev dependencies in root (`composer install --no-dev`).
2. Zip the folder.
3. Reinstall dev dependencies in root.

**Our Approach (Fast & Safe):**
We use a **Staging Folder** strategy to avoid touching the root `vendor` directory entirely.

1. **Build Assets**: Compile JS/CSS.
2. **Copy Files**: Copy plugin files (php, assets, app, etc.) to a temporary staging directory `dist/productbay`.
3. **Copy Config**: Copy `composer.json` and `composer.lock` to the staging directory.
4. **Install Production Deps**: Run `composer install --no-dev` **inside** `dist/productbay`.
5. **Zip**: Compress the staging directory to `productbay-x.x.x.zip`.

This ensures the `vendor` folder in your development environment remains untouched, and the production zip contains a clean, optimized autoloader.

## Release Script Breakdown

The script `scripts/package-plugin.js` performs the following steps:

1.  **Clean**: Removes `dist/` and old zip files.
2.  **Build**: Runs `bun run build` (triggering the parallel asset compilation).
3.  **Copy**: recursive copy of allow-listed files/folders to `dist/productbay`.
4.  **Install**: Runs `composer install --no-dev --optimize-autoloader` in `dist/productbay`.
5.  **Zip**: Creates a zip file named with the current version (e.g., `productbay-1.0.0.zip`) containing the `productbay` folder.

## Versioning

The output zip filename is automatically derived from the `version` field in `package.json`. Always ensure `package.json`, `composer.json`, and `productbay.php` versions are in sync before releasing.
