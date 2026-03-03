# Table Dashboard

The Table Dashboard is your central hub for managing all product tables in ProductBay.

## Overview

When you navigate to **ProductBay** in the WordPress admin, you'll see the **All Tables** view. This dashboard provides a complete overview of your tables with powerful management tools.

### Dashboard States

**Empty State**
If you haven't created any tables yet, the dashboard displays a clean empty state with a direct link to launch the [Guided Wizard](./creation-wizard).

![Empty State Dashboard](/images/empty-tables-page.png)

**Active Tables List**
Once tables are created, they appear in a structured list. Hovering over a table row reveals a contextual action menu directly below the title, allowing you to **Edit**, **Duplicate**, **Toggle Status**, or **Delete** the table instantly.

![All Tables Dashboard](/images/simple-tables-page.png)

## Table List

Each table in the list displays:

| Column | Description |
|--------|-------------|
| **Checkbox** | Select tables for bulk actions |
| **Title** | The name you gave your table |
| **Shortcode** | The embed code (e.g., `[productbay id="1"]`) — click to copy |
| **Source** | Where products come from (All, Category, Sale, Specific) |
| **Status** | Published or Private |
| **Date** | When the table was created |

## Search & Filtering

### Search
Use the search bar at the top to quickly find tables by name.

### Filters
Filter your tables by:
- **Status** — Published, Private, or All
- **Source** — All Products, Category, Sale, or Specific

You can combine multiple filters and use the **Clear all filters** option to reset.

## Table Actions

### Individual Actions
Hover over any table to reveal action buttons:

- **Edit** — Opens the table in the Creation Wizard for editing
- **Duplicate** — Creates a copy of the table with all its settings
- **Delete** — Removes the table (with confirmation)

### Bulk Actions
1. Select multiple tables using checkboxes
2. Click the **Bulk Actions** dropdown
3. Choose **Delete** and confirm

::: warning
Deleted tables cannot be recovered. Make sure you no longer need a table before deleting it.
:::

## Table Statuses

ProductBay tables have two statuses:

| Status | Visibility |
|--------|-----------|
| **Published** | Visible on the frontend wherever the shortcode is placed |
| **Private** | Hidden from frontend visitors. Admins will see a notice explaining the table is private. |

You can change a table's status at any time by editing it in the [Creation Wizard](/features/creation-wizard).

## Next Steps

- [Create a new table](/features/creation-wizard) using the wizard
- Learn about [Shortcodes](/features/shortcodes) to embed tables on your pages
