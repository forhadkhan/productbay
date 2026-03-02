# Global Settings

ProductBay provides global settings that apply across all tables. Access them from **ProductBay → Settings** in the WordPress admin.

![Global Settings](/images/settings.png)

## General Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Add to Cart Text** | Text | "Add to Cart" | The label shown on add-to-cart buttons across all tables |
| **Products Per Page** | Number | 10 | Default number of products shown per page (can be overridden per table) |
| **Show Admin Bar** | Toggle | Enabled | Show ProductBay link in the WordPress admin bar |
| **Delete on Uninstall** | Toggle | Enabled | Remove all plugin data when the plugin is deleted |

::: warning
When "Delete on Uninstall" is enabled, **all tables, settings, and metadata** will be permanently removed when you delete the plugin. See [Uninstallation](/guide/uninstallation) for details.
:::

## Default Design

These design defaults are used as the starting point when creating new tables. They can be overridden per table in the [Design Customization](/features/design-customization) step.

| Setting | Default |
|---------|---------|
| **Header Background** | `#f3f4f6` |
| **Border Color** | `#e5e7eb` |

## Resetting to Defaults

ProductBay includes a **Reset** feature that restores the plugin to its initial "just installed" state. This action:

1. **Deletes all ProductBay tables** (custom post type entries)
2. **Clears all table configuration metadata**
3. **Resets plugin settings** to factory defaults
4. **Resets onboarding state** (the welcome wizard will appear again)

::: danger Irreversible Action
The reset action **permanently deletes all your tables and settings**. This cannot be undone. Use with extreme caution and only when you want a complete fresh start.
:::

## Default Table Configuration

When you create a new table, it starts with these default settings (configurable per table):

### Source Defaults
- **Source type:** All Products
- **Stock status:** Any
- **Sort by:** Date (Newest First)

### Style Defaults
| Element | Background | Text Color |
|---------|-----------|------------|
| Header | `#f0f0f1` | `#333333` |
| Body | `#ffffff` | `#444444` |
| Button | `#2271b1` | `#ffffff` |
| Button Hover | `#135e96` | `#ffffff` |

### Feature Defaults
| Feature | Default |
|---------|---------|
| Search | Enabled |
| Sorting | Enabled |
| Pagination | Enabled (10 per page) |
| Category Filters | Enabled |
| Add to Cart | Enabled (AJAX, with quantity) |
