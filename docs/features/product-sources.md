# Product Sources

Product sources determine **which products** appear in your table. ProductBay offers several flexible source options.

## Source Types

### All Products

Displays all published products from your WooCommerce store.

- **Best for:** General product catalogs, store-wide listings
- **Products included:** All products with "Published" status

### By Category

Select one or more WooCommerce product categories to populate your table.

- **Best for:** Category-specific pages, seasonal collections
- **Search:** Type to search and select categories from a dropdown
- **Multiple categories:** You can select multiple categories — products from all selected categories will be included

### On Sale

Automatically includes only products currently on sale. This uses WooCommerce's native sale detection, which accounts for:
- Regular sale prices
- Scheduled sales (start/end dates)
- Variable product sales (if any variation is on sale)

- **Best for:** Sale pages, promotional landing pages
- **Dynamic:** Products automatically appear/disappear as sales start and end

### Specific Products

Hand-pick individual products by searching for them.

- **Search by name** — Type a product name for fuzzy matching
- **Search by ID** — Enter an exact product ID
- **Search by SKU** — Enter a full or partial SKU

- **Best for:** Curated lists, featured products, comparison tables

## Query Modifiers

Regardless of source type, you can further refine which products appear:

### Exclude Product IDs
Enter one or more product IDs to **exclude** from the table. Useful for hiding discontinued items or products you don't want in a particular table.

### Stock Status Filter

| Option | Description |
|--------|-------------|
| **Any** | Show products regardless of stock status |
| **In Stock** | Only products that are in stock |
| **Out of Stock** | Only products that are out of stock |
| **On Backorder** | Only products accepting backorders |

### Price Range
Set minimum and/or maximum price bounds to limit displayed products. Leave a field empty for no limit.

## Sort Order

Configure the default sorting for your table:

| Sort By | Options |
|---------|---------|
| **Name** | A → Z or Z → A |
| **Price** | Low → High or High → Low |
| **Date** | Newest First or Oldest First |
| **Popularity** | Best Selling First |

::: tip
This sets the **default** sort order. If [sorting is enabled](/features/search-and-filters) in table options, customers can re-sort by clicking column headers.
:::
