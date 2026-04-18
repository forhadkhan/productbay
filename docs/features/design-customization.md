# Design Customization

ProductBay gives you granular control over the visual appearance of each table. Every table has its own scoped CSS, so styles never leak between tables.

## Header Styling

| Property | Description | Default |
|----------|-------------|---------|
| **Background Color** | Header row background | `#f0f0f1` |
| **Text Color** | Header text color | `#333333` |
| **Font Weight** | Header font weight (Normal, Bold, Extra Bold) | Bold |
| **Text Transform** | Header text capitalization (Uppercase, Lowercase, Capitalize, Normal) | Uppercase |

## Body Styling

| Property | Description | Default |
|----------|-------------|---------|
| **Background Color** | Body rows background | `#ffffff` |
| **Text Color** | Body text color | `#444444` |

### Alternating Rows (Zebra Striping)

Enable the **Alternate Rows** toggle to apply different background colors to even and odd rows. This improves readability for tables with many rows.

When toggled **on**, two additional color pickers appear:

| Property | Description | Default |
|----------|-------------|---------|
| **Alternate Background** | Background for even rows | `#f9f9f9` |
| **Alternate Text** | Text color for even rows | `#444444` |

When toggled **off**, all rows use the same Body background and text colors.

## Button Styling

The add-to-cart button can be fully customized with both default and hover states:

| Property | Description | Default |
|----------|-------------|---------|
| **Background Color** | Button background | `#2271b1` |
| **Text Color** | Button text | `#ffffff` |
| **Hover Background** | Background on hover | `#135e96` |
| **Hover Text Color** | Text color on hover | `#ffffff` |

## Layout

| Property | Description | Default |
|----------|-------------|---------|
| **Border Style** | Table border style (None, Solid, Dashed) | Solid |
| **Border Color** | Table border color (disabled when border style is None) | `#e5e5e5` |
| **Border Radius** | Toggle on/off + numeric px value for corner rounding | On, `0px` |
| **Cell Padding** | Space inside each cell (Compact, Normal, Spacious) | Normal |

### Border Radius
The border radius has its own **enable toggle**. When off, the table has sharp corners regardless of the px value. When on, you can set a custom pixel value (0–24px).

### Cell Padding Options
- **Compact** — Tight spacing for dense tables
- **Normal** — Standard spacing (default)
- **Spacious** — Extra spacing for readability

## Hover Effects

The **Row Hover Effect** has its own **enable toggle**. When on, rows are visually highlighted when the cursor passes over them.

| Property | Description | Default |
|----------|-------------|---------|
| **Row Hover** | Enable/disable row hover highlighting | Enabled |
| **Hover Background** | Row background on hover | `#f5f5f5` |
| **Hover Text Color** | Row text color on hover | *(inherit)* |

When the toggle is off, the hover color pickers are greyed out.

## Instance-Scoped CSS

Each table generates a unique CSS scope. This means:
- Multiple tables on the same page won't share or override each other's styles
- Table styles won't interfere with your theme's CSS
- Your theme's CSS won't break the table layout

## Live Preview

All design changes are shown in real-time in the preview panel during the [Creation Wizard](/features/creation-wizard). What you see in the preview is exactly what visitors will see on the frontend.
