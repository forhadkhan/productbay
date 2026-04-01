# Gutenberg Blocks

ProductBay 1.1.0 introduces **two native Gutenberg Blocks** to elevate the table building experience directly inside the WordPress Block Editor. Unlike shortcodes, blocks offer a live visual preview and a streamlined configuration interface seamlessly integrated into WordPress.

## Product Table Block

The standard **Product Table** block securely embeds a single ProductBay table into any page or post while giving you a 1:1 preview of the live table.

### How to use it:
1. Open any page or post in the WordPress Block Editor.
2. Click the **`+` (Add Block)** button and search for "Product Table".
3. Insert the **ProductBay - Product Table** block.
4. If you have not selected a table yet, the block will show a placeholder. 
   - You can click **"Create New Table"** to jump straight to the wizard.
   - Or, select an existing table from the dropdown menu in the block toolbar or sidebar.
5. The block will instantly render a live visual preview of your table, matching the frontend exactly.

## Tabbed Product Table Block

The **Tabbed Product Table** block enables you to display multiple ProductBay tables inside a clean, interactive tabbed layout. It's incredibly useful for separating product catalogs by category or separating wholesale vs. retail price lists on a single page.

### How to use it:
1. Insert the **ProductBay - Tabbed Product Table** block into your editor.
2. In the block sidebar inspector, select the tables you want to display by checking the boxes or using the dropdown selector.
3. For each selected table, you can optionally define a **Custom Tab Label** (e.g., "Men's Clothing", "Electronics"). If left blank, it will default to "Tab 1", "Tab 2", etc.
4. The editor will render the tabs. Clicking the tabs in the editor will let you preview each table exactly as visitors will see it. 

> [!NOTE]
> Interaction with the tables inside the Gutenberg Editor (like sorting, filtering, and clicking 'Add to Cart') is suppressed so that clicking the block opens the block settings smoothly instead of interacting with the embedded table. All interactivity works perfectly on the live frontend.
