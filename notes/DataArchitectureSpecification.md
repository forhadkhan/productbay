Here is the comprehensive **ProductBay Data Architecture & Schema Specification**.

This document serves as the "source of truth" for both Backend (PHP) and Frontend (React/TypeScript) developers. It maps your requirements into a robust, scalable WordPress data model.

---

# 📘 ProductBay Data Architecture Specification

**Version:** 1.0.0
**Status:** Approved for Development

## 1. High-Level Storage Strategy

To ensure maximum compatibility with the WordPress ecosystem (backup plugins, import/export tools, multisite), we will use a **Custom Post Type (CPT)** architecture.

* **Entity:** `Product Table`
* **Storage:** `wp_posts` table.
* **Configuration:** Stored as structured JSON strings in `wp_post_meta`. This prevents table bloat while allowing complex, nested configurations (like column layouts) that are hard to map to standard SQL columns.

---

## 2. Database Schema (Backend)

### 2.1 The Post Object (`wp_posts`)

Standard WordPress fields are used for basic identity.

| Field           | Usage              | Notes                                                                      |
| --------------- | ------------------ | -------------------------------------------------------------------------- |
| `ID`            | **Table ID**       | Unique Identifier (e.g., `123`) used in Shortcode `[productbay id="123"]`. |
| `post_type`     | `productbay_table` | Registered CPT slug.                                                       |
| `post_title`    | **Table Name**     | User-facing title (e.g., "Summer Sale List").                              |
| `post_status`   | **Status**         | `publish` (Live) or `draft` (Editing).                                     |
| `post_author`   | **Author**         | WP User ID of the creator.                                                 |
| `post_date`     | **Created At**     | Creation timestamp.                                                        |
| `post_modified` | **Updated At**     | Last modified timestamp.                                                   |

### 2.2 The Meta Fields (`wp_post_meta`)

We group data into 4 logical context buckets to avoid monolithic data blobs.

| Meta Key       | Data Type   | Description                                             |
| -------------- | ----------- | ------------------------------------------------------- |
| `_pb_source`   | JSON Object | Rules for *which* products to fetch (Query args).       |
| `_pb_columns`  | JSON Array  | The layout, order, and visibility of columns.           |
| `_pb_settings` | JSON Object | Functional toggles (Pagination, Search, Cart behavior). |
| `_pb_style`    | JSON Object | Visual design tokens (Colors, Borders, Fonts).          |

---

## 3. Data Models (JSON Structure)

These schemas define exactly what is stored inside the `wp_post_meta` keys.

### A. Data Source (`_pb_source`)

*Controls the `WP_Query` builder logic.*

```json
{
  "type": "specific", // Options: "all", "category", "tag", "specific", "sale"
  "query_args": {
    "category_ids": [12, 45],
    "tag_ids": [],
    "post_ids": [], // Specific product IDs
    "excludes": [99],
    "stock_status": "instock", // "any", "instock", "outofstock"
    "min_price": 0,
    "max_price": null
  },
  "sort": {
    "orderby": "price",
    "order": "ASC" // "ASC", "DESC"
  }
}

```

### B. Columns Configuration (`_pb_columns`)

*Controls the visual grid. This is an ORDERED ARRAY.*

```json
[
  {
    "id": "col_xyz123",        // UUID for React DnD keys
    "type": "image",           // "image", "name", "price", "button", "combined", "tax", "cf"
    "heading": "Product Image",
    
    // Advanced Display Logic (Per your requirement)
    "advanced": {
      "show_heading": true,
      "width": {
        "value": 150,
        "unit": "px"           // "px" or "%"
      },
      "visibility": "all",     // "all", "mobile", "desktop", "not-mobile", etc.
      "order": 1               // Persisted order index
    },

    // Type-Specific Settings
    "settings": {
      "imageSize": "thumbnail",
      "linkTarget": "lightbox" // "none", "product", "lightbox"
    }
  },
  {
    "id": "col_abc789",
    "type": "cf",
    "heading": "Weight",
    "advanced": {
      "showHeading": true,
      "width": { "value": 0, "unit": "auto" }, // "auto", "px", or "%"
      "visibility": "all",
      "order": 2
    },
    "settings": {
      "metaKey": "_weight",
      "prefix": "",
      "suffix": " kg",
      "fallback": "N/A"
    }
  },
  {
    "id": "col_xyz456",
    "type": "combined",
    "heading": "Product Info",
    "advanced": {
      "showHeading": true,
      "width": { "value": 30, "unit": "%" },
      "visibility": "desktop",
      "order": 3
    },
    "settings": {
      "layout": "stacked",       // "inline" or "stacked"
      "elements": ["name", "price", "sku"]  // Min 2 column types
    }
  }
]

```

