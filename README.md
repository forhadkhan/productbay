# ProductBay - Advanced WooCommerce Product Tables

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg) ![License](https://img.shields.io/badge/license-GPL--2.0%2B-green.svg) ![WordPress](https://img.shields.io/badge/WordPress-6.0%2B-blue.svg) ![WooCommerce](https://img.shields.io/badge/WooCommerce-8.0%2B-purple.svg)

**ProductBay** is a modern, high-performance plugin designed to revolutionize how WooCommerce products are displayed. It bridges the gap between a robust PHP backend and a dynamic, reactive frontend, providing a seamless experience for both administrators and customers.

Unlike traditional table plugins, ProductBay utilizes a **Hybrid Architecture**:
- **Admin Panel:** A fully responsive Single Page Application (SPA) built with React, TypeScript, and Tailwind CSS.
- **Frontend Display:** A lightweight, SEO-friendly rendering engine optimized for Core Web Vitals, enhanced with instant AJAX filtering.

---

## 🌟 Key Features

- **🚀 Hybrid Architecture:** React-powered admin for fluid management, lightweight PHP/JS frontend for speed.
- **⚡ Instant Search & Filtering:** AJAX-driven filtering allows users to find products without page reloads.
- **🎨 Modern Design:** Built with Tailwind CSS v4 for a premium, consistent, and responsive look.
- **🛡️ Secure & Scalable:** Implements Nonce verification, sanitized inputs, and a repository pattern for database interactions.
- **📦 Developer Friendly:** Structured like a modern web app (Laravel x React), making it easy to extend and maintain.
- **🔧 Zero-Config Build:** Uses `@wordpress/scripts` and Tailwind CLI for a hassle-free development experience.

---

## 🏗 Technology Stack

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

---

## 📂 Project Structure
For a detailed breakdown of the project structure and development implementation notes, please refer to [DEVELOPMENT.md](DEVELOPMENT.md).

---

## 🛠 Installation & Development

### Prerequisites
- **Node.js** v18+
- **Composer** v2+
- **WordPress** Local Development Environment (XAMPP, LocalWP, etc.)

### Setup Instructions

1. **Clone the Repository**
   Navigate to your WordPress plugins directory:
   ```bash
   cd wp-content/plugins
   git clone https://github.com/forhadakhan/productbay.git
   cd productbay
   ```

2. **Install Dependencies**
   ```bash
   bun install
   ```

3. **Start Development Server**
   This command starts both the WordPress script watcher and the Bun-powered build process.
   ```bash
   bun start
   ```
   *The React app will hot-reload, and CSS changes will compile instantly.*

4. **Build for Production**
   Before deploying, run the build command to minify and optimize assets.
   ```bash
   bun run build
   ```

5. **Run lints**
   ```bash
   bun run lint
   ```
   or
   ```bash
   bun run lint:php
   ``` 
   or
   ```bash
   bun run lint:css
   ``` 
   etc. 

6. **More**  
   Format code:
   ```bash
   bun run format
   ```
   Plugin Zip:
   ```bash
   bun run plugin-zip
   ``` 
   Check Engines:
   ```bash
   bun run check-engines
   ```
   Check Licenses:
   ```bash
   bun run check-licenses
   ```
   

---

## 📖 How It Works

1. **Initialization:** `productbay.php` bootstraps the `Plugin` class in `app/Core`.
2. **Admin Load:** The `Admin` class enqueues `assets/js/admin.js` on the specific plugin page.
3. **React Mount:** `src/index.tsx` finds the `#productbay-root` div and mounts the React App.
4. **Data Fetching:** The React app sends authenticated requests to `app/Api/` endpoints via the WP REST API.
5. **Frontend Rendering:** Using the `[productbay id="123"]` shortcode, the PHP backend renders the initial view, and `assets/js/frontend.js` takes over for interactive elements.

---

## 🐛 Bug Reports & Issues

If you encounter any bugs or have suggestions, please report them via the [GitHub Issue Tracker](https://github.com/forhadakhan/productbay/issues).

When reporting an issue, please provide:
1. A clear description of the problem.
2. Steps to reproduce the issue.
3. Screenshots or error logs (if applicable).

---

## 📄 License

ProductBay is licensed under the [GPL v2.0 or later](https://www.gnu.org/licenses/gpl-2.0.html).

**Copyright:** [WPAnchorBay](https://wpanchorbay.com/) 
