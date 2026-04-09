# Known Issues (v1.0.0)

This page tracks confirmed bugs or limitations that were present in the initial ProductBay **v1.0.0** release.

## Cross-Tab Interference

- **Issue**: When embedding multiple tables on the same page via shortcodes, utilizing AJAX filters (like search or categories) on one table could inadvertently update or interfere with the UI/values of the secondary table.
- **Status**: <Badge type="success" text="Fixed" /> Resolved in patch version **v1.1.1** via instance-scoped logic mapping.

## Block Editor Styling Conflict
- **Issue**: The free version core UI styles occasionally overwrite the block editor's native sidebar controls, causing display quirks for other blocks.
- **Status**: <Badge type="success" text="Fixed" /> Resolved in major version **v1.1.0** via enhanced iframe isolation.

---

## Report an Issue
Using an outdated version? We highly recommend updating your plugin from `v1.0.0` to the latest `v1.1.1` stable release before [opening a new bug report on GitHub](https://github.com/wpanchorbay/productbay/issues).
