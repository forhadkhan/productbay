# Implementation Plan: Product Rating Column

Add a new column type "Rating" that displays the product's average star rating using native WooCommerce functionality.

## Proposed Changes

### [Core] [types](file:///var/www/html/wp-content/plugins/productbay/src/types/index.ts)

#### [MODIFY] [index.ts](file:///var/www/html/wp-content/plugins/productbay/src/types/index.ts)
- Add `'rating'` to the `ColumnType` union.

### [Frontend] [Admin UI]

#### [MODIFY] [ColumnEditor.tsx](file:///var/www/html/wp-content/plugins/productbay/src/components/Table/sections/ColumnEditor.tsx)
- Add `rating` to the `COLUMN_TYPES` registry with the `StarIcon`.

#### [MODIFY] [ColumnItem.tsx](file:///var/www/html/wp-content/plugins/productbay/src/components/Table/sections/ColumnItem.tsx)
- Add `StarIcon` to `COLUMN_ICONS`.
- Add `rating` to `COMBINABLE_COLUMN_TYPES` (this will allow ratings to be part of a Combined column too).

### [Backend] [PHP Renderer]

#### [MODIFY] [TableRenderer.php](file:///var/www/html/wp-content/plugins/productbay/app/Frontend/TableRenderer.php)
- Implement `case 'rating':` in the `render_cell` method.
- Use `$product->get_average_rating()` and `wc_get_rating_html()` to display stars.
- Include a fallback for products with no ratings (e.g., empty or "No ratings").

## Verification Plan

### Automated Tests
- Run `npm run build` to ensure the new UI registry and types compile correctly.

### Manual Verification
- Add the "Rating" column to a test table.
- Verify that products with ratings show stars.
- Verify that the "Rating" column can be added inside a "Combined" column.
