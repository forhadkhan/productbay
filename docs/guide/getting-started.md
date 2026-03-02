# Quick Start

This guide walks you through creating your first product table and embedding it on a page — in under 5 minutes.

## Step 1: Open ProductBay

Navigate to **ProductBay** in your WordPress admin sidebar. You'll land on the **Dashboard**.

![ProductBay Dashboard](/images/all-tables.png)

## Step 2: Create a New Table

Click the **"Create New Table"** button. This opens the **Creation Wizard**, a guided 5-step process.

### Step 2a: Setup

- Give your table a **name** (e.g., "All Products Table")
- Choose a **product source**:
  - **All Products** — display everything in your store
  - **By Category** — select specific categories
  - **On Sale** — only show products currently on sale
  - **Specific Products** — hand-pick products by name, ID, or SKU

Click **Next** to proceed.

### Step 2b: Columns

- Configure which columns to display (Image, Name, Price, SKU, Stock, Summary, etc.)
- **Drag and drop** to reorder columns
- Toggle visibility per device size (desktop, tablet, mobile)

Click **Next** to proceed.

### Step 2c: Display

Customize the visual design of your table:
- Header and body colors
- Button styles and hover effects
- Border styles and cell padding
- Typography settings

A **live preview** updates in real-time as you make changes.

### Step 2d: Options

Configure table behavior:
- Enable/disable **search**, **sorting**, **pagination**
- Set **products per page**
- Configure **add-to-cart** options (AJAX, quantity selectors)
- Enable **category filters**

### Step 2e: Finish

Review your table settings and click **Publish**. 🎉 A celebratory confetti animation confirms your table is live!

## Step 3: Copy the Shortcode

After publishing, you'll see a shortcode like:

```
[productbay id="1"]
```

Copy this shortcode.

## Step 4: Embed on a Page

1. Go to **Pages → Add New** (or edit an existing page)
2. Add a **Shortcode** block (or paste directly in a Classic Editor)
3. Paste the shortcode: `[productbay id="1"]`
4. **Publish** or **Update** the page

## Step 5: View Your Table

Visit the page on the frontend. You should see your product table with all the columns, styling, and features you configured!

::: tip
You can embed the same table on multiple pages, or place multiple different tables on a single page — each with its own independent styling.
:::

## What's Next?

- Learn about [Product Sources](/features/product-sources) to fine-tune which products appear
- Explore [Design Customization](/features/design-customization) for pixel-perfect styling
- Set up [Search & Filters](/features/search-and-filters) for an interactive browsing experience
