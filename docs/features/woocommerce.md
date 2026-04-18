# WooCommerce Integration

ProductBay is built as a WooCommerce extension, providing deep integration with WooCommerce's product system, cart, and checkout.

## Supported Product Types

| Product Type | Support | Notes |
|-------------|---------|-------|
| **Simple** | Full | Standard add-to-cart with quantity |
| **Variable** | Full | Inline attribute selectors (Free) or Popup/Nested/Separate rows (Pro) |
| **Grouped** | Full | Links to single product page (Free) or Inline/Popup/Nested/Separate (Pro) |
| **External / Affiliate** | Full | "Buy Now" button linking to external URL |

## Add to Cart

### AJAX Add to Cart
When enabled, products are added to the cart **without a page reload**. A success message appears inline, confirming the item was added.

This provides a seamless shopping experience, especially for tables with many products.

### Quantity Selector
Enable per-row quantity inputs so customers can specify how many units to add. The input respects WooCommerce's min/max and step settings for each product.

### Bulk Add to Cart
ProductBay supports adding multiple products at once:

1. Enable the checkbox column by turning on cart features
2. Customers select multiple products using checkboxes
3. Click the "Add Selected to Cart" button
4. All selected products are added in a single AJAX request

::: tip
Bulk add-to-cart works with simple products. Variable products need their attributes selected individually before they can be added.
:::

## Variable Products

By default, ProductBay displays variable products using inline attribute selectors:

- **Dropdowns** appear for each attribute (e.g., Size, Color)
- Selecting attributes updates the **price** in real-time
- The **Add to Cart** button activates once all required attributes are selected
- **Out of stock** variations are automatically disabled

### Advanced Variable Modes <ProBadge /> <Badge type="tip" text="Since v1.2.0" />

ProductBay Pro unlocks **3 additional display modes** for variable products, allowing for a vastly superior shopping experience:

1. **Popup Modal:** Opens a full-featured modal where customers can see all variations, select quantities, and add multiple variations at once using bulk selection.
2. **Nested Rows:** Expandable child rows that display all variations directly below the parent row.
3. **Separate Rows:** Each variation is split into its own independent row in the main table.

[Read the Advanced Modes guide &rarr;](/features/variable-grouped-modes)

## Grouped Products

By default, grouped products display a simple button directing the user to the single product page.

### Advanced Grouped Modes <ProBadge /> <Badge type="tip" text="Since v1.2.0" />

ProductBay Pro allows you to display grouped products directly within the table using 4 different modes:

1. **Inline Select:** A dropdown in the table row letting customers pick a child product, set quantity, and add to cart without leaving the page.
2. **Popup Modal:** A full modal listing all child products for easy selection.
3. **Nested Rows:** Expandable child rows containing grouped items underneath the parent limit.
4. **Separate Rows:** Treats each child product as a separate standalone table row.

[Read the Advanced Modes guide &rarr;](/features/variable-grouped-modes)

## Price Display

Prices are rendered using WooCommerce's native formatting:
- **Currency symbol** and position (before/after)
- **Decimal separator** and thousand separator
- **Sale prices** shown with strikethrough on the regular price
- **Variable price ranges** (e.g., "$10.00 – $25.00") when no variation is selected

## Cart URL
After adding a product to cart, a "View Cart" link appears, directing customers to the WooCommerce cart page.
