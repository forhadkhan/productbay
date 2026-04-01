# Changelog

All notable changes to ProductBay are documented on this page.

## 1.0.0

*Initial Release*

### Added

- **Extensibility API**: 30+ action hooks and filters across all plugin layers (Core, Data, API, Frontend, Admin) enabling third-party and add-on integration.
- New [Hooks & Filters](/developer/hooks) developer documentation page.
- Centralized table management dashboard with search, status filtering, and bulk delete
- 5-step guided creation wizard with live preview
- Product source selection: by category, sale status, specific IDs, or all products
- Query modifiers: exclude IDs, filter by stock status, set price range
- Drag-and-drop column editor with responsive show/hide rules per device
- Column types: Image, Name, Price, SKU, Stock Status, Short Description
- Live preview of table changes while building
- Support for Simple, Variable, Grouped, and External WooCommerce product types
- Inline variation attribute selection within the table
- AJAX add-to-cart (single and bulk)
- Instance-scoped CSS to prevent style conflicts between tables
- Deep design customization: colors, typography, borders, border radius, cell padding
- 30-minute category query caching with stale-while-revalidate
- Shortcode system: `[productbay id="XYZ"]`
- 100% translation-ready codebase
- Global settings: add-to-cart text, products per page, design defaults, data deletion control
- Clean uninstallation with configurable data retention
