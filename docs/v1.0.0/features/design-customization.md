# Design Customization

ProductBay gives you granular control over the visual appearance of each table. Every table has its own scoped CSS, so styles never leak between tables.

## Header Styling

| Property | Description | Default |
|----------|-------------|---------|
| **Background Color** | Header row background | `#f0f0f1` |
| **Text Color** | Header text color | `#333333` |
| **Font Size** | Header font size | `16px` |
| **Font Weight** | Header font weight | Bold |

## Body Styling

| Property | Description | Default |
|----------|-------------|---------|
| **Background Color** | Body rows background | `#ffffff` |
| **Text Color** | Body text color | `#444444` |
| **Alternating Rows** | Enable zebra striping | Disabled |
| **Alt Background** | Alternating row background color | `#f9f9f9` |
| **Alt Text Color** | Alternating row text color | `#444444` |
| **Border Color** | Row/cell border color | `#e5e5e5` |

### Alternating Rows (Zebra Striping)
Enable this to apply different background colors to even and odd rows. This improves readability for tables with many rows.

## Button Styling

The add-to-cart button can be fully customized:

| Property | Description | Default |
|----------|-------------|---------|
| **Background Color** | Button background | `#2271b1` |
| **Text Color** | Button text | `#ffffff` |
| **Border Radius** | Button corner rounding | `4px` |
| **Icon** | Button icon style | Cart |
| **Hover Background** | Background on hover | `#135e96` |
| **Hover Text Color** | Text color on hover | `#ffffff` |

## Layout

| Property | Description | Default |
|----------|-------------|---------|
| **Border Style** | Table border style | Solid |
| **Border Color** | Table border color | `#e5e5e5` |
| **Border Radius** | Table corner rounding | `0px` |
| **Cell Padding** | Space inside each cell | Normal |

### Cell Padding Options
- **Compact** — Tight spacing for dense tables
- **Normal** — Standard spacing (default)
- **Comfortable** — Extra spacing for readability

## Hover Effects

| Property | Description | Default |
|----------|-------------|---------|
| **Row Hover** | Highlight rows on mouse hover | Enabled |
| **Hover Background** | Row background on hover | `#f5f5f5` |

## Instance-Scoped CSS

Each table generates a unique CSS scope. This means:
- Multiple tables on the same page won't share or override each other's styles
- Table styles won't interfere with your theme's CSS
- Your theme's CSS won't break the table layout

## Live Preview

All design changes are shown in real-time in the preview panel during the [Creation Wizard](/features/creation-wizard). What you see in the preview is exactly what visitors will see on the frontend.
