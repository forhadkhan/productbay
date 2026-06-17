# ProductBay — Complete Feature Bible

> **Version:** ProductBay Free v1.3.0 · ProductBay Pro v1.0.0
> **Last Updated:** 2026-04-17
> **Audience:** Marketing, UX, Content, Sales
> **Purpose:** Single source of truth for all product features, positioning, and Free ↔ Pro relationships.

---

## Table of Contents

1. [Product Identity](#1-product-identity)
2. [Architecture Summary (Non-Technical)](#2-architecture-summary-non-technical)
3. [Table Creation Wizard](#3-table-creation-wizard)
4. [Product Sources & Query Modifiers](#4-product-sources--query-modifiers)
5. [Column System](#5-column-system)
6. [Design Customization System](#6-design-customization-system)
7. [Cart & Checkout Features](#7-cart--checkout-features)
8. [Search & Filtering](#8-search--filtering)
9. [Variable & Grouped Product Handling](#9-variable--grouped-product-handling)
10. [Image Lightbox](#10-image-lightbox)
11. [Gutenberg Blocks](#11-gutenberg-blocks)
12. [Permalink System](#12-permalink-system)
13. [Table Management Dashboard](#13-table-management-dashboard)
14. [Global Settings System](#14-global-settings-system)
15. [Activity Log](#15-activity-log)
16. [Import / Export](#16-import--export)
17. [Developer Extensibility](#17-developer-extensibility)
18. [Uninstall & Data Management](#18-uninstall--data-management)
19. [Translation & i18n](#19-translation--i18n)
20. [Performance & Privacy](#20-performance--privacy)
21. [Compatibility](#21-compatibility)
22. [Free vs Pro Comparison Matrix](#22-free-vs-pro-comparison-matrix)
23. [Planned / Coming Soon Features (Pro)](#23-planned--coming-soon-features-pro)
24. [Uncertainties & Flags](#24-uncertainties--flags)

---

## 1. Product Identity

| Property | Value |
|---|---|
| **Full Name** | ProductBay – High-Performance Product Table for WooCommerce |
| **Pro Name** | ProductBay Pro |
| **Publisher** | WPAnchorBay |
| **Plugin Slug** | `productbay` (Free) · `productbay-pro` (Pro) |
| **WordPress.org URL** | Listed on WordPress.org (Free only) |
| **Requires WordPress** | 6.8+ (Free) · 6.0+ (Pro) |
| **Requires WooCommerce** | 6.1+ |
| **Requires PHP** | 7.4+ |
| **Tested up to WP** | 6.9 |
| **License** | GPLv2 or later |
| **Support (Free)** | WordPress.org support forum — ≤2 business days |
| **Support (Pro)** | Priority support hub — ≤1 business day |

### Positioning Statement

ProductBay transforms how WooCommerce products are displayed. It replaces the default grid layout with fast, scannable product tables that are perfect for wholesale, B2B, large catalogs, quick-order forms, price lists, restaurant menus, and digital product libraries.

### Target Audiences

- Wholesale & B2B stores
- Large product catalogs (100s–1000s of SKUs)
- Quick-order & bulk-order forms
- Price lists & product directories
- Restaurant & food menus
- Digital product libraries

---

## 2. Architecture Summary (Non-Technical)

> [!NOTE]
> This section is simplified for non-technical teams. For full technical details, refer to the development documentation.

- **Free + Pro Add-on Model:** The Free plugin is the complete foundation. The Pro plugin is a separate add-on that extends the Free plugin—Pro cannot function without Free.
- **Modern Admin Panel:** The table creation interface is a fast, fluid Single Page Application (built with React). It feels more like a modern web app than a typical WordPress plugin.
- **Lightweight Frontend:** The customer-facing table uses a lean, SEO-friendly rendering engine optimized for page speed (Core Web Vitals).
- **No External Dependencies:** All assets (JS, CSS, fonts) are bundled locally. **No data ever leaves the server.** No CDN, no tracking, no remote calls.
- **Pro Integration:** Pro extends Free through WordPress hooks (PHP) and a "SlotFill" pattern (React). The Pro plugin never touches the database directly.

---

## 3. Table Creation Wizard

**Version:** Free
**Type:** 5-step guided wizard with a live preview

The wizard walks users through creating a product table in a focused, linear flow. A **real-time live preview** updates instantly as changes are made — WYSIWYG.

### Step 1: Setup
- **Table Name** — required field, used as the table's title in the dashboard
- **Product Source Selection** — choose which products populate the table (see [Section 4](#4-product-sources--query-modifiers))

### Step 2: Columns
- **Column Editor** — add, remove, and reorder columns using drag-and-drop
- Choose from 12 column types (see [Section 5](#5-column-system))
- Configure per-column settings (heading text, visibility, width)

### Step 3: Display
- **Design Customization** — configure colors, typography, borders, and spacing
- All changes reflect instantly in the live preview (see [Section 6](#6-design-customization-system))

### Step 4: Options
- **Functional Configuration** — search, pagination, filters, cart behavior, variable product display modes
- See [Section 7](#7-cart--checkout-features) and [Section 8](#8-search--filtering) for details

### Step 5: Finish
- **Shortcode** — copy the generated `[productbay id="X"]` shortcode
- **Permalink** — view the direct URL to the table's dedicated page
- The table is ready to embed anywhere

> [!TIP]
> The wizard can also be reopened to edit an existing table at any time. The live preview always reflects the current saved state.

---

## 4. Product Sources & Query Modifiers

**Version:** Free

Every table has a **Product Source** that determines which products appear. Four source types are available:

### Source Types

| Source | Description |
|---|---|
| **All Products** | Displays every published product from the WooCommerce catalog |
| **By Category** | Shows products from one or more selected categories (multi-select) |
| **On Sale** | Displays only products with an active sale price |
| **Specific Products** | Hand-pick individual products using a search interface |

### Query Modifiers (All Sources)

These modifiers apply on top of the chosen source:

| Modifier | Description |
|---|---|
| **Exclude Product IDs** | Remove specific products from the results |
| **Stock Status Filter** | Show all, in-stock only, or out-of-stock only products |
| **Default Sort Order** | Sort by Name, Price, Date, or Popularity |
| **Sort Direction** | Ascending or Descending |

### Specific Products Source — Special Behavior

- Products are selected via a live search autocomplete (searches by name)
- Selected products appear as removable pill/tag chips
- A count of selected products is shown with a "Clear All" button
- The display order matches the order in which products were selected (preserves `post__in` order)

---

## 5. Column System

**Version:** Free (core types) · Pro (cf, combined — editing UI)

The column editor supports **12 column types**. Each column has:

- **Heading** — editable text for the column header
- **Show/Hide Heading** — toggle visibility of the header text
- **Width** — configurable in px, %, or auto
- **Visibility** — 7 modes: All devices, Desktop only, Tablet only, Mobile only, Hide on mobile, Hide on desktop, Hidden
- **Drag-and-drop reordering** — visual column arrangement

### Column Types

| # | Type | Slug | Version | Description |
|---|---|---|---|---|
| 1 | **Product Image** | `image` | Free | Thumbnail image. Clicking opens the lightbox (if enabled) or links to the product page. |
| 2 | **Product Name** | `name` | Free | Clickable product name linking to the product page. Shows a subtitle with "X options available" for variable/grouped products (configurable). |
| 3 | **Price** | `price` | Free | WooCommerce price HTML (supports sale prices, range prices for variable products). |
| 4 | **Add to Cart** | `button` | Free | Add-to-cart button with optional quantity selector. Behavior differs by product type (see [Section 7](#7-cart--checkout-features)). |
| 5 | **SKU** | `sku` | Free | Product SKU as plain text. |
| 6 | **Stock Status** | `stock` | Free | Displays "In stock" (with quantity if managed), "Out of stock", or "On backorder" with color-coded text. |
| 7 | **Date** | `date` | Free | Product creation date, formatted per WordPress site settings. |
| 8 | **Description** | `summary` | Free | Short description, trimmed to ~10 words. |
| 9 | **Taxonomy** | `tax` | Free | Displays terms from any registered taxonomy (e.g., categories, tags). Option to link terms to their archive page. |
| 10 | **Rating** | `rating` | Free | Product average rating. Three display formats: Custom Stars (SVG), Text-based ("Rated 4.5 out of 5"), or WooCommerce Default. Shows "No ratings" if unrated. |
| 11 | **Custom Field** | `cf` | 🔒 Pro | Displays the value of any post meta key. Includes a quick-select list of common WooCommerce fields (Weight, Length, Width, Height, Total Sales, Purchase Note). An autocomplete loader fetches all available meta keys from the database. |
| 12 | **Combined** | `combined` | 🔒 Pro | Merges multiple column types into a single cell. Supports drag-and-drop sub-element ordering, inline or stacked layout, custom separators, and per-element prefix/suffix text. Can nest any other column type *except* another combined column. |

> [!IMPORTANT]
> **Pro-Only Column Enforcement:** Even if a user manually crafts a table config with `cf` or `combined` columns, the Free plugin's renderer explicitly blocks these types from rendering unless the Pro plugin is active. This is a security gate, not just a UI restriction.

### Bulk Selection Column (Special)

In addition to the 12 data columns, there is a **Bulk Selection checkbox column** that is configured separately:

- **Position:** First or Last column (configurable)
- **Select All checkbox** in the header row
- Only purchasable, in-stock, non-external, non-grouped, non-variable simple products can be selected
- Width is configurable independently

---

## 6. Design Customization System

**Version:** Free

Every table has **independent, scoped CSS** — multiple tables on the same page never conflict with each other. All styling is configured per-table.

### Colors

| Element | Customizable Properties |
|---|---|
| **Add to Cart Button** | Background, Text, Hover Background, Hover Text |
| **Table Header** | Background, Text |
| **Table Rows** | Background, Text |
| **Alternate Rows (Zebra Striping)** | Enabled/Disabled toggle + Alternate Background, Alternate Text |
| **Row Hover Effect** | Enabled/Disabled toggle + Hover Background, Hover Text |

### Layout & Spacing

| Setting | Options |
|---|---|
| **Border Style** | None, Solid, Dashed |
| **Border Color** | Custom color (dimmed when border style is "None") |
| **Border Radius** | Enabled/Disabled toggle + value in px (0–24) |
| **Cell Padding** | Compact, Normal, Spacious |

### Typography

| Setting | Options |
|---|---|
| **Header Font Weight** | Normal, Bold, Extra Bold |
| **Header Text Transform** | Uppercase, Lowercase, Capitalize, Normal |

> [!NOTE]
> All color values use a native color picker component. The live preview updates in real-time as values change.

---

## 7. Cart & Checkout Features

**Version:** Free

### Add-to-Cart Modes

| Mode | Description |
|---|---|
| **AJAX Add to Cart** (default) | Products are added to the cart instantly, without a page reload. A success message appears inline. |
| **Native Form Submission** | When AJAX is disabled, the button triggers a standard form POST to WooCommerce's add-to-cart handler. The user stays on the table page (redirect back via HTTP referrer). |

### Cart Sub-Features

All of these are independently toggleable, regardless of AJAX mode:

| Feature | Description | Default |
|---|---|---|
| **Quantity Selector** | Numeric input with increment/decrement buttons displayed next to the add-to-cart button. Respects WooCommerce stock quantity limits and backorder settings. | ✅ On |
| **Variation Badges** | After adding a variable product to the cart, small badges appear showing which variation was added (e.g., "Size: L, Color: Red"). | ✅ On |
| **Clear All Button** | A button in the bulk actions area to instantly deselect all selected products. | ✅ On |
| **Selected Items Panel** | A floating popup/drawer showing all currently selected products with: individual quantities, pricing per item, remove-per-item control, and total count. | ✅ On |

### Bulk Add-to-Cart

- Customers check multiple products via checkboxes
- A "Add to Cart" bulk action button adds all selected products at once
- A "View (N)" button opens the Selected Items Panel
- Both buttons are disabled until at least one product is selected
- Works with simple products in the Free version
- Works with variable and grouped products when Pro variations modes are used

### Product Type Behavior in the Cart Column

| Product Type | Behavior |
|---|---|
| **Simple** | Standard "Add to Cart" button with quantity |
| **Variable** | Inline attribute dropdowns for each variation axis (Free: "Inline Dropdown" mode). The user selects options and then clicks "Add to Cart". See [Section 9](#9-variable--grouped-product-handling) for Pro modes. |
| **Grouped** | Inline dropdown showing all child products with individual quantity and add buttons (Free: "Inline Dropdown" mode). See [Section 9](#9-variable--grouped-product-handling) for Pro modes. |
| **External/Affiliate** | Displays the external "Buy" button linking to the external product URL |
| **Out of Stock** | Button is disabled / shows "Out of stock" |

---

## 8. Search & Filtering

**Version:** Free (core) · Pro (price range filter)

### Search

| Feature | Description | Version |
|---|---|---|
| **Instant AJAX Search** | A search bar above the table that filters products in real-time as the user types. No page reload. Uses WordPress's `s` search parameter. | Free |

### Filters

All filters appear in a **Filters Bar** above the toolbar. A "Clear" button resets all active filters.

| Filter | Description | Version |
|---|---|---|
| **Category Filter** | Dropdown to filter products by WooCommerce product category (`product_cat` taxonomy). | Free |
| **Product Type Filter** | Dropdown to filter by product type (Simple, Variable, Grouped, External). Uses the `product_type` taxonomy. | Free |
| **Price Range Filter** | A range slider and/or numeric inputs to filter products within a price range. | 🔒 **Pro** |

### Price Range Filter — Deep Dive (Pro)

The Price Range Filter is a fully-featured Pro module with the following configuration options:

| Setting | Description | Default |
|---|---|---|
| **Enable/Disable** | Master toggle for the feature | Off |
| **Filter Mode** | Slider Only, Inputs Only, or Both (slider + inputs) | Both |
| **Step Value** | Increment value for the slider and inputs (supports decimals, e.g., 0.01) | 1 |
| **Custom Minimum Price** | Override the auto-detected minimum. Leave empty to auto-detect from the table's products. | Auto |
| **Custom Maximum Price** | Override the auto-detected maximum. Leave empty to auto-detect from the table's products. | Auto |

#### How Auto-Detection Works
When custom min/max are not set, the module queries all products that match the table's source configuration and determines the floor/ceil of the price range. This query is re-run on each table load.

#### Frontend Rendering
- When "both" mode is selected, a dual-handle range slider appears alongside two numeric inputs, all synchronized.
- Slider tooltips show the current min/max values.
- A colored track fill indicates the selected range.
- The filter applies via the `productbay_query_args` hook, adding a `_price` meta query with `BETWEEN` comparison.

---

## 9. Variable & Grouped Product Handling

**Version:** Free (Inline Dropdown) · Pro (Popup, Nested, Separate)

This is one of the most significant differentiators between Free and Pro.

### Display Modes

| Mode | Variable Products | Grouped Products | Version |
|---|---|---|---|
| **Inline Dropdown** | Attribute dropdowns appear directly inside the table row cell. User selects options within the row. | Child products appear in an inline dropdown with individual add buttons. | ✅ Free |
| **Popup Modal** | Click "Select Products" → opens a full modal dialog with a mini-table of all variations (Product, Price, Quantity, Action columns). Supports individual and bulk add-to-cart within the popup. | Same behavior — popup shows all child products in a mini-table. | 🔒 Pro |
| **Nested Rows** | Click "View Products" → expandable child rows appear directly beneath the parent row, inheriting the parent table's column structure. Can be set to auto-expand or collapsed by default. | Same behavior — nested rows show child products. | 🔒 Pro |
| **Separate Rows** | Each variation/child is displayed as its own full row in the main table. | Each child product has its own row. | 🔒 Pro |

### Variable & Grouped Products — Shared Settings

| Setting | Description | Default |
|---|---|---|
| **Show Options Count** | Displays "X options available" subtitle below the product name | ✅ On |
| **Expand Nested Rows** (Pro, Nested only) | Show nested rows expanded by default instead of collapsed | Off |

### Popup Modal — Detailed Behavior (Pro)

- Opens as a native `<dialog>` element with a backdrop
- Shows the parent product name as the dialog title
- Mini-table columns: Product Name, Price, Quantity (with +/- buttons), Action (Add button + bulk select checkbox)
- Handles "Any" attribute variations by "exploding" them into individual rows for each possible term combination
- Per-variation add-to-cart (AJAX)
- Bulk selection checkboxes for multi-add
- Cart data is loaded via AJAX from `wp_ajax_productbay_pro_get_variation_html`
- A selection confirmation message appears after adding

### Nested Rows — Detailed Behavior (Pro)

- Child rows mirror the parent table's column structure
- Each child row has a "↳" prefix before the product name to indicate hierarchy
- Child rows are loaded via AJAX
- Checkbox bulk select is supported within nested rows
- Respects the parent table's bulk select position (first/last)

---

## 10. Image Lightbox

**Version:** Free

Product images open in a native popup/modal with:

- **Fullscreen toggle** — expand the image to fill the viewport
- **Close button** — dismiss the lightbox
- **Backdrop click** — clicking outside the image closes the lightbox
- Built using native `<dialog>` element — **no third-party lightbox library**
- Can be **enabled or disabled** per table via the Options panel

When the lightbox is disabled, the image either links to the product page or displays as a static image, depending on the column settings.

---

## 11. Gutenberg Blocks

**Version:** Free

ProductBay includes **two native Gutenberg blocks** with server-side rendering:

### Block 1: Product Table

- Insert a single product table into any post or page
- Select from existing tables via a dropdown
- Renders a **live preview** directly inside the Block Editor
- If no table is selected, shows a placeholder with a "Create New Table" link

### Block 2: Tabbed Product Tables

- Display multiple product tables organized in an interactive tabbed interface
- Users can select multiple tables, each appearing as a named tab
- Useful for organizing products by category, type, or any custom grouping

### Shortcode Alternative

For page builders (Elementor, Divi, WPBakery, etc.) or non-block contexts:

```
[productbay id="X"]
```

Where `X` is the table's post ID. Compatible with any page builder that supports WordPress shortcodes.

---

## 12. Permalink System

**Version:** Free (since v1.3.0)

Each product table has a dedicated, shareable URL:

- **URL format:** `example.com/productbay/product-table/{table-slug}`
- Uses a registered Custom Post Type (`productbay_table`) with `publicly_queryable = true`
- The table renders automatically on its permalink page via `the_content` filter
- **Private tables:** Only render for logged-in administrators, with a yellow warning banner
- **Permalink display:** Both the table listing page and the table editor show the permalink URL with a copy button

> [!NOTE]
> Permalink pages use the theme's default single post template. The table replaces the post content area.

---

## 13. Table Management Dashboard

**Version:** Free

A centralized admin area to manage all tables:

### Features

| Feature | Description |
|---|---|
| **Search** | Find tables by name using a search input |
| **Filter by Status** | Published or Private |
| **Filter by Source** | Category, Sale, Specific IDs, or All Products |
| **Bulk Status Update** | Change multiple tables to Published or Private at once |
| **Bulk Delete** | Delete multiple tables at once |
| **Table Metadata** | View created date, modified date, published date, product source type, column count |
| **Quick Actions** | Edit, Duplicate, Copy Shortcode, View Permalink, Delete |
| **Shortcode Display** | Each table shows its shortcode with a one-click copy button |
| **Permalink Display** | Each saved table shows its shareable permalink |

---

## 14. Global Settings System

**Version:** Free

The Settings page is organized into **4 tabs**:

### Tab 1: Default Configuration

Sets the **global defaults** for all newly created tables. Every setting available in the per-table wizard is also available here as a global default:

- Default Product Source (type, sort order)
- Default Columns (order, types, widths)
- Default Style (colors, borders, typography)
- Default Options (search, pagination, filters, cart behavior)
- A "Reset Defaults" button restores all values to factory settings

> [!TIP]
> When a new table is created via the wizard, it inherits these global defaults. Changes to global defaults do not retroactively affect existing tables.

### Tab 2: Plugin Settings

| Setting | Description | Default |
|---|---|---|
| **Admin Bar** | Show/hide the ProductBay link in the WordPress admin bar | On |
| **Delete Data on Uninstall** | If enabled, all tables, settings, and logs are deleted when the plugin is removed from WordPress | On |
| **Clear Data** | Manually wipe all plugin data (tables, settings, onboarding state) — factory reset | — |

### Tab 3: Activity Log

An in-app log viewer (see [Section 15](#15-activity-log)).

### Tab 4: License

- When Pro is **not active:** Displays a promotional page (hero banner, feature grid, "Upgrade to Pro" CTA) with a license key explanation box.
- When Pro is **active:** Renders a SlotFill area where the Pro plugin injects its license activation UI.

---

## 15. Activity Log

**Version:** Free (since v1.2.0)

A file-based logging system that records all significant plugin events.

### Logged Events

| Event | Logged Data |
|---|---|
| **Table Created** | Table title, ID, column count |
| **Table Updated** | Table title, ID, specific fields changed (diff summary) |
| **Table Deleted** | Table ID |
| **Settings Updated** | Which keys changed (e.g., "Logging Enabled", "Retention set to 30 days") |
| **Factory Reset** | Number of tables deleted |
| **Plugin Activated** | Plugin version |
| **Plugin Deactivated** | Plugin version |

### Log Viewer UI

- **Calendar navigation** — browse logs by date
- **Color-coded severity levels** — Success (green), Info (blue), Warning (yellow), Error (red)
- **Expandable entries** — click to see detailed change summaries
- **Configurable retention** — set how many days to keep logs (default: 30 days)
- **Enable/Disable logging** — master toggle
- **Cron-based pruning** — runs daily to delete old log files

### Storage

- Logs are stored as flat files in `wp-content/productbay-logs/`
- Protected by an `.htaccess` file (deny all direct access)
- Deleted on plugin uninstall (if "Delete Data on Uninstall" is enabled)

---

## 16. Import / Export

**Version:** 🔒 Pro

> [!IMPORTANT]
> The Import/Export infrastructure (Zustand store, modal system, UI hooks) is built into the **Free** plugin as scaffolding. However, the actual import/export functionality — the modal content that handles JSON serialization, file upload, and data transfer — is rendered by the **Pro** plugin via SlotFill.

### Capabilities (Pro)

| Feature | Description |
|---|---|
| **Export Tables** | Export selected table configurations as JSON files |
| **Import Tables** | Upload JSON files to create tables on a different site |
| **Table Selection** | Multi-select UI to choose which tables to export |
| **Pre-selected Export** | Can be triggered with specific tables pre-selected from the dashboard |

> [!WARNING]
> The Import/Export feature is listed in Pro marketing materials but the Pro module implementation for `SpecificProducts` (which would contain the import/export logic) appears to have an empty directory. This may indicate the feature is partially implemented or in development. **Marketing should verify the current state before making claims.**

---

## 17. Developer Extensibility

**Version:** Free

ProductBay exposes **30+ action hooks and filters** for developers:

### Key Hooks (Selection)

| Hook / Filter | Type | Description |
|---|---|---|
| `productbay_loaded` | Action | Fires after the Free plugin is fully initialized — primary hook for Pro |
| `productbay_before_table` | Action | Before the table HTML wrapper |
| `productbay_after_table` | Action | After the table HTML wrapper |
| `productbay_before_row` | Action | Before each product row |
| `productbay_after_row` | Action | After each product row |
| `productbay_query_args` | Filter | Modify WP_Query arguments before the product query |
| `productbay_table_columns` | Filter | Modify the columns array before rendering |
| `productbay_cell_output` | Filter | Override or extend individual cell HTML |
| `productbay_table_styles` | Filter | Modify the generated scoped CSS |
| `productbay_table_output` | Filter | Modify the complete table HTML |
| `productbay_shortcode_atts` | Filter | Modify shortcode attributes |
| `productbay_admin_script_data` | Filter | Extend data passed to the React admin app |
| `productbay_default_settings` | Filter | Modify the default settings structure |
| `productbay_get_settings` | Filter | Modify settings before they reach the frontend |
| `productbay_render_filters` | Action | Render additional filters in the toolbar (used by Pro Price Filter) |
| `productbay_enqueue_frontend_assets` | Action | Enqueue additional frontend scripts/styles |
| `productbay_enqueue_admin_assets` | Action | Enqueue additional admin scripts/styles |
| `productbay_preview_css_urls` | Filter | Inject CSS into the live preview iframe |
| `productbay_preview_js_urls` | Filter | Inject JS into the live preview iframe |
| `productbay_admin_capability` | Filter | Override the required capability for admin access |
| `productbay_system_status` | Filter | Extend system status information |
| `productbay_settings_updated` | Action | Fires after settings are persisted |
| `productbay_before_save_table` | Filter | Fires before a table is saved (used for diff logging) |
| `productbay_after_save_table` | Action | Fires after a table is saved |
| `productbay_after_delete_table` | Action | Fires after a table is deleted |
| `productbay_toolbar_start` | Action | Start of the toolbar area |
| `productbay_toolbar_end` | Action | End of the toolbar area |

### React SlotFill System

The Free plugin exposes named "Slots" in the React admin UI where the Pro plugin can inject components:

| Slot Name | Location | Used By |
|---|---|---|
| `productbay-pro-options` | OptionsPanel (table config) | Pro Price Filter settings, Pro Variations settings |
| `productbay-pro-combined-cta` | Combined column placeholder | Pro CTA / configuration |
| `productbay-pro-settings-license` | Settings > License tab | Pro license activation UI |

### Exposed Global APIs

The Free plugin exposes these on `window.productbay` for Pro consumption:

- `useTableStore` — Zustand store hook for table state
- `components` — SectionHeading, SettingsOption, and other UI components

---

## 18. Uninstall & Data Management

**Version:** Free

### Uninstall Behavior

When the plugin is **deleted** (not just deactivated) from WordPress:

1. Checks the `delete_on_uninstall` setting (default: `true`)
2. If enabled, performs a full cleanup:
   - Deletes all `productbay_table` posts (Custom Post Type)
   - Deletes all associated post meta (`_productbay_source`, `_productbay_columns`, `_productbay_settings`, `_productbay_style`, `_productbay_config`)
   - Deletes the `productbay_settings` option
   - Deletes the `productbay_onboarding_completed` option
   - Deletes all log files in `wp-content/productbay-logs/` (including `.htaccess`)
   - Clears the log pruning cron event

### Factory Reset (In-App)

Available via Settings > Plugin Settings > "Clear Data":

- Deletes all tables
- Clears all post meta
- Resets settings to defaults
- Resets onboarding state
- Does **not** delete the plugin itself

---

## 19. Translation & i18n

**Version:** Free & Pro

- **100%** of user-facing strings are wrapped in WordPress localization functions (`__()`, `_e()`, `sprintf()`, `_n()`)
- **Text Domains:** `productbay` (Free), `productbay-pro` (Pro)
- Translation files live in the `languages/` directory of each plugin
- Both PHP and React strings are internationalized
- React uses `@wordpress/i18n` for frontend translations
- WP-CLI can generate `.pot` and `.json` translation files

---

## 20. Performance & Privacy

**Version:** Free & Pro

### Performance

| Optimization | Description |
|---|---|
| **Conditional Asset Loading** | JS and CSS are only loaded on pages where a `[productbay]` shortcode or Gutenberg block is present |
| **AJAX Pagination** | Navigate between pages without full page reloads |
| **Lightweight Frontend** | The frontend renderer is optimized for Core Web Vitals |
| **Scoped CSS** | Each table generates only the CSS it needs, avoiding bloat |

### Privacy

| Guarantee | Description |
|---|---|
| **No External CDN** | All assets are bundled locally |
| **No Remote Scripts** | No JavaScript loaded from external servers |
| **No Data Transmission** | No product data, user data, or analytics data is sent anywhere |
| **No Tracking** | Zero tracking pixels, analytics, or telemetry |

---

## 21. Compatibility

| Compatibility | Status |
|---|---|
| **WooCommerce** | Required (6.1+). Supports all 4 core product types. |
| **WordPress** | 6.8+ (Free), 6.0+ (Pro) |
| **PHP** | 7.4+ |
| **Gutenberg** | Full support with 2 native blocks |
| **Classic Editor** | Supported via shortcode |
| **Elementor** | Supported via shortcode |
| **Divi** | Supported via shortcode |
| **WPBakery** | Supported via shortcode |
| **Any Page Builder** | Supported via shortcode |
| **Multisite** | Expected to work (standard plugin architecture) |
| **HPOS (WooCommerce)** | Yes — uses WC_Data methods, not direct meta queries for product data |

---

## 22. Free vs Pro Comparison Matrix

| Feature | Free | Pro |
|---|---|---|
| **Table Creation Wizard** | ✅ Full 5-step wizard | ✅ |
| **Live Preview** | ✅ | ✅ |
| **Unlimited Tables** | ✅ | ✅ |
| **Product Sources (All, Category, Sale, Specific)** | ✅ | ✅ |
| **Query Modifiers (Excludes, Stock, Sort)** | ✅ | ✅ |
| **Column Types: Image, Name, Price, Button, SKU, Stock, Date, Summary, Taxonomy, Rating** | ✅ 10 types | ✅ |
| **Column Type: Custom Field** | ❌ Shows Pro placeholder | ✅ |
| **Column Type: Combined** | ❌ Shows Pro placeholder | ✅ |
| **Drag-and-Drop Column Reordering** | ✅ | ✅ |
| **Per-Column Width (px, %, auto)** | ✅ | ✅ |
| **Per-Column Responsive Visibility** | ✅ 7 modes | ✅ |
| **Full Design Customization** | ✅ All options | ✅ |
| **AJAX Add to Cart** | ✅ | ✅ |
| **Native Form Add to Cart** | ✅ | ✅ |
| **Quantity Selector** | ✅ | ✅ |
| **Bulk Add to Cart** | ✅ | ✅ |
| **Selected Items Panel** | ✅ | ✅ |
| **Variation Badges** | ✅ | ✅ |
| **Variable Products: Inline Dropdown** | ✅ | ✅ |
| **Variable Products: Popup Modal** | ❌ | ✅ |
| **Variable Products: Nested Rows** | ❌ | ✅ |
| **Variable Products: Separate Rows** | ❌ | ✅ |
| **Grouped Products: Inline Dropdown** | ✅ | ✅ |
| **Grouped Products: Popup Modal** | ❌ | ✅ |
| **Grouped Products: Nested Rows** | ❌ | ✅ |
| **Grouped Products: Separate Rows** | ❌ | ✅ |
| **AJAX Search** | ✅ | ✅ |
| **Category Filter** | ✅ | ✅ |
| **Product Type Filter** | ✅ | ✅ |
| **Price Range Filter** | ❌ Shows Pro badge | ✅ |
| **Image Lightbox** | ✅ | ✅ |
| **Gutenberg Blocks (2)** | ✅ | ✅ |
| **Permalink System** | ✅ | ✅ |
| **Table Management Dashboard** | ✅ | ✅ |
| **Global Default Settings** | ✅ | ✅ |
| **Activity Log** | ✅ | ✅ |
| **Pagination: Standard (Numbers)** | ✅ | ✅ |
| **Pagination: Load More Button** | ❌ | ✅ |
| **Pagination: Infinite Scroll** | ❌ | ✅ |
| **Import / Export** | ❌ (scaffolding only) | ✅ |
| **30+ Developer Hooks/Filters** | ✅ | ✅ |
| **Translation Ready** | ✅ | ✅ |
| **No External CDN / Privacy** | ✅ | ✅ |
| **Support** | Forum (≤2 days) | Priority (≤1 day) |

---

## 23. Planned / Coming Soon Features (Pro)

These features are listed in the Free plugin's readme.txt under the Pro section and marked as "Coming Soon":

| Feature | Description | Status |
|---|---|---|
| **Quick View Modal** | AJAX-loaded product detail popup — view full product info without leaving the table | Coming Soon |
| **Custom CSS Editor** | Per-table scoped CSS editor in the admin panel | Coming Soon |
| **Advanced Filters** | Sidebar/drawer/top-menu filter layout, attribute filters, active filter chips | Coming Soon |
| **Premium Templates** | One-click style presets for instant table theming | Coming Soon |

> [!CAUTION]
> These features are not yet implemented and should not be marketed as available. Use "Coming Soon" language only.

