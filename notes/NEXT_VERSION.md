# Next Version — Postponed Features

> **Tag: next-version**
> Features removed from v1.0 to be re-implemented in a future release.
> Each section contains the original code and context to restore the feature.

---

## 1. Additional Column Types (ColumnEditor.tsx)

**File:** `src/components/Table/sections/ColumnEditor.tsx`

The following column types were removed from `COLUMN_TYPES`. Only `image`, `name`, `price`, `button`, `sku`, and `summary` are kept in v1.

### Removed Entries

```tsx
// Additional icon imports needed:
// import { PackageIcon, CalendarIcon, TagIcon, DatabaseIcon, LayoutGridIcon } from 'lucide-react';

// Add these back to the COLUMN_TYPES array:
{ type: 'stock', label: __('Stock', 'productbay'), icon: PackageIcon },
{ type: 'date', label: __('Date', 'productbay'), icon: CalendarIcon },
{ type: 'tax', label: __('Taxonomy', 'productbay'), icon: TagIcon },
{ type: 'cf', label: __('Custom Field', 'productbay'), icon: DatabaseIcon },
{ type: 'combined', label: __('Combined', 'productbay'), icon: LayoutGridIcon },
```

### Notes
- The `ColumnType` type in `@/types` still includes these values — no type changes needed when restoring.
- The `ColumnItem` component already handles rendering for all column types.

---

## 2. Responsive Display Section (DisplayPanel.tsx)

**File:** `src/components/Table/panels/DisplayPanel.tsx`

Section 5: Responsive Display was removed. It allowed users to choose between Standard Table, Stack Cards, and Accordion responsive modes.

### Removed Props

```tsx
// Add back to DisplayPanelProps interface:
setResponsiveStyle: (responsive: Partial<TableStyle['responsive']>) => void;

// Add back to component destructured params:
setResponsiveStyle,
```

### Removed JSX (was after Section 3: Typography)

```tsx
{/* ================================================================
 * Section 5: Responsive Display
 * ================================================================ */}
<section className="space-y-6">
    <SectionHeading
        title={__('Responsive Display', 'productbay')}
        description={__('Mobile and tablet display settings', 'productbay')}
    />

    <CardRadioGroup
        name="responsive-mode"
        value={style.responsive.mode}
        onChange={(val) => setResponsiveStyle({ mode: val as any })}
        options={[
            {
                value: 'standard',
                label: __('Standard Table', 'productbay'),
                helpText: __('Horizontal scrolling on small screens', 'productbay')
            },
            {
                value: 'stack',
                label: __('Stack Cards', 'productbay'),
                helpText: __('Stack columns vertically like cards', 'productbay')
            },
            {
                value: 'accordion',
                label: __('Accordion', 'productbay'),
                helpText: __('Collapse extra columns into expanded row', 'productbay')
            }
        ]}
        className="grid grid-cols-1 xl:grid-cols-3 gap-3"
    />

    {/* Info note about per-column visibility */}
    <div className="bg-blue-50 border border-blue-200 rounded-md px-4 py-3 mt-4">
        <p className="text-sm text-blue-700 m-0">
            {__('Tip: You can hide specific columns on mobile using the visibility setting in each column\'s advanced options.', 'productbay')}
        </p>
    </div>
</section>
```

### Removed Import

```tsx
// Add back:
import { CardRadioGroup } from '@/components/ui/CardRadioGroup';
```

---

## 3. OptionsPanel Removed Features (OptionsPanel.tsx)

**File:** `src/components/Table/panels/OptionsPanel.tsx`

### 3a. Enable Price Range Toggle (from Table Controls section)

```tsx
{/* Enable Price Range */}
<SettingsOption
    title={__('Enable Price Range', 'productbay')}
    description={__('Allow users to filter by price range', 'productbay')}
>
    <Toggle
        checked={settings.features.priceRange}
        onChange={(e) => setFeatures({ priceRange: e.target.checked })}
    />
</SettingsOption>
```

### 3b. General Settings Section (entire section)

