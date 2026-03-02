<div align="center">
   <a href="https://wpanchorbay.com/products/productbay">
      <img src="https://s6.imgcdn.dev/YSNRBn.png" alt="ProductBay Logo">
   </a>
</div>
<br />

# ProductBay - Advanced WooCommerce Product Tables

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg) ![License](https://img.shields.io/badge/license-GPL--2.0%2B-green.svg) 

**ProductBay** is a modern, high-performance plugin designed to transform how WooCommerce products are displayed. It bridges the gap between a robust PHP backend and a dynamic, reactive frontend, providing a seamless experience for both administrators and customers.

Unlike traditional table plugins, ProductBay utilizes a **Hybrid Architecture**:
- **Admin Panel:** A fully responsive Single Page Application (SPA) built with React, TypeScript, and Tailwind CSS.
- **Frontend Display:** A lightweight, SEO-friendly rendering engine optimized for Core Web Vitals, enhanced with instant AJAX filtering.



## Features

### 1. Table Management & Dashboard
- **All Tables View**: A centralized dashboard to manage your product tables.
- **Search & Filtering**: Quickly find tables by name, status, or product source.
- **Bulk Actions**: Perform batch deletions to keep your workspace clean.
- **Table Operations**: Edit, duplicate, or delete individual tables with instant feedback.
- **Shortcode System**: Embed tables anywhere using the `[productbay id="XYZ"]` shortcode.

### 2. Guided Creation Wizard
- **5-Step Workflow**: A focused wizard guiding you through Setup, Columns, Display, Options, and Finish.
- **Live Preview**: See your design changes instantly in a real-time preview iframe.
- **Completion Effects**: Celebratory "Confetti" effect upon successful table creation.

### 3. Smart Product Sources
- **Flexible Selection**: Choose products by Category, Sale status, Specific IDs, or display All Products.
- **Query Modifiers**: Refine lists by excluding IDs, filtering by stock status, or setting price ranges.
- **Dynamic Sorting**: Set default sorting by name, price, date, or popularity.

### 4. Advanced Column Editor
- **Drag-and-Drop Reordering**: Intuitive interface to change column order visually.
- **Diverse Column Types**: Standard fields (Image, Name, Price, SKU, Stock, Summary)

### 5. Seamless WooCommerce Integration
- **Multi-Product Support**: Specialized rendering for Simple, Variable, Grouped, and External products.
- **Inline Variations**: Select attributes (size, color, etc.) directly within the table.
- **AJAX Add-to-Cart**: Add products to the cart without page reloads.
- **Bulk Add-to-Cart**: "Select All" feature to add multiple products in one click.

### 6. Extensive Design System
- **Instance-Scoped Styling**: Private CSS blocks prevent style leaks between multiple tables.
- **Deep Customization**: Adjust colors, typography (font size/weight), borders, radius, and cell padding.
- **Responsive Visibility**: Device-specific "Show/Hide" rules per column.

### 7. Core Technical Features
- **Intelligent Caching**: 30-minute category caching with "Stale-While-Revalidate" patterns.
- **Modern Tech Stack**: React 18, TypeScript, Tailwind CSS v4, and Zustand.
- **Localization (i18n)**: 100% translation-ready codebase.



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



## 🛠 Installation & Development

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
