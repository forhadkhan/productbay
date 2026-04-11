# [WordPress React Plugin: Sync Admin Menu Active State with React Router](https://dev.to/forhadakhan/wordpress-react-plugin-sync-admin-menu-active-state-with-react-router-380m)
When building a React-based WordPress admin plugin using client-side routing (like **React Router**), you'll quickly notice a UX problem: **the WordPress admin menu doesn't stay in sync with your React routes**. As users navigate your React app, the wrong menu item remains highlighted, confusing the experience.

This guide shows you how to solve this by dynamically syncing the WordPress admin sidebar menu's active state with your React Router navigation.

---

## Table of Contents

- [WordPress React Plugin: Sync Admin Menu Active State with React Router](#wordpress-react-plugin-sync-admin-menu-active-state-with-react-router)
  - [Table of Contents](#table-of-contents)
  - [The Problem](#the-problem)
  - [How It Works](#how-it-works)
  - [Prerequisites](#prerequisites)
    - [Required Dependencies](#required-dependencies)
  - [Step 1: Register WordPress Admin Menus](#step-1-register-wordpress-admin-menus)
    - [Key Points:](#key-points)
  - [Step 2: Define React Routes](#step-2-define-react-routes)
  - [Step 3: Create the Sync Hook](#step-3-create-the-sync-hook)
  - [Step 4: Use the Hook](#step-4-use-the-hook)
  - [Complete Code Examples](#complete-code-examples)
    - [File Structure](#file-structure)
    - [Route-to-Slug Mapping Table](#route-to-slug-mapping-table)
  - [How It Works Under the Hood](#how-it-works-under-the-hood)
    - [WordPress Admin Menu Structure](#wordpress-admin-menu-structure)
    - [Our Hook's DOM Manipulation](#our-hooks-dom-manipulation)
    - [URL Update with `replaceState`](#url-update-with-replacestate)
  - [Troubleshooting](#troubleshooting)
    - [Menu Not Updating](#menu-not-updating)
    - [URL Not Syncing](#url-not-syncing)
    - [Multiple Submenus Highlighted](#multiple-submenus-highlighted)
    - [Dynamic Routes (e.g., `/edit/:id`)](#dynamic-routes-eg-editid)
    - [External Plugin Link Conflicts (Production Issue)](#external-plugin-link-conflicts-production-issue)
  - [Summary](#summary)
  - [Further Reading](#further-reading)

---

## The Problem

In a typical React-based WordPress plugin:

1. You register **multiple WordPress admin submenus** (e.g., Dashboard, Settings, Tables)
2. Each submenu renders the **same container div** where your React app mounts
3. React Router handles navigation **internally** using hash-based routing (`#/settings`, `#/tables`)
4. WordPress doesn't know about these route changes, so **the active menu item never updates**

The result: clicking "Settings" in your React app leaves "Dashboard" highlighted in the WordPress sidebar.

---

## How It Works

Our solution:

1. **Monitor React Router's location changes** using a custom hook
2. **Map each React route to its corresponding WordPress menu slug**
3. **Update the browser's URL query parameter** (`?page=plugin-slug`) without page reload
4. **Manipulate the DOM** to toggle WordPress's `.current` class on menu items

---

## Prerequisites

Before implementing this solution, ensure you have:

- **WordPress 5.0+**
- **React 18+** in your plugin
- **React Router v6** (using `HashRouter`)
- Basic knowledge of **WordPress admin menu registration**
- **TypeScript** (optional, examples use TypeScript)

### Required Dependencies

```bash
# Bun
bun add react-router-dom

# npm
npm install react-router-dom
```

---

## Step 1: Register WordPress Admin Menus

First, register your admin menus in PHP. Each submenu must have a unique slug that we'll reference later. (Note: our code is class-based or in OOP structure).

```php
<?php

namespace YourPlugin\Admin;

class Admin {
    /** Plugin menu slug constant */
    const MENU_SLUG = 'your-plugin';
    const CAPABILITY = 'manage_options';
    const TEXT_DOMAIN = 'your-plugin';
    
    /**
     * Register admin menu pages.
     * Hook this to 'admin_menu' action.
     */
    public function register_menu(): void {
        // Top-level menu
        add_menu_page(
            __('Your Plugin', self::TEXT_DOMAIN),
            __('Your Plugin', self::TEXT_DOMAIN),
            self::CAPABILITY,
            self::MENU_SLUG,
            [$this, 'render_app'],
            'dashicons-admin-generic',
            58
        );

        // Dashboard submenu (same slug as parent hides duplicate)
        add_submenu_page(
            self::MENU_SLUG,
            __('Dashboard', self::TEXT_DOMAIN),
            __('Dashboard', self::TEXT_DOMAIN),
            self::CAPABILITY,
            self::MENU_SLUG, // Same as parent = "Dashboard"
            [$this, 'render_app']
        );

        // Settings submenu
        add_submenu_page(
            self::MENU_SLUG,
            __('Settings', self::TEXT_DOMAIN),
            __('Settings', self::TEXT_DOMAIN),
            self::CAPABILITY,
            self::MENU_SLUG . '-settings', // Unique slug
            [$this, 'render_app']
        );

        // Tables submenu
        add_submenu_page(
            self::MENU_SLUG,
            __('Tables', self::TEXT_DOMAIN),
            __('Tables', self::TEXT_DOMAIN),
            self::CAPABILITY,
            self::MENU_SLUG . '-tables',
            [$this, 'render_app']
        );
    }

    /**
     * Render the React app container.
     * All submenus point here; React Router handles routing.
     */
    public function render_app(): void {
        echo '<div id="your-plugin-root"></div>';
    }
}
```

### Key Points:

- All submenus call the **same callback** (`render_app`) — React handles routing
- Each submenu has a **unique slug** pattern: `plugin-slug`, `plugin-slug-settings`, etc.
- These slugs appear in the URL: `?page=your-plugin-settings`

---

## Step 2: Define React Routes

Set up your React Router with centralized path constants:

```tsx
// src/utils/routes.ts
import { ComponentType } from 'react';
import Dashboard from '@/pages/Dashboard';
import Settings from '@/pages/Settings';
import Tables from '@/pages/Tables';
import EditItem from '@/pages/EditItem';

/**
 * Centralized path constants for routing.
 * Makes mapping to WordPress slugs easier.
 */
export const PATHS = {
    DASHBOARD: '/',
    SETTINGS: '/settings',
    TABLES: '/tables',
    EDIT: '/edit/:id',
} as const;

export interface RouteConfig {
    path: string;
    element: ComponentType;
    label?: string;
}

export const routes: RouteConfig[] = [
    { path: PATHS.DASHBOARD, element: Dashboard },
    { path: PATHS.SETTINGS, element: Settings },
    { path: PATHS.TABLES, element: Tables },
    { path: PATHS.EDIT, element: EditItem },
];
```

---

## Step 3: Create the Sync Hook

This is the core of our solution - a custom hook that syncs WordPress menu state with React Router:

```tsx
// src/hooks/useWpMenuSync.ts
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PATHS } from '@/utils/routes';

/**
 * Custom hook to sync WordPress admin menu active state with React Router.
 * 
 * Solves the UX issue where WordPress sidebar menu items don't highlight
 * correctly when navigating within a React SPA that uses client-side routing.
 * 
 * How it works:
 * 1. Listens to React Router location changes
 * 2. Maps the current React route to the corresponding WP admin menu slug
 * 3. Updates the browser URL's ?page= query parameter (without reload)
 * 4. Manipulates the DOM to toggle WordPress's .current class on menu items
 */
export const useWpMenuSync = (): void => {
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        
        // Default to main plugin slug (Dashboard)
        let slug = 'your-plugin';

        // Map React routes to WordPress menu slugs
        if (path === PATHS.DASHBOARD) {
            slug = 'your-plugin';
        } else if (path === PATHS.SETTINGS) {
            slug = 'your-plugin-settings';
        } else if (path === PATHS.TABLES || path.startsWith('/edit')) {
            // Group related routes under same menu item
            slug = 'your-plugin-tables';
        }

        // --- 1. Update URL query parameter without page reload ---
        const currentUrl = new URL(window.location.href);
        const searchParams = currentUrl.searchParams;

        // Only update if the slug has changed to avoid redundant history entries
        if (searchParams.get('page') !== slug) {
            searchParams.set('page', slug);
            
            // Use replaceState to avoid cluttering browser history
            // Preserve the hash for React Router's HashRouter
            const newUrl = `${currentUrl.pathname}?${searchParams.toString()}${window.location.hash}`;
            window.history.replaceState(null, '', newUrl);
        }

        // --- 2. Update WordPress Admin Menu DOM ---
        // Find the menu link matching our target slug
        // IMPORTANT: Use URL parsing for exact match to avoid matching:
        // - External links from third-party plugins (e.g., Freemius) 
        // - Partial slug matches (e.g., 'plugin' matching 'plugin-settings')
        const allSubMenuLinks = document.querySelectorAll('ul.wp-submenu a');
        
        const menuLink = Array.from(allSubMenuLinks).find((link) => {
            const href = link.getAttribute('href');
            if (!href) return false;

            // Only match relative admin.php links or absolute links on same origin
            // This filters out external links that may contain page= in their params
            const isRelativeAdminLink = href.startsWith('admin.php');
            const isAbsoluteAdminLink = href.startsWith(window.location.origin) && href.includes('admin.php');

            if (!isRelativeAdminLink && !isAbsoluteAdminLink) {
                return false;
            }

            try {
                // Parse the href to extract the 'page' parameter exactly
                const url = new URL(href, window.location.origin);
                return url.searchParams.get('page') === slug;
            } catch {
                // Fallback: if URL parsing fails, check for exact match with boundaries
                return href.includes(`page=${slug}&`) || href.endsWith(`page=${slug}`);
            }
        });

        if (menuLink) {
            // Get the parent submenu container
            const submenu = menuLink.closest('ul.wp-submenu');

            if (submenu) {
                // Remove 'current' class from all sibling items
                submenu.querySelectorAll('li').forEach((li) => {
                    li.classList.remove('current');
                });
                submenu.querySelectorAll('a').forEach((a) => {
                    a.classList.remove('current');
                });

                // Add 'current' class to the active item
                const parentLi = menuLink.closest('li');
                if (parentLi) {
                    parentLi.classList.add('current');
                }
                menuLink.classList.add('current');
            }
        }
    }, [location]);
};
```

---

## Step 4: Use the Hook

Call the hook in your app's root component (or anywhere within the `Router` context):

```tsx
// src/App.tsx
import { HashRouter, Routes, Route } from 'react-router-dom';
import { routes } from '@/utils/routes';
import { useWpMenuSync } from '@/hooks/useWpMenuSync';
import Layout from '@/components/Layout';

/**
 * Component that activates the menu sync.
 * Must be rendered inside Router context.
 */
const MenuSyncProvider = ({ children }: { children: React.ReactNode }) => {
    useWpMenuSync();
    return <>{children}</>;
};

const App = () => {
    return (
        <HashRouter>
            <MenuSyncProvider>
                <Layout>
                    <Routes>
                        {routes.map((route) => (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={<route.element />}
                            />
                        ))}
                    </Routes>
                </Layout>
            </MenuSyncProvider>
        </HashRouter>
    );
};

export default App;
```

---

## Complete Code Examples

### File Structure

```
your-plugin/
├── app/
│   └── Admin/
│       └── Admin.php       # WordPress menu registration
├── src/
│   ├── App.tsx             # Main React app
│   ├── hooks/
│   │   └── useWpMenuSync.ts
│   └── utils/
│       └── routes.ts
```

### Route-to-Slug Mapping Table

| React Route | WordPress Menu Slug    | Menu Item        |
| ----------- | ---------------------- | ---------------- |
| `/`         | `your-plugin`          | Dashboard        |
| `/settings` | `your-plugin-settings` | Settings         |
| `/tables`   | `your-plugin-tables`   | Tables           |
| `/edit/:id` | `your-plugin-tables`   | Tables (grouped) |

---

## How It Works Under the Hood

### WordPress Admin Menu Structure

WordPress renders admin submenus with this HTML structure:

```html
<ul class="wp-submenu">
    <li class="current">
        <a href="admin.php?page=your-plugin" class="current">Dashboard</a>
    </li>
    <li>
        <a href="admin.php?page=your-plugin-settings">Settings</a>
    </li>
</ul>
```

The `.current` class is what visually highlights the active menu item.

### Our Hook's DOM Manipulation

1. **Iterates all submenu links** in `ul.wp-submenu a`
2. **Filters to internal admin.php links** (excludes external URLs from third-party plugins)
3. **Parses URL** and matches `page` parameter exactly using `URL.searchParams.get('page')`
4. **Clears all `.current` classes** from sibling `<li>` and `<a>` elements
5. **Adds `.current`** to the matching `<li>` and `<a>`

### URL Update with `replaceState`

We use `window.history.replaceState()` instead of `pushState()` to:

- Update the `?page=` parameter without page reload
- Avoid polluting browser history with every route change
- Preserve React Router's hash-based navigation (`#/settings`)

---

## Troubleshooting

### Menu Not Updating

- **Check slug matching**: Ensure your React route-to-slug mapping matches exactly what you registered in PHP
- **Verify selector**: Use browser DevTools to confirm the submenu structure matches `ul.wp-submenu a[href*="page=..."]`

### URL Not Syncing

- Confirm you're using `HashRouter` (not `BrowserRouter`)
- Check that the hash is being preserved: `${window.location.hash}`

### Multiple Submenus Highlighted

- Ensure you're removing `.current` from **all** siblings before adding to the active item
- Check for CSS specificity issues in your theme

### Dynamic Routes (e.g., `/edit/:id`)

Group them with their parent route:

```tsx
if (path === PATHS.TABLES || path.startsWith('/edit')) {
    slug = 'your-plugin-tables';
}
```

### External Plugin Link Conflicts (Production Issue)

Some third-party plugins (e.g., Freemius SDK) inject external links into the WordPress admin menu that contain `page=` parameters:

```html
<a href="https://external-service.com/contact/?page=your-plugin&site_url=...">
```

**Problem**: A simple CSS contains selector `a[href*="page=your-plugin"]` will match these external links, potentially highlighting the wrong menu item.

**Solution**: The hook uses URL parsing to:
1. Only match `admin.php` links (relative or absolute on same origin)
2. Parse the URL and match the `page` parameter exactly

```tsx
// Filter to internal admin links only
const isRelativeAdminLink = href.startsWith('admin.php');
const isAbsoluteAdminLink = href.startsWith(window.location.origin) && href.includes('admin.php');

if (!isRelativeAdminLink && !isAbsoluteAdminLink) {
    return false;
}
```

---

## Summary

By creating a custom React hook that:

1. **Listens to route changes** via `useLocation()`
2. **Maps routes to WordPress menu slugs**
3. **Updates the URL** with `history.replaceState()`
4. **Toggles the `.current` class** on DOM elements

You can achieve seamless synchronization between your React Router navigation and the WordPress admin sidebar, providing a polished, native-feeling admin experience.

---

## Further Reading

- [WordPress add_submenu_page()](https://developer.wordpress.org/reference/functions/add_submenu_page/)
- [React Router v6 Documentation](https://reactrouter.com/en/main)
- [History API: replaceState()](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState)

---

*This guide was created for developers building React-based WordPress plugins with client-side routing.*
