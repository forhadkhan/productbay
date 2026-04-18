# Combined Column <ProBadge /> <Badge type="tip" text="Since v1.2.0" />

The Combined Column allows you to merge multiple disparate data points into a single, clean table cell. This is particularly useful when you want to display dense information without taking up horizontal screen space.

## Use Cases

- **Merging Identifiers:** Display the Product SKU and the Stock Status together (e.g., `SKU: 12345 | In Stock`).
- **Dimensions:** Combine Weight, Length, Width, and Height custom fields into a single "Dimensions" column.
- **Pricing & Rating:** Show the Price and the Star Rating in the same cell.

## Configuration

To set up a Combined Column:

1. Add the **Combined** column from the Column Editor.
2. Under the column settings, enter your **Template Syntax**.

### Template Syntax

You can combine static text with dynamic product data using bracket markers. For example, if you want to combine SKU and Stock, you specify the template. The specific syntax will depend on the internal shortcodes or template tags available in the builder (refer to the helper panel inside the wizard for a list of available tags).

*(Documentation for exact template syntax goes here)*
