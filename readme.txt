=== ProductBay ===
Contributors: wpanchorbay, forhadkhan
Tags: woocommerce product table, product table, product list, bulk order form, woocommerce, order form, product grid, responsive table
Requires at least: 6.0
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.txt

High-performance WooCommerce product tables with instant AJAX search, flexible filters, and a modern React-powered creation wizard.

== Description ==

ProductBay is a modern, high-performance plugin designed to revolutionize how WooCommerce products are displayed. It bridges the gap between a robust PHP backend and a dynamic, reactive frontend, providing a seamless experience for both administrators and customers.

Unlike traditional table plugins, ProductBay utilizes a Hybrid Architecture:
*   **Admin Panel:** A fully responsive Single Page Application (SPA) built with React and Tailwind CSS.
*   **Frontend Display:** A lightweight, SEO-friendly rendering engine optimized for Core Web Vitals, enhanced with instant AJAX filtering.

= Implemented Features =

1. Table Management & Dashboard
*   All Tables View: A centralized dashboard to manage your product tables.
*   Search & Filtering: Quickly find tables by name, status (Published/Private), or product source.
*   Bulk Actions: Perform batch deletions to keep your workspace clean.
*   Shortcode System: Embed tables anywhere using the `[productbay id="XYZ"]` shortcode.

2. Guided Creation Wizard
*   5-Step Workflow: A focused wizard guiding you through Setup, Columns, Display, Options, and Finish.
*   Live Preview: See your design changes instantly in a real-time preview iframe.
*   Completion Effects: Celebratory "Confetti" effect upon successful table creation.

3. Smart Product Sources
*   Flexible Selection: Choose products by Category, Sale status, Specific IDs, or display All Products.
*   Query Modifiers: Refine lists by excluding IDs, filtering by stock status, or setting price ranges.
*   Dynamic Sorting: Set default sorting by name, price, date, or popularity.

4. Advanced Column Editor
*   Drag-and-Drop Reordering: Intuitive interface to change column order visually.
*   Diverse Column Types: Standard fields (Image, Name, Price, SKU, Stock, Summary).
*   Responsive Visibility: Device-specific "Show/Hide" rules per column.

5. Seamless WooCommerce Integration
*   Multi-Product Support: Specialized rendering for Simple, Variable, Grouped, and External products.
*   Inline Variations: Select attributes (size, color, etc.) directly within the table.
*   AJAX Add-to-Cart: Add products to the cart without page reloads.
*   Bulk Add-to-Cart: "Select All" feature to add multiple products in one click.

6. Extensive Design System
*   Instance-Scoped Styling: Private CSS blocks prevent style leaks between multiple tables.
*   Deep Customization: Adjust colors, typography (font size/weight), borders, radius, and cell padding.

7. Core Technical Features
*   Intelligent Caching: 30-minute category caching with "Stale-While-Revalidate" patterns.
*   Modern Tech Stack: React 18, TypeScript, Tailwind CSS v4, and Zustand.
*   Localization (i18n): 100% translation-ready codebase.

== Installation ==

1.  Upload the plugin files to the `/wp-content/plugins/productbay` directory, or install the plugin through the WordPress plugins screen directly.
2.  Activate the plugin through the 'Plugins' screen in WordPress.
3.  Use the ProductBay menu in the admin dashboard to configure your product tables.

== Frequently Asked Questions ==

= Does this require WooCommerce? =

Yes, ProductBay is an add-on for WooCommerce and requires WooCommerce to be installed and active.

== Screenshots ==

1.  (No screenshots available yet)

== Changelog ==

= 1.0.0 =
*   Initial release.