### C. Table Settings (`_pb_settings`)

*Functional behavior toggles.*

```json
{
  "features": {
    "search": true,
    "sorting": true,
    "pagination": true,
    "lazy_load": false,
    "export": false,
    "responsive_collapse": true // Row accordion on mobile
  },
  "pagination": {
    "limit": 10,
    "position": "bottom"
  },
  "cart": {
    "enable": true,
    "method": "button", // "button", "checkbox", "text"
    "show_quantity": true,
    "ajax_add": true
  },
  "filters": {
    "enabled": true,
    "position": "top",
    "active_taxonomies": ["product_cat", "pa_color"]
  },
  "performance": {
    "product_limit": 200 // Hard cap for query speed
  }
}

```

### D. Styling (`_pb_style`)

*Visual design override tokens.*

```json
{
  "header": {
    "bg_color": "#f0f0f1",
    "text_color": "#333333",
    "font_size": "16px"
  },
  "body": {
    "bg_color": "#ffffff",
    "text_color": "#444444",
    "row_alternate": false,
    "alt_bg_color": "#f9f9f9",
    "border_color": "#e5e5e5"
  },
  "button": {
    "bg_color": "#2271b1",
    "text_color": "#ffffff",
    "border_radius": "4px",
    "icon": "cart"
  }
}

```

---

## 4. TypeScript Interfaces (Frontend Contract)

*File: `src/types/index.ts*`

This ensures the React Admin team adheres strictly to the backend schema.

```typescript
/**
 * 1. Column Visibility Modes
 * Maps directly to CSS media query classes in the frontend renderer.
 */
export type VisibilityMode = 
  | 'default' | 'all' | 'none'
  | 'mobile' | 'tablet' | 'desktop'
  | 'not-mobile' | 'not-tablet' | 'not-desktop'
  | 'min-tablet';

/**
 * 2. The Column Object
 */
export interface Column {
    id: string; // Internal React Key
    type: 'image' | 'name' | 'price' | 'sku' | 'stock' | 'button' | 'date' | 'summary' | 'tax' | 'cf' | 'combined';
    heading: string;
    
    // The Advanced Tab Data
    advanced: {
        showHeading: boolean;
        width: {
            value: number;
            unit: 'px' | '%';
        };
        visibility: VisibilityMode;
        order: number;
    };

    // Dynamic settings based on type
    settings?: Record<string, any>;
}

/**
 * 3. Data Source Definition
 */
export interface DataSource {
    type: 'all' | 'specific' | 'category' | 'sale';
    queryArgs: {
        categoryIds: number[];
        tagIds: number[];
        postIds: number[];
        excludes: number[];
        stockStatus: 'any' | 'instock' | 'outofstock';
        priceRange: { min: number; max: number | null };
    };
    sort: {
        orderBy: string;
        order: 'ASC' | 'DESC';
    };
}

/**
 * 4. The Master Table Object
 * This is what the API GET/POST returns/receives.
 */
export interface ProductTable {
    id?: number; // Optional because new tables don't have an ID yet
    title: string;
    status: 'publish' | 'draft';
    author?: {
        id: number;
        name: string;
    };
    date?: {
        created: string;
        modified: string;
    };
    source: DataSource;
    columns: Column[];
    settings: any; // Mapped from _pb_settings
    style: any;    // Mapped from _pb_style
}

```

---

## 5. Implementation Notes for Developers

### A. Responsive Visibility Logic (Frontend Renderer)

When generating the table HTML, mapped the `visibility` setting to these Tailwind classes:

```php
// app/Helper/Utils.php

public static function get_visibility_classes( $mode ) {
    switch ( $mode ) {
        case 'mobile':      return 'block md:hidden';
        case 'desktop':     return 'hidden lg:block';
        case 'not-mobile':  return 'hidden md:block';
        case 'not-desktop': return 'block lg:hidden';
        case 'min-tablet':  return 'hidden md:block';
        case 'none':        return 'hidden';
        case 'all': default: return '';
    }
}

```

### B. Custom Fields & Taxonomies

For `type: 'tax'` or `type: 'cf'`, the `settings` object must include the target key:

* **Taxonomy:** `{ "taxonomy": "pa_color", "link_to_archive": true }`
* **Custom Field:** `{ "meta_key": "my_custom_field_slug" }`

### C. "Combined" Column Logic

For `type: 'combined'`, the `settings` object holds an array of *other* column IDs or types to render inside that single cell.

* **Settings:** `{ "layout": "stacked", "elements": ["name", "price", "sku"] }`