Here is the refined, modular, step-by-step development plan for **ProductBay**. This plan integrates your specific design system, navigation structure, and page workflows into the existing architecture.

Each step is designed to be small, focused, and testable.

---

## 🛠 Phase 1: Foundation & Design System

**Goal:** Setup the environment and implement the global styling rules so all future components look correct immediately.

### Step 1.1: Tailwind & Design System Configuration

Define the color palette in `tailwind.config.js` to strictly follow your design system.

* **Task:** Update `tailwind.config.js`.
* **Action:** Extend the theme with your specific colors.
```javascript
theme: {
  extend: {
    colors: {
      wp: {
        bg: '#f0f0f1',      // Primary BG
        card: '#ffffff',    // Secondary BG
        highlight: '#f0f6fc', // Highlight BG
        info: '#fcf9e8',    // Info BG
        btn: {
          DEFAULT: '#2271b1', // Button BG
          hover: '#135e96',
          disabled: '#a7aaad'
        },
        text: '#3c434a'     // Standard WP Text. add more text colors.
      }
    }
  }
}

```


* **Integration Check:** Create a dummy button in `App.tsx` using `bg-wp-btn text-white` and verify it matches WordPress blue.

### Step 1.2: App Layout & Navigation Bar

Build the persistent shell of the Admin SPA.

* **Task:** Create `src/layouts/AdminLayout.tsx` and `src/components/Layout/Navbar.tsx`.
* **Requirements:**
* **Left:** Logo "ProductBay" (Bold/Regular text mix).
* **Right:** Links (Dashboard, Tables, Settings, Design, Help).
* **Action:** "Create Table" button (CTA style).
* **State:** Use `useLocation` hook to apply `border-b-2 border-wp-btn` style to the active menu item.


* **Integration Check:** Clicking navigation items changes the URL hash (`#/settings`, `#/tables`) and updates the active highlight.

---

## 📊 Phase 2: The Dashboard Logic

**Goal:** Handle the "First Run" experience and System Checks.

### Step 2.1: Backend System Check API

* **Task:** Create `app/Api/SystemController.php`.
* **Action:** Add endpoint `GET /system/status`.
* **Logic:**
* Check if WooCommerce is active.
* Count published products: `wc_get_products(['status' => 'publish', 'limit' => 1])`.


* **Integration Check:** API returns `{ wc_active: true, product_count: 50, table_count: 0 }`.

### Step 2.2: Dashboard Logic (Frontend)

* **Task:** Update `src/pages/Dashboard.tsx`.
* **Logic (Conditional Rendering):**
1. **Loading:** Show Skeleton loader.
2. **Error State:** If `product_count === 0`, render **Warning Card**:
> *"ProductBay could not find any 'published' WooCommerce products on your site. ProductBay cannot display products in tables without published products."* (Background: `#fcf9e8`, Border: Orange).


3. **New User:** If `table_count === 0`, render "Welcome + Get Started" Hero section.
4. **Existing User:** Render the Grid of cards.



### Step 2.3: Dashboard Cards (Existing User)

* **Task:** Build reusable `DashboardCard` component.
* **Content:**
* **Stats:** Total Products, Total Tables.
* **Actions:** Import/Export (Disable Export button if `table_count === 0`).
* **Resources:** "Getting Started" (Video placeholder), Feedback link.


* **Integration Check:** Dashboard looks complete and data matches the database.

---

## 📋 Phase 3: Tables Management (CRUD)

**Goal:** The list view of all created tables.

### Step 3.1: Tables List API

* **Task:** Update `app/Api/TablesController.php`.
* **Action:** `GET /tables`. Returns array of `{id, title, shortcode, type, date, status}`.

### Step 3.2: Tables Page UI

* **Task:** Create `src/pages/Tables.tsx`.
* **Action:** Render a Data Table.
* **Columns:** Name, Category Type, Shortcode (Click to Copy), Date, Status.
* **Integration Check:** The list populates with dummy data or data from the API.

### Step 3.3: Row Actions & Hover States

* **Task:** Implement WordPress-style row actions.
* **Style:** `opacity-0 group-hover:opacity-100 transition-opacity`.
* **Actions:**
* **Edit:** Links to `#/edit/{id}`.
* **Delete:** Opens `ConfirmDialog` modal.
* **Duplicate:** Calls API `POST /tables/{id}/duplicate`.
* **Status:** Toggle Published/Draft.



---

## 🪄 Phase 4: The "Add New Table" Wizard (Core)

**Goal:** A complex multi-step form managed by a robust state machine.

### Step 4.1: Wizard Architecture

