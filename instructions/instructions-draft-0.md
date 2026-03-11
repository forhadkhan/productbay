This is a comprehensive, scalable development roadmap designed for **ProductBay**. It is structured to be consumed by both human developers and AI assistants (like Antigravity) to maintain context and execution standards throughout the lifecycle.

---

# 🚀 ProductBay Development Roadmap

**Project Goal:** Build a high-performance, enterprise-grade WooCommerce Product Table plugin with a React-powered "Headless" Admin and an SEO-friendly, AJAX-driven Frontend.

**Architecture:** Hybrid MVC (PHP Backend) + SPA (React Admin).
**Package Manager:** Bun (implied by `bun.lock`) / Composer.

---

## 🛠 Phase 1: Foundation & Infrastructure

**Objective:** Establish the communication lines between React, PHP, and the Database.

### 1.1 Backend Core (`app/Core/`)

* **Plugin Bootstrapper (`Plugin.php`):** Ensure all services (Admin, API, Frontend) are instantiated strictly.
* **Dependency Injection:** Pass `TableRepository` and `Request` instances into Controllers.
* **Database Schema (`Activator.php`):**
* Register Custom Post Type: `productbay_table`.
* *Scalability Note:* Avoid custom SQL tables initially; use CPTs for compatibility, but abstract data access so we can swap to SQL later if needed.



### 1.2 HTTP Layer (`app/Http/` & `app/Api/`)

* **Request Wrapper (`Request.php`):** Create a standardized wrapper for `$_POST/$_GET` to handle sanitization centrally.
* **REST API Setup (`Router.php`):**
* Namespace: `productbay/v1`
* Endpoint: `GET /tables` (List)
* Endpoint: `GET /tables/{id}` (Read)
* Endpoint: `POST /tables` (Create/Update)
* Endpoint: `DELETE /tables/{id}` (Delete)


* **Security:** Implement `permission_callback` checking `manage_options` and Nonce verification in `ApiController.php`.

### 1.3 React Scaffold (`src/`)

* **Store (`store/useStore.ts`):** Initialize Zustand store for managing the "Current Table State" (columns, settings, query rules).
* **API Wrapper (`utils/api.ts`):** Configure `wp.apiFetch` or `fetch` with Nonce headers.
* **Router (`App.tsx`):** Ensure `HashRouter` handles `/`, `/new`, `/edit/:id`, and `/settings` correctly.

**✅ Exit Criteria:** React Admin loads, can talk to the REST API, and logs a "Success" response from the PHP backend.

---

## 📦 Phase 2: The Data Layer (The Brain)

**Objective:** robustly fetch and manipulate WooCommerce product data.

### 2.1 Table Repository (`app/Data/TableRepository.php`)

* Implement `get_table( $id )`: Returns configuration array.
* Implement `save_table( $data )`: Sanitizes and saves post meta.
* **Schema Definition:** Define the standard structure for a table config (Columns list, Query rules, Styling settings) in `app/Utils/Config.php`.

### 2.2 Product Query Logic (`app/Api/ProductsController.php`)

* **Admin Search:** Implement a high-performance endpoint for searching products (for the "Manual Selection" feature). Use `WC_Product_Query` optimized for fields (ID, Name, SKU).
* **Front-end Query:** Develop the logic to translate "Table Settings" (e.g., category IDs, stock status) into a `WP_Query` args array.

---

## 🎨 Phase 3: The Admin Experience (React SPA)

**Objective:** Build a drag-and-drop interface that feels like a SaaS app.

### 3.1 Table Builder (`src/components/TableBuilder/`)

* **Column Manager:** A UI to add, remove, and reorder columns (Image, Name, Price, SKU, Add to Cart).
* **Drag & Drop:** Implement `dnd-kit` or `react-beautiful-dnd` for column reordering.
* **Column Settings:** Clicking a column opens a modal/sidebar to edit its label, width, and visibility on mobile.

### 3.2 Query Configuration (`src/components/Controls/`)

* **Source Selector:** Toggle between "Specific Products" (Search & Select) and "Dynamic Query" (Category/Tag/Attribute filters).
* **Product Select:** Integrate a React Select/Async component fetching from `ProductsController`.

### 3.3 Live Preview (Bonus/Optional)

