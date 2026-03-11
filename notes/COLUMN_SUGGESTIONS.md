# Product Table Column Suggestions & Expansion Ideas

Based on user feedback, industry standards, and B2B/B2C use cases, here is an analysis of additional column types we can add to ProductBay to make it a premium, conversion-optimized plugin.

Currently, we support: `image`, `name`, `price`, `sku`, `stock`, `button`, `date`, `summary`, `tax`, `cf`, and `combined`.

Here are highly valuable columns to consider adding in future versions, categorized by their primary use case:

## 1. Social Proof & Conversions
*   **`rating` (Rating Stars)**: A visual 5-star rating presentation of the product's average rating. Essential for consumer-facing bulk order tables to build trust and drive conversions.
*   **`review_count` (Review Count)**: A simple text or badge showing the total number of reviews (e.g., "(24 reviews)"). Often paired alongside the rating.
*   **`sales` (Sales Count)**: Expose WooCommerce's internal `total_sales` metric to show popularity (e.g., "1k+ Sold"). Great for wholesale users looking for fast-moving items or dropshippers.

## 2. B2B & Wholesale Specifics
*   **`quantity` (Standalone Quantity Box)**: Currently, the quantity selector is attached to the add to cart `button`. In B2B or wholesale order forms, users often want a dedicated Quantity Column so they can tab down the entire column, type in numbers quickly, and then hit a global "Add Selected to Cart" button.
*   **`dimensions` (Dimensions)**: Formatted string of Length × Width × Height. Needed for logistics, freight purchasing, and bulky items.
*   **`weight` (Weight)**: Product weight formatted with the store's weight unit (e.g., "1.2 kg").

## 3. Media & Interactions
*   **`media_preview` (Audio / Video Preview)**: A play button that opens an inline audio track or video modal. This is highly used in digital goods, music, or course material shops.
*   **`quick_view` (Quick View Button)**: A dedicated column type (or button type) to trigger a modal with the product's full description and gallery without leaving the page.
*   **`wishlist` (Wishlist Toggle)**: A heart icon column integrating with popular wishlist plugins (YITH, TI WooCommerce Wishlist) for users to save items for later.

## 4. Variations & Dynamic Elements
*   **`variations` (Variation Selectors)**: If the table displays variable products, a dedicated column to render the variation dropdowns (Color, Size) inline within the row so they can be selected and then added to cart.
*   **`discount` (Discount / Savings Badge)**: Instead of just showing the crossed-out price, a column/badge that calculates and shows the exact discount (e.g., **"Save 25%"** or **"-$10"**).

## 5. Vendor & Multi-store Integration
*   **`vendor` (Store / Vendor Name)**: If the site uses multivendor plugins like Dokan, WCFM, or WC Vendors, a column displaying who is selling the item and a link to their store silhouette or profile.

---

### Implementation Priority Recommendation
If we decide to expand the column suite, the following path offers the best effort-to-value ratio:
1.  **Phase 1 (Quick Wins)**: `rating`, `weight`, `dimensions` (These are native to WooCommerce and very easy to extract and display).
2.  **Phase 2 (B2B Power Tools)**: `quantity` (Requires slight UI and cart state adjustments, but massive value to wholesale).
3.  **Phase 3 (Integrations)**: `wishlist` and `quick_view` (Requires integrating with 3rd party plugin APIs or building our own modal handler).
