# Gutenberg Block Support for ProductBay

Add two Gutenberg blocks to the ProductBay plugin so that end-users can insert product tables directly from the block editor — no shortcode knowledge required.

---

## Proposed Blocks

| Block Name | Block Identifier | Purpose |
|---|---|---|
| **Product Table** | `productbay/product-table` | Insert a single product table by choosing one from a dropdown |
| **Tab – Product Table** | `productbay/tab-product-table` | Insert multiple tables rendered inside a tabbed UI |

Both blocks are **dynamic blocks** — the editor UI is React, but PHP renders the final frontend HTML (same `TableRenderer` already used by the shortcode). This requires zero duplication of rendering logic.

---

## Architecture Overview

```
productbay/
├── src/
│   └── blocks/                         ← [NEW] Block JS source root
│       ├── product-table/
│       │   ├── index.js                ← registers the block
│       │   ├── edit.js                 ← Gutenberg editor UI (React)
│       │   └── save.js                 ← returns null (dynamic block)
│       └── tab-product-table/
│           ├── index.js
│           ├── edit.js
│           └── save.js
├── app/
│   └── Blocks/                         ← [NEW] PHP block registration
│       ├── BlockManager.php            ← orchestrates all block registrations
│       ├── ProductTableBlock.php       ← render_callback for single table
│       ├── TabProductTableBlock.php    ← render_callback for tabbed tables
│       └── index.php                  ← silence is golden (directory protection)
├── blocks/                             ← [NEW] block.json files + compiled block assets
│   ├── product-table/
│   │   └── block.json
│   └── tab-product-table/
│       └── block.json
├── webpack.config.js                   ← [MODIFY] add two new entry points
└── app/Core/Plugin.php                 ← [MODIFY] init BlockManager
```

> [!NOTE]
> Block JS source lives in `src/blocks/` (compiled output goes to `blocks/<name>/`). This keeps separation of concerns and integrates naturally with the existing `@wordpress/scripts` Webpack setup.

---

## Proposed Changes

### 1. Webpack Build — Add Block Entry Points

#### [MODIFY] [webpack.config.js](file:///var/www/html/wp-content/plugins/productbay/webpack.config.js)

Add two new entry points alongside the existing `admin` entry. The `@wordpress/scripts` default config already handles `block.json` discovery and generates the `.asset.php` dependency files automatically.

```diff
 entry: {
     admin: './src/index.tsx',
+    // Gutenberg Blocks
+    'blocks/product-table/index':     './src/blocks/product-table/index.js',
+    'blocks/tab-product-table/index': './src/blocks/tab-product-table/index.js',
 },
 output: {
     ...defaults.output,
-    path: path.resolve(__dirname, 'assets', 'js'),
+    path: path.resolve(__dirname, 'assets', 'js'),   // admin.js stays here
```

> [!IMPORTANT]
> We need to split the output path — admin JS stays in `assets/js/`, but block assets must land inside `blocks/<name>/` so WordPress can find them via `register_block_type( __DIR__ . '/blocks/product-table' )`. This is done by overriding `output.filename` with a function.

The revised `output` section:

```js
output: {
    ...defaults.output,
    path: path.resolve(__dirname),   // root of plugin
    filename: (pathData) => {
        const name = pathData.chunk.name;
        if (name === 'admin') return 'assets/js/admin.js';
        return `${name}.js`; // e.g. blocks/product-table/index.js
    },
    clean: false,
},
```

---

### 2. Block Source Files (JavaScript/React)

#### [NEW] `src/blocks/product-table/index.js`

Registers the block with its `block.json` metadata and wires up `edit` / `save` components.

```js
import { registerBlockType } from '@wordpress/blocks';
import metadata from '../../../blocks/product-table/block.json';
import Edit from './edit';
import save from './save';

registerBlockType( metadata.name, { edit: Edit, save } );
```

#### [NEW] `src/blocks/product-table/edit.js`

React editor UI — shows a panel with a `SelectControl` populated via the REST API (`/wp-json/productbay/v1/tables`). When a table is selected, renders a live `ServerSideRender` preview.

Key WP packages used (all already bundled by `@wordpress/scripts`):
- `@wordpress/block-editor` → `useBlockProps`, `InspectorControls`
- `@wordpress/components` → `PanelBody`, `SelectControl`, `Placeholder`, `Spinner`
- `@wordpress/server-side-render` → `ServerSideRender`
- `@wordpress/api-fetch` → `apiFetch` for loading table list
- `@wordpress/i18n` → `__`

#### [NEW] `src/blocks/product-table/save.js`

```js
export default function save() { return null; }  // dynamic block
```

#### [NEW] `src/blocks/tab-product-table/index.js` + `edit.js` + `save.js`

Same pattern. The `edit.js` allows selecting **multiple** tables (rendered as pills/tags with a multi-select or a repeater UI using `@wordpress/components`). Each selected table becomes a tab at render time.

---

### 3. Block Manifest Files

#### [NEW] `blocks/product-table/block.json`

```json
{
    "$schema": "https://schemas.wp.org/trunk/block.json",
    "apiVersion": 3,
    "name": "productbay/product-table",
    "title": "Product Table",
    "category": "woocommerce",
    "description": "Display a WooCommerce product table via ProductBay.",
    "keywords": ["product", "table", "woocommerce", "productbay"],
    "textDomain": "productbay",
    "icon": "grid-view",
    "attributes": {
        "tableId": {
            "type": "number",
            "default": 0
        }
    },
    "supports": {
        "html": false,
        "align": ["wide", "full"]
    },
    "editorScript": "file:./index.js",
    "editorStyle":  "file:./index.css",
    "style":        "file:./style-index.css"
}
```

