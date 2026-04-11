# Walkthrough - Import/Export Pro Feature

We have successfully implemented the **Import/Export** feature for ProductBay Pro. This allows users to pack their table configurations and global settings into a JSON file and migrate them between different WordPress installations.

## Key Features

- **Granular Export**: Select specific tables or include all tables along with global plugin settings.
- **Flexible Import**: Choose between three conflict resolution modes:
  - **Create New**: Keeps both versions, optionally adding "(Imported)" to the title.
  - **Overwrite Existing**: Updates existing tables with matching titles.
  - **Skip Duplicates**: Only imports new tables.
- **Cross-Plugin Architecture**: Uses a global bridge (`window.productbay`) to allow the Pro plugin to provide the modal UI while the Free plugin provides the entry points.
- **Pro Gated**: All UI entry points are naturally integrated into the Free plugin but protected by the Pro feature gate.

## Changes

### 1. Free Plugin Integration
- **Store**: Implemented `importExportStore` to manage modal visibility and selection state.
- **Bridge**: Updated `src/index.tsx` to expose core hooks and UI components to the Pro plugin.
- **UI**: Added "Export" actions to the Tables list and Table Editor.
- **Settings**: Added an "Advanced" tab in Settings for bulk operations.

### 2. Pro Plugin Logic
- **UI Slot**: Created `ImportExportSlot.tsx` to handle the global modal interactions.
- **Backend**: Created `ImportExportModule.php` providing authenticated REST API endpoints for data processing.
- **Registration**: Connected the new module to the Pro plugin's bootstrap sequence.

## Verification Results

### Automated Checks
- Verified TypeScript compilation for all new components.
- Confirmed REST API route registration.

### Manual Verification Steps
1. Navigate to **ProductBay > Settings > Advanced**.
2. Toggle "Enable Import/Export Features" (Requires Pro).
3. Click **Export All Tables** to generate a JSON download.
4. Navigate to **ProductBay > Tables** and use the individual "Export" action in the row menu.
5. Use the **Import Tables** button to upload a JSON file and test the different "Conflict Resolution" modes.

> [!NOTE]
> The current version supports JSON file format for v1. ZIP support was excluded per requirements to maintain simplicity for the initial release.

---
*Implementation completed by Antigravity*
