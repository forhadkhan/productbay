# Manual Methods

While the [Guided Wizard](/features/creation-wizard) provides a guided onboarding experience, you can also initiate table creation through a more straightforward interface.

## Manual Entry Points

You can open the table creation interface from multiple locations: 

![Create New Table Options](/images/create-new-table-options.png) 

### 1. Plugin Navbar
Inside the ProductBay admin dashboard, you'll find a **Create New Table** button in the top navigation bar. This is the most common way to start a new table when you're already managing your existing ones.

### 2. WordPress Admin Menu
You can jump directly to the creation screen from any page in the WordPress admin by navigating to **ProductBay → Create New Table** in the left-hand sidebar menu.

### 3. WordPress Topbar
When the plugin is active, a specialized **ProductBay** menu is added to the WordPress admin topbar. Hover over it and select **Create New Table** for instant access. You can turn this feature on or off in the [Plugin Settings](/features/plugin-settings) page.

### 4. Dashboard Empty State
If you haven't created any tables yet, a prominent **Create New Table** call-to-action will appear in the center of the [Table Dashboard](/features/table-dashboard). 


## Configuring Your Product Table

Once you've clicked **Create New Table**, you'll be directed to the table configuration screen. This interface allows you to define exactly how your product table looks and behaves.

There are **three tabs** on the table configuration page: 

### 1. Table Tab 

The **Table Tab** contains the foundational settings for your table, including its name and source data.

![Create New Table - Table Tab](/images/create-new-table--table-tab.png) 

1. **Table Name**: Give your table a descriptive name. This is required for internal organization.
2. **Product Source**: Choose where the products for this table come from. By default, this is set to "All Products," but you can filter by category, select specific products, or products on sale.
3. **Table Columns**: Select and order the columns you want to display (e.g., Image, Title, Price, Add to Cart).
4. **Bulk Actions & Selection**: Enable checkboxes for users to select multiple products and perform bulk "Add to Cart" actions.
5. **Live Preview**: This dynamic preview updates in real-time as you adjust settings, allowing you to see your changes instantly.
6. **Status**: Control the visibility of your table. "Published" tables are ready for use, while "Private" tables are only visible to administrators.
7. **Save Table**: Click this button to commit your changes.


### 2. Display Tab 

The **Display Tab** allows you to customize the visual aesthetics of your table to match your store's branding.

![Create New Table - Display Tab](/images/create-new-table--display-tab.png) 

1. **Colors**: Personalize the table's color scheme.
 - **Add to Cart Button Color**: Change the background and text color of the primary action button.
 - **Table Header Color**: Set the background color for the table's header row.
 - **Table Rows Color**: Set the default background color for rows.
 - **Alternating Rows Color**: Apply a different color to every other row for better readability.
 - **Row Hover Color**: Define the color when a user hovers their cursor over a row.
2. **Layout & Spacing**: Adjust the structural feel of the table.
 - **Border Style**: Choose from solid, dashed, or no border.
 - **Border Color**: Set the color of the table and cell borders.
 - **Border Radius**: Round the corners of your table for a softer look.
 - **Cell Padding**: Control the space between the content and the cell borders.
3. **Typography**: Fine-tune the text appearance for the header.
 - **Header Font Weight**: Choose between Normal, Bold, or Extra Bold.
 - **Header Text Transform**: Set text to Uppercase, Lowercase, Capitalize, or leave as Normal.


### 3. Options Tab 

The **Options Tab** provides advanced controls for table functionality and cart behavior.

![Create New Table - Options Tab](/images/create-new-table--options-tab.png) 

1. **Table Controls**: Configure how users interact with the table list.
 - **Enable Search Bar**: Allow users to filter products within the table via a search input.
 - **Enable Pagination**: Break long lists into multiple pages for better performance and UX.
 - **Products Per Page**: Define how many products are shown before pagination kicks in.
2. **Cart / Functionality**: Enhance the shopping experience.
 - **AJAX Add to Cart**: Enable seamless adding to cart without refreshing the page.
 - **Show Quantity Selector**: Allow users to specify the number of items they want to add directly from the table.
 

::: info
The **Table Name**, **Live Preview**, **Status**, and **Save Table** controls are persistent and remain accessible regardless of which tab you are currently viewing. Once you are satisfied with your table configuration, click **Save Table** to create your table and add it to the [Table Dashboard](/features/table-dashboard).
:::

