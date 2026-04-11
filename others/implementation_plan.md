# Import & Export (Pro Feature) — Implementation Plan v2

## Goal

Implement a robust, scalable Import/Export system for ProductBay that allows users to transfer plugin data (tables + settings) across installations. This is a **Pro feature** — the Free plugin contains only shell UI with Pro badges, while all logic lives in the Pro plugin following the established hook/SlotFill architecture.

> [!NOTE]
> **Confirmed**: The Pro plugin does NOT store any data independently — all data persistence (tables as CPT, settings as `wp_options`) is handled exclusively by the Free plugin's `TableRepository` and `SettingsController`. The export only needs to capture Free plugin data. The Pro version metadata (`pro_version`) is included in the export file purely for compatibility checking.

---

## Data Architecture Summary

| Data Type | Storage | Meta Keys |
|-----------|---------|-----------|
| **Tables** (CPT) | `productbay_table` posts | `_productbay_source`, `_productbay_columns`, `_productbay_settings`, `_productbay_style` |
| **Settings** | `wp_options` | `productbay_settings` |

### Export JSON Schema

```json
{
  "plugin": "productbay",
  "version": "1.2.0",
  "schema_version": 1,
  "exported_at": "2026-04-04T16:00:00Z",
  "pro_version": "1.0.0",
  "data": {
    "tables": [
      {
        "title": "My Table",
        "status": "publish",
        "source": { ... },
        "columns": [ ... ],
        "settings": { ... },
        "style": { ... }
      }
    ],
    "settings": { ... }
  },
  "options": {
    "include_settings": true,
    "include_tables": true,
    "table_ids": [1, 5, 12]
  }
}
```

Key design decisions:
- **No IDs exported** — tables are always created as new on import (avoids ID conflicts)
- **`schema_version`** — enables future migration logic when data structures change
- **`version` + `pro_version`** — used for compatibility checks during import
- **v1 is JSON-only** — no ZIP asset bundling (tables reference WooCommerce products, not custom media)
- **Assets**: URL references are exported as-is

---

## Proposed Changes

### Component 1: Free Plugin — Reusable Pro UI Components

These components will be created first as a **separate commit**, then existing inline `proVersion` checks will be refactored to use them.

---

#### [NEW] [ProBadge.tsx](file:///var/www/html/wp-content/plugins/productbay/src/components/ui/ProBadge.tsx)

Simple reusable "PRO" pill badge component:
```tsx
const ProBadge = () => (
    <span className="...gradient from-amber-500 to-orange-500...">PRO</span>
);
```
- Exported from `src/components/ui/index.ts`
- Exposed globally via `window.productbay.ui.ProBadge`

---

#### [NEW] [ProFeatureGate.tsx](file:///var/www/html/wp-content/plugins/productbay/src/components/ui/ProFeatureGate.tsx)

Reusable wrapper that shows a "Pro required" modal when non-Pro users interact with gated features:

```tsx
interface ProFeatureGateProps {
    children: ReactNode;
    featureName: string;       // e.g., "Import/Export"
    description?: string;      // Custom description for the modal
}
```

- Checks `productBaySettings.proVersion` to determine Pro status
- **When Pro is NOT active**: intercepts `onClick` → shows informational `<Modal>` explaining the feature is Pro-only
- **When Pro IS active**: renders children normally (pass-through, no wrapper)
- Uses the existing `<Modal>` component from the UI library

---

#### [MODIFY] [index.ts](file:///var/www/html/wp-content/plugins/productbay/src/components/ui/index.ts)

Add exports for `ProBadge` and `ProFeatureGate`.

---

#### [MODIFY] [index.tsx](file:///var/www/html/wp-content/plugins/productbay/src/index.tsx)

Expose `ProBadge` and `ProFeatureGate` (already exported via `ui` wildcard, but verify).

---

#### Refactor: Existing Pro Checks (Separate Commit)

Replace inline `productBaySettings.proVersion` checks with `<ProBadge>` and `<ProFeatureGate>` in:
- `src/components/Table/panels/OptionsPanel.tsx` (line 50)
- `src/components/Table/sections/ColumnItem.tsx` (line 317)
- `src/components/Table/sections/ColumnEditor.tsx` (line 327)

---

### Component 2: Free Plugin — Advanced Settings Shell

---

#### [MODIFY] [AdvancedSettings.tsx](file:///var/www/html/wp-content/plugins/productbay/src/components/Settings/AdvancedSettings.tsx)

