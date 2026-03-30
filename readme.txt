=== ProductBay – High-Performance Product Table for WooCommerce ===
Contributors: wpanchorbay, forhadkhan, sankarsan, arifac
Tags: product table for woocommerce, woocommerce product table, woocommerce product list, product table, product list
Requires at least: 6.8
Tested up to: 6.9
Requires PHP: 7.4
Stable tag: 1.1.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Build fast and efficient product tables for WooCommerce with AJAX search, bulk add-to-cart, and a  creation wizard with live-preview.

== Description ==

WooCommerce's default grid layout is great for browsing, but it isn't always the right fit for every store. Wholesale shops, large catalogs, B2B order forms, price lists, quick-order tables, and restaurant menus all need something different, a clean, fast, scannable table where customers can compare products, select options, and add to cart in seconds.

**ProductBay** transforms how your WooCommerce products are displayed. Build beautiful, responsive product tables using a guided wizard, no coding required, and embed them anywhere on your site with a simple shortcode.

-------
[Home](https://wpanchorbay.com/plugins/productbay/) | [Documentation](https://docs.wpanchorbay.com/productbay/)
-------

[youtube https://www.youtube.com/watch?v=gFp_4gpe-lY]

> **ProductBay requires WooCommerce to be installed and active.**

= Perfect For =

* Wholesale & B2B stores
* Large product catalogs
* Quick-order & bulk-order forms
* Price lists & product directories
* Restaurant & food menus
* Digital product libraries 
* Any WooCommerce store who wants easy and efficient product listing

---

= Why ProductBay? =

Unlike traditional table plugins, ProductBay is built on a **modern hybrid architecture**:

* **Admin Panel:** A fully responsive Single Page Application (SPA) built with React 18, TypeScript, and Tailwind CSS, so the table builder feels fast, fluid, and intuitive.
* **Frontend Display:** A lightweight, SEO-friendly rendering engine optimized for Core Web Vitals, so your customers get speed without bloat.

**No external CDN. No remote scripts. No data ever leaves your server.** All assets are bundled locally inside the plugin.

---

= Guided Table Creation Wizard =

Creating a product table has never been easier. ProductBay walks you through a focused **5-step wizard**:

1. **Setup**: Name your table and choose a product source
2. **Columns**: Pick and arrange which data columns to display
3. **Display**: Customize colors, typography, borders, and spacing
4. **Options**: Configure filters, pagination, and sorting defaults
5. **Finish**: Copy your `shortcode` and publish 

= Live Preview =
A **real-time live preview** updates as you make changes. What you see in the wizard is exactly what your customers will see on the front end.

---

= Smart Product Sources =

Control exactly which products appear in each table:

* **By Category**: Show all products from one or more categories
* **By Sale Status** : Display currently on-sale products
* **By Specific IDs**: Handpick individual products
* **All Products**: Pull your entire catalog into the table

**Query Modifiers:** Exclude product IDs, filter by stock status, set a minimum/maximum price range, and choose a default sort order (name, price, date, or popularity).

---

= Advanced Column Editor =

Full control over what data appears in your table and how it's arranged:

* **Drag-and-Drop Reordering**: Change column order visually with an intuitive interface
* **Column Types**: Product Image, Name, Price, SKU, Description, Add to Cart, Bulk Selection and more
* **Responsive Visibility**: Set custom width for each column in pixel (px), percentage (%) or auto. Configure per-column show/hide rules for desktop/laptop, tablet, and mobile independently
* **Tablet & Phone Columns are optional**: if left empty, the plugin falls back to your desktop column configuration automatically

---

= Seamless WooCommerce Integration =

ProductBay is built for WooCommerce from the ground up:

* **Simple Products**: Standard add-to-cart button
* **Variable Products**: Inline attribute selectors (for each variable) right inside the table row. Visual indicators showing which variations were added, natively synced with the WooCommerce Cart
* **Grouped Products**: Link to product page or display child items
* **External / Affiliate Products**: Displays the external buy button correctly
* **AJAX Add-to-Cart**: Products are added without any page reload
* **Bulk Add-to-Cart**: Customers can select multiple products and add them all at once with a single click
* **Selected Items Panel**: A floating popup showing selected products with individual quantities, pricing, and remove controls
* **Clear All Selections**: A global "Clear all" button to reset bulk selections instantly

---

= Search & Filter =

Help customers find instantly what they're looking for, without page reloads:

* **Instant AJAX Search**: Live search that filters the product list as users type
* **Category Filter**: Native dropdown to filter by product category
* **Product Type Filter**: Dropdown to filter by Simple, Variable, Grouped, or External product type
* **AJAX Pagination**: Page through results without full page reloads

---

= Image Lightbox =

Product images open in a popup/modal with fullscreen toggling and close controls, built using native resources for maximum performance, with no bloated third-party library required.

---

= Deep Design Customization =

Every table is independently styled. Multiple tables on the same page will never conflict with each other:

* **Colors**: Background, text, borders, alternate rows (zebra striping) and hover states
* **Typography**: Font size and font weight per element
* **Borders**: Border style, width, and radius
* **Spacing**: Cell padding per table

---

= Table Management Dashboard =

A centralized admin dashboard to manage all your tables at a glance:

* **Search Tables**: Find any table quickly by name
* **Filter by Status**: Published or Private
* **Filter by Product Source**: Category, Sale, IDs, or All
* **Bulk Status Update**: Update status of tables at once to private or published
* **Bulk Delete**: Clean up multiple tables at once
* **Shortcode Display**: Every table shows its shortcode instantly
* **Date**: See created, modified and published date for each table

---

= Developer-Friendly =

ProductBay exposes **30+ action hooks and filters** across all plugin layers, Core, Data, API, Frontend, and Admin, so developers can extend or modify behavior without ever touching plugin files:

* Hook into query arguments, cell output, table styles, and more
* A dedicated **Hooks & Filters reference page** is included directly in the plugin's admin area
* All frontend assets are only loaded on pages where a table shortcode is present

---

= Translation Ready =

**100%** of all user-facing strings are wrapped in WordPress localization functions. ProductBay is fully ready to be translated into any language.

---

= Coming Soon: ProductBay Pro =

We're actively building a Pro add-on that will extend ProductBay with advanced capabilities:

* **Variation Popup & Nested Rows**: Richer variable/grouped product interactions
* **Pro Columns**: Ratings, reviews, dimensions, discount badges, B2B quantity column
* **Lazy Loading**: Improved performance with lazy loading including infinite scroll or "Load More" button instead of pagination
* **Quick View Modal**: AJAX-loaded product detail popup
* **Custom CSS Editor**: Per-table scoped CSS editor in the admin
* **Advanced Filters**: Sidebar/drawer/top menu layout, attribute filters, active filter chips
* **Import / Export**: Backup and share table configurations as JSON
* **Premium Templates**: One-click style presets
* **Analytics**: Table impressions, click tracking, and a dashboard widget

---

== Installation ==

= Option A: Install from WordPress.org (Recommended) =

1. In your WordPress admin, go to **Plugins → Add New**.
2. Search for **ProductBay**.
3. Click **Install Now**, then **Activate**.
4. Ensure WooCommerce is installed and active.
5. Navigate to **ProductBay** in the admin menu to create your first table.

= Option B: Manual Upload =

1. Download the plugin `.zip` file.
2. In your WordPress admin, go to **Plugins → Add New → Upload Plugin**.
3. Upload the `.zip` file and click **Install Now**, then **Activate**.
4. Navigate to **ProductBay** in the WordPress admin menu.

= Using Your Table =

After creating a table, copy its shortcode (e.g., `[productbay id="1"]`) and paste it into any page, post, or widget using the WordPress Shortcode block.

== Frequently Asked Questions ==

= Does this plugin require WooCommerce? =

Yes. ProductBay is a WooCommerce extension and will not function without WooCommerce installed and active.

= Which WooCommerce product types are supported? =

ProductBay supports all four core WooCommerce product types: **Simple**, **Variable**, **Grouped**, and **External/Affiliate**.

= How do I display a product table on a page? =

After creating a table in the ProductBay dashboard, copy its shortcode — for example `[productbay id="1"]` — and paste it into any page, post, or widget using the WordPress Shortcode block.

= Can I display multiple tables on the same page? =

Yes. Each table uses its own scoped CSS, so multiple tables on the same page will never conflict with each other's styling.

= Can customers add multiple products to the cart at once? =

Yes. ProductBay includes a **Bulk Add-to-Cart** feature. Customers can select multiple products using checkboxes and add them all to the cart in a single click. A "Selected Items" panel shows a live summary of selections, and a "Clear All" button resets them instantly.

= How do variable products work inside the table? =

Variable products display inline attribute selectors (size, color, etc.) directly in the table row, no need to visit the product page to choose a variation. Variation badges then visually confirm which options were added to the cart.

= Can I configure different columns for desktop, tablet, and mobile? =

Yes. The column editor allows you to configure independent show/hide rules for each column per device size (desktop, tablet, and phone). Tablet and phone columns are completely optional, if left empty, the plugin automatically uses your desktop column configuration for smaller devices.

= Can customers search and filter products in the table? =

Yes. Every table supports instant AJAX search, a price range filter (slider, inputs, or both), a product category dropdown filter, and a product type dropdown filter, all without any page reloads.

= Does the plugin slow down my site? =

No. ProductBay is built with performance as a core priority. Plugin assets are only loaded on pages where a table shortcode is present. Product queries are cached for 30 minutes using a stale-while-revalidate strategy to minimize database load. The frontend rendering engine is intentionally lightweight and optimized for Core Web Vitals.

= Does the plugin call any external services or load remote scripts? =

No. All JavaScript, CSS, and other assets are bundled locally inside the plugin. No data is sent to any external server, and no remote CDN scripts are ever loaded.

= How many tables can I create? =

There is no limit. You can create as many product tables as your store requires.

= Is ProductBay compatible with page builders like Elementor, Divi, or WPBakery? =

Yes. ProductBay uses a standard WordPress shortcode (`[productbay id="X"]`), which is compatible with any page builder that supports shortcodes.

= Is there a Pro version available? =

A Pro add-on is currently in development and will unlock advanced features including additional column types, lazy loading, quick view modals, advanced filters, and more. Visit [wpanchorbay.com](https://wpanchorbay.com/plugins/productbay) for updates.

= Is ProductBay translation ready? =

Yes. All user-facing strings use WordPress localization functions and the plugin is 100% translation ready.

= Where can I get support? =

Use the support forum on this plugin's WordPress.org page. We aim to respond within 2 business days. You can also reach us directly at [contact@wpanchorbay.com](mailto:contact@wpanchorbay.com).

== Screenshots ==

1. Create/View/Modify product tables with live preview and smooth experience.
2. The ProductBay dashboard — manage all your tables with status indicators and shortcodes at a glance.
3. Show the product in any page or post using the shortcode througout your website. View products efficiently and filter by catrgory and type. 
4. Add products to cart in bulk using the checkbox and add to cart button. View selected items in the floating panel and remove them if needed.
5. Step 1 of the creation wizard — name your table and choose your product source.
6. Step 2 — the column editor with drag-and-drop reordering and per-device responsive visibility controls.
7. Step 3 — the design panel with live preview updating in real time as you customize colors, typography, and spacing.
8. Step 4 — the options panel for configuring filters, pagination, and sorting.
9. See full-screen live preview of the table as you design it.
10. Step 4 — the table is created and ready to be used.


== Changelog ==

= 1.1.0 =

* Feature: Native Gutenberg blocks for Product Table and Tabbed Product Tables with server-side rendering.
* Improvement: Filters bar repositioned above toolbar for better UX flow.
* Improvement: Admin menu (WooCommerce > Products) renamed from "All Tables" to "Product Tables" for clarity.
* Improvement: Hover highlight improvements across admin UI.
* Improvement: Shortcode display layout refined on the table management page.
* Dev: Restructured codebase for Pro extension architecture.
* Dev: Exposed UI components and settings globally for Pro add-on consumption.

= 1.0.0 =

* Initial release of ProductBay.

== Upgrade Notice ==

= 1.1.0 =
Adds native Gutenberg blocks, enhances the admin UI and restructures the codebase for Pro extension architecture.

= 1.0.0 =
Initial release, no upgrade steps required.