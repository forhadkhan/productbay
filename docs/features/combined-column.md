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

### Sub-Elements Builder

The Combined Column features a drag-and-drop builder interface rather than using complex template tags. 

Inside the Combined Column settings, you can:
1. **Add Elements:** Click the "Add Element" dropdown to add any standard column type (Name, Price, SKU, custom fields, etc.) as sub-elements.
2. **Layout Options:** Choose between:
   - **Inline:** Elements display side-by-side (flex row). You can optionally define a character or symbol (like `|` or `-`) as a **Separator** between elements.
   - **Stacked:** Elements display one below the other (block).
3. **Prefix & Suffix:** Each added sub-element has its own settings, allowing you to easily add text before or after its dynamic value (e.g., Prefix: `SKU: ` or Suffix: ` kg`).
4. **Reorder:** Drag and drop elements up or down in the list to rearrange how they appear in the final output.
