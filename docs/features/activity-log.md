# Activity Log <Badge type="tip" text="Since v1.3.0" />

ProductBay includes a powerful, built-in recording system that tracks important actions like table creation, setting updates, and system events. This helps you monitor changes, audit user actions, and troubleshoot issues without checking server-level logs.

## Overview

The Activity Log is a diagnostic tool that provides transparency into how your product tables are being managed. It records:
- **Major Events**: Table creation, updates, and deletions.
*   **Administrative Actions**: Global settings changes, licensing updates, and log clearing.
- **System Events**: Background tasks like log pruning and automatic data cleanup.

## Managing Logs

You can access the log viewer by navigating to **ProductBay > Settings > Activity Log**.

### Enabling & Disabling
Logging is enabled by default. To change this:
1.  Click the **Gear Icon (⚙️)** in the top-right of the Log Viewer.
2.  Toggle the **Enable Logging** switch.
3.  Click **Save & Close**.

### Live Mode
For real-time monitoring, you can enable **Live Mode** in the settings modal. When active, the log list will automatically refresh every 10 seconds to show new entries as they happen.

### Exporting Logs
If you need to share your logs with support or analyze them externally:
1.  Click the **Export** button in the header.
2.  Choose a range: **Day**, **Week**, or **Month**.
*   The system will automatically combine all relevant daily files into a single download.

### Clearing History
To permanently remove all recorded logs:
1.  Click the **Trash Icon (🗑️)** in the header.
2.  Confirm the action in the popup.
> [!WARNING]
> This action is permanent and cannot be undone.

---

## Log Filtering

The Log Viewer provides several ways to find specific information quickly:

- **Search**: Use the search bar to find entries by title or specific details.
- **Date Picker**: Use the calendar dropdown to view logs from a specific day.
- **Level Filter**: Filter by severity (Info, Success, Warning, or Error).
- **User Filter**: See actions performed by specific WordPress users, the system, or WP-CLI.

## Configuration & Retention

### Log Retention
To prevent logs from taking up too much disk space, ProductBay automatically cleans up old entries.
- **Default**: 30 days.
- **Customize**: Open the settings modal (Gear Icon) and adjust the **Log Retention** value.

### Storage & Security
- **File-Based**: Logs are stored as optimized text files in `wp-content/productbay-logs/`, keeping your database lean.
- **Privacy**: The log directory is protected by `.htaccess` rules to prevent unauthorized direct access via the web.
- **Selective Capture**: The system captures only relevant data for the specific actions being logged, minimizing the storage of sensitive information.

---

## Troubleshooting

If you see an **Error** level entry in your logs, click the entry to see the full details. ProductBay often captures technical environment data (like PHP version and system state) during errors to help developers identify the root cause faster.