* Mock a table view in the admin that updates instantly as settings change (using dummy data).

**✅ Exit Criteria:** User can create a table, select columns, filter by category, save it, and reload the page to see saved state.

---

## ⚡ Phase 4: The Frontend (Public View)

**Objective:** Render the table fast for SEO, then make it interactive.

### 4.1 Server-Side Rendering (`app/Frontend/TableRenderer.php`)

* **Shortcode Handler:** `[product_table id="123"]`.
* **HTML Generation:** Build the `<table>` structure using PHP. *Do not render React on the frontend.*
* **WooCommerce Integration:** Use `wc_get_template_part` or native WC functions to render Prices (`$product->get_price_html()`) and Add to Cart buttons to ensure compatibility with themes and currency switchers.

### 4.2 AJAX Interactivity (`app/Frontend/AjaxRenderer.php`)

* **The Handler:** Listen for `wp_ajax_productbay_filter`.
* **Logic:**
1. Receive `table_id`, `paged`, `search`, `category`.
2. Re-run query.
3. Return JSON: `{ html: "<tr>...</tr>", pagination: "..." }`.


* **JavaScript (`assets/js/frontend.js`):** Write vanilla JS (no jQuery if possible) to handle search input debounce and pagination clicks.

---

## 🔌 Technical Requirements & Integrations

### Key Features Checklist

**1. Core Features (MVP)**

* [ ] **Shortcode Generation:** `[productbay id="X"]`.
* [ ] **Column Builder:** Drag-and-drop columns.
* [ ] **Data Sources:** Filter by Category, Tag, or Manual Selection.
* [ ] **AJAX Search:** Instant search within the table.
* [ ] **Pagination:** Server-side pagination (load 10, 20, 50 items).
* [ ] **Responsive:** "Collapsing" rows or horizontal scroll on mobile.

**2. Additional Features (V1.1)**

* [ ] **Bulk Add to Cart:** Checkbox selection + Global "Add Selected to Cart" button.
* [ ] **Variations Support:** Display "Select Options" or list variations as individual rows.
* [ ] **Quick View:** Lightbox integration (support standard themes).
* [ ] **Custom Columns:** Allow display of Custom Fields (ACF) or Attributes.

**3. Bonus / Scalability Features**

* [ ] **Caching:** Store the rendered HTML of expensive queries in WP Transients (`set_transient`). Clear on Product Update/Save.
* [ ] **Design Customizer:** React controls for Border color, Header background, Row striping (saves to CSS variables).
* [ ] **Export/Import:** JSON export of table configurations.

### WooCommerce Integration Guide

To ensure `antigravity` or developers follow standard WC protocols:

1. **Global Object:** Always set `global $product;` inside the loop so 3rd party plugins (Waitlists, Badges) work.
2. **Formatting:**
* Price: `echo $product->get_price_html();` (Handles tax/currency).
* Image: `echo $product->get_image( 'thumbnail' );` (Handles Srcset/Lazyload).
* Stock: `echo wc_get_stock_html( $product );`.


3. **Add to Cart:**
* Use `woocommerce_template_loop_add_to_cart()` to render the button. It automatically handles Simple vs Variable vs External types.



---

## 📝 Development Guidelines (for AI & Devs)

1. **Strict Typing:** Use PHP 7.4+ type hinting in Controllers and Repositories. Use TypeScript interfaces for all React props and API responses (`src/types/index.ts`).
2. **Sanitization:**
* **Input:** `sanitize_text_field`, `absint`.
* **Output:** `esc_html`, `esc_attr`, `wp_kses_post`.


3. **Nonce Verification:** Every `POST` request to `app/Api` must verify `X-WP-Nonce`.
4. **No Direct SQL:** Always use `WP_Query` or `wc_get_products`. Direct SQL is hard to cache and breaks compatibility.
5. **Tailwind JIT:** Ensure `tailwind.config.js` is scanning `app/**/*.php` to allow utility classes in PHP templates.

## 🚀 Execution Command Sequence

```bash
# 1. Install PHP Deps
composer install

# 2. Install JS Deps (using Bun)
bun install

# 3. Start Dev Server (Hot Module Replacement for Admin)
bun run start

# 4. Watch for Styles (if separate watcher needed)
bun run watch:css

# 5. Build for Production
bun run build

```