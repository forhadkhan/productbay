# Column Editor

The Column Editor lets you choose which data columns appear in your product table, arrange their order, and control responsive visibility.

## Available Columns

| Column | Description | Example Content |
|--------|-------------|-----------------|
| **Image** | Product thumbnail | Product photo |
| **Name** | Product title, linked to the product page | "Blue Running Shoes" |
| **Price** | Current price, including sale formatting | ~~$49.99~~ $39.99 |
| **SKU** | Stock Keeping Unit | "SHOE-BLUE-42" |
| **Stock** | Stock status indicator | "In Stock", "Out of Stock" |
| **Summary** | Product short description | "Lightweight breathable running shoes..." |

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
