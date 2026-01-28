# Routing & Navigation Architecture

This document details how ProductBay's routing and navigation system works, bridging React Router with WordPress Admin Menu synchronization.

## Table of Contents

- [Overview](#overview)
- [System Components](#system-components)
- [How It Works](#how-it-works)
- [File Reference](#file-reference)
- [Adding New Routes](#adding-new-routes)
- [Troubleshooting](#troubleshooting)

---

## Overview

ProductBay uses a **dual-routing system**:

1. **React Router (HashRouter)** - Handles client-side navigation within the React app
2. **WordPress Admin Menu** - Provides the sidebar navigation in wp-admin

These two systems must stay synchronized so that:
- Clicking a WordPress menu item navigates to the correct React route
- Navigating within React updates the active WordPress menu item

```mermaid
graph LR
    subgraph WordPress
        WPMenu[Admin Menu Sidebar]
        URL[Browser URL ?page=]
    end
    
    subgraph React
        Router[HashRouter #/route]
        NavBar[React Navbar]
        SyncHook[useWpMenuSync]
    end
    
    WPMenu -->|Click| URL
    URL -->|Deep Link| Router
    NavBar -->|Navigate| Router
    Router -->|Location Change| SyncHook
    SyncHook -->|Update URL| URL
    SyncHook -->|Toggle .current| WPMenu
```

---

## System Components

### 1. WordPress Admin Menu (PHP)

**File**: `app/Admin/Admin.php`

Registers the top-level menu and submenus. Each submenu has a unique slug:

| Menu Item     | WordPress Slug        | React Route |
| ------------- | --------------------- | ----------- |
| Dashboard     | `productbay-dash`     | `/dash`     |
| Tables        | `productbay-tables`   | `/tables`   |
| Settings      | `productbay-settings` | `/settings` |
| Add New Table | `productbay-new`      | `/new`      |

```php
// Dashboard submenu with unique slug
\add_submenu_page(
    Constants::MENU_SLUG,
    \__('Dashboard', Constants::TEXT_DOMAIN),
    \__('Dashboard', Constants::TEXT_DOMAIN),
    Constants::CAPABILITY,
    Constants::MENU_SLUG . '-dash',  // productbay-dash
    [$this, 'render_app']
);

// Remove auto-generated duplicate parent menu
\remove_submenu_page(Constants::MENU_SLUG, Constants::MENU_SLUG);
```

### 2. React Routes Configuration

**File**: `src/utils/routes.ts`

Centralized path constants and route definitions:

```typescript
export const PATHS = {
    DASHBOARD: '/dash',
    NEW: '/new',
    EDIT: '/edit/:id',
    SETTINGS: '/settings',
    TABLES: '/tables',
    // ...
} as const;

export const routes: RouteConfig[] = [
    { path: PATHS.DASHBOARD, element: Dashboard, showInNav: true },
    { path: PATHS.TABLES, element: Tables, showInNav: true },
    // ...
];
```

### 3. Deep Linking Handler

**File**: `src/index.tsx`

Maps WordPress `?page=` parameter to React hash routes on initial load:

```typescript
const page = urlParams.get('page');
switch (page) {
    case 'productbay-dash':
    case 'productbay':  // Fallback for parent menu
        window.location.hash = `#${PATHS.DASHBOARD}`;
        break;
    case 'productbay-tables':
        window.location.hash = `#${PATHS.TABLES}`;
        break;
    // ...
}
```

### 4. Menu Sync Hook

**File**: `src/hooks/useWpMenuSync.ts`

Syncs React Router location with WordPress admin menu on every navigation:

```typescript
export const useWpMenuSync = () => {
    const location = useLocation();
    
    useEffect(() => {
        // 1. Map React path to WordPress slug
        const slug = getSlugFromPath(location.pathname);
        
        // 2. Update browser URL (?page=slug)
        window.history.replaceState(...);
        
        // 3. Find the admin menu link and toggle .current class
        const menuLink = findAdminMenuLink(slug);
        toggleCurrentClass(menuLink);
    }, [location]);
};
```

---

## How It Works

### Flow 1: User Clicks WordPress Menu

```
1. User clicks "Settings" in WordPress sidebar
2. Browser navigates to: admin.php?page=productbay-settings
3. PHP renders the React app container
4. index.tsx reads ?page=productbay-settings
5. Sets hash to #/settings
6. React Router renders Settings page
7. useWpMenuSync already has correct menu highlighted
```

### Flow 2: User Navigates Within React

```
1. User clicks "Dashboard" in React navbar
2. React Router navigates to #/dash
3. useWpMenuSync fires (location changed)
4. Hook maps /dash → productbay-dash slug
5. Updates URL to ?page=productbay-dash#/dash
6. Finds <a href="admin.php?page=productbay-dash">
7. Removes .current from all menu items
8. Adds .current to Dashboard menu item
```

---

## File Reference

| File                               | Purpose                            |
| ---------------------------------- | ---------------------------------- |
| `app/Admin/Admin.php`              | Registers WordPress admin menus    |
| `app/Core/Constants.php`           | Defines `MENU_SLUG = 'productbay'` |
| `src/utils/routes.ts`              | Defines PATHS and route configs    |
| `src/index.tsx`                    | Deep linking on initial load       |
| `src/hooks/useWpMenuSync.ts`       | Syncs menu on navigation           |
| `src/layouts/AdminLayout.tsx`      | Calls `useWpMenuSync()` hook       |
| `src/components/Layout/Navbar.tsx` | React navigation component         |

---

## Adding New Routes

Follow these steps to add a new route (e.g., "Analytics"):

### Step 1: Register WordPress Submenu

**File**: `app/Admin/Admin.php`

```php
// Register "Analytics" submenu
\add_submenu_page(
    Constants::MENU_SLUG,
    \__('Analytics', Constants::TEXT_DOMAIN),
    \__('Analytics', Constants::TEXT_DOMAIN),
    Constants::CAPABILITY,
    Constants::MENU_SLUG . '-analytics',  // productbay-analytics
    [$this, 'render_app']
);
```

### Step 2: Add Path Constant

**File**: `src/utils/routes.ts`

```typescript
export const PATHS = {
    // ...existing paths
    ANALYTICS: '/analytics',
} as const;
```

### Step 3: Add Route Config

**File**: `src/utils/routes.ts`

```typescript
import Analytics from '@/pages/Analytics';

export const routes: RouteConfig[] = [
    // ...existing routes
    {
        path: PATHS.ANALYTICS,
        element: Analytics,
        label: __('Analytics', 'productbay'),
        showInNav: true,  // true to show in navbar
    },
];
```

### Step 4: Create Page Component

**File**: `src/pages/Analytics.tsx`

```typescript
const Analytics = () => {
    return <div>Analytics Page</div>;
};

export default Analytics;
```

### Step 5: Add Deep Link Handler

**File**: `src/index.tsx`

```typescript
case 'productbay-analytics':
    window.location.hash = `#${PATHS.ANALYTICS}`;
    break;
```

### Step 6: Add Menu Sync Mapping

**File**: `src/hooks/useWpMenuSync.ts`

```typescript
} else if (path === PATHS.ANALYTICS) {
    slug = 'productbay-analytics';
}
```

---

## Troubleshooting

### Menu Not Syncing

**Symptom**: React navbar shows correct page, but WordPress menu highlights wrong item.

**Causes**:
1. Missing slug mapping in `useWpMenuSync.ts`
2. Path constant mismatch between routes.ts and hook

**Fix**: Ensure path → slug mapping is correct in `useWpMenuSync`.

### External Links Matching

**Symptom**: Menu sync works in dev but fails in production.

**Cause**: Third-party plugins (e.g., Freemius) inject external links containing `page=` parameter.

**Solution**: The hook filters links to only match:
- Relative `admin.php` links
- Absolute links starting with `window.location.origin`

```typescript
const isRelativeAdminLink = href.startsWith('admin.php');
const isAbsoluteAdminLink = href.startsWith(window.location.origin) && href.includes('admin.php');
```

### Deep Link Not Working

**Symptom**: Clicking WordPress menu loads the app but shows wrong page.

**Cause**: Missing case in `index.tsx` switch statement.

**Fix**: Add the WordPress slug → React hash mapping in `index.tsx`.

---

**Last Updated**: 2026-01-28  
**Related**: [ARCHITECTURE.md](./ARCHITECTURE.md)
