# Translations (i18n)

This document covers the internationalization (i18n) setup for ProductBay, supporting both **PHP** and **React** translations within WordPress.

---

## Quick Start

### For Developers (Adding Translatable Strings)

**In React/TypeScript:**
```tsx
import { __ } from '@wordpress/i18n';

// Use in components
<h1>{__('Dashboard', 'productbay')}</h1>
```

**In PHP:**
```php
$text = __('Dashboard', 'productbay');
_e('Settings', 'productbay');
```

### For Translators

1. Find the POT file at `languages/productbay.pot`
2. Create a translation file (e.g., `productbay-es_ES.po`)
3. Run `bun i18n:make-json` to generate JSON files for React

---

## Overview

| Component                  | Details                                       |
| -------------------------- | --------------------------------------------- |
| **Text Domain**            | `productbay`                                  |
| **POT File**               | `languages/productbay.pot`                    |
| **PHP Functions**          | `__()`, `_e()`, `_x()`, `_n()`                |
| **React Package**          | `@wordpress/i18n` (devDependency)             |
| **POT Extraction**         | WP-CLI `wp i18n make-pot`                     |
| **JS Translation Loading** | `wp_set_script_translations()` in `Admin.php` |

---

## Step-by-Step: Translation Workflow

### Step 1: Write Translatable Code

Wrap all user-facing strings with translation functions:

```tsx
// React/TypeScript
import { __, sprintf } from '@wordpress/i18n';

const MyComponent = () => (
    <div>
        <h1>{__('Dashboard', 'productbay')}</h1>
        <p>{sprintf(__('Page %d of %d', 'productbay'), current, total)}</p>
    </div>
);
```

```php
// PHP
$title = __('Settings', 'productbay');
_e('Save Changes', 'productbay');
```

### Step 2: Extract Translatable Strings

Run the extraction script:

```bash
bun i18n:make-pot
```

This runs the local WP-CLI bundle to extract strings from PHP files and **compiled** JavaScript assets into `languages/productbay.pot`.

> [!IMPORTANT]
> Since React strings are extracted from compiled assets, ensure you have run a build (`bun run wpbuild` or `bun run wpstart`) before generating the POT file.

### Step 3: Create Translation Files

Create `.po` files from the `.pot` template for each language:

| File Name             | Language         |
| --------------------- | ---------------- |
| `productbay-es_ES.po` | Spanish (Spain)  |
| `productbay-fr_FR.po` | French (France)  |
| `productbay-de_DE.po` | German (Germany) |

