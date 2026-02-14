# Backend API Documentation

This document provides comprehensive documentation for the ProductBay backend API endpoints.

## Overview

The ProductBay plugin uses a custom REST API built on WordPress to manage product tables. The API follows REST principles and uses custom PHP routing to handle CRUD operations for tables.

## Base URL

```
/wp-admin/admin-ajax.php?action=productbay_api
```

## Architecture

### Controllers

**Location**: `app/Api/`

- **`TablesController.php`**: Handles all table-related requests
- **`ProductsController.php`**: Handles product-related requests  
- **`SettingsController.php`**: Handles plugin settings
- **`SystemController.php`**: Handles system information and stats

### Repository Layer

**Location**: `app/Data/`

- **`TableRepository.php`**: Data access layer for tables using WordPress Post Types

---

## Tables API

### Endpoints

#### 1. **GET** `/tables` - List All Tables

Retrieves all published tables.

**Controller Method**: `TablesController::index()`

**Request**:
```http
GET /wp-admin/admin-ajax.php?action=productbay_api&endpoint=tables
```

**Response**:
```json
[
  {
    "id": 1,
    "title": "Summer Sale Products",
    "status": "publish",
    "date": "2026-02-07 12:00:00",
    "shortcode": "[productbay id=\"1\"]",
    "source": {
      "type": "sale",
      "queryArgs": {...},
      "sort": {...}
    },
    "columns": [...],
    "settings": {...},
    "style": {...}
  }
]
```

**Response Fields**:
- `id` (int): Table post ID
- `title` (string): Table name
- `status` (string): Publication status ('publish', 'draft')
- `date` (string): Creation date
- `shortcode` (string): WordPress shortcode for embedding
- `source` (object): Data source configuration
- `columns` (array): Column definitions
- `settings` (object): Functional settings
- `style` (object): Visual styling

---

#### 2. **GET** `/tables/{id}` - Get Single Table

Retrieves a specific table by ID.

**Controller Method**: `TablesController::show($request)`

**Request**:
```http
GET /wp-admin/admin-ajax.php?action=productbay_api&endpoint=tables/123
```

**Response**:
```json
{
  "id": 123,
  "title": "Featured Products",
  "status": "publish",
  "date": "2026-02-07 12:00:00",
  "shortcode": "[productbay id=\"123\"]",
  "source": {
    "type": "category",
    "queryArgs": {
      "categoryIds": [5, 12],
      "postIds": [],
      "limit": 20
    },
    "sort": {
      "orderBy": "name",
      "order": "asc"
    }
  },
  "columns": [
    {
      "id": "image",
      "heading": "Image",
      "enabled": true,
      "width": "80px",
      "alignment": "center",
      "advanced": {...}
    }
  ],
  "settings": {
    "features": {...},
    "pagination": {...},
    "cart": {...},
    "filters": {...},
    "performance": {...}
  },
  "style": {
    "header": {...},
    "body": {...},
    "button": {...},
    "layout": {...},
    "typography": {...},
    "hover": {...},
    "responsive": {...}
  }
}
```

**Error Response** (404):
```json
null
```

---

#### 3. **POST** `/tables` - Create or Update Table

Creates a new table or updates an existing one.

**Controller Method**: `TablesController::store()`

**Request**:
```http
POST /wp-admin/admin-ajax.php?action=productbay_api&endpoint=tables
Content-Type: application/json

{
  "data": {
    "id": 123,           // Optional: omit for new table
    "title": "My Table",
    "status": "publish",  // or "draft"
    "source": {...},
    "columns": [...],
    "settings": {...},
    "style": {...}
  }
}
```

**Request Payload Fields**:

- `data.id` (int, optional): Table ID for updates, omit for new tables
- `data.title` (string, required): Table name
- `data.status` (string): 'publish' or 'draft'
- `data.source` (object): Complete source configuration
- `data.columns` (array): Array of column objects
- `data.settings` (object): Complete settings configuration  
- `data.style` (object): Complete style configuration

**Response** (Success):
```json
{
  "id": 123,
  "title": "My Table",
  "status": "publish",
  "date": "2026-02-07 12:00:00",
  "shortcode": "[productbay id=\"123\"]",
  "source": {...},
  "columns": [...],
  "settings": {...},
  "style": {...}
}
```

**Response** (Error):
```json
{
  "error": "Error message here"
}
```

**Storage Details**:

Tables are stored as WordPress Custom Post Type `productbay_table` with four meta keys:

- `_productbay_source`: Source configuration (serialized object)
- `_productbay_columns`: Column definitions (serialized array)
- `_productbay_settings`: Functional settings (serialized object)
- `_productbay_style`: Visual styling (serialized object)

---

#### 4. **DELETE** `/tables/{id}` - Delete Table

Permanently deletes a table.

**Controller Method**: `TablesController::destroy($request)`

**Request**:
```http
DELETE /wp-admin/admin-ajax.php?action=productbay_api&endpoint=tables/123
```

**Response**:
```json
true
```

---

## Data Models

### Table Data Structure

The table uses a **4-key architecture** matching backend meta storage:

#### 1. Source Configuration (`_productbay_source`)

Controls what products are displayed in the table.

```typescript
{
  type: 'all' | 'sale' | 'category' | 'specific',
  queryArgs: {
    categoryIds: number[],  // For type: 'category'
    postIds: number[],      // For type: 'specific'
    limit: number
  },
  sort: {
    orderBy: 'name' | 'price' | 'date' | 'sales',
    order: 'asc' | 'desc'
  }
}
```

#### 2. Columns Configuration (`_productbay_columns`)

Defines table columns and their properties.

```typescript
[
  {
    id: string,             // 'image', 'name', 'price', etc.
    heading: string,        // Column header text
    enabled: boolean,       // Visibility toggle
    width: string,          // CSS width value
    alignment: 'left' | 'center' | 'right',
    advanced: {
      order: number,        // Display order
      customClass: string,  // Custom CSS classes
      ...
    }
  }
]
```

#### 3. Settings Configuration (`_productbay_settings`)

Functional behavior of the table.

```typescript
{
  features: {
    search: boolean,
    sorting: boolean,
    filtering: boolean,
    export: boolean
  },
  pagination: {
    enabled: boolean,
    perPage: number,
    position: 'top' | 'bottom' | 'both'
  },
  cart: {
    enabled: boolean,
    buttonText: string,
    redirectAfterAdd: boolean
  },
  filters: {
    categories: boolean,
    priceRange: boolean,
    availability: boolean
  },
  performance: {
    lazyLoad: boolean,
    cacheResults: boolean,
    cacheDuration: number
  }
}
```

#### 4. Style Configuration (`_productbay_style`)

Visual appearance of the table.

```typescript
{
  header: {
    backgroundColor: string,
    textColor: string,
    fontSize: string,
    fontWeight: string
  },
  body: {
    backgroundColor: string,
    textColor: string,
    borderColor: string,
    evenRowColor: string,
    oddRowColor: string
  },
  button: {
    backgroundColor: string,
    textColor: string,
    borderRadius: string,
    hoverColor: string
  },
  layout: {
    containerWidth: string,
    spacing: string,
    borderStyle: string
  },
  typography: {
    fontFamily: string,
    headingSize: string,
    bodySize: string
  },
  hover: {
    enabled: boolean,
    backgroundColor: string
  },
  responsive: {
    breakpoints: {...},
    stackOnMobile: boolean
  }
}
```

---

## Implementation Details

### Backend Flow

1. **Route Handling**: WordPress AJAX action `productbay_api` routes to appropriate controller
2. **Controller**: Validates request and delegates to repository
3. **Repository**: Interacts with WordPress database using WP_Query and post meta functions
4. **Response**: JSON-formatted data returned to frontend

### Data Validation

**Backend Validation** (`TableRepository::save_table`):
- Sanitizes `title` using `sanitize_text_field()`
- Validates `id` as integer
- Validates `tableStatus` (defaults to 'publish')
- Stores complex data structures (source, columns, settings, style) as serialized arrays

**Frontend Validation** (`Table.tsx`):
- Requires non-empty `tableTitle` before save
- Shows validation error toast on failure

---

## Error Handling

### Common Errors

**Table Not Found (404)**:
- Returned by `get_table($id)` when table doesn't exist
- Frontend displays "Table Not Found" error page

**Save Failure**:
- Returns `{ error: "Error message" }` from `wp_insert_post` or `wp_update_post`
- Frontend shows error toast with message

**Delete Failure**:
- Returns `false` if delete operation fails
- Frontend shows error toast

---

## Frontend Integration

### API Client (`src/utils/api.ts`)

The frontend uses a utility function `apiFetch()` to interact with the API:

```typescript
// Fetch all tables
const tables = await apiFetch<Table[]>('tables');

// Fetch single table
const table = await apiFetch(`tables/${id}`);

// Save table
const result = await apiFetch('tables', {
  method: 'POST',
  body: JSON.stringify({ data: tableData })
});

// Delete table
await apiFetch(`tables/${id}`, { method: 'DELETE' });
```

### State Management (`src/store/tableStore.ts`)

The Zustand store provides actions that wrap API calls:

```typescript
// Load table into store
await loadTable(id);

// Save current store state to backend
const success = await saveTable();
```

---

## Testing

### Manual Testing

1. **Create Table**: Navigate to `/new`, configure table, click "Save Table"
2. **View Table**: Navigate to `/table/{id}` to view saved table
3. **Update Table**: Modify table at `/table/{id}`, click "Save Table"
4. **Delete Table**: Click delete button, confirm deletion
5. **List Tables**: Navigate to `/tables` to see all tables

### Expected Behaviors

- Newly created table should receive an ID from backend
- After save, URL should update to `/table/{id}` (for new tables)
- Loaded table should display actual saved data, not defaults
- Deleted table should be removed from list

---

## Known Issues & Limitations

2. **No Update Endpoint**: Currently uses same POST endpoint for create and update (determined by presence of `id`)
3. **Limited Error Details**: API returns generic error messages without detailed validation failures
4. **No Pagination**: `get_tables()` returns all tables (uses `posts_per_page: -1`)

---

## Changelog

**2026-02-07**: Initial API documentation created
- Documented all Tables endpoints
- Described 4-key data architecture
- Added frontend integration examples
