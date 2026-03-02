=== ProductBay ===
Contributors: wpanchorbay, forhadkhan
Tags: woocommerce product table, product table, product list, woocommerce, bulk add to cart
Requires at least: 6.0
Tested up to: 6.9
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

High-performance WooCommerce product tables with instant AJAX search, flexible filters, and a guided React-powered creation wizard.

== Description ==

**ProductBay requires WooCommerce to be installed and active.**

ProductBay is a modern, high-performance plugin that transforms how WooCommerce products are displayed in a table layout. It bridges a robust PHP backend with a dynamic, reactive frontend — delivering a seamless experience for both store administrators and customers.

Unlike traditional table plugins, ProductBay uses a hybrid architecture:

* **Admin Panel:** A fully responsive Single Page Application (SPA) built with React and Tailwind CSS.
* **Frontend Display:** A lightweight, SEO-friendly rendering engine optimized for Core Web Vitals, enhanced with instant AJAX filtering.

All JavaScript and CSS assets are bundled locally within the plugin. No external CDN or remote scripts are loaded.

= Table Management & Dashboard =

* **All Tables View:** A centralized dashboard to create, manage, and organize all your product tables.
* **Search & Filtering:** Quickly find tables by name, status (Published/Private), or product source.
* **Bulk Actions:** Batch-delete tables to keep your workspace clean.
* **Shortcode System:** Embed any table anywhere using `[productbay id="XYZ"]`.

= Guided Creation Wizard =

* **5-Step Workflow:** A focused wizard guiding you through Setup, Columns, Display, Options, and Finish.
* **Live Preview:** See design changes instantly in a real-time preview.
* **Completion Effect:** A celebratory confetti animation on successful table creation.

= Smart Product Sources =

* **Flexible Selection:** Choose products by Category, Sale status, Specific IDs, or display All Products.
* **Query Modifiers:** Refine results by excluding IDs, filtering by stock status, or setting price ranges.
* **Dynamic Sorting:** Set a default sort order by name, price, date, or popularity.

= Advanced Column Editor =

* **Drag-and-Drop Reordering:** Change column order visually with an intuitive interface.
* **Diverse Column Types:** Image, Name, Price, SKU, Stock, Summary, and more.
* **Responsive Visibility:** Configure per-column "Show/Hide" rules for different device sizes.

= Seamless WooCommerce Integration =

* **Multi-Product Support:** Specialized rendering for Simple, Variable, Grouped, and External products.
* **Inline Variations:** Let customers select attributes (size, color, etc.) directly within the table.
* **AJAX Add-to-Cart:** Add products to the cart without a page reload.
* **Bulk Add-to-Cart:** A "Select All" feature to add multiple products in one click.

= Design & Customization =

* **Instance-Scoped Styling:** Isolated CSS blocks prevent style conflicts between multiple tables on the same page.
* **Deep Customization:** Adjust colors, typography (size/weight), borders, border radius, and cell padding per table.

= Technical =

* **Intelligent Caching:** 30-minute category caching with stale-while-revalidate patterns.
* **Modern Tech Stack:** React 18, TypeScript, Tailwind CSS v4, and Zustand — all bundled locally.
* **Translation Ready:** 100% of user-facing strings are wrapped in localization functions.

== Installation ==

1. Upload the plugin folder to `/wp-content/plugins/productbay`, or install directly through the WordPress Plugins screen.
2. Activate the plugin through the **Plugins** screen in WordPress.
3. Ensure WooCommerce is installed and active.
4. Navigate to **ProductBay** in the WordPress admin menu to create your first table.
5. Copy the generated shortcode (e.g. `[productbay id="1"]`) and paste it into any page, post, or widget.

== Frequently Asked Questions ==

= Does this plugin require WooCommerce? =

Yes. ProductBay is a WooCommerce extension and will not function without WooCommerce installed and active.

= Which product types are supported? =

ProductBay supports WooCommerce Simple, Variable, Grouped, and External/Affiliate product types.

= How do I display a table on a page? =

After creating a table in the ProductBay dashboard, copy its shortcode — for example `[productbay id="1"]` — and paste it into any page, post, or block using the Shortcode block.

= Can I display multiple tables on the same page? =

Yes. Each table has its own scoped CSS, so multiple tables on the same page will not conflict with each other's styling.

= Does this plugin call any external services? =

No. All JavaScript, CSS, and other assets are bundled locally within the plugin. No data is sent to any external server.

= Will it slow down my site? =

ProductBay is built with performance in mind. Assets are loaded only on pages where a table shortcode is present, and product queries are cached for 30 minutes to minimize database load.

= Is it translation ready? =

Yes. All user-facing strings use WordPress localization functions and the plugin is 100% translation ready.

= Where can I get support? =

Use the support forum on this plugin's WordPress.org page. We aim to respond within 2 business days.

== Screenshots ==

1. The ProductBay dashboard showing all created tables with status and shortcode information.
2. Step 1 of the creation wizard — table setup and product source selection.
3. The column editor with drag-and-drop reordering and responsive visibility controls.
4. The design customization panel with live preview.
5. A product table on the front end with inline variation selectors and AJAX add-to-cart.

== Changelog ==

= 1.0.0 =
**Added**

* Initial release of ProductBay.
* Centralized table management dashboard with search, status filtering, and bulk delete.
* 5-step guided creation wizard with live preview.
* Product source selection: by category, sale status, specific IDs, or all products.
* Query modifiers: exclude IDs, filter by stock status, set price range.
* Drag-and-drop column editor with responsive show/hide rules per device.
* Column types: Image, Name, Price, SKU, Stock Status, Short Description.
* Support for Simple, Variable, Grouped, and External WooCommerce product types.
* Inline variation attribute selection within the table.
* AJAX add-to-cart (single and bulk).
* Instance-scoped CSS to prevent style conflicts between tables.
* Deep design customization: colors, typography, borders, border radius, cell padding.
* 30-minute category query caching with stale-while-revalidate.
* Shortcode system: `[productbay id="XYZ"]`.
* 100% translation-ready codebase.

== Upgrade Notice ==

= 1.0.0 =
Initial release — no upgrade steps required.