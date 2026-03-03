# Guided Wizard

The Guided Wizard is designed to make building product tables effortless, whether you're a first-time user or an experienced administrator.

## Entry Points

### Welcome Wizard
When you first install and activate ProductBay, the **Welcome Wizard** automatically launches to guide you through creating your very first table. This ensures you can get a table live on your site in under a minute.

### Floating Action Button
A **Floating Action Button (FAB)** is available at the bottom-right corner of the admin panel. Click this button at any time to quickly launch the wizard and start a new build.

## Wizard Steps

The wizard consists of **5 focused steps**:

1. **Setup** — Name your table and choose a product source
2. **Columns** — Select and arrange the columns to display
3. **Display** — Customize the visual design
4. **Options** — Configure behavior and features
5. **Finish** — Review and publish

You can navigate between steps freely, changes are preserved as you move back and forth.


## Step 1: Setup

### Table Name
Give your table a descriptive name. This is for your reference only — it's not shown on the frontend.

![Wizard - Set Table Name](/images/wizard--set-name.png)

### Product Source
Choose where your products come from:

| Source | Description |
|--------|-------------|
| **All Products** | Displays all published products in your WooCommerce store |
| **On Sale** | Only products currently on sale |
| **By Category** | Select one or more product categories |
| **Specific Products** | Hand-pick products by searching name, ID, or SKU |

#### Source: Category 
![Source: Category ](/images/wizard--source-category.png)  

1. Select 'By Category' as source  
2. Open/Close category list 
3. Select/deselect catrgories 
4. Search category 
5. If needed, reload categories 
6. Clear all selected categories 

#### Source: Specific Products 

![Source: Specific Products ](/images/wizard--source-specific-products.png)  

1. Select 'Specific Products' as source  
2. Search products by name, id or sku 
3. Select desired product(s) 
4. See selected product(s), you can also remove any selected product from here. 
5. Remove all selected product 

::: tip
For each source type, you'll see live statistics showing how many products and categories match your selection.
:::


### Default Sort Order
Configure how products are initially sorted:
- Name (A-Z or Z-A)
- Price (Low to High or High to Low)
- Date (Newest or Oldest first)
- Popularity

## Step 2: Columns

### Available Column Types

| Column | Description |
|--------|-------------|
| **Image** | Product thumbnail image |
| **Name** | Product title (linked to product page) |
| **Price** | Current price (including sale prices) |
| **SKU** | Stock Keeping Unit identifier |
| **Stock** | Stock status indicator |
| **Summary** | Product short description |

### Drag-and-Drop Reordering
Drag columns to change their display order. The live preview updates instantly.

### Responsive Visibility
For each column, you can configure visibility per device:
- **Desktop** — Show or hide on large screens
- **Tablet** — Show or hide on medium screens
- **Mobile** — Show or hide on small screens

This lets you create streamlined mobile layouts by hiding less essential columns.

## Step 3: Display

The Display step gives you full control over the visual appearance of your table. See [Design Customization](/features/design-customization) for detailed documentation.

Key areas:
- Header styling (background, text color, font weight)
- Body styling (background, text, alternating rows)
- Button styling (colors, border radius, icon, hover effects)
- Layout (border style, border radius, cell padding)
- Hover effects (row hover highlight)

## Step 4: Options

### Features
Toggle individual table features on or off:
- **Search** — Enable the AJAX search bar
- **Sorting** — Allow column-based sorting
- **Pagination** — Enable paginated results
- **Category Filters** — Show dropdown filters by taxonomy

### Pagination
- **Products per page** — Set how many products display per page
- **Position** — Show pagination at the bottom of the table

### Cart Options
- **Enable Add to Cart** — Show add-to-cart buttons
- **Method** — Button style
- **Show Quantity** — Display quantity input fields
- **AJAX Add to Cart** — Add to cart without page reload

## Step 5: Finish

The final step provides:
- A summary of your table configuration
- The option to set the table status (**Published** or **Private**)
- A **Publish** / **Update** button

After publishing, a confetti animation celebrates your success! 🎉 You'll also see the shortcode to copy and embed.

## Editing an Existing Table

To edit a table, click **Edit** from the [Table Dashboard](/features/table-dashboard). The wizard opens with all your existing settings loaded, and you can modify any step.
