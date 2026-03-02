# ProductBay Architecture Documentation

This document provides a comprehensive overview of the ProductBay WordPress plugin architecture, detailing how different components interact and the design patterns used throughout the system.

## Table of Contents

- [Overview](#overview)
- [High-Level Architecture](#high-level-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Data Flow](#data-flow)
- [Component Documentation](#component-documentation)

---

## Overview

ProductBay is a modern WordPress plugin built with a clear separation between backend (PHP) and frontend (React/TypeScript). The architecture follows these core principles:

1. **Separation of Concerns**: PHP handles WordPress integration and data persistence, React handles UI/UX
2. **Single Source of Truth**: Zustand store manages all client-side state
3. **RESTful API**: Communication between frontend and backend via WordPress REST API
4. **Type Safety**: TypeScript ensures type safety across the frontend
5. **Progressive Enhancement**: Server-side rendering with client-side interactivity

---

## High-Level Architecture

```mermaid
graph TB
    subgraph WordPress
        WP[WordPress Core]
        WPDB[(WordPress Database)]
    end
    
    subgraph Backend[PHP Backend]
        Plugin[productbay.php]
        Core[Core/Plugin.php]
        Admin[Admin Layer]
        API[REST API Controllers]
        Data[Data Layer]
    end
    
    subgraph Frontend[React Frontend]
        React[React App]
        Zustand[Zustand Store]
        Components[Components]
        Utils[API Utils]
    end
    
    WP --> Plugin
    Plugin --> Core
    Core --> Admin
    Core --> API
    API --> Data
    Data --> WPDB
    
    Admin --> React
    React --> Zustand
    Zustand --> Components
    Components --> Utils
    Utils --> API
```

---

## Frontend Architecture

The React frontend follows a component-based architecture with centralized state management:

### State Management Strategy

- **Global State**: Zustand stores (`src/store/`)
- **Local State**: React `useState` for UI-only state (modals, dropdowns, etc.)
- **Server State**: Cached in Zustand with TTL and refresh strategies

### Caching Strategy

ProductBay implements a multi-layer caching system for optimal performance:

1. **LocalStorage Cache** (30-minute TTL) - Persists across sessions
2. **Zustand Store Cache** (Session-based) - In-memory instant access
3. **Background Refresh** (5-minute staleness threshold) - Non-blocking updates

---

## Backend Architecture

### PHP Namespace Structure

```
ProductBay\
├── Admin\          # Admin interface registration and asset enqueuing
├── Api\            # REST API endpoints for React frontend
├── Core\           # Plugin initialization and DI container
├── Data\           # Repositories and data access layer
├── Frontend\       # Public-facing shortcodes and handlers
├── Http\           # Request/Response utilities
└── Utils\          # Helper functions and sanitization
```

### API Endpoints

All REST API endpoints are registered under the `/productbay/v1` namespace:

- `/categories` - Fetch WooCommerce product categories
- `/tables` - CRUD operations for product tables
- `/products` - Search and fetch WooCommerce products

---

## Data Flow

### Typical User Interaction Flow

1. **User Action** → React Component
2. **Component** → Zustand Store Action
3. **Store Action** → API Utility Function
4. **API Utility** → WordPress REST API
5. **REST API** → PHP Controller
6. **Controller** → Data Repository
7. **Repository** → WordPress Database
8. **Response** ← Reverse through the chain
9. **Zustand Store** updates state
10. **React Components** re-render with new data

---

## Component Documentation

Detailed documentation for specific components and features:

### System Architecture

- **[Routing & Navigation](./ROUTING.md)** - React Router integration with WordPress Admin Menu sync
- **[Settings System](./SETTINGS.md)** - Plugin settings architecture and reload-required patterns

### UI Components

- **[CategorySelector](./CategorySelectorArchitecture.md)** - Multi-select category picker with intelligent caching
- **ColumnEditor** (`src/components/Table/sections/ColumnEditor.tsx`) - Drag-and-drop column list with @dnd-kit, includes width validation warnings
- **ColumnItem** (`src/components/Table/sections/ColumnItem.tsx`) - Individual column settings with inline heading editing, combined column sub-element picker, and custom field meta key configuration
- **ProductSearch** (`src/components/Table/sections/ProductSearch.tsx`) - Advanced product search with debounced input and selection management

### Pages

- **Dashboard** (`src/pages/Dashboard.tsx`) - System overview and quick actions
- **Tables** (`src/pages/Tables.tsx`) - List of all tables with bulk actions and filtering
- **Table** (`src/pages/Table.tsx`) - Main editor with live preview integration

### Stores

- **tableStore** (`src/store/tableStore.ts`) - Central engine managing the 4-key table configuration
- **settingsStore** (`src/store/settingsStore.ts`) - Manages global plugin settings
- **systemStore** (`src/store/systemStore.ts`) - Manages system information and stats

---

## Design Patterns

### 1. Repository Pattern (Backend)

All database interactions go through repository classes:

```php
// app/Data/TableRepository.php
class TableRepository {
    public function find(int $id): ?Table;
    public function save(Table $table): bool;
}
```

### 2. Hook-Based Store Pattern (Frontend)

Zustand stores are accessed via React hooks:

```typescript
const { categories, preloadCategories } = useTableStore();
```

### 3. Smart Loading Pattern

Components display cached data immediately while fetching fresh data in the background:

```typescript
// Display cache instantly
setCategories(cachedData);

// Fetch fresh data in background
const fresh = await fetchCategories();
setCategories(fresh); // UI updates seamlessly
```

---

## Performance Optimizations

1. **Preloading**: Parent components preload data before child components mount
2. **Memoization**: `useMemo` for expensive computations (filtering, sorting)
3. **Code Splitting**: Lazy loading for page components
4. **Asset Optimization**: Webpack bundles optimized for production

---

## Internationalization (i18n)

ProductBay supports full internationalization for both PHP and React code.

### Architecture

```mermaid
graph LR
    subgraph Development
        Code[Source Code] --> Build[bun build]
        Build --> POT[productbay.pot]
    end
    
    subgraph Translation
        POT --> PO[.po files]
        PO --> JSON[.json files]
        PO --> MO[.mo files]
    end
    
    subgraph Runtime
        JSON --> React[React UI]
        MO --> PHP[PHP Backend]
    end
```

### Key Components

| Component      | Location                  | Purpose                              |
| -------------- | ------------------------- | ------------------------------------ |
| Text Domain    | `productbay`              | Unique identifier for translations   |
| POT Extraction | WP-CLI `wp i18n make-pot` | Extracts strings from PHP and JS     |
| PHP Loading    | Plugin bootstrap          | Native WordPress `load_textdomain()` |
| React Loading  | `Admin.php:168`           | `wp_set_script_translations()`       |

### React i18n Pattern

All user-facing strings in React use `@wordpress/i18n`:

```tsx
import { __ } from '@wordpress/i18n';

const Component = () => (
    <h1>{__('Dashboard', 'productbay')}</h1>
);
```

### PHP i18n Pattern

```php
$title = __('Settings', 'productbay');
_e('Save Changes', 'productbay');
```

> **See Also**: [TRANSLATIONS.md](./TRANSLATIONS.md) for detailed translation workflow.

---

## Security Considerations

1. **Nonce Verification**: All API requests include WordPress nonces
2. **Capability Checks**: User permissions verified on backend
3. **Input Sanitization**: All user inputs sanitized via WordPress functions
4. **Output Escaping**: All output properly escaped for XSS prevention

---

## Lifecycle & Cleanup

### Uninstallation Process
ProductBay follows WordPress best practices for data management during the plugin lifecycle:

1. **Deactivation**: No data is removed. This allows users to temporarily disable the plugin without losing their tables or configuration.
2. **Uninstallation**: When the plugin is deleted from the WordPress dashboard, `uninstall.php` is executed.
    - **Security**: The script verifies the `WP_UNINSTALL_PLUGIN` constant to prevent unauthorized access.
    - **Configurable Cleanup**: The plugin removes all Custom Post Type data (`productbay_table`) and options (`productbay_settings`). If the settings haven't been saved to the database yet, cleanup defaults to **enabled**.
    - **Orphan Data Prevention**: Force-deletion of posts ensures associated metadata is removed. As an extra safety net, a direct `$wpdb` SQL query is executed to wipe any residual `_productbay_config` metadata across the entire database.

> [!IMPORTANT]
> The cleanup behavior is controlled by the [delete_on_uninstall](../uninstall.php) setting in [productbay_settings](../app/Api/SettingsController.php). If set to `false`, data will be preserved even after uninstallation.


---

## Build Process & Release
We cannot use this development project directly in production. To get a distribution-ready zip file of the plugin we can run `bun run release`, which will give us an installable zip for our plugin with the latest changes.

Learn more - **[Release Process & Build Architecture](./RELEASE.md)**.

---

**Last Updated**: 2026-03-02  
**Maintainer**: ProductBay Development Team
