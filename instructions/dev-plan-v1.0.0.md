# 🚀 ProductBay Development Plan v1.0.0

**Status:** Draft / Ready for Implementation
**Target Audience:** AI Assistants (Antigravity) & Human Developers
**Goal:** Build a high-performance, enterprise-grade WooCommerce Product Table plugin with a React-powered "Headless" Admin and an SEO-friendly, AJAX-driven Frontend.

---

## 🏗 Architecture Overview

*   **Hybrid MVC:** PHP Backend for data, business logic, and SEO-friendly frontend rendering.
*   **React SPA:** "Headless" Admin interface for a modern, app-like experience (Tables, Settings, Design).
*   **Communication:** REST API (`productbay/v1`) with Nonce verification.
*   **Package Managers:** `composer` (PHP), `bun` (JS).

---

## 🗓 Phase 1: Core Framework & Infrastructure

**Objective:** specific basic "plumbing" to allow React and PHP to talk, and set up the robust class structure.

### 1.1 Backend Bootstrapper
*   **File:** `app/Core/Plugin.php`
*   **Task:** Ensure the plugin container initializes strictly.
*   **Dependency Injection:** Pass `TableRepository` and `Request` instances into Controllers.
*   **Router:** Initialize `app/Http/Router.php` to handle REST routes under `productbay/v1`.

### 1.2 Cross-Stack Communication
*   **API Wrapper:** Create `app/Http/Request.php` to standardize input sanitization (`sanitize_text_field`, `absint`).
*   **Nonce Handling:** Ensure `index.php` (Admin View) localizes `productbay_config` with `nonce`, `root` (API URL), and `assets_url`.
*   **Store Setup:** Initialize React Zustand store (`src/store/useStore.ts`) for managing global state.

### 1.3 Tailwind Design System
*   **Config:** Update `tailwind.config.js` with the ProductBay Design System colors.
    ```javascript
    theme: {
      extend: {
        colors: {
          wp: {
            bg: '#f0f0f1',      // Primary BG
            card: '#ffffff',    // Secondary BG
            highlight: '#f0f6fc', // Highlight BG
            btn: { DEFAULT: '#2271b1', hover: '#135e96' },
            text: '#3c434a'
          }
        }
      }
    }
    ```

---

## 🎨 Phase 2: Admin UI Foundation

**Objective:** Build the persistent shell of the Admin SPA.

### 2.1 Navigation & Layout
*   **Files:** `src/layouts/AdminLayout.tsx`, `src/components/Layout/Navbar.tsx`.
*   **Structure:**
    *   **Sidebar/Top Bar:** Logo "ProductBay", Navigation Links (Dashboard, Tables, Settings, Design, Help).
    *   **Action:** "Create Table" button (Primary CTA).
    *   **Active State:** Highlight current route (e.g., bottom border or different bg).
*   **Routing:** Setup `react-router-dom` (HashRouter) for `/`, `/tables`, `/settings`, etc.

---

## 📊 Phase 3: Dashboard & System Checks

**Objective:** Handle the "First Run" experience and System Checks.

### 3.1 Backend System Check
*   **Endpoint:** `GET /system/status` (`SystemController.php`).
*   **Logic:**
    *   Check if WooCommerce is active.
    *   Count published products (`wc_get_products`).
    *   Count existing tables.

### 3.2 Dashboard UI (`src/pages/Dashboard.tsx`)
*   **Zero State (No Products):** Show **Warning Card**: *"ProductBay could not find any 'published' WooCommerce products."*
*   **New User (No Tables):** Show **Hero Section**: "Get Started by creating your first product table."
*   **Existing User:** Show **Stats Grid** (Total Products, Tables) and "Quick Links" (Documentation, Support).

---

## 🗄 Phase 4: Data Layer & Tables Management

**Objective:** CRUD operations for Tables.

