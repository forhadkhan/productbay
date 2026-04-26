<div align="center">
   <a href="https://wpanchorbay.com/products/productbay">
      <img src="https://wpanchorbay.com/wp-content/uploads/2026/03/ProductBay-Logo-2.png" alt="ProductBay Logo">
   </a>
</div>
<br />

<div align="center">

### High-Performance Product Table for WooCommerce

<p style="margin-top: 10px; font-size: 14px; color: #666;">
A modern, blazing-fast WooCommerce product table plugin built for scalability and performance.
</p>

<br/>

<!-- BADGES -->
<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 12px;">

<a href="https://docs.wpanchorbay.com/productbay/" style="text-decoration:none;">
  <img src="https://img.shields.io/badge/Docs-Live-2ea44f?style=for-the-badge&logo=readthedocs&logoColor=white" />
</a>

<a href="https://wordpress.org/plugins/productbay/" style="text-decoration:none;">
  <img src="https://img.shields.io/badge/Download-Free-21759B?style=for-the-badge&logo=wordpress&logoColor=white" />
</a>

<a href="https://wpanchorbay.com/plugins/productbay/" style="text-decoration:none;">
  <img src="https://img.shields.io/badge/Get-Pro-E8691E?style=for-the-badge&logo=woocommerce&logoColor=white" />
</a>

</div>

</div>

-----

**ProductBay** is a modern, high-performance plugin designed to transform how WooCommerce products are displayed. It bridges the gap between a robust PHP backend and a dynamic, reactive frontend, providing a seamless experience for both administrators and customers.

Unlike traditional table plugins, ProductBay utilizes a **Hybrid Architecture**:
- **Admin Panel:** A fully responsive Single Page Application (SPA) built with React, TypeScript, and Tailwind CSS.
- **Frontend Display:** A lightweight, SEO-friendly rendering engine optimized for Core Web Vitals, enhanced with instant AJAX filtering.

## Technology Stack

### Backend (PHP)

- **Architecture:** MVP (Model-View-Presenter) / specialized MVC for WordPress.
- **Routing:** Custom router wrapping WP REST API.
- **Database:** Custom `TableRepository` communicating with WPDB.
- **Style:** Strong typing, strict types, and modern PHP 8.0+ features.

### Frontend (Admin & UI)

- **Framework:** React 18 (via `@wordpress/element`).
- **State Management:** React Context + Hooks (in `src/store`).
- **Routing:** `react-router-dom` (HashRouter) for admin navigation.
- **Styling:** Tailwind CSS v4.
- **Internationalization:** `@wordpress/i18n`.
- **Build Tooling:** Webpack (via `@wordpress/scripts`) & Tailwind CLI.
- **Languages:** TypeScript (ES2020+), Modern JavaScript (Frontend), PHP (Templating).

## Installation & Development

### Prerequisites

- **Node.js** v18+
- **Composer** v2+
- **WordPress** Local Development Environment (XAMPP, LAMP, LocalWP, etc.)

### Setup Instructions

1. **Clone the Repository**
   Navigate to your WordPress plugins directory:
   ```bash
   cd wp-content/plugins
   git clone https://github.com/forhadakhan/productbay.git
   cd productbay
   ```

2. **Install Dependencies**
   for JS dependencies
   ```bash
   bun install
   ```

   for PHP dependencies
   ```bash
   composer install
   ```

3. **Start Development Server**
   This command checks/starts local Web & DB services, then starts the Bun-powered build process.
   ```bash
   bun run dev
   ```
   *(Automatically uses `dev.ps1` for Windows and `dev.sh` for Linux/macOS)*
   *The React app will hot-reload, and CSS changes will compile instantly.*

4. **Build for Production**
   Before deploying, run the build command to minify and optimize assets.
   ```bash
   bun run build
   ```

## Bug Reports & Issues

If you encounter any bugs or have suggestions, please report them via the [GitHub Issue Tracker](https://github.com/forhadakhan/productbay/issues).

When reporting an issue, please provide:
1. A clear description of the problem.
2. Steps to reproduce the issue.
3. Screenshots or error logs (if applicable).

## License

ProductBay is licensed under the [GPL v2.0 or later](https://www.gnu.org/licenses/gpl-2.0.html).

**Copyright:** [WPAnchorBay](https://wpanchorbay.com/)
