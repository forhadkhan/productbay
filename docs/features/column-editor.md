# Column Editor

The Column Editor lets you choose which data columns appear in your product table, arrange their order, and control responsive visibility.

![Column Editor](/images/columns.webp)

## Available Columns

ProductBay includes a variety of column types to build your perfect product table.

### Product Image
Displays the product's featured thumbnail. Optionally includes a built-in lightbox for full-size viewing on click.

### Product Name
The product title, linked directly to the single product page.

### Price
The current price of the product, appropriately formatted with strike-throughs for products on sale.

### SKU
The Stock Keeping Unit of the product.

### Description
The product's short description (summary).

### Stock <Badge type="tip" text="Since v1.2.0" />
Displays the product's stock status (In Stock, Out of Stock, On Backorder) and optionally the exact stock quantity.

### Date <Badge type="tip" text="Since v1.2.0" />
Shows the product's published date or last modified date, formatted according to your WordPress date settings.

### Taxonomy <Badge type="tip" text="Since v1.2.0" />
Displays terms from any registered taxonomy, such as standard Categories and Tags, or any custom taxonomy you've registered.

### Rating <Badge type="tip" text="Since v1.2.0" />
Renders the average customer review rating as a visual stars element.

### Custom Field <ProBadge /> <Badge type="tip" text="Since v1.2.0" />
Display any product meta field, Advanced Custom Fields (ACF) data, or WooCommerce internal data. Includes intelligent auto-formatting for images, links, dates, and numbers. [Read the full Custom Field guide &rarr;](/features/custom-field-column)

### Combined Column <ProBadge /> <Badge type="tip" text="Since v1.2.0" />
Merge multiple data points into a single column using a powerful template syntax. For example, combine a product's SKU and Stock status into one cell. [Read the full Combined Column guide &rarr;](/features/combined-column)

## Adding & Removing Columns

- Toggle columns on/off using the checkboxes in the column list
- At least one column must be active

## Drag-and-Drop Reordering

Columns can be reordered by dragging them in the column list. The order in the editor corresponds directly to the order in the rendered table (left to right).

The live preview updates instantly as you rearrange columns.

## Responsive Visibility

For each column, you can configure visibility across three breakpoints:

| Device | Breakpoint | Description |
|--------|-----------|-------------|
| **Desktop** | ≥1024px | Large screens (laptops, desktops) |
| **Tablet** | 768px–1023px | Medium screens (tablets, small laptops) |
| **Mobile** | <768px | Small screens (phones) |

### Use Cases

- **Hide Image on mobile** to save horizontal space
- **Hide SKU on mobile** if it's not useful for mobile shoppers
- **Hide Summary on tablet** for a more compact layout

::: tip
Start with all columns visible on desktop, then progressively hide non-essential columns for smaller screens. The most critical columns (Name, Price, Add to Cart) should typically remain visible across all devices.
:::

## Cart Column

When add-to-cart is enabled in the [Options step](/features/creation-wizard#step-4-options), a cart action column is automatically appended to your table. This column includes:

- **Add to Cart button** for simple products
- **Variation selectors** for variable products
- **Quantity input** (if enabled)
- **Bulk select checkbox** for bulk add-to-cart
