# Quick Start

This guide walks you through creating your first product table and embedding it on a page, in under a few seconds.

## Step 1: Open ProductBay

Navigate to **ProductBay** in your WordPress admin sidebar and click on the **"ProductBay"** button.

![ProductBay Button](/images/open-productbay.png)

You'll see a wizard to create a new table:

![ProductBay Wizard](/images/wizard-step-1.png)

if not, click on the wizard button located at the bottom-right corner of the page, it will open the wizard:

![ProductBay Wizard Button](/images/wizard-icon-pointer.png)


## Step 2.1: Setup New Table

- Give your table a **name** (e.g., "Summer Sales Products")
- Choose a **product source**:
  - **All Products** - display everything in your store
  - **By Category** - select specific categories
  - **On Sale** - only show products currently on sale
  - **Specific Products** - hand-pick products by name, ID, or SKU

Click **Next** to proceed.

![ProductBay Wizard Step 2](/images/wizard-step-1-basic-fill-guide.png)


## Step 2.2: Columns

- Configure which columns (1) to display (Image, Name, Price, SKU, Stock, Summary, etc.)
- **Drag and drop** to reorder columns
- Toggle visibility per device size (desktop, tablet, mobile)
- See live preview (2) of table changes while building

Click **Next** to proceed.

![ProductBay Wizard Step 3](/images/wizard-step-2-basic-fill-guide.png)

## Step 2.3: Display

Customize the visual design of your table:
- Header and body colors
- Button styles and hover effects
- Border styles and cell padding
- Typography settings   

*(Scroll down to see all the options)*

**Live preview** updates in real-time as you make changes. 

![ProductBay Wizard Step 4](/images/wizard-step-3-basic-fill-guide.png)

Click **Next** to proceed.

## Step 2.4: Options

Configure table behavior:
- Enable/disable **search**, **sorting**, **pagination**
- Set **products per page**
- Configure **add-to-cart** options (AJAX, quantity selectors)
- Enable **category filters**

![ProductBay Wizard Step 5](/images/wizard-step-4-basic-fill-guide.png)

Click **Create Table** button to save your table.

## Step 2.5: Finish

Congratulations! You've created your first product table. 🎉 A celebratory confetti animation confirms your table is live! 

![ProductBay Wizard Step 6](/images/wizard-step-5-basic-fill-guide.png)  

1. You can close the wizard by clicking on the close button (X) in the top-right corner of the wizard. 
2. You can view/edit your table by clicking on the **"View/Edit this table"** button. 
3. You can see all tables list by clicking on the **"Show all tables"** button. 

## Step 3: Copy the Shortcode

After publishing, you'll see a shortcode like:

```
[productbay id="1"] 
```

**Copy this shortcode.** You can copy the shortcode by clicking on the copy button (Copy) in the shortcode box or select the shortcode and copy it manually.

![ProductBay Shortcode](/images/copy-shortcode-from-wizard.png)  

You can also copy the shortcode from the **"Show all tables"** page. 

![ProductBay Shortcode](/images/copy-shortcode-from-tables-list.png)  


## Step 4: Embed on a Page

1. Go to **Pages → Add New** (or edit an existing page)
2. Add a **Shortcode** block (or paste directly in a Classic Editor)
3. Paste the shortcode: `[productbay id="1"]`
4. **Publish** or **Update** the page

## Step 5: View Your Table

Visit the page on the frontend. You should see your product table with all the columns, styling, and features you configured!

::: tip
You can embed the same table on multiple pages, or place multiple different tables on a single page, each with its own independent styling.
:::

## What's Next?

- Explore [Table Dashboard](/features/table-dashboard.html) to manage your tables
- Learn how to [Create Tables](/features/create-table.html) for best conversion rates 
- See how to use [Shortcodes](/features/shortcodes.html) to embed tables anywhere
