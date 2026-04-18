# Search & Filters

ProductBay includes built-in frontend search, filtering, sorting, and pagination — all powered by AJAX for a seamless, no-reload experience.

## Search

When search is enabled, a search bar appears in the main toolbar above the table. For a cleaner user experience, category filters (and the price slider in Pro) are positioned in a dedicated Filter Bar directly above this main toolbar. Customers can type to search products by:

- **Product name** — Partial or full match
- Results update instantly as the user types (with a debounce delay)
- Search is case-insensitive

::: info
Search operates on the products loaded by the table's [product source](/features/product-sources). It does not search your entire WooCommerce catalog — only the products that match the table's source configuration.
:::

## Category Filters

When category filters are enabled, a filter dropdown appears in the dedicated Filter Bar above the main table tools. Customers can:

- Select a product category to filter the table
- Clear the filter to show all products again
- Combine filtering with search for precise results

### Configuration
Enable category filters in the **Options** step of the [Creation Wizard](/features/creation-wizard#step-4-options):

1. Toggle **Filters** to on
2. Select which taxonomies to use (default: Product Categories)

## Sorting

When sorting is enabled, column headers become clickable. Customers can:

- Click a column header to sort by that column
- Click again to reverse the sort direction
- An arrow indicator shows the current sort column and direction

### Sortable Columns
The following columns support sorting:
- **Name** (alphabetical)
- **Price** (numerical)

## Pagination

When pagination is enabled:

- Products are split across multiple pages
- Navigation controls appear at the table bottom
- The **products per page** count is configurable (default: 10)

### Configuration

| Setting | Options | Default |
|---------|---------|---------|
| **Products per page** | Any number (1–100+) | 10 |
| **Position** | Bottom | Bottom |

## Price Range Filter <ProBadge /> <Badge type="tip" text="Since v1.2.0" />

ProductBay Pro includes a powerful price filter that allows customers to refine products by an exact price range. It can display as a dual-handle slider, number inputs, or both. The filter auto-detects the minimum and maximum prices of the products in your table.

[Read the full Price Filter guide &rarr;](/features/price-filter)

## Feature Toggles

All frontend features can be individually enabled or disabled:

| Feature | Default | Description |
|---------|---------|-------------|
| **Search** | ✅ On | AJAX search bar |
| **Sorting** | ✅ On | Column header sorting |
| **Pagination** | ✅ On | Paginated results |
| **Category Filters** | ✅ On | Category dropdown filter |
| **Price Filter** <ProBadge /> | ❌ Off | Price range slider and inputs |

Configure these in the **Options** step of the [Creation Wizard](/features/creation-wizard).
