# Search & Filters

ProductBay includes built-in frontend search, filtering, and pagination — all powered by AJAX for a seamless, no-reload experience.

## Search

When search is enabled, a search bar appears in the main toolbar above the table. Customers can type to search products by:

- **Product name** — Partial or full match
- Results update instantly as the user types (with a debounce delay)
- Search is case-insensitive

::: info
Search operates on the products loaded by the table's [product source](/features/product-sources). It does not search your entire WooCommerce catalog — only the products that match the table's source configuration.
:::

## Category Filter

When enabled, a category filter dropdown appears in the dedicated Filter Bar above the main table tools.

- Select a product category to filter the table
- Clear the filter to show all products again
- Combine filtering with search for precise results

### Configuration

Enable the category filter in the **Options** step of the [Creation Wizard](/features/creation-wizard#step-4-options):

1. Under **Taxonomy & Type Filters**, toggle **Enable Categories Filter** to on

## Product Type Filter <Badge type="tip" text="Since v1.2.0" />

A separate toggle adds a **Product Type** dropdown to the frontend Filter Bar, allowing customers to filter by WooCommerce product type:

- **Simple** — Standard products
- **Variable** — Products with attribute variations
- **Grouped** — Products containing child items
- **External** — Affiliate or external products

### Configuration

Enable the product type filter in the **Options** step:

1. Under **Taxonomy & Type Filters**, toggle **Enable Product Type Filter** to on

## Pagination

When pagination is enabled, products are split across multiple pages with navigation controls at the bottom of the table.

### Configuration

| Setting | Options | Default |
|---------|---------|---------|
| **Enable Pagination** | On / Off | On |
| **Products per page** | Any number (1–500) | 10 |
| **Pagination Style** | Standard, Load More <ProBadge />, Infinite Scroll <ProBadge /> | Standard |

### Pagination Styles

#### Standard (Numbers)
The default mode. Numbered page buttons appear at the bottom of the table, allowing customers to jump between pages.

#### Load More Button <ProBadge />
Replaces page numbers with a single **"Load More"** button. Clicking it appends the next batch of products below the existing rows without replacing them.

#### Infinite Scroll <ProBadge />
Products load automatically as the customer scrolls down, creating a seamless, never-ending browsing experience. No buttons or page numbers needed.

## Image Lightbox

When enabled, clicking a product's thumbnail image opens a **full-size popup** of the image with a smooth zoom animation. This lets customers inspect product photos without leaving the table.

### Configuration

Toggle **Enable Image Lightbox** in the **Options** step under **Table Controls**. Enabled by default.

## Price Range Filter <ProBadge /> <Badge type="tip" text="Since v1.2.0" />

ProductBay Pro includes a powerful price filter that allows customers to refine products by an exact price range. It can display as a dual-handle slider, number inputs, or both. The filter auto-detects the minimum and maximum prices of the products in your table.

[Read the full Price Filter guide &rarr;](/features/price-filter)

## Feature Toggles

All frontend features can be individually enabled or disabled in the **Options** step:

| Feature | Default | Description |
|---------|---------|-------------|
| **Search** | ✅ On | AJAX search bar |
| **Pagination** | ✅ On | Paginated results |
| **Image Lightbox** | ✅ On | Full-size image popup on click |
| **Categories Filter** | ✅ On | Category dropdown filter |
| **Product Type Filter** | ✅ On | Product type dropdown filter |
| **Price Filter** <ProBadge /> | ❌ Off | Price range slider and inputs |

Configure these in the **Options** step of the [Creation Wizard](/features/creation-wizard).