**Tools for Translation:**
- **[Poedit](https://poedit.net/)** - Desktop app (recommended)
- **[Loco Translate](https://wordpress.org/plugins/loco-translate/)** - WordPress plugin
- **[translate.wordpress.org](https://translate.wordpress.org/)** - Community translations

### Step 4: Generate JSON for React

WordPress loads JavaScript translations from `.json` files. Convert your `.po` files:

```bash
bun i18n:make-json
```

This creates files like `productbay-es_ES-admin.json` that WordPress automatically loads.

---

## React Translation Functions

Import from `@wordpress/i18n`:

```tsx
import { __, _n, _x, sprintf } from '@wordpress/i18n';
```

### Function Reference

| Function                              | Purpose           | Example                                          |
| ------------------------------------- | ----------------- | ------------------------------------------------ |
| `__('text', 'domain')`                | Basic translation | `__('Save', 'productbay')`                       |
| `_x('text', 'context', 'domain')`     | With context      | `_x('Post', 'verb', 'productbay')`               |
| `_n('single', 'plural', n, 'domain')` | Pluralization     | `_n('%d item', '%d items', count, 'productbay')` |
| `sprintf(format, ...args)`            | String formatting | `sprintf(__('Page %d', 'productbay'), num)`      |

### Usage Examples

```tsx
// Simple string
<h1>{__('Dashboard', 'productbay')}</h1>

// With context (for ambiguous words)
<span>{_x('Post', 'verb', 'productbay')}</span>    // "Post" as an action
<span>{_x('Post', 'noun', 'productbay')}</span>    // "Post" as a blog post

// Pluralization
<p>
    {sprintf(
        _n('%d product', '%d products', count, 'productbay'),
        count
    )}
</p>

// Dynamic values
<p>
    {sprintf(
        /* translators: %s: user name */
        __('Hello, %s!', 'productbay'),
        userName
    )}
</p>
```

---

## PHP Translation Functions

Standard WordPress i18n functions:

```php
// Return translated string
$text = __('Dashboard', 'productbay');

// Echo translated string
_e('Settings', 'productbay');

// With context
$verb = _x('Post', 'verb', 'productbay');
$noun = _x('Post', 'noun', 'productbay');

// Pluralization
printf(
    _n('%d table', '%d tables', $count, 'productbay'),
    $count
);
```

---

## File Structure

```
languages/
├── productbay.pot              # Template - source of truth (auto-generated)
├── productbay-es_ES.po         # Spanish translation (created by translators)
├── productbay-es_ES.mo         # Compiled Spanish for PHP (auto-generated)
├── productbay-es_ES-admin.json # Spanish for React (generated by make-json)
└── ...
```

---

## NPM Scripts

| Script           | Command              | Description                  |
| ---------------- | -------------------- | ---------------------------- |
| `build`          | `wp-scripts build`   | Builds JS/CSS assets         |
| `i18n:make-pot`  | `bun i18n:make-pot`  | Extracts strings to POT file |
| `i18n:make-json` | `bun i18n:make-json` | Converts PO → JSON           |

> **Note:** These scripts use the local WP-CLI installed via Composer. They are configured in `package.json` to run via the PHP bootstrapper for reliable cross-platform compatibility.

---

## Configuration

### Admin.php (wp_set_script_translations)

Located at `app/Admin/Admin.php`, loads JSON translations at runtime:

```php
wp_set_script_translations(
    'productbay-admin',           // Script handle
    'productbay',                  // Text domain
    PRODUCTBAY_PATH . 'languages' // JSON files directory
);
```

WordPress looks for: `{text-domain}-{locale}-{script-handle}.json`
Example: For Spanish locale → `productbay-es_ES-admin.json`

---

## Best Practices

1. **Always include the text domain**
   ```tsx
   __('Text', 'productbay')  // ✅ Correct
   __('Text')                // ❌ Missing domain
   ```

2. **Add translator comments for placeholders**
   ```tsx
   {sprintf(
       /* translators: %s: product name */
       __('Add %s to cart', 'productbay'),
       productName
   )}
   ```

3. **Don't concatenate translatable strings**
   ```tsx
   // ❌ Bad - translator can't reorder words
   __('Hello') + ' ' + __('World')
   
   // ✅ Good
   __('Hello World', 'productbay')
   ```

4. **Use context for ambiguous words**
   ```tsx
   _x('Order', 'sorting', 'productbay')    // Sort order
   _x('Order', 'purchase', 'productbay')   // Customer order
   ```

5. **Extract before release**  
   Always run `bun run build` before tagging a release to ensure POT is up-to-date.

---

## Troubleshooting

### POT file is missing React strings

If React strings are missing from the POT file:
1. Ensure you have run a build: `bun run build`.
2. Check that strings are wrapped in `__()` from `@wordpress/i18n`.
3. Verify that the `assets/` directory is not excluded in the `i18n:make-pot` command in `package.json`.

### Translations not appearing in React

1. Ensure the JSON file exists: `languages/productbay-{locale}-admin.json`
2. Verify `wp_set_script_translations()` is called in `Admin.php`
3. Check the script handle matches: `productbay-admin`

### WP-CLI setup

The translation scripts use a **local WP-CLI bundle** installed via Composer. No global WP-CLI installation is required on your system.

---

**Last Updated**: 2026-01-27
