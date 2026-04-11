# WooCommerce Integration

ProductBay is built as a WooCommerce extension, providing deep integration with WooCommerce's product system, cart, and checkout.

## Supported Product Types

| Product Type | Support | Notes |
|-------------|---------|-------|
| **Simple** | Full | Standard add-to-cart with quantity |
| **Variable** | Full | Inline attribute selectors within the table |
| **Grouped** | Full | Links to the grouped product page |
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

Variable products display inline attribute selectors directly in the table row:

- **Dropdowns** appear for each attribute (e.g., Size, Color)
- Selecting attributes updates the **price** in real-time
- The **Add to Cart** button activates once all required attributes are selected
- **Out of stock** variations are automatically disabled

This eliminates the need to visit individual product pages to choose variations.

## Price Display

Prices are rendered using WooCommerce's native formatting:
- **Currency symbol** and position (before/after)
- **Decimal separator** and thousand separator
- **Sale prices** shown with strikethrough on the regular price
- **Variable price ranges** (e.g., "$10.00 – $25.00") when no variation is selected

## Cart URL
After adding a product to cart, a "View Cart" link appears, directing customers to the WooCommerce cart page.