Transform from empty placeholder into a proper settings panel with an **Import/Export** section. Receives `settings`, `setSettings`, and `loading` props from parent (same pattern as `AdminBarOptions`).

**UI Structure using `SectionHeading` + `SettingsOption`:**

```
┌─────────────────────────────────────────────────────┐
│ Import & Export                          [PRO badge] │
│ Configure how tables are exported and imported.     │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Enable Import/Export        [Toggle] [PRO badge]│ │
│ │ Allow importing and exporting tables            │ │
│ ├─────────────────────────────────────────────────┤ │
│ │ Include Settings in Export  [Toggle] [PRO badge]│ │
│ │ Include global plugin settings when exporting   │ │
│ ├─────────────────────────────────────────────────┤ │
│ │ Settings Import Mode        [Select] [PRO badge]│ │
│ │ Choose how imported settings are applied        │ │
│ │ Options: "Merge with existing" / "Replace all"  │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

- All toggles/selects are **disabled** with `<ProBadge>` when Pro is not active
- When Pro IS active, toggles control settings in `productbay_settings.import_export`

---

#### [MODIFY] [Settings.tsx](file:///var/www/html/wp-content/plugins/productbay/src/pages/Settings.tsx)

Pass props to `<AdvancedSettings>` on line 393:
```tsx
{activeTab === 'advanced' && (
    <AdvancedSettings
        settings={settings}
        setSettings={updateSettings}
        loading={loading}
    />
)}
```

---

#### [MODIFY] [SettingsController.php](file:///var/www/html/wp-content/plugins/productbay/app/Api/SettingsController.php)

Add new defaults to `defaults()`:
```php
'enable_import_export' => false,
'import_export' => [
    'include_settings' => true,
    'settings_import_mode' => 'merge', // 'merge' or 'replace'
],
```

---

### Component 3: Free Plugin — Export Triggers (Multiple Locations)

Export/Import triggers appear in **4 locations**, all gated with `<ProFeatureGate>`:

---

#### [MODIFY] [Tables.tsx](file:///var/www/html/wp-content/plugins/productbay/src/pages/Tables.tsx)

**Location 1 — Header Buttons (lines 596-609):**
- Wrap Import/Export buttons with `<ProFeatureGate>`
- When Pro active: `onClick` → open import/export modal via `importExportStore`
- Pass current `tables` list to the export modal for selection

**Location 2 — Bulk Actions:**
- Add "Export Selected" to the `BULK_OPTIONS` array (with ProFeatureGate)
- When activated with selected rows, opens export modal with pre-selected table IDs

**Location 3 — Row Hover Actions (line ~918-961):**
- Add "Export" link after "Duplicate" in the hover actions row
- Wrapped in `<ProFeatureGate>`, exports single table when Pro active

---

#### [MODIFY] [Table.tsx](file:///var/www/html/wp-content/plugins/productbay/src/pages/Table.tsx)

**Location 4 — Individual Table Editor Header (line ~318-331):**
- Add an Export button (DownloadIcon) next to the Delete button in the controls area
- Wrapped in `<ProFeatureGate>`, exports the single currently-open table when Pro active

---

### Component 4: Free Plugin — Communication Bridge Store

---

#### [NEW] [importExportStore.ts](file:///var/www/html/wp-content/plugins/productbay/src/store/importExportStore.ts)

Lightweight Zustand store that bridges Free buttons → Pro modal UI:

```typescript
interface ImportExportStore {
    // Modal state
    importModalOpen: boolean;
    exportModalOpen: boolean;

    // Pre-selected data for export
    exportTableIds: number[];   // Specific table IDs to export (empty = show selection UI)
    availableTables: Table[];   // All tables for selection UI

    // Actions
    openImportModal: () => void;
    closeImportModal: () => void;
    openExportModal: (tables: Table[], preSelectedIds?: number[]) => void;
    closeExportModal: () => void;
}
```

- Free buttons call `openImportModal()` / `openExportModal(tables, [id])`
- Pro's SlotFill reads `importModalOpen` / `exportModalOpen` and renders modals
- Store exposed globally: `window.productbay.useImportExportStore`

---

#### [MODIFY] [index.tsx](file:///var/www/html/wp-content/plugins/productbay/src/index.tsx)

Expose `useImportExportStore` on `window.productbay`:
```tsx
import { useImportExportStore } from './store/importExportStore';

(window as any).productbay = {
    ...((window as any).productbay || {}),
    useTableStore,
    useExtensionStore,
    useImportExportStore,  // NEW
    ui,
    components: { SettingsOption, SectionHeading },
};
```

---

### Component 5: Pro Plugin — PHP Backend (ImportExportModule)

All server-side logic follows the exact same module pattern as `CustomFieldsModule.php`.

---

#### [NEW] [ImportExportModule.php](file:///var/www/html/wp-content/plugins/productbay-pro/app/Modules/ImportExport/ImportExportModule.php)

Self-contained PHP module class:

**`init()` method** — registers hooks:
```php
add_filter('productbay_admin_script_data', [$this, 'extend_admin_data']);
add_action('rest_api_init', [$this, 'register_routes']);
```

**REST Endpoints:**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/pro/export` | Generate and return export JSON |
| `POST` | `/pro/import` | Validate and import JSON data |
| `POST` | `/pro/import/validate` | Pre-validate import file without executing |

**Export Logic (`handle_export`):**
1. Accept `table_ids` array (empty = all tables), `include_settings` bool
2. Query `productbay_table` CPT via `get_posts()` + `get_post_meta()` (reading the Free plugin's data)
3. For each table: extract the 4 meta keys (`_productbay_source`, `_productbay_columns`, `_productbay_settings`, `_productbay_style`)
4. If `include_settings`: read `get_option('productbay_settings')`
5. Build the export JSON structure with version metadata
6. Return JSON response (frontend handles file download via `Blob`)

**Import Logic (`handle_import`):**
1. Accept the full JSON payload (already parsed by frontend)
2. **Validate phase:**
   - Check `plugin === 'productbay'`
   - Check `schema_version` compatibility
   - Validate data structure integrity (all required keys exist)
   - Version compatibility check: warn if `version` is newer than current
3. **User options (received from frontend):**
   - `conflict_mode`: `'create_new'` | `'overwrite'` | `'skip'`
   - `add_imported_suffix`: `boolean` (whether to append "(Imported)" to titles, default `false`)
   - `settings_import_mode`: `'merge'` | `'replace'` (from Advanced Settings or per-import override)
4. **Execute phase** (wrapped in try/catch for atomicity):
   - **Conflict detection**: Check if tables with same title exist
   - **Create New mode**: Always create new tables (de-duplicate titles if needed, optionally append "(Imported)")
   - **Overwrite mode**: Find tables by title match → update existing via `wp_update_post`, create new for unmatched
   - **Skip mode**: Skip tables with matching titles, create only new ones
   - Call Free plugin's `TableRepository::save_table()` for each table
   - Import settings: If included, use `get_option()` + `update_option()` with merge or replace
   - Track created table IDs for rollback
5. **Rollback on failure**: If any table fails, delete all previously created tables in this batch
6. Return success response with summary:
   ```json
   {
     "tables_created": 3,
     "tables_updated": 1,
     "tables_skipped": 1,
     "settings_updated": true,
     "details": [
       { "title": "My Table", "action": "created", "id": 456 },
       { "title": "Existing Table", "action": "overwritten", "id": 123 },
       { "title": "Duplicate Table", "action": "skipped" }
     ]
   }
   ```

**Validation Logic (`handle_validate`):**
1. Same structural validation as import, returns compatibility report without executing
2. Returns:
   ```json
   {
     "valid": true,
     "warnings": ["Export from newer version (1.3.0)"],
     "tables_count": 5,
     "table_titles": ["Table A", "Table B", ...],
     "has_settings": true,
     "version_match": true,
     "conflicts": [
       { "title": "Existing Table", "existing_id": 123 }
     ]
   }
   ```

**Security:**
- All endpoints require `manage_options` capability (via Router permission check)
- WordPress nonce verification via standard REST API
- All imported titles sanitized via `sanitize_text_field()`
- Table data passed through `productbay_before_save_table` filter (existing hook)

**Performance:**
- For large exports (50+ tables), process in batches of 20
- Memory limit check before import (`wp_raise_memory_limit('admin')`)
- Use `wp_defer_term_counting()` during bulk import

---

#### [MODIFY] [ProPlugin.php](file:///var/www/html/wp-content/plugins/productbay-pro/app/Core/ProPlugin.php)

Add ImportExportModule instantiation in `on_free_loaded()`:
```php
$import_export_module = new \WpabProductBayPro\Modules\ImportExport\ImportExportModule();
$import_export_module->init();
```

---

### Component 6: Pro Plugin — React Frontend (SlotFill UI)

---

#### [NEW] [ImportExportSlot.tsx](file:///var/www/html/wp-content/plugins/productbay-pro/src/slots/ImportExportSlot.tsx)

The Pro's SlotFill component that renders the actual Import/Export modals. Registered via `useExtensionStore.addFill()`.

Uses UI components from `window.productbay.ui` (Button, Modal, Toggle, Select, etc.).

**Export Modal Flow:**

```
┌─────────────────────────────────────────────────────┐
│                   Export Tables                      │
│─────────────────────────────────────────────────────│
│                                                     │
│  ☑ Select All                                       │
│  ┌─────────────────────────────────────────────────┐│
│  │ ☑ Summer Sale Products (Published)             ││
│  │ ☑ Featured Electronics (Private)               ││
│  │ ☐ Holiday Deals (Published)                    ││
│  └─────────────────────────────────────────────────┘│
│                                                     │
│  ☑ Include Plugin Settings                          │
│                                                     │
│  Selected: 2 tables                                 │
│                                                     │
│                    [Cancel]    [⬇ Export]            │
└─────────────────────────────────────────────────────┘
```

1. Table selection: Checkboxes for each table (pre-selected if triggered from specific table/bulk)
2. "Select All" / "Deselect All" controls
3. "Include Settings" toggle (reads from Advanced Settings default, overridable per-export)
4. "Export" button → calls `POST /pro/export` → generates `Blob` → triggers browser download
5. Filename: `productbay-export-YYYY-MM-DD.json`
6. Success toast with table count on completion

**Import Modal Flow (Multi-step):**

```
Step 1: File Selection
┌─────────────────────────────────────────────────────┐
│                   Import Tables                      │
│─────────────────────────────────────────────────────│
│                                                     │
│  ┌─────────────────────────────────────────────────┐│
│  │                                                 ││
│  │    📁 Drop your .json export file here          ││
│  │       or click to browse                        ││
│  │                                                 ││
│  └─────────────────────────────────────────────────┘│
│                                                     │
│                           [Cancel]                   │
└─────────────────────────────────────────────────────┘

Step 2: Validation Preview
┌─────────────────────────────────────────────────────┐
│                  Import Preview                      │
│─────────────────────────────────────────────────────│
│                                                     │
│  ✅ Valid export file (ProductBay v1.2.0)            │
│  ⚠️ Export from newer version — some features may   │
│     not import correctly                             │
│                                                     │
│  📦 5 tables to import:                             │
│     • Summer Sale Products                          │
│     • Featured Electronics                          │
│     • Holiday Deals ⚠️ (exists — conflict)          │
│     • Budget Picks                                  │
│     • New Arrivals                                  │
│                                                     │
│  📋 Plugin settings included                        │
│                                                     │
│  ─── Import Options ───────────────────────────────  │
│                                                     │
│  Conflict Resolution:  [Create New  ▾]              │
│                        (Create New / Overwrite /     │
│                         Skip Duplicates)             │
│                                                     │
│  ☐ Add "(Imported)" to table titles                 │
│                                                     │
│  Settings Mode:        [Merge ▾]                    │
│                        (Merge / Replace)             │
│                                                     │
│                    [Cancel]  [⬆ Import]              │
└─────────────────────────────────────────────────────┘

Step 3: Progress & Result
┌─────────────────────────────────────────────────────┐
│                  Import Complete                     │
│─────────────────────────────────────────────────────│
│                                                     │
│  ✅ 4 tables created                                │
│  ♻️ 1 table overwritten                             │
│  ✅ Settings merged successfully                    │
│                                                     │
│                           [Done]                     │
└─────────────────────────────────────────────────────┘
```

**Error Handling:**
- Corrupt JSON → immediate error message with file details
- Partial import failure → show which tables succeeded/failed + rollback notice
- Version mismatch → warning with option to proceed

---

#### [MODIFY] [index.tsx](file:///var/www/html/wp-content/plugins/productbay-pro/src/index.tsx)

Register the new ImportExportSlot Fill:
```tsx
import ImportExportSlot from './slots/ImportExportSlot';
// ...
store.getState().addFill(ImportExportSlot);
```

---

## Implementation Order

### Commit 1: ProBadge & ProFeatureGate (Reusable Components)
1. Create `ProBadge.tsx` and `ProFeatureGate.tsx` in `src/components/ui/`
2. Export from `src/components/ui/index.ts`
3. Refactor existing inline `proVersion` checks in `OptionsPanel.tsx`, `ColumnItem.tsx`, `ColumnEditor.tsx`

### Commit 2: Free Plugin — Settings & Store
4. Update `SettingsController.php` with new defaults
5. Create `importExportStore.ts`
6. Update `AdvancedSettings.tsx` with Import/Export config section
7. Update `Settings.tsx` to pass props to AdvancedSettings
8. Expose `useImportExportStore` in `index.tsx`

### Commit 3: Free Plugin — Trigger Points
9. Update `Tables.tsx` — header buttons, bulk action, row hover action
10. Update `Table.tsx` — individual table export button

### Commit 4: Pro Plugin — Backend
11. Create `ImportExportModule.php` with 3 REST endpoints
12. Register module in `ProPlugin.php`

### Commit 5: Pro Plugin — Frontend
13. Create `ImportExportSlot.tsx` with Export/Import modals
14. Register Fill in Pro `index.tsx`

---

## File Summary

### Free Plugin Changes

| Action | File | Purpose |
|--------|------|---------|
| NEW | `src/components/ui/ProBadge.tsx` | Reusable Pro badge component |
| NEW | `src/components/ui/ProFeatureGate.tsx` | Pro feature gate with modal |
| MODIFY | `src/components/ui/index.ts` | Export new components |
| MODIFY | `src/components/Table/panels/OptionsPanel.tsx` | Refactor to use ProBadge/ProFeatureGate |
| MODIFY | `src/components/Table/sections/ColumnItem.tsx` | Refactor to use ProBadge/ProFeatureGate |
| MODIFY | `src/components/Table/sections/ColumnEditor.tsx` | Refactor to use ProBadge/ProFeatureGate |
| NEW | `src/store/importExportStore.ts` | Modal state management store |
| MODIFY | `src/index.tsx` | Expose importExportStore globally |
| MODIFY | `app/Api/SettingsController.php` | Add import_export defaults |
| MODIFY | `src/components/Settings/AdvancedSettings.tsx` | Import/Export settings section with Pro badges |
| MODIFY | `src/pages/Settings.tsx` | Pass props to AdvancedSettings |
| MODIFY | `src/pages/Tables.tsx` | Header, bulk, and row-hover export triggers |
| MODIFY | `src/pages/Table.tsx` | Individual table export button |

### Pro Plugin Changes

| Action | File | Purpose |
|--------|------|---------|
| NEW | `app/Modules/ImportExport/ImportExportModule.php` | PHP REST endpoints + logic |
| NEW | `src/slots/ImportExportSlot.tsx` | Import/Export modal UI (SlotFill) |
| MODIFY | `app/Core/ProPlugin.php` | Register ImportExportModule |
| MODIFY | `src/index.tsx` | Register ImportExportSlot Fill |

---

## Verification Plan

### Automated Tests
- Export → re-import and verify data integrity (compare table configs field by field)
- Test all 3 conflict modes: create new, overwrite, skip

### Manual Verification

1. **Free plugin only** (no Pro):
   - ✅ Pro badges appear on all settings toggles in Advanced Settings
   - ✅ Clicking Import/Export buttons shows "Pro required" modal
   - ✅ "Export" in hover actions shows "Pro required" modal
   - ✅ Export button in Table editor shows "Pro required" modal
   - ✅ No errors in console

2. **Free + Pro active**:
   - ✅ Toggle Import/Export enable/disable in Advanced Settings
   - ✅ Export all tables → verify JSON structure and version metadata
   - ✅ Export single table from row hover → verify only 1 table in JSON
   - ✅ Export single table from Table editor → verify only 1 table in JSON
   - ✅ Bulk select 3 tables → "Export Selected" → verify 3 tables in JSON
   - ✅ Import with "Create New" → all tables created as new entries
   - ✅ Import with "Overwrite" → matching titles updated, new ones created
   - ✅ Import with "Skip" → matching titles skipped, new ones created
   - ✅ Import with "(Imported)" suffix → verify titles have suffix
   - ✅ Import settings with "Merge" → existing settings preserved, new merged
   - ✅ Import settings with "Replace" → all settings replaced
   - ✅ Import invalid JSON → verify error handling
   - ✅ Import from "newer version" → verify warning shown with proceed option

3. **Edge Cases**:
   - ✅ Rollback test: Corrupt import data mid-way → verify partial imports are rolled back
   - ✅ Large dataset: 50+ tables → export → verify no memory issues → import on fresh install
   - ✅ Empty export (0 tables, settings only) → verify clean handling
   - ✅ Export then delete tables → import again → verify clean re-creation