### 4.1 Data Repository
*   **File:** `app/Data/TableRepository.php`
*   **Methods:** `get_tables()`, `get_table($id)`, `save_table($data)`, `delete_table($id)`.
*   **Storage:** Custom Post Type `productbay_table` (scalable to Custom SQL later if needed).

### 4.2 Tables Listener API
*   **Endpoint:** `GET /tables`
*   **Response:** Array of Table Summaries `{id, title, shortcode, type, date, status}`.

### 4.3 Tables List Page (`src/pages/Tables.tsx`)
*   **UI:** Data Table with columns: Name, Type, Shortcode (Click-to-Copy), Date, Status.
*   **Actions:** Hover actions for Edit, Delete, Duplicate, Toggle Status.

---

## 🪄 Phase 5: The "Table Builder" Wizard

**Objective:** A generic, complex multi-step form for creating/editing tables.

### 5.1 Wizard Architecture (`src/pages/EditTable.tsx`)
*   **State:** Local reducer or Zustand store for the "Draft Table".
*   **Layout:** Left Sidebar (Steps 1-8 navigation) + Right Content Area.

### 5.2 Step-by-Step Logic
*   **Step 1 (Name):** Table Title.
*   **Step 2 (Source):** Select Products.
    *   *Mode:* All / Categories / Specific.
    *   *Components:* `CategoryCelect` (Async), `ProductSearch` (Async Select).
*   **Step 3 (Columns):** Drag-and-drop Column Manager (`dnd-kit`).
    *   Add/Remove Columns (Image, Name, Price, SKU, Add to Cart).
*   **Step 4 (Options):** Toggles for Ajax, Pagination type, Quantity picker.
*   **Step 5 (Search):** Sorting defaults, Filter toggles.
*   **Step 6 (Design & Preview):** Live Preview logic using `POST /tables/preview`.
*   **Step 7 (Performance):** Lazy Load toggle.
*   **Step 8 (Publish):** Save button -> `POST /tables`. Show Success/Shortcode.

---

## 🚀 Phase 6: Frontend Rendering (The Engine)

**Objective:** Render the table fast for SEO, then make it interactive.

### 6.1 Server-Side Rendering
*   **File:** `app/Frontend/TableRenderer.php`.
*   **Shortcode:** `[productbay id="123"]`.
*   **Process:**
    1. Fetch Config.
    2. Build `WP_Query`.
    3. Render HTML using a PHP Template (`templates/table-grid.php`).
*   **WooCommerce:** Use standard `wc_get_template_part` for Prices and Add to Cart to ensure theme compatibility.

### 6.2 AJAX Interactivity
*   **Handler:** `app/Frontend/AjaxRenderer.php` hook to `wp_ajax_productbay_filter`.
*   **JS:** `assets/js/frontend.js` (Vanilla JS).
*   **Logic:** Listen for pagination/search -> Fetch HTML -> Replace Table Body.

---

## ⚙️ Phase 7: Settings & Polish

### 7.1 Settings Page (`src/pages/Settings.tsx`)
*   **Tabs:** General, Add to Cart, Advanced, Uninstall.
*   **Features:** "Delete data on uninstall" toggle, default configuration.

### 7.2 Design Page (`src/pages/Design.tsx`)
*   **Global Styles:** Define default colors/borders for all tables.

### 7.3 Quality Assurance
*   **Responsive:** Check Admin Table Builder on small screens.
*   **Empty States:** Verify fresh install experience.

---

## 📝 Development Guidelines

1.  **Strict Typing:** Use PHP 7.4+ type hinting. Use TypeScript interfaces (`src/types/index.ts`).
2.  **Sanitization:**
    *   Input: `sanitize_text_field`, `absint`.
    *   Output: `esc_html`, `esc_attr`.
3.  **No Direct SQL:** Use `WP_Query` or `wc_get_products`.
4.  **Tailwind JIT:** Ensure `app/**/*.php` is scanned.

## 💻 Execution Command Sequence

```bash
composer install
bun install
bun run start   # Dev Server
bun run build   # Production Build
```
