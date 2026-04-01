# Search & Filters

ProductBay includes built-in frontend search, filtering, sorting, and pagination — all powered by AJAX for a seamless, no-reload experience.

## Search

When search is enabled, a search bar appears above the table. Customers can type to search products by:

- **Product name** — Partial or full match
- Results update instantly as the user types (with a debounce delay)
- Search is case-insensitive

::: info
Search operates on the products loaded by the table's [product source](/features/product-sources). It does not search your entire WooCommerce catalog — only the products that match the table's source configuration.
:::

## Category Filters

When category filters are enabled, a filter dropdown appears alongside the search bar. Customers can:

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

## Feature Toggles

All frontend features can be individually enabled or disabled:

| Feature | Default | Description |
|---------|---------|-------------|
| **Search** | ✅ On | AJAX search bar |
| **Sorting** | ✅ On | Column header sorting |
| **Pagination** | ✅ On | Paginated results |
| **Category Filters** | ✅ On | Category dropdown filter |

Configure these in the **Options** step of the [Creation Wizard](/features/creation-wizard).
