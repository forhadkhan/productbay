# Changelog

All notable changes to ProductBay are documented on this page.

## 1.3.0

* **Feature:** Introduced native **Permalink Pages** for product tables — every saved table now gets a clean, shareable URL via the `productbay_table` Custom Post Type.
* **Feature:** Grouped products now default to **Inline Dropdown** mode, allowing customers to select child products, set quantity, and add to cart directly from the table row (previously linked to the single product page).
* **Improvement:** Permalink URL is shown in the table editor sidebar and the table listing page for quick copying.
* **Dev:** Registered `productbay_table` CPT with `public` support for frontend permalink rendering.

## 1.2.1

* **Feature:** Introduced a comprehensive, file-based Activity Log system to track table management, settings changes, and system events.
* **Improvement:** General maintenance and stability updates.
* **Dev:** Internal optimizations and code cleanup.

## 1.2.0

* **Feature:** Added new column types: Stock, Date, Taxonomy, and Rating.
* **Feature:** Introduced Pro integration for premium features: Custom Field, Combined, Price Range Filter, and Variable & Grouped Products.
* **Dev:** Unified Pro activation detection across Free plugin layers.

## 1.1.1

* **Improvement:** Block setup experience with "Create New Table" link in placeholders.
* **Improvement:** Removed misleading product counts from category multiselect filters.
* **Improvement:** Enhanced reliability of CSS injection into the Block Editor iframe.
* **Fix:** Isolated table event handlers to prevent cross-tab state interference (e.g. AJAX filter state).

## 1.1.0

* **Feature:** Native Gutenberg blocks for Product Table and Tabbed Product Tables with server-side rendering.
* **Improvement:** Filters bar repositioned above toolbar for better UX flow.
* **Improvement:** Admin menu (WooCommerce > Products) renamed from "All Tables" to "Product Tables" for clarity.
* **Improvement:** Added a "Manage" link to the plugin action links on the Plugins page for quicker access.
* **Improvement:** Hover highlight improvements across admin UI.
* **Improvement:** Shortcode display layout refined on the table management page.
* **Dev:** Restructured codebase for Pro extension architecture.
* **Dev:** Exposed UI components and settings globally for Pro add-on consumption.

## 1.0.0

*Initial Release*
