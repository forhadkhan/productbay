## 🛠 WordPress & WooCommerce Developer Guidelines

### 1\. Core Architecture & Style

  * **Coding Standards:** Strictly adhere to [WordPress PHP Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/).
      * Use **Tabs** for indentation (WP standard).
      * Use `snake_case` for functions/variables and `PascalCase` for Classes.
      * Space inside parentheses: `if ( $condition ) {`.
  * **Namespacing & Autoloading:** We use Composer PSR-4 autoloading with the `WpabProductBay\` namespace mapped to the `app/` directory. Global constants are prefixed with `PRODUCTBAY_` or `productbay_`.
  * **Project Structure:**
      * `app/` — PHP backend (OOP based: Admin, Api, Core, Data, Frontend, Http, Utils).
      * `src/` — React/TypeScript frontend (components, pages, store, hooks).
      * `assets/` — Compiled JS/CSS output.
  * **Frontend Stack:** React, TypeScript, Tailwind CSS v4 (scoped to `#productbay-root`), Zustand, and React Router DOM v7.
  * **Build Tools:** Use `bun` as the package manager (`bun start` for dev, `bun build` for production).

### 2\. Security (The "Late Escaping" Rule)

  * **Validation:** Check data *before* use (e.g., `is_email()`, `username_exists()`).
  * **Sanitization:** Sanitize all inputs on arrival.
      * `sanitize_text_field()`, `sanitize_textarea_field()`, `sanitize_email()`, `sanitize_key()`, `absint()`, `floatval()`.
      * **CRITICAL:** Use `wp_unslash()` before sanitizing `$_POST` or `$_GET` to handle magic quotes.
  * **Escaping:** Escape all data *at the moment of output* (Late Escaping).
      * `esc_html()`, `esc_attr()`, `esc_url()`, `esc_url_raw()`, `esc_textarea()`.
      * Use `wp_kses()` and `wp_kses_post()` for strings with allowed HTML.
  * **Type Casting:** Use type casting to ensure data is of the correct type.
      * `(int)` for integers.
      * `(float)` for floats.
      * `(string)` for strings.
  * **Nonces:** Every form or AJAX/REST API request must have a nonce.
      * Generate: `wp_create_nonce()` or `wp_nonce_field()`.
      * Verify: `check_admin_referer()`, `check_ajax_referer()`, or verify in REST API callbacks. 

### 3\. Access Control

  * **Capabilities:** Never check for "roles" (like 'administrator'). Always check for **capabilities** (e.g., `current_user_can( 'manage_options' )` or `current_user_can( 'manage_woocommerce' )`).
  * **Direct Access:** Prevent direct file access by adding `if ( ! defined( 'ABSPATH' ) ) exit;` at the top of all PHP files.
  * **index.php:** Make sure every directory has an `index.php` file with direct access prevention code.

### 4\. WooCommerce Integration & CRUD

  * **The CRUD Way:** Never use `update_post_meta()` for WooCommerce products or orders. Use the **WC\_Data** methods:
      * `$product = wc_get_product( $id );`
      * `$product->set_price( 10 );`
      * `$product->save();`
  * **HPOS Compatibility:** Ensure the plugin supports High-Performance Order Storage. Use `wc_get_order()` and its methods instead of direct `get_post()` calls.
  * **Hooks & Filters:** Use official WooCommerce hooks. Never modify product data directly in `wp_posts` or `wp_postmeta`.

### 5\. Internationalization (I18n)

  * **PHP:** All strings must be translatable using `__()`, `_e()`, `_x()`, `_n()`, or `esc_html_e()`.
      * Always include the text domain: `__( 'Text here', 'productbay' )`.
  * **React/JS/TS:** Import `{ __ }` from `@wordpress/i18n` and use like `__( 'Text here', 'productbay' )` for frontend strings.
  * **Generation script:** 
      * Generate POT file: Run `bun run i18n:make-pot`
      * Generate JSON for React: Run `bun run i18n:make-json`

### 6\. Helpful Resources & Documentation

  * [WP Plugin Handbook](https://developer.wordpress.org/plugins/)
  * [WooCommerce REST API / WC_Product_Query](https://woocommerce.github.io/code-reference/classes/WC_Product_Query.html)
  * [WooCommerce Global Functions](https://woocommerce.github.io/code-reference/files/woocommerce-includes-wc-core-functions.html)
  * [WC\_Product Class Reference](https://woocommerce.github.io/code-reference/classes/WC-Product.html)
  * [WordPress Security Best Practices](https://developer.wordpress.org/plugins/security/)
  * [Escaping Data](https://developer.wordpress.org/apis/security/escaping/)