#### [NEW] `blocks/tab-product-table/block.json`

```json
{
    "$schema": "https://schemas.wp.org/trunk/block.json",
    "apiVersion": 3,
    "name": "productbay/tab-product-table",
    "title": "Tab – Product Table",
    "category": "woocommerce",
    "description": "Display multiple WooCommerce product tables in a tabbed layout via ProductBay.",
    "keywords": ["tabs", "product", "table", "woocommerce", "productbay"],
    "textDomain": "productbay",
    "icon": "table-col-after",
    "attributes": {
        "tableIds": {
            "type": "array",
            "items": { "type": "number" },
            "default": []
        },
        "tabLabels": {
            "type": "array",
            "items": { "type": "string" },
            "default": []
        }
    },
    "supports": {
        "html": false,
        "align": ["wide", "full"]
    },
    "editorScript": "file:./index.js",
    "editorStyle":  "file:./index.css",
    "style":        "file:./style-index.css"
}
```

---

### 4. PHP — Block Registration & Rendering

#### [NEW] `app/Blocks/BlockManager.php`

Orchestrates registration of all blocks on the `init` hook. Uses `register_block_type()` pointing to the compiled `blocks/<name>/` directory so WordPress auto-loads the `block.json` and wires asset dependencies.

```php
namespace WpabProductBay\Blocks;

class BlockManager {
    protected $table_repository;

    public function __construct( TableRepository $repository ) {
        $this->table_repository = $repository;
    }

    public function init() {
        $product_table_block     = new ProductTableBlock( $this->table_repository );
        $tab_product_table_block = new TabProductTableBlock( $this->table_repository );

        register_block_type(
            PRODUCTBAY_PATH . 'blocks/product-table',
            [ 'render_callback' => [ $product_table_block, 'render' ] ]
        );

        register_block_type(
            PRODUCTBAY_PATH . 'blocks/tab-product-table',
            [ 'render_callback' => [ $tab_product_table_block, 'render' ] ]
        );
    }
}
```

#### [NEW] `app/Blocks/ProductTableBlock.php`

`render( $attributes, $content )` method:
1. Reads `$attributes['tableId']`
2. Calls `TableRepository::get_table()` (same as shortcode)
3. Enqueues frontend assets
4. Delegates to `TableRenderer::render()` and wraps in `get_block_wrapper_attributes()`

#### [NEW] `app/Blocks/TabProductTableBlock.php`

`render( $attributes, $content )`:
1. Reads `$attributes['tableIds']` and `$attributes['tabLabels']`
2. Loops through each ID, fetches table, renders via `TableRenderer`
3. Wraps in accessible tab markup (`role="tablist"` / `role="tabpanel"`, keyboard nav via inline JS or reusing the existing `frontend.js` if extended)

#### [NEW] `app/Blocks/index.php`

```php
<?php // Silence is golden.
```

---

### 5. Plugin Bootstrap

#### [MODIFY] [Plugin.php](file:///var/www/html/wp-content/plugins/productbay/app/Core/Plugin.php)

Add `BlockManager` initialization. Blocks must register on `init`, not `plugins_loaded`, so we hook accordingly.

```diff
+use WpabProductBay\Blocks\BlockManager;

 private function init_components() {
+    // Gutenberg Blocks (must run on 'init').
+    $block_manager = new BlockManager( $this->table_repository );
+    \add_action( 'init', [ $block_manager, 'init' ] );

     // Admin Area.
     if ( is_admin() ) { ... }
```

---

## Open Questions

> [!IMPORTANT]
> **REST API for table list in editor**: The editor's `edit.js` needs to fetch the list of available tables to populate a dropdown. We currently have an existing REST API at `/wp-json/productbay/v1/tables`. Does it require authentication, and is it accessible from `apiFetch` in the block editor context? If not, we may need to add a nonce or adjust the permission callback.

> [!IMPORTANT]
> **Tab UI Frontend JavaScript**: The tabbed block needs tab-switching JS on the frontend. Options:
> 1. Extend existing `frontend.js` to handle `.productbay-tabs` markup
> 2. Register a separate lightweight tab script only enqueued when the tab block is on the page
>
> Option 2 is cleaner. Please confirm.

> [!NOTE]
> **Block Category**: Both blocks are placed under the `woocommerce` category in the inserter (requires WooCommerce to be active, which is already a plugin requirement). We could also register a custom `productbay` category if you prefer a dedicated section in the inserter.

> [!NOTE]
> **`ServerSideRender` vs. static editor preview**: Using `ServerSideRender` gives an accurate live preview in the editor (matching the frontend exactly) but requires a network request. The alternative is a simplified static React preview. `ServerSideRender` is recommended for accuracy. Confirm?

---

## Verification Plan

### Automated
- `npm run build` — confirm no Webpack errors and that all block assets compile to `blocks/<name>/index.js` + `index.asset.php`
- `npm run lint:js` — no ESLint errors in new block source files
- `npm run lint:php` — no PHPCS violations in new PHP classes

### Manual
1. Activate the plugin in a WP 6.5+ install with WooCommerce active
2. Open Block Editor → Inserter → Search "Product Table" — both blocks appear
3. Insert **Product Table** block → Inspector panel shows table dropdown populated with real table names
4. Select a table → `ServerSideRender` preview appears in editor
5. Publish page → confirm frontend renders identically to the shortcode version
6. Insert **Tab – Product Table** → add 2+ tables → confirm tabbed layout renders on frontend
7. Confirm block-added tables enqueue `frontend.css` and `frontend.js` correctly
8. Confirm no JS console errors in editor or frontend