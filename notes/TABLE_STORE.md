# Table Store Architecture

## Overview

The `tableStore.ts` is the central state management for table configuration in the ProductBay plugin. It uses Zustand as the state management library and manages the complete lifecycle of a product table from creation to display.

## Store Location

**File**: `src/store/tableStore.ts`

## Architecture Pattern

The store follows a **4-key architecture** that mirrors the backend database structure:

1. **Source** (`_productbay_source` in DB)
2. **Columns** (`_productbay_columns` in DB)
3. **Settings** (`_productbay_settings` in DB)
4. **Style** (`_productbay_style` in DB)

This ensures complete separation of concerns and makes the data structure predictable and maintainable.

## State Structure

### Core Table State

```typescript
{
  // Metadata
  tableId: number | null,          // Database ID (null for new tables)
  tableTitle: string,               // Table name
  tableStatus: 'publish' | 'draft', // Publication status
  
  // 4-key data structure
  source: DataSource,               // What products to show
  columns: Column[],                // Which columns to display
  settings: TableSettings,          // Functional behavior
  style: TableStyle,                // Visual appearance
}
```

### UI State

```typescript
{
  isLoading: boolean,    // Loading data from API
  isSaving: boolean,     // Saving data to API
  error: string | null,  // Error message
  isDirty: boolean,      // Has unsaved changes
}
```

### Cache State

The store includes caching mechanisms for performance:

```typescript
{
  // Category cache (30-minute TTL)
  categories: Category[],
  categoriesLoading: boolean,
  categoriesLastFetched: number | null,
  
  // Source statistics cache
  sourceStats: Record<string, SourceStats>,
  sourceStatsLoading: Record<string, boolean>,
}
```

### Legacy State

Maintained for backward compatibility during migration:

```typescript
{
  currentStep: number,  // @deprecated - wizard step tracking
  tableData: {...},     // @deprecated - old data structure
}
```

## Actions

### Core Actions

#### `setTitle(title: string)`
Updates the table title and marks store as dirty.

```typescript
setTitle('My Product Table')
```

#### `setStatus(status: 'publish' | 'draft')`
Updates publication status.

```typescript
setStatus('publish')  // Make table active
setStatus('draft')    // Make table inactive
```

### Source Actions

#### `setSourceType(type: SourceType)`
Changes the data source type.

```typescript
// Available types:
setSourceType('all')       // All products
setSourceType('sale')      // On-sale products
setSourceType('category')  // Products from selected categories
setSourceType('specific')  // Manually selected products
```

#### `setSourceQueryArgs(args: Partial<DataSource['queryArgs']>)`
Updates query parameters for the source.

```typescript
setSourceQueryArgs({
  categoryIds: [5, 12],  // Select categories
  limit: 20              // Limit results
})

setSourceQueryArgs({
  postIds: [101, 102, 103]  // Select specific products
})
```

#### `setSourceSort(sort: Partial<DataSource['sort']>)`
Updates sorting configuration.

```typescript
setSourceSort({
  orderBy: 'price',
  order: 'desc'
})
```

### Column Actions

#### `addColumn(column: Column)`
Adds a new column to the table.

```typescript
addColumn({
  id: 'sku',
  heading: 'SKU',
  enabled: true,
  width: '100px',
  alignment: 'left'
})
```

#### `updateColumn(columnId: string, updates: Partial<Column>)`
Updates an existing column.

```typescript
updateColumn('price', {
  heading: 'Price (USD)',
  width: '120px'
})
```

#### `removeColumn(columnId: string)`
Removes a column.

```typescript
removeColumn('sku')
```

#### `reorderColumns(sourceIndex: number, destinationIndex: number)`
Reorders columns (for drag-and-drop).

```typescript
reorderColumns(0, 2)  // Move first column to third position
```

### Settings Actions

#### `setFeatures(features: Partial<TableSettings['features']>)`
Toggles functional features.

```typescript
setFeatures({
  search: true,
  sorting: true,
  filtering: false
})
```

#### `setPagination(pagination: Partial<TableSettings['pagination']>)`
Configures pagination.

```typescript
setPagination({
  enabled: true,
  perPage: 20,
  position: 'bottom'
})
```

#### `setCart(cart: Partial<TableSettings['cart']>)`
Configures shopping cart behavior.

```typescript
setCart({
  enabled: true,
  buttonText: 'Add to Cart',
  redirectAfterAdd: true
})
```

#### `setFilters(filters: Partial<TableSettings['filters']>)`
Configures filter options.

```typescript
setFilters({
  categories: true,
  priceRange: true,
  availability: false
})
```

#### `setPerformance(performance: Partial<TableSettings['performance']>)`
Configures performance options.

```typescript
setPerformance({
  lazyLoad: true,
  cacheResults: true,
  cacheDuration: 3600
})
```

### Style Actions

Each style section has its own setter:

- `setHeaderStyle(header: Partial<TableStyle['header']>)`
- `setBodyStyle(body: Partial<TableStyle['body']>)`
- `setButtonStyle(button: Partial<TableStyle['button']>)`
- `setLayoutStyle(layout: Partial<TableStyle['layout']>)`
- `setTypographyStyle(typography: Partial<TableStyle['typography']>)`
- `setHoverStyle(hover: Partial<TableStyle['hover']>)`
- `setResponsiveStyle(responsive: Partial<TableStyle['responsive']>)`

Example:
```typescript
setHeaderStyle({
  backgroundColor: '#2563eb',
  textColor: '#ffffff',
  fontSize: '16px'
})
```

### Persistence Actions

#### `resetStore()`
Resets the entire store to default values. Use when creating a new table.

```typescript
resetStore()
```

#### `loadTable(id: number): Promise<void>`
Loads a table from the backend API into the store.

```typescript
await loadTable(123)
```

**Implementation Details**:
1. Sets `isLoading: true`
2. Fetches data from API: `GET /tables/123`
3. Maps API response to store state
4. Falls back to defaults if data is invalid (e.g., empty arrays)
5. Sets `isDirty: false` (no unsaved changes)
6. Sets `isLoading: false`

#### `saveTable(): Promise<boolean>`
Saves the current store state to the backend API.

```typescript
const success = await saveTable()
if (success) {
  // Table saved successfully
}
```

**Implementation Details**:
1. Validates table title (frontend validation)
2. Sets `isSaving: true`
3. Cleans query args based on active source type:
   - If type != 'category': Clear `categoryIds`
   - If type != 'specific': Clear `postIds`
4. Builds payload with 4-key structure
5. Posts to API: `POST /tables`
6. Updates `tableId` if this was a new table
7. Sets `isDirty: false`
8. Returns `true` on success, `false` on failure
9. Sets `isSaving: false`

### Category Cache Actions

#### `preloadCategories(): Promise<void>`
Loads categories with localStorage caching (30-min TTL).

```typescript
await preloadCategories()
```

#### `refreshCategoriesIfStale(): Promise<void>`
Background refresh if cache is stale (5-min threshold).

```typescript
await refreshCategoriesIfStale()
```

#### `forceReloadCategories(): Promise<void>`
Forces fresh category load ignoring cache.

```typescript
await forceReloadCategories()
```

### Source Statistics Actions

#### `fetchSourceStats(sourceType: string): Promise<void>`
Fetches statistics for a given source type.

```typescript
await fetchSourceStats('sale')
// Returns: { categories: 5, products: 42 }
```

## Data Flow

### Creating a New Table

```typescript
// 1. Reset store
useTableStore.getState().resetStore()

// 2. User configures table
setTitle('My New Table')
setSourceType('category')
setSourceQueryArgs({ categoryIds: [5, 12] })

// 3. Save to backend
const success = await saveTable()

// 4. Store now has tableId from API response
const tableId = useTableStore.getState().tableId
```

### Editing an Existing Table

```typescript
// 1. Load table from API
await loadTable(123)

// 2. Store populated with data from backend
// 3. User modifies data (any setter marks isDirty: true)
setTitle('Updated Title')
updateColumn('price', { width: '150px' })

// 4. Save changes
const success = await saveTable()

// 5. isDirty reset to false
```

### Displaying a Table

```typescript
// 1. Load table
await loadTable(123)

// 2. Access state in components
const { columns, source, settings, style } = useTableStore()

// 3. Render based on actual data, not defaults
```

## Key Behaviors

### Auto-Marking Dirty State

All setters automatically set `isDirty: true` to track unsaved changes:

```typescript
setTitle('New Title')  // isDirty = true
saveTable()            // isDirty = false on success
```

### Query Args Cleaning

When saving, the store cleans irrelevant query args:

