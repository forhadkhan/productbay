# Plugin Settings

Plugin-wide configuration options that control administrative behavior, data persistence, and system-level maintenance.

Access these settings from **ProductBay → Settings → Plugin Settings** tab.

## Admin Bar Options

Control the visibility of the ProductBay quick-access link in the WordPress admin topbar. 

![Admin Bar Settings](/images/admin-bar-settings.png)

- **Show Admin Bar**: When enabled, a "ProductBay" menu appears in the topbar, providing quick links to "All Tables" and "Create New Table".

## Uninstall Options

Determine what happens to your data when the ProductBay plugin is deleted from your WordPress site.

- **Delete on Uninstall**: 
  - **Enabled**: All tables, configurations, and settings will be permanently removed from the database on deletion.
  - **Disabled**: Plugin data is preserved, allowing you to pick up where you left off if you reinstall later.

::: warning Data Permanence
We recommend keeping this **Disabled** unless you are certain you want to perform a completely clean removal of all ProductBay data.
:::

## Clear Data (Reset)

ProductBay includes a master reset tool to restore the plugin to its factory state.

### What gets cleared?
1. **Tables**: All created tables are permanently deleted.
2. **Metadata**: All configuration data associated with those tables is removed.
3. **Settings**: All global and default configurations are reset to factory defaults.
4. **Onboarding**: The "Welcome Wizard" state is reset, and it will appear again on the next visit.

::: danger Irreversible Action
Resetting data is **permanent** and cannot be undone. Always ensure you have a database backup before performing a full reset.
:::