```tsx
{/* General Settings - Advanced table features */}
<SettingsSection
    title={__('General Settings', 'productbay')}
    description={__('Configure core table features', 'productbay')}
>
    <SettingsOption
        title={__('Enable Sorting', 'productbay')}
        description={__('Allow users to click column headers to sort', 'productbay')}
    >
        <Toggle
            checked={settings.features.sorting}
            onChange={(e) => setFeatures({ sorting: e.target.checked })}
        />
    </SettingsOption>
    <SettingsOption
        title={__('Enable Export', 'productbay')}
        description={__('Show buttons to export table to CSV/PDF', 'productbay')}
    >
        <Toggle
            checked={settings.features.export}
            onChange={(e) => setFeatures({ export: e.target.checked })}
        />
    </SettingsOption>


    <SettingsOption
        title={__('Pagination Position', 'productbay')}
        description={__('Where to display pagination controls', 'productbay')}
    >
        <div className="w-48">
            <Select
                size="sm"
                value={settings.pagination.position}
                onChange={(val) => setPagination({ position: val as any })}
                options={[
                    { label: __('Bottom', 'productbay'), value: 'bottom' },
                    { label: __('Top', 'productbay'), value: 'top' },
                    { label: __('Both', 'productbay'), value: 'both' },
                ]}
            />
        </div>
    </SettingsOption>
</SettingsSection>
```

### 3c. AJAX Add to Cart Toggle (from Cart Settings)

```tsx
<SettingsOption
    title={__('AJAX Add to Cart', 'productbay')}
    description={__('Add to cart without reloading the page', 'productbay')}
>
    <Toggle
        checked={settings.cart.ajaxAdd}
        onChange={(e) => setCart({ ajaxAdd: e.target.checked })}
    />
</SettingsOption>
```

**Note:** AJAX add to cart is now enabled by default in v1.

### 3d. Cart Method Select (from Cart Settings)

```tsx
<SettingsOption
    title={__('Cart Method', 'productbay')}
    description={__('Interaction style for adding to cart', 'productbay')}
>
    <div className="w-48">
        <Select
            size="sm"
            value={settings.cart.method}
            onChange={(val) => setCart({ method: val as any })}
            options={[
                { label: __('Button (Default)', 'productbay'), value: 'button' },
                { label: __('Checkbox (Multi-select)', 'productbay'), value: 'checkbox' },
                { label: __('Text Link', 'productbay'), value: 'text' },
            ]}
        />
    </div>
</SettingsOption>
```

### 3e. Filter Configuration Section (entire section)

```tsx
{/* Filter Settings */}
<SettingsSection
    title={__('Filter Configuration', 'productbay')}
    description={__('Advanced settings for filters', 'productbay')}
>
    {/* Enable Filter */}
    <SettingsOption
        title={__('Enable Filter', 'productbay')}
        description={__('Show filter options above the table', 'productbay')}
    >
        <Toggle
            checked={settings.filters.enabled}
            onChange={(e) => setFilters({ enabled: e.target.checked })}
        />
    </SettingsOption>
</SettingsSection>
```

### Removed Props

```tsx
// Add back to OptionsPanelProps:
setFilters: (filters: Partial<TableSettings['filters']>) => void;

// Add back to destructured params:
setFilters,
```

### Removed Import

```tsx
// Add back when restoring General Settings (uses Select for Pagination Position):
import { Select } from '@/components/ui/Select';
```

---

## 4. Additional Global Defaults — Sort/Stock (SourcePanel.tsx)

**File:** `src/components/Table/panels/SourcePanel.tsx`

### Removed Props

```tsx
// Add back to SourcePanelProps:
setSourceSort?: (sort: Partial<DataSource['sort']>) => void;
setSourceQueryArgs?: (args: Partial<DataSource['queryArgs']>) => void;

// Add back to destructured params:
setSourceSort,
setSourceQueryArgs,
```

### Removed JSX (was inside Section 1 after CardRadioGroup)