* **Task:** Create `src/pages/EditTable.tsx`.
* **State:** Use a global store or localized reducer to hold the "Draft Table" object.
* **UI:** Left Sidebar (Steps 1-8) + Right Content Area.
* **Integration Check:** Navigation between steps works; data persists when switching steps.

### Step 4.2: Step 1 & 2 (Setup & Selection)

* **Task:** Build `StepName.tsx` and `StepSource.tsx`.
* **Inputs:** Table Name field.
* **Source Logic:**
* Radio: All / Categories / Specific.
* **Conditionals:** If "Categories" selected -> Show `MultiSelect` (fetching WC Categories). If "Specific" -> Show `ProductSearch` (Select2 style).
* **Filters:** Stock Status checkbox, Price Range inputs.



### Step 4.3: Step 3 (Columns Builder)

* **Task:** Build `StepColumns.tsx`.
* **Library:** Use `dnd-kit` (lightweight) or `react-beautiful-dnd`.
* **Features:**
* List of Active Columns.
* "Add Column" Modal (Image, Name, Price, SKU, Add to Cart).
* Rename columns inline.


* **Integration Check:** Dragging a column updates the `columns` array order in the state.

### Step 4.4: Step 4 & 5 (Options & Search)

* **Task:** Build `StepOptions.tsx` and `StepSearch.tsx`.
* **Inputs:**
* Toggles (Switch component) for Ajax, Quantity Picker.
* Select for Pagination Type (Load More / Numbered).
* Sorting controls.



### Step 4.5: Step 6 (Design & Live Preview)

* **Task:** Build `StepDesign.tsx`.
* **Layout:** Split screen. Left: Layout controls. Right: **Live Preview**.
* **Preview Logic:**
* Send current state to API endpoint `POST /tables/preview`.
* API returns HTML string.
* Render HTML inside a `ShadowDOM` or scoped div to simulate frontend.


* **Integration Check:** Changing "Header Color" instantly updates the Preview (or triggers a refresh).

### Step 4.6: Step 7 & 8 (Performance & Publish)

* **Task:** Build `StepPerformance.tsx` and `StepReady.tsx`.
* **Features:**
* Lazy Load toggle.
* **Publish Action:** "Save Table" button. Sends full state to `POST /tables`.
* **Success State:** Show "Success!" confetti + Copy Shortcode button + "View Table" link.



---

## ⚙️ Phase 5: Settings Page

**Goal:** Global plugin configuration.

### Step 5.1: Settings Sections UI

* **Task:** Create `src/pages/Settings.tsx` using `Tabs` or `ScrollSpy` layout.
* **Sections:**
* **Add to Cart:** Dropdowns for Button Text, "Multi-add" behavior.
* **Table Content:** Inputs for Description Length, Default Columns.
* **Pagination:** Products per page (input type number).
* **Uninstall:** "Delete data on uninstall" (Red Danger Toggle).


* **Action:** Save Settings button (writes to `wp_options`).

---

## 🎨 Phase 6: Design & Help

**Goal:** Styling presets and User Support.

### Step 6.1: Design Page

* **Task:** Create `src/pages/Design.tsx`.
* **Inputs:**
* Global Colors (Border, Header BG, Cell BG).
* Button Styling (Radius, Padding).


* **Note:** Mark "Font Customization" and "Corner Radius" with a `[PRO]` badge (disabled state).

### Step 6.2: Help Page (System Status)

* **Task:** Create `src/pages/Help.tsx`.
* **Data:** Reuse `app/Api/SystemController.php`.
* **Display:** Read-only table showing WP Version, WC Version, PHP Version.
* **Links:** "Read Documentation", "Contact Support".

---

## 🌐 Phase 7: Public Frontend

**Goal:** Rendering the table to the visitor.

### Step 7.1: Shortcode Renderer

* **Task:** Update `app/Frontend/Shortcode.php`.
* **Logic:**
1. Parse `[product_table id="123"]`.
2. Fetch Config from DB.
3. Construct `WP_Query`.
4. Load Template `templates/table-grid.php`.



### Step 7.2: AJAX Functionality

* **Task:** Implement `app/Frontend/AjaxRenderer.php`.
* **Action:** Handle pagination/sorting without page reload.
* **Frontend JS:** Bind click events to Pagination buttons -> `fetch( ajaxurl, ... )` -> Replace HTML content.

---

## 📦 Phase 8: Quality Assurance & Polish

* **Step 8.1:** **Responsive Check:** Ensure the Admin Table Builder works on smaller laptop screens.
* **Step 8.2:** **Empty State Check:** Verify the "No Products" warning in Dashboard appears correctly on a fresh install.
* **Step 8.3:** **PRO Teasers:** Ensure PRO features are visible but clearly disabled/badged to drive potential future upgrades.