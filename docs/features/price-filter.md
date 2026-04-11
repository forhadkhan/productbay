# Price Range Filter <ProBadge />

The Price Range Filter allows your customers to zero in on products that fit their budget. Built to be lightning-fast, it uses AJAX to update the table instantly as the user drags the slider or types a price.

## Enabling the Filter

To enable the price filter:
1. Navigate to Step 4 (**Options**) in the creation wizard.
2. Toggle **Price Filter** to the `On` position.
3. The Price Filter settings panel will appear.

## Display Modes

You can choose how the filter is presented to the user. There are 3 display modes:

- **Both (Default):** Combines the visual slider with the precision of number inputs. 
- **Slider:** Shows a sleek, dual-handle range slider. Customers drag the handles to set their min and max budget. Hovering over a handle displays a tooltip with the current value.
- **Input:** Shows two simple number input fields (Min and Max).

## Custom Bounds (Min / Max)

By default, ProductBay Pro automatically scans the products in your table and dynamically sets the minimum and maximum limits of the slider based on the cheapest and most expensive items currently available.

If you prefer, you can override this behavior by entering fixed **Min Price** and **Max Price** values in the configuration panel.

## Step Size

The step size dictates how large the increments are when sliding the handle.
- The default step size is `1`.
- If you sell very expensive items (e.g., cars, properties), you might want to set the step size to `100` or `1000`.
- If you want fractional precision, you can set it to `0.50` or `0.01`.

## How it Works

When the filter is applied, ProductBay Pro intercepts the query and applies a standard WordPress meta query against the WooCommerce `_price` meta key. This happens instantly via AJAX without page reloads, and it works flawlessly with all product sources (categories, specific IDs, sale products, etc.).