```tsx
{/* Additional Global Defaults (Sort/Stock) - Only show if handlers provided */}
{setSourceSort && setSourceQueryArgs && (
    <div className="mt-6 space-y-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-1 gap-6">
            {/* Default Sort */}
            <SettingsOption
                title={__('Default Sort Order', 'productbay')}
                description={__('How products are ordered initially', 'productbay')}
                className="border-0 p-2 rounded-md"
            >
                <div className="flex gap-2">
                    <div className="w-32">
                        <Select
                            size="sm"
                            value={source.sort.orderBy}
                            onChange={(val) => setSourceSort({ orderBy: val })}
                            options={[
                                { label: __('Date', 'productbay'), value: 'date' },
                                { label: __('Title', 'productbay'), value: 'title' },
                                { label: __('Price', 'productbay'), value: 'price' },
                                { label: __('Popularity', 'productbay'), value: 'popularity' },
                                { label: __('Rating', 'productbay'), value: 'rating' },
                            ]}
                        />
                    </div>
                    <div className="w-24">
                        <Select
                            size="sm"
                            value={source.sort.order}
                            onChange={(val) => setSourceSort({ order: val as 'ASC' | 'DESC' })}
                            options={[
                                { label: __('Descending', 'productbay'), value: 'DESC' },
                                { label: __('Ascending', 'productbay'), value: 'ASC' },
                            ]}
                        />
                    </div>
                </div>
            </SettingsOption>

            {/* Stock Status */}
            <SettingsOption
                title={__('Stock Status', 'productbay')}
                description={__('Filter by stock availability', 'productbay')}
                className="border-0 p-2 rounded-md"
            >
                <div className="w-36">
                    <Select
                        size="sm"
                        value={source.queryArgs?.stockStatus || 'any'}
                        onChange={(val) => setSourceQueryArgs({ stockStatus: val as any })}
                        options={[
                            { label: __('Any Status', 'productbay'), value: 'any' },
                            { label: __('In Stock', 'productbay'), value: 'instock' },
                            { label: __('Out of Stock', 'productbay'), value: 'outofstock' },
                        ]}
                    />
                </div>
            </SettingsOption>
        </div>
    </div>
)}
```

### Removed Imports

```tsx
// Add back:
import { Select } from '@/components/ui/Select';
import { SettingsOption } from '@/components/Table/SettingsOption';
```

---

## 5. Advanced Settings Tab (Settings.tsx)

**File:** `src/pages/Settings.tsx`

### Removed Tab Configuration

```tsx
// Add 'advanced' back to SettingsTabValue type:
type SettingsTabValue = 'default' | 'advanced' | 'plugin';

// Add back to VALID_SETTINGS_TABS:
const VALID_SETTINGS_TABS = ['default', 'advanced', 'plugin'] as const;

// Add back to SETTINGS_TABS array:
{
    value: 'advanced',
    label: __('Advanced', 'productbay'),
},
```

### Removed Tab Content

```tsx
{activeTab === 'advanced' && (
    <div className="space-y-6">
        <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mt-0 mb-4">
                {__('Advanced Settings', 'productbay')}
            </h3>
            <p className="text-gray-500">{__('Settings will be available soon', 'productbay')}</p>
        </div>
    </div>
)}
```

### Also Removed from Settings.tsx
- `setSourceSort` and `setSourceQueryArgs` handlers and their props on `<SourcePanel>`
- `setResponsiveStyle` handler and its prop on `<DisplayPanel>`
- `setFilters` handler and its prop on `<OptionsPanel>`

---

## 6. Import / Export Buttons (Tables.tsx)

**File:** `src/pages/Tables.tsx`

### Removed JSX (was in header area after "All Tables" heading)

```tsx
{/* Import-Export */}
<div className="flex gap-2">
    <Button variant="secondary" size="sm" className="flex-1 flex items-center justify-center gap-2 cursor-pointer px-3 py-2 border border-gray-200 rounded text-sm hover:bg-gray-50 text-gray-600 transition-colors">
        <UploadIcon size={14} /> {__('Import', 'productbay')}
    </Button>
    <Button
        variant="secondary"
        size="sm"
        className="flex-1 flex items-center justify-center gap-2 cursor-pointer px-3 py-2 border border-gray-200 rounded text-sm hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        disabled={isLoading || tables.length === 0}
    >
        <DownloadIcon size={14} /> {__('Export', 'productbay')}
    </Button>
</div>
```

### Removed Imports

```tsx
// Add back to lucide-react import:
DownloadIcon, UploadIcon,
```

---

## Restoration Checklist

When bringing features back:

- [ ] Column types: add entries back to `COLUMN_TYPES` + imports
- [ ] Responsive Display: restore section in DisplayPanel + `CardRadioGroup` import + prop
- [ ] Options: restore removed settings/sections + `Select` import + `setFilters` prop
- [ ] Source sort/stock: restore block + `Select`/`SettingsOption` imports + props
- [ ] Advanced tab: restore tab config + content block
- [ ] Import/Export: restore buttons + icon imports
- [ ] Settings.tsx: reconnect all removed handler props (`setSourceSort`, `setSourceQueryArgs`, `setResponsiveStyle`, `setFilters`)
- [ ] Implement actual backend logic for each feature