```typescript
// If source.type = 'all':
//   categoryIds and postIds both cleared

// If source.type = 'sale':
//   categoryIds and postIds both cleared

// If source.type = 'category':
//   categoryIds preserved, postIds cleared

// If source.type = 'specific':
//   postIds preserved, categoryIds cleared
```

This ensures only relevant data is persisted to the database.

### Fallback to Defaults

When loading a table, if any of the 4 keys are invalid (e.g., empty array from PHP), the store falls back to defaults:

```typescript
// Backend returns: { source: [] }
// Store uses: defaultSource()

// Backend returns: { columns: [] }
// Store uses: defaultColumns()
```

This prevents broken states and ensures the UI always has valid data.

### Legacy State Sync

The store maintains sync between new and legacy state structures for backward compatibility:

```typescript
setTitle('New Title')
// Updates both:
// - tableTitle (new)
// - tableData.title (legacy)

setSourceType('category')
// Updates both:
// - source.type (new)
// - tableData.source_type (legacy)
```

This allows gradual migration without breaking existing code.

## Performance Optimizations

### Category Caching

Categories are cached in `localStorage` with a 30-minute TTL to reduce API calls:

```typescript
// First call: Fetches from API
await preloadCategories()

// Subsequent calls within 30 min: Uses cache
await preloadCategories()  // Instant, no API call

// After 5 min (stale threshold): Background refresh
await refreshCategoriesIfStale()
```

### Source Stats Caching

Source statistics are cached in memory per source type:

```typescript
await fetchSourceStats('sale')  // API call
await fetchSourceStats('sale')  // Cache hit, no API call
```

## Common Patterns

### Using Store in Components

```typescript
import { useTableStore } from '@/store/tableStore'

const MyComponent = () => {
  const { tableTitle, setTitle, saveTable, isSaving } = useTableStore()
  
  return (
    <div>
      <input 
        value={tableTitle} 
        onChange={(e) => setTitle(e.target.value)} 
      />
      <button 
        onClick={saveTable}
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : 'Save'}
      </button>
    </div>
  )
}
```

### Selective Subscriptions

Only subscribe to needed state to avoid unnecessary re-renders:

```typescript
// Bad: Re-renders on ANY state change
const store = useTableStore()

// Good: Only re-renders when columns change
const columns = useTableStore((state) => state.columns)
```

### Direct Store Access

Access store outside React components:

```typescript
// Get current state
const state = useTableStore.getState()

// Call actions
useTableStore.getState().setTitle('New Title')
useTableStore.getState().saveTable()
```

## Known Issues

### Issue 1: Default Data on New Tables

**Problem**: When creating a new table, the `Table.tsx` component may display default data from the store instead of letting users start fresh.

**Root Cause**: `resetStore()` populates all 4 keys with defaults immediately.

**Solution**: Components should check `tableId === null` to determine if showing a "new table" flow.

### Issue 2: Navigation After Save

**Problem**: After saving a new table, navigation to `/table/{id}` may not happen automatically.

**Current Implementation**: `Table.tsx` line 152-154 handles this, but `Tables.tsx` still links to `/edit/{id}`.

**Solution**: Update `Tables.tsx` to use `/table/{id}` for consistency.

### Issue 3: isDirty Not Used

**Problem**: The `isDirty` flag exists but no components use it to warn about unsaved changes.

**Opportunity**: Add "unsaved changes" warning when navigating away.

## Best Practices

1. **Always reset store when creating new tables**:
   ```typescript
   useTableStore.getState().resetStore()
   ```

2. **Load table data when editing**:
   ```typescript
   useEffect(() => {
     if (!isNewTable) {
       loadTable(parseInt(id))
     }
   }, [id])
   ```

3. **Validate before saving**:
   ```typescript
   if (!tableTitle.trim()) {
     toast({ type: 'error', title: 'Table name required' })
     return
   }
   await saveTable()
   ```

4. **Handle loading states**:
   ```typescript
   if (isLoading) return <Spinner />
   if (error) return <ErrorMessage />
   return <TableEditor />
   ```

5. **Use selective subscriptions**:
   ```typescript
   const title = useTableStore((s) => s.tableTitle)
   const setTitle = useTableStore((s) => s.setTitle)
   ```

## Changelog

**2026-02-07**: Initial store architecture documentation
- Documented all actions and state structure
- Described 4-key architecture
- Added common patterns and best practices
- Identified known issues
