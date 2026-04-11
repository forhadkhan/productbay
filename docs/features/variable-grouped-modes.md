# Variable & Grouped Product Modes <ProBadge />

ProductBay Pro transforms how your customers interact with complex products (Variable and Grouped). You can configure display modes per-table in the creation wizard under **Step 4: Options**.

## Variable Product Modes

Variable products contain multiple variations (e.g., a T-shirt available in different sizes and colors).

### Inline Dropdown (Default / Free)
Attribute dropdowns are embedded directly in the main table row. Selecting all attributes calculates the price, and the customer can add exactly one variation to the cart at a time.

### Popup Modal <ProBadge />
When the customer clicks "Select Options", a sleek modal overlay appears:
- Every variation is listed as a separate row in the modal.
- Customers can adjust quantities for multiple variations simultaneously.
- **Bulk Selection:** Select All checkboxes allow customers to quickly add all desired variations to their cart in a single click.
- The modal automatically adopts your main table's styling settings.

### Nested Rows <ProBadge />
A "toggle" button is added to the parent product row. When clicked, it expands via AJAX to reveal a nested sub-table showing all variations.
- *Tip: You can optionally set nested tables to be "expanded by default".*

### Separate Rows <ProBadge />
Each variation is forcefully detached from the parent product and rendered as an entirely independent row in the main table. The parent product is hidden, and its children appear alongside simple products. This is excellent for hardware stores or catalogs where every SKU needs instant visibility.

---

## Grouped Product Modes

Grouped products are collections of related simple products sold together (e.g., a "Complete Bed Set" that includes pillows, sheets, and a comforter).

### Direct Link (Default / Free)
The table simply renders a button linking the user to the single product page where they can configure and purchase the grouped collection.

### Inline Select <ProBadge />
A minimal dropdown selector is added to the table row:
- The customer selects which child product they want.
- The price updates instantly based on the selection.
- If multiple children exist, a "Select All" option allows bulk addition.

### Popup Modal <ProBadge />
Similar to the variable product modal, clicking the parent button opens an overlay listing all child products with their individual checkboxes, quantities, and direct add-to-cart buttons.

### Nested Rows <ProBadge />
The grouped product acts as a collapsible container. Clicking it drops down a nested table showing all child items, keeping the main table view clean while providing instant drill-down access.

### Separate Rows <ProBadge />
Breaks the group apart completely, rendering each child item as its own row in the main table.
