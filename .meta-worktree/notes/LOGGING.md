# Activity Logging Architecture

ProductBay implements a high-performance, file-based activity logging system designed for diagnostics, audit trails, and system transparency. This document details the technical implementation, data structures, and lifecycle management.

## Core Principles

1.  **Privacy First**: Logs are stored in a non-accessible directory (`wp-content/productbay-logs/`) protected by `.htaccess` rules.
2.  **Zero Database Bloat**: Activity data is stored in text files rather than the `wp_posts` or `wp_options` tables to ensure site performance.
3.  **Audit Integrity**: Captures rich request context (IP, URL, Method, User Agent) for every entry.
4.  **Self-Cleaning**: Integrated lifecycle management via WP-Cron prevents log accumulation from exhausting server disk space.

---

## Technical Implementation

### 1. Storage Engine (`ActivityLog.php`)

The logging engine uses a **JSON-Lines (JSONL)** format, where each event is a standalone JSON object on a new line. This allows for extremely efficient parsing and appending.

#### File Naming & Rotation
- **Daily Files**: Logs are grouped by day: `YYYY-MM-DD.log`.
- **Size-Based Rotation**: To prevent unmanageably large files, rotation occurs at **10MB** (`MAX_FILE_SIZE`).
- **Indexed Fallback**: If a file exceeds the limit, it rotates to `YYYY-MM-DD.1.log`, `YYYY-MM-DD.2.log`, etc.

#### Security Layers
Upon directory creation, the system automatically writes:
- `.htaccess`: `deny from all` (Apache/LiteSpeed protection).
- `index.php`: `// Silence is golden.` (Directory listing protection).

### 2. Data Schema

Each log entry is serialized into a consistent JSON structure.

```json
{
  "level": "info|success|warning|error",
  "time": "2026-04-11T18:00:00+00:00",
  "title": "Short summary (max 255 chars)",
  "details": "Extended multiline information",
  "user": "username|system|cron|wp-cli",
  "context": {
    "ip": "127.0.0.1",
    "url": "/wp-admin/admin-ajax.php",
    "method": "POST",
    "ua": "Mozilla/5.0..."
  },
  "backtrace": [
    { "file": "path/to/file.php", "line": 42, "function": "foo" }
  ],
  "env": {
    "php": "8.1.0",
    "wp": "6.4.2",
    "productbay": "1.2.1"
  }
}
```

> [!NOTE]
> `backtrace` and `env` fields are **only** generated for `error` level logs to aid in deep-dive debugging without bloating `info` logs.

### 3. API Layer (`LogController.php`)

The system exposes a RESTful interface under the `/productbay/v1/logs` namespace.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | `GET` | Paginated retrieval with filters (`date`, `level`, `search`, `user`). |
| `/dates` | `GET` | List of dates with existing log files (used for the date picker). |
| `/export` | `GET` | Aggregated CSV/Text export for `day`, `week`, or `month`. |
| `/clear` | `POST` | Permanent deletion of all log files (recorded as an audit event). |

---

## Lifecycle Management

### Auto-Pruning (WP-Cron)
The system schedules a daily task (`productbay_prune_logs`) that runs the `ActivityLog::prune()` method.

1.  Retrieves `log_retention` setting (Default: 30 days).
2.  Scans the log directory for all `.log` files.
3.  Calculates the cutoff timestamp.
4.  Deletes files where the filename date is older than the cutoff.
5.  Logs a "Logs pruned" event with the count of removed files.

### Master Control
- **Logging Toggle**: Every `log()` call checks the `logging_enabled` setting first. This allows the system to remain dormant with zero performance overhead when disabled.
- **Manual Clearing**: Users can reset the log history via the UI, which triggers a complete directory scrub (excluding security files).

---

## Developer API

### Static Convenience Methods
The system provides PSR-3 like methods for easy integration across the plugin:

```php
use WpabProductBay\Data\ActivityLog;

ActivityLog::info('Title', 'Optional details');
ActivityLog::success('Payment received', 'Order #123 processed.');
ActivityLog::warning('Stock low', 'Product SKU: ABC is below threshold.');
ActivityLog::error('API Failure', 'Connection timed out to provider.');
```

### Hooks & Filters

| Hook | Type | Description |
|------|------|-------------|
| `productbay_log_created` | `action` | Fires after a log is written. Useful for generic Slack/Email notifications. |
| `productbay_log_retention_days` | `filter` | Allows programmatic control over retention period (e.g. log-level specific retention). |

---

## Frontend Architecture (`LogViewer.tsx`)

The Log Viewer is built for performance and usability in high-traffic environments.

- **Virtualization**: Uses efficient rendering to handle thousands of entries in the DOM.
- **Live Mode**: Implements adaptive polling (10s) with `localStorage` persistence. It automatically pauses when the browser tab is inactive to save resources.
- **Visual Cues**:
    - **Header Badge**: Shows "LOGGING DISABLED" in amber if the system is inactive.
    - **Status Colors**: High-contrast icons and borders for quick scanning of Error/Warning levels.
- **Deep Linking**: Date and filter states are synced with the URL query parameters, allowing admins to share specific log views.
