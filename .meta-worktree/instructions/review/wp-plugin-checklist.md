# WordPress Plugin Pre-Submission Checklist

> **Built from all 5 official sources:**
> - wordpress.org/plugins/developers/
> - developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/
> - developer.wordpress.org/plugins/wordpress-org/plugin-developer-faq/
> - wordpress.org/plugins/developers/add/
> - developer.wordpress.org/plugins/wordpress-org/common-issues/

**Legend:** [ ] Unchecked · `✓` Passed · `✗` Failed · `🔴 CRITICAL` top rejection reasons · `🆕 NEW` added from FAQ/Developer Info sources

---

## 0. Before You Start — Eligibility & Account
`Source: wordpress.org/plugins/developers/ | plugin-developer-faq/`

> The WordPress Plugin Directory is a **hosting** site, not a listing site. You must use the SVN repository given to you. Plugins must be production-ready — no placeholders, no "coming soon" shells.

### 0.1 Account Requirements
- [ ] 🔴🆕 You have an active WordPress.org account (wordpress.org/register)
- [ ] 🔴🆕 The email on your WordPress.org account is actively monitored — **no auto-replies or ticket systems**
  - Auto-reply emails prevent the review team from communicating with you — explicit disqualifier
- [ ] 🆕 Your WordPress.org contact information is current and accurate
- [ ] 🆕 You are submitting under the correct account (company account if submitting an official plugin)
  - Official org plugins submitted with a personal gmail address will be flagged for trademark infringement

### 0.2 Plugin Type Eligibility 🔴
- [ ] 🔴🆕 Plugin is **NOT** a "do nothing" or placeholder plugin
- [ ] 🔴🆕 Plugin is **NOT** a framework or library plugin (must be packaged inside each plugin that uses it)
  - Boilerplates where other plugins customize your files directly are rejected
- [ ] 🔴🆕 Plugin is **NOT** a 100% copy of someone else's plugin presented as original work
- [ ] 🔴🆕 Plugin does **NOT** duplicate functionality already built into WordPress Core
- [ ] 🔴🆕 Plugin is **NOT** illegal (black-hat SEO, content spinners, hate-plugins, etc.)
- [ ] 🔴🆕 Plugin is **NOT** sandbox/test-only (e.g. only sandbox API access)
- [ ] 🔴🆕 Plugin is complete and functional right now — no "will add features later" submissions

### 0.3 Submission Rules
- [ ] 🔴🆕 Only **ONE** plugin currently in the review queue (not submitted multiple simultaneously)
  - Only developers with 1M+ active installs may submit up to 10 at once
- [ ] 🔴🆕 You have **NOT** submitted duplicate plugins using multiple accounts
  - All secondary accounts will be suspended if detected
- [ ] 🆕 You understand you **cannot** request priority review — submit early if you have a deadline
- [ ] 🔴🆕 Zip file is **under 10MB**
  - If over 10MB: remove test folders, full node_modules, documentation, dev content
- [ ] 🔴🆕 Zip is in standard WordPress plugin format (installable via Upload Plugin in WP admin)
- [ ] 🔴🆕 Plugin is production-ready: complete, no errors, no development logs, all files compiled

---

## 1. Plugin Header (Main PHP File)
`Source: developer.wordpress.org/plugins/plugin-basics/header-requirements/ | plugin-developer-faq/`

### 1.1 Required Header Fields
- [ ] 🔴 `Plugin Name` is present, unique, and descriptive
- [ ] 🔴 `Plugin URI` points to a page **unique to this plugin** (NOT shared with a pro version)
  - Using the same Plugin URI for free and pro versions "ends badly" per official docs
- [ ] `Description` is clear and under 150 characters (no markup)
- [ ] 🔴 `Version` uses semantic versioning — numbers and periods only (e.g. `1.0.0`)
- [ ] `Author` is your name or company name
- [ ] `Author URI` is your website (not the plugin page)
- [ ] 🔴 `Text Domain` matches your plugin slug **exactly**
  - Slug comes from Plugin Name: `"My Cool Plugin"` → slug `my-cool-plugin` → Text Domain `my-cool-plugin`
- [ ] `Domain Path` is set (usually `/languages`)
- [ ] 🔴 `Requires at least` is numbers only (e.g. `6.0` — NOT `"WP 6.0"`)
  - Since WP 5.8 this is parsed from the main PHP file, not the readme
- [ ] `Requires PHP` is numbers only (e.g. `7.4` — NOT `"PHP 7.4"`)
- [ ] 🔴 `License` is declared (GPLv2 or later strongly recommended)
- [ ] `License URI` is a link to the license text

### 1.2 Naming Restrictions (FAQ enforcement rules) 🔴
- [ ] 🔴🆕 Plugin name does **NOT begin with** a trademarked term you do not own
  - Cannot start with "WooCommerce", "Jetpack", "WordPress", "Yoast", "ACF", etc. unless you ARE that company
  - 🆕 You can **no longer** start a slug with `woo` — must use `wc` instead (WooCommerce enforcement)
- [ ] 🔴🆕 Plugin name does **NOT** use a term fully prohibited by its trademark owner
- [ ] 🔴🆕 Plugin name contains no vulgarities or offensive language
- [ ] 🔴🆕 Plugin slug does **NOT** contain `"WordPress"` or `"Plugin"` as a word
  - Allowed in display names (though redundant) but NOT in slugs
- [ ] 🔴🆕 Plugin slug contains **no version numbers**
- [ ] 🔴🆕 Plugin slug uses **only English letters and Arabic numbers**
- [ ] 🔴🆕 Plugin name does **NOT** falsely imply it is an official product of a service
  - ❌ `"WooCommerce Product Search"` (implies official)
  - ✅ `"Product Search for WooCommerce"` (correct format)

### 1.3 Slug — Understand It Is Permanent ⚠️

> **WARNING:** The slug is derived from your Plugin Name header. It determines your WP.org URL, your WP folder name, your SVN repo address, and your i18n text domain. You may change it **ONCE** before approval. After approval: **impossible**. Choose carefully.

- [ ] 🔴🆕 The chosen slug is the final, intended name — not a placeholder
- [ ] 🔴🆕 Slug is memorable, unique, and does not infringe on any trademark
- [ ] 🔴🆕 No existing plugin on WordPress.org has the same slug
- [ ] 🆕 Slug is not already in use by a plugin distributed outside WordPress.org
  - WP update API compares folder names globally — a slug collision could silently "update" someone else's plugin

### 1.4 Header Consistency
- [ ] 🔴 `Version` in main PHP file **exactly** matches `Stable tag` in readme.txt
- [ ] Plugin Name in PHP file matches Plugin Name in readme.txt
- [ ] 🔴 License in PHP header matches license in readme.txt
- [ ] 🔴 Main plugin file is named identically to the plugin folder/slug (`slug.php`)
  - If slug is `my-cool-plugin`, the main file MUST be `my-cool-plugin.php`

### 1.5 Correct Header Example

```php
/**
 * Plugin Name:       My Cool Plugin
 * Plugin URI:        https://example.com/my-cool-plugin
 * Description:       A concise description of what this plugin does. Under 150 chars.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            Your Name
 * Author URI:        https://yoursite.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       my-cool-plugin
 * Domain Path:       /languages
 */
```

---

## 2. readme.txt File
`Source: developer.wordpress.org/plugins/wordpress-org/how-your-readme-txt-works/ | plugin-developer-faq/`

> Validate at: **wordpress.org/plugins/developers/readme-validator/** — A failing readme = rejected plugin.

### 2.1 Readme Header Block
- [ ] 🔴 File is named exactly `readme.txt` (not `README.md` — `.md` is NOT the primary file)
- [ ] 🔴 `=== Plugin Name ===` is the very first line
- [ ] `Contributors:` lists WordPress.org usernames (case-sensitive)
  - Only WP.org usernames — anything else renders without avatar or profile link
- [ ] `Donate link:` is omitted OR points to a real donation destination (optional)
- [ ] 🔴🆕 `Tags:` uses 1–5 terms that display; maximum 12 total (only first 5 display on WP.org)
  - First 12 tags used for search; first 5 displayed publicly; excess tags ignored
  - Do NOT use competitor plugin names as tags
  - Tags unique to only your plugin won't show (they help no one find similar plugins)
- [ ] 🔴 `Requires at least:` plain number only (e.g. `6.0` — not `"WP 6.0"`)
- [ ] 🔴🆕 `Tested up to:` reflects the highest WP version you **actually tested** against
  - NEVER exceed the current stable release or RC
  - Do not use non-released versions — triggers a "not tested" warning on your plugin page
  - Only need to state `major.minor` — WP ignores patch releases automatically
- [ ] 🔴 `Stable tag:` matches `Version` in your main PHP file **exactly**
  - `"Stable tag: trunk"` is NOT supported or recommended for new plugins — use a version number
- [ ] `Requires PHP:` plain number only (e.g. `7.4`)
- [ ] 🔴 `License:` same as declared in the PHP header
- [ ] `License URI:` link to the license
- [ ] 🔴 Short description (the line after headers) is ≤ 150 characters, no HTML markup

### 2.2 Readme Body Sections
- [ ] 🔴 `== Description ==` is present, clear, written for humans not bots
  - Describe what the plugin does, how to use it, key features — NOT a sales pitch
- [ ] `== Installation ==` included when the plugin requires specific setup steps
- [ ] `== Frequently Asked Questions ==` included
- [ ] `== Screenshots ==` section present if screenshot files exist in `/assets/`
- [ ] 🔴🆕 `== Changelog ==` has current major version (and one version back)
  - Move older entries to a `changelog.txt` file to keep `readme.txt` under 10KB
  - Recommended format: keepachangelog.com — label Bugs Fixed, New Features, etc.
- [ ] `== Upgrade Notice ==` included for major/breaking changes
- [ ] 🔴 If using an external service, readme fully documents it (what, where, ToS, Privacy)

### 2.3 Readme File Limits & Quality
- [ ] 🔴🆕 `readme.txt` file size is **under 10KB** total
  - Oversized readmes can cause parse errors; move changelogs to `changelog.txt`
- [ ] 🔴 No keyword stuffing in any section
- [ ] 🔴 No black-hat SEO tactics
- [ ] 🔴 No unnecessary affiliate links; any affiliate links are disclosed and direct (not cloaked)
- [ ] 🔴 No competitor plugin names used as tags
- [ ] 🔴 `readme.txt` passes the official readme validator with zero errors
- [ ] Videos embedded by pasting URL on its own line (YouTube/Vimeo auto-embed)
  - Do not put a video as the very last line in a FAQ section — formatting issues occur

---

## 3. Security — The #1 Reason Plugins Are Rejected
`Source: developer.wordpress.org/apis/security/ | common-issues/ | add/`

> **The three most common rejection reasons (from the submission page itself):**
> 1. Unescaped output
> 2. Unsanitized input
> 3. Form data without nonce verification
>
> Fix these three FIRST. The review team will send you back to these pages and add delays.

### 3.1 Input Sanitization 🔴
- [ ] 🔴 ALL `$_POST` / `$_GET` / `$_REQUEST` / `$_COOKIE` / `$_FILES` inputs sanitized immediately
- [ ] 🔴 `sanitize_text_field()` used for plain text
- [ ] 🔴 `sanitize_email()` used specifically for email fields
- [ ] 🔴 `sanitize_url()` / `esc_url_raw()` used for URL inputs (not for output)
- [ ] 🔴 `absint()` or `intval()` used for integer fields
- [ ] `wp_kses_post()` or `wp_kses()` used when HTML input is allowed
- [ ] `sanitize_key()` used for keys, slugs, identifiers
- [ ] 🔴 `filter_input()` / `filter_var()` always pass an explicit `FILTER_SANITIZE_*` constant
  - Omitting the filter parameter applies `FILTER_DEFAULT` which does **NOT** sanitize at all
  - ✅ `$id = filter_input(INPUT_GET, 'post_id', FILTER_SANITIZE_NUMBER_INT);`
- [ ] Plugin does **NOT** attempt to process the entire `$_POST` / `$_GET` stack at once
  - Only extract and sanitize the specific keys your plugin actually needs
- [ ] 🔴 File uploads use `wp_handle_upload()` — **never** raw `move_uploaded_file()`
- [ ] 🔴 `ALLOW_UNFILTERED_UPLOADS` constant is **never** set to `true`

### 3.2 Output Escaping ("Escape Late") 🔴
- [ ] 🔴 EVERY echoed variable is escaped **at the point of output**, not before
- [ ] 🔴 `esc_html()` used for plain text inside HTML
- [ ] 🔴 `esc_attr()` used for HTML attribute values
- [ ] 🔴 `esc_url()` used for outputting URLs (not `esc_url_raw` which is for sanitizing)
  - `esc_url_raw()` = sanitizes URL for DB storage/redirects · `esc_url()` = escapes for HTML output
- [ ] 🔴 `wp_kses_post()` or `wp_kses()` used when outputting HTML that should be preserved
  - Do NOT use `esc_html()` to escape HTML — it strips all tags. Use `wp_kses_post()` instead
- [ ] 🔴 `wp_json_encode()` used instead of `json_encode()` when echoing JSON
- [ ] 🔴 `esc_html__()` / `esc_attr__()` used for translatable strings — **never** bare `__()`
  - `__()` retrieves translation WITHOUT escaping · `esc_html__()` retrieves AND escapes
- [ ] 🔴 `_e()` and `_ex()` replaced with `esc_html_e()` or `esc_attr_e()`
  - `_e()` and `_ex()` output without escaping — they are legacy functions
- [ ] 🔴 Sanitize functions are **NOT** used as escaping functions (they serve different purposes)
  - Even if they overlap, sanitize functions are filterable — another plugin could change them
- [ ] 🔴 HEREDOC / NOWDOC syntax is **NOT** used (PHPCS cannot detect missing escapes in it)
- [ ] 🔴 PHP short tags `<?` or `<?=` are **NOT** used

### 3.3 Nonces & CSRF Protection 🔴
- [ ] 🔴 Every form submission verifies a nonce
- [ ] 🔴 `wp_nonce_field()` generates nonce fields in all forms
- [ ] 🔴 `wp_verify_nonce()` or `check_admin_referer()` validates nonce before processing
- [ ] 🔴 Nonce value sanitized with `sanitize_text_field(wp_unslash(…))` before calling `wp_verify_nonce()`

```php
if ( ! isset( $_POST['pfx_nonce'] ) ||
     ! wp_verify_nonce(
         sanitize_text_field( wp_unslash( $_POST['pfx_nonce'] ) ),
         'pfx_action'
     )
) {
    wp_die( esc_html__( 'Security check failed.', 'plugin-slug' ) );
}
```

### 3.4 Database Security
- [ ] 🔴 Every custom query uses `$wpdb->prepare()`
- [ ] 🔴 `$wpdb->prepare()` uses `%s`, `%d`, `%f` placeholders — never string concatenation
- [ ] 🔴 Arrays for `IN()` clauses build one placeholder per item (not a single `%s`)
  - `implode(',', array_fill(0, count($ids), '%d'))` then merge with `prepare()`
- [ ] 🔴 No raw PHP `mysql_*` or `mysqli_*` calls — `$wpdb` used exclusively
- [ ] Custom table names always use `$wpdb->prefix`
- [ ] Options saved via WordPress Options API (`get_option` / `update_option`)

### 3.5 User Capabilities
- [ ] 🔴 `current_user_can()` checked before every privileged action
- [ ] 🔴 Capability checks in place for ALL AJAX handlers
- [ ] 🔴 REST API endpoints have `permission_callback` with real capability checks
- [ ] Most restrictive capability required for the task is used
  - `"manage_options"` for admin settings · `"edit_posts"` for content operations
- [ ] 🔴 Nonce checks AND capability checks BOTH present — they are NOT interchangeable

### 3.6 Direct File Access & Execution
- [ ] 🔴 All PHP files that could execute code have at the top:

```php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
```

- [ ] 🔴 No use of `eval()`, `system()`, `exec()`, `passthru()`, `shell_exec()` with user-supplied data
- [ ] 🔴 No dynamic code execution (`preg_replace` `/e` modifier, `create_function`)
- [ ] 🔴 File path inputs validated before use in any filesystem operation
- [ ] 🔴 Plugin does **NOT** set `ini_set()` or `error_reporting()` globally
  - Global `ini_set('memory_limit', '-1')` on `init` hook affects the entire site — forbidden
- [ ] 🔴 Plugin does **NOT** call `date_default_timezone_set()` (WP requires UTC)

---

## 4. Licensing & Legal Compliance
`Source: Guideline #1, #17 | common-issues/ | wordpress.org/plugins/developers/`

### 4.1 GPL Compliance
- [ ] 🔴 Plugin released under GPLv2 or later (or a fully GPL-compatible license)
  - Same license as WordPress — `"GPLv2 or later"` — is strongly recommended
- [ ] 🔴 ALL PHP code (including bundled libraries) is GPL-compatible
- [ ] 🔴 ALL JavaScript code is GPL-compatible
- [ ] 🔴 ALL CSS is GPL-compatible
- [ ] 🔴 ALL images and media are GPL-compatible (or Creative Commons equivalent)
- [ ] 🔴 License declared in BOTH the plugin PHP header AND `readme.txt`
- [ ] 🔴 BOTH declared licenses match each other exactly
- [ ] A `LICENSE.txt` file is included in the plugin root

### 4.2 Third-Party Libraries
- [ ] 🔴 Every bundled library individually confirmed as GPL-compatible
- [ ] 🔴 All libraries are current stable releases — no beta, alpha, or dev versions
- [ ] 🔴 No abandoned or unmaintained libraries included
- [ ] 🔴 Libraries that WP core already includes are **NOT** re-bundled
  - Core already includes: jQuery, Backbone.js, Underscore.js, SimplePie, PHPMailer, PHPass, and many more
  - Full list: developer.wordpress.org/reference/functions/wp_enqueue_script/#default-scripts
- [ ] Only the necessary files of each library are included (not entire repos)
- [ ] 🔴🆕 `composer.json` included if Composer is used (even for dev-only dependencies)
  - Required for open-source transparency — reviewers will ask for it if missing

### 4.3 Trademark & Copyright
- [ ] 🔴 Plugin slug does **NOT** begin with a trademarked or brand term you do not own
  - Cannot start with "WordPress", "WooCommerce", "Elementor", "Yoast", etc. without being those companies
  - 🆕 `woo` as a slug prefix is **no longer permitted** — use `wc` instead
- [ ] 🔴 Plugin does NOT claim to be an official product it is not
- [ ] 🔴 Plugin is original work — no other developer's code presented as your own
- [ ] All forked/derived code has copyright attribution preserved

---

## 5. Code Quality & WordPress Standards
`Source: common-issues/ | detailed-plugin-guidelines/ #4, #13`

### 5.1 Prefixing & Namespacing
- [ ] 🔴 ALL custom function names use a unique plugin prefix
- [ ] 🔴 ALL custom class names use a unique prefix or PHP namespace
- [ ] 🔴 ALL option names, transient keys, and filter/action hook names are prefixed
- [ ] 🔴 ALL defines/constants use a unique prefix
- [ ] 🔴 No use of `__` (double underscore), `wp_`, or `_` (single underscore) as standalone function prefix
  - Those are reserved for WordPress core — conflicts cause fatal errors
- [ ] No use of `if(!function_exists('name'))` as a substitute for a proper prefix/namespace
  - If another plugin defines the same name first, YOUR code silently won't load
- [ ] 🔴 Prefix is long enough to be unique — **NOT** just 2–3 letters
  - With 100,000+ plugins on WP.org, short prefixes always conflict eventually

### 5.2 WP API Compliance
- [ ] 🔴 `wp_remote_get()` / `wp_remote_post()` used for all HTTP calls — no raw cURL
  - cURL inside third-party vendor libs is OK; YOUR code must use the WP HTTP API
- [ ] 🔴 `wp_enqueue_script()` / `wp_register_script()` used for all JavaScript
- [ ] 🔴 `wp_enqueue_style()` / `wp_register_style()` used for all CSS
- [ ] `wp_add_inline_script()` / `wp_add_inline_style()` used for inline code additions
- [ ] `admin_enqueue_scripts` hook used for admin-only assets
- [ ] `WP_Filesystem` API used instead of direct PHP filesystem functions

### 5.3 Readability & Human-Readable Code (Guideline #4)
- [ ] 🔴 Code is **NOT** obfuscated, minified, or mangled beyond recognition
  - `p,a,c,k,e,r` obfuscation and uglify "mangle" mode are explicitly prohibited
- [ ] 🔴 Variable names are descriptive — no single-letter or random-character naming (`$z12sdf813d`)
- [ ] 🔴🆕 If minified/compiled JS or CSS is deployed, unminified source files are ALSO included **OR** a link to a public repo is in the readme
- [ ] Build tool usage (npm, webpack, composer, grunt, etc.) is documented
- [ ] 🔴 No HEREDOC / NOWDOC syntax anywhere in plugin code
- [ ] 🔴 No PHP short tags `<?` or `<?=` used
- [ ] PHPCS + WordPress Coding Standards runs with zero errors

---

## 6. Functionality, Features & Guideline Compliance
`Source: detailed-plugin-guidelines/ #5–#12 | common-issues/`

### 6.1 No Trialware / Locked Features (Guideline #5)
- [ ] 🔴 No functionality locked/restricted by payment within the plugin itself
- [ ] 🔴 No features disabled after a trial period or quota
- [ ] 🔴 No sandbox-only / test-only API access within a submitted plugin
  - Paid services ARE permitted (Guideline #6) but ALL plugin code must be fully functional
- [ ] Upsell prompts are within guideline #11 bounds (not intrusive)

### 6.2 External Services / SaaS (Guideline #6)

| ❌ NOT Accepted | ✅ Accepted (with docs) |
|---|---|
| License-validation-only service (all code is already local) | Genuine SaaS like Akismet, Twitter, YouTube, Amazon CDN |
| Code moved externally just to appear as a "service" | Font loading from Google Fonts / approved CDN |
| Storefronts that are only a front-end for external products | oEmbed calls to service providers |

- [ ] 🔴 All external services clearly documented in readme
- [ ] 🔴 readme includes a direct link to each service used
- [ ] 🔴 readme includes links to the service ToS AND Privacy Policy
- [ ] 🔴 readme explains exactly what data is sent, when, and under what circumstances
- [ ] 🔴 All communication with external services uses HTTPS

### 6.3 User Tracking & Privacy (Guideline #7)
- [ ] 🔴 No external server contacted without explicit user opt-in consent
- [ ] 🔴 No automated collection of user data without confirmed consent
- [ ] 🔴 No remote loading of images/JS/CSS unrelated to a declared service
- [ ] 🔴 No third-party ad mechanisms that track usage or views
- [ ] If plugin stores personal data: `wp_add_privacy_policy_content()` implemented
- [ ] If plugin stores personal data: `wp_register_personal_data_exporter()` implemented
- [ ] If plugin stores personal data: `wp_register_personal_data_eraser()` implemented

### 6.4 No External Code Execution (Guideline #8)
- [ ] 🔴 Plugin does **NOT** pull updates or install code from non-WordPress.org servers
- [ ] 🔴🆕 Any custom update checker / EDD Software Licensing / WPPUS code is **REMOVED**
  - WP.org provides updates for you — phoning home for updates violates Guideline #8
- [ ] 🔴 No third-party CDN for JS/CSS unless tied to a declared service
- [ ] No iframes used to embed admin pages (use REST API instead)
- [ ] 🔴🆕 Plugin does **NOT** interfere with WP core's built-in update mechanism
  - Interfering causes unexpected behavior with WordPress 5.5+ auto-updates

### 6.5 Admin Experience (Guideline #11)
- [ ] 🔴 No persistent site-wide notices that cannot be dismissed
- [ ] All dashboard widgets are dismissible
- [ ] Error messages include resolution steps and self-dismiss when resolved
- [ ] No excessive redirects or forced landing pages on activation
- [ ] No ads inside WP admin (generally ineffective and discouraged)
  - Any admin ads must not track users (violates Guideline #7)

### 6.6 No Front-End Credits Without Opt-In (Guideline #10)
- [ ] 🔴 "Powered By" links default to **OFF** on the public site
- [ ] 🔴 Credits/links are opt-in only, clearly labeled, and off by default
- [ ] 🔴 Plugin function is **NOT** gated behind requiring credit display

### 6.7 No Spam in Readme (Guideline #12)
- [ ] 🔴 Tags: max 12 in readme; no competitor names; no keyword stuffing
- [ ] 🔴 No unnecessary affiliate links
- [ ] 🔴 No black-hat SEO techniques in any visible field
- [ ] 🔴 Affiliate links disclosed and link DIRECTLY (no redirects or cloaked URLs)

---

## 7. File Structure & Submission Zip
`Source: plugin-developer-faq/ | common-issues/ | wordpress.org/plugins/developers/`

### 7.1 Required Files
- [ ] 🔴 Plugin root folder name matches the plugin slug exactly
- [ ] 🔴 Main PHP file name matches the plugin slug exactly (`slug.php`)
- [ ] 🔴 `readme.txt` present in the plugin root
- [ ] `LICENSE.txt` present in the plugin root
- [ ] 🔴🆕 All files properly compiled or generated — no raw build artifacts

### 7.2 SVN Structure (After Approval)

> **SVN is a RELEASE repository, not a development one.** Every commit triggers zip regeneration. Do not push until code is ready.

- [ ] 🔴🆕 Plugin files go **directly** in `trunk/` — NOT in a subdirectory of `trunk/`
  - Files in a subdirectory of `trunk/` WILL break the zip generator
- [ ] 🔴🆕 `readme.txt` and the main plugin PHP file are in the root of `trunk/`
- [ ] 🔴🆕 Tags are named with **numbers and periods ONLY** (e.g. `2.8.4` — NOT `"my-release"`)
  - Use Semantic Versioning (semver.org) — not enforced but strongly recommended
- [ ] 🔴🆕 No SVN externals included (they will NOT be added to the downloadable zip)
- [ ] 🔴🆕 No `.zip` or other compressed archive files committed to SVN
- [ ] 🆕 Images for WP.org page (screenshots, banner, icon) go in `/assets/` folder
  - `/assets/` is at the same level as `/trunk/` and `/tags/` in the SVN root
- [ ] 🆕 Keep as few old releases in SVN as possible (not a code history tool)
  - Use GitHub/GitLab for full version history

### 7.3 Plugin Page Assets (Banner & Icon)
- [ ] 🆕 Plugin icon: `icon-128x128.png` and `icon-256x256.png` in `/assets/`
- [ ] 🆕 Plugin banner: `banner-772x250.png` and `banner-1544x500.png` in `/assets/`
- [ ] 🔴🆕 Plugin icon/banner does **NOT** use official third-party logos
  - Even if a company gives you permission, WP.org does NOT have that permission
- [ ] 🆕 Icon and banner use original branding (more memorable and protects you legally)

### 7.4 Files to EXCLUDE from Zip
- [ ] 🔴 No `node_modules/` folder
- [ ] 🔴 No `.git/` or `.svn/` version control folders
- [ ] 🔴 No Bower, Grunt, Gulp, or other build tool output folders
- [ ] No unit test files or test data folders
- [ ] No IDE config files (`.idea/`, `.vscode/`, `.editorconfig`)
- [ ] No demo content (unless demos are core functionality)
- [ ] No log files, error dumps, or temporary files
- [ ] No `.DS_Store`, `Thumbs.db`, or OS metadata files
- [ ] 🔴 No premium or commercial library files that are not GPL-compatible
- > Note: `composer.json` and `package.json` **SHOULD** stay — required for open-source transparency

### 7.5 Minified JS/CSS Rule
- [ ] 🔴🆕 If minified JS/CSS deployed: unminified source files also included in plugin, **OR**
- [ ] 🔴🆕 A readme link to a public repo containing the unminified source is provided
  - Cannot include minified-only code without human-readable access — Guideline #4

---

## 8. Internationalization (i18n)
`Source: common-issues/ | developer.wordpress.org/plugins/internationalization/`

### 8.1 Text Domain Setup
- [ ] 🔴 Text domain in plugin header exactly matches the plugin slug
- [ ] `load_plugin_textdomain()` called on `init` hook (or WP 4.6+ auto-load used)
- [ ] `.pot` template file generated and included in `/languages/`

### 8.2 Gettext Function Correctness
- [ ] 🔴 All user-visible strings wrapped in a gettext function
- [ ] 🔴 Text domain parameter is a **literal string** — NEVER a variable or constant
  - ❌ `esc_html__('Hello', $plugin_slug)` — translator cannot read a variable
- [ ] 🔴 String parameter is a **literal string** — NEVER a variable
  - ❌ `esc_html__($greeting, 'slug')` — translators cannot see what to translate
- [ ] 🔴 Dynamic values injected via `printf`/`sprintf` AFTER the gettext call

```php
printf(
    /* translators: %s: first name */
    esc_html__( 'Hello %s!', 'plugin-slug' ),
    esc_html( $first_name )
);
```

- [ ] Translator comments added above strings with `%s` / `%d` placeholders
- [ ] 🔴 `_e()` replaced with `esc_html_e()` or `esc_attr_e()`
- [ ] 🔴 `_ex()` replaced with `echo esc_html( _x(…) )`
- [ ] Pluralization handled with `_n()` for singular/plural forms

---

## 9. Activation, Deactivation & Uninstall Lifecycle

### 9.1 Activation
- [ ] `register_activation_hook()` used for activation logic (not `init` hook)
- [ ] Activation checks minimum WP and PHP version compatibility
- [ ] DB tables created using `$wpdb->prefix` and `dbDelta()`
- [ ] Default options set with `add_option()` not `update_option()` on first activation
- [ ] Activation redirects are minimal (first activation only if at all)

### 9.2 Deactivation
- [ ] `register_deactivation_hook()` used for deactivation cleanup
- [ ] WP-Cron events cleared via `wp_clear_scheduled_hook()` on deactivation
- [ ] User data and settings are **NOT** deleted on deactivation (only on uninstall)

### 9.3 Uninstall
- [ ] 🔴 Uninstall logic uses `uninstall.php` (preferred) or `register_uninstall_hook()`
- [ ] 🔴 `uninstall.php` begins with:

```php
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) exit;
```

- [ ] All plugin options deleted via `delete_option()` on uninstall
- [ ] All custom database tables dropped on uninstall
- [ ] All transients created by plugin cleared on uninstall
- [ ] All user meta and post meta added by plugin cleaned up
- [ ] Uninstall behavior documented in readme

---

## 10. Performance & Resource Usage

### 10.1 Asset Loading
- [ ] 🔴 Scripts and styles loaded only on pages where they are needed
- [ ] Admin-only assets not loaded on the front end
- [ ] Front-end assets not loaded on every admin page
- [ ] Scripts enqueued in footer where possible
- [ ] Minified assets used for production deployment

### 10.2 Database & Query Efficiency
- [ ] Expensive queries cached using transients
- [ ] All queries have sensible `LIMIT` clauses — no unbounded queries
- [ ] `WP_Query` `posts_per_page` is not `-1` without strict justification
- [ ] No duplicate or redundant queries within a single page request
- [ ] Query Monitor shows no slow queries or PHP warnings

### 10.3 Cron Jobs
- [ ] Cron events use appropriately infrequent schedules
- [ ] Cron hook names are unique and prefixed
- [ ] Cron events cleared on both deactivation and uninstall
- [ ] Cron callbacks handle exceptions gracefully

---

## 11. Final Pre-Submission Verification Table
`Source: ALL 5 sources`

> Complete ALL items in sections 0–10 before reviewing this table. Items marked 🆕 were absent from common checklists — pay extra attention.

| Item | Priority | Status |
|---|---|---|
| 🆕 WP.org account active with monitored email (no auto-reply) | 🔴 CRITICAL | ☐ |
| 🆕 Zip is under 10MB and in standard WP plugin format | 🔴 CRITICAL | ☐ |
| 🆕 Plugin is complete and production-ready (no placeholders) | 🔴 CRITICAL | ☐ |
| 🆕 Only ONE plugin in review queue at a time | 🔴 CRITICAL | ☐ |
| 🆕 Plugin NOT a framework, library, or 100% copy of existing plugin | 🔴 CRITICAL | ☐ |
| 🆕 Slug chosen carefully — cannot be changed after approval | 🔴 CRITICAL | ☐ |
| 🆕 Slug does not start with a trademarked or prohibited term | 🔴 CRITICAL | ☐ |
| 🆕 `woo` prefix NOT used in slug — use `wc` instead | 🔴 CRITICAL | ☐ |
| 🆕 Files placed directly in `trunk/` (not in a subdirectory) | 🔴 CRITICAL | ☐ |
| 🆕 Tags named with numbers and periods only (e.g. `2.8.4`) | 🔴 CRITICAL | ☐ |
| 🆕 No SVN externals; no `.zip` files in SVN | 🔴 CRITICAL | ☐ |
| 🆕 Do NOT push to SVN until plugin is ready to go live | 🔴 CRITICAL | ☐ |
| Main PHP header: all required fields complete and correct | 🔴 CRITICAL | ☐ |
| `Stable tag` exactly matches `Version` in PHP header | 🔴 CRITICAL | ☐ |
| `readme.txt` passes official validator with zero errors | 🔴 CRITICAL | ☐ |
| 🆕 `readme.txt` under 10KB; `Tested up to` reflects actual tested version | 🔴 CRITICAL | ☐ |
| 🆕 Tags in readme: max 12 (first 5 display); no competitor names | 🔴 CRITICAL | ☐ |
| All `$_POST`/`$_GET`/`$_REQUEST` inputs sanitized immediately | 🔴 CRITICAL | ☐ |
| All echoed variables escaped at the point of output (escape late) | 🔴 CRITICAL | ☐ |
| All form submissions verify a nonce (sanitized with `wp_unslash` first) | 🔴 CRITICAL | ☐ |
| All DB queries use `$wpdb->prepare()` | 🔴 CRITICAL | ☐ |
| `current_user_can()` checks for all privileged operations | 🔴 CRITICAL | ☐ |
| `ABSPATH` check at top of all executable PHP files | 🔴 CRITICAL | ☐ |
| License declared in both PHP header and `readme.txt` (matching) | 🔴 CRITICAL | ☐ |
| All bundled code is GPL-compatible | 🔴 CRITICAL | ☐ |
| No re-bundled WP core libraries (jQuery, etc.) | 🔴 CRITICAL | ☐ |
| 🆕 Custom update checker / phone-home code removed | 🔴 CRITICAL | ☐ |
| External services fully documented in readme (link + ToS + Privacy) | 🔴 CRITICAL | ☐ |
| No trialware or locked features inside the plugin | ⚠️ HIGH | ☐ |
| All JS/CSS loaded via `wp_enqueue_script` / `wp_enqueue_style` | ⚠️ HIGH | ☐ |
| cURL replaced with WP HTTP API | ⚠️ HIGH | ☐ |
| All functions/classes/options use long unique plugin prefix | ⚠️ HIGH | ☐ |
| No PHP short tags; no HEREDOC/NOWDOC; no global `ini_set` | ⚠️ HIGH | ☐ |
| `esc_html__()` used instead of bare `__()` for translated strings | ⚠️ HIGH | ☐ |
| `_e()` replaced with `esc_html_e()`; `_ex()` replaced with `echo esc_html(_x())` | ⚠️ HIGH | ☐ |
| 🆕 Minified code: source also included or publicly linked in readme | ⚠️ HIGH | ☐ |
| 🆕 `composer.json` included if Composer is used | ⚠️ HIGH | ☐ |
| 🆕 Plugin icon and banner uploaded to `/assets/` (no official logos) | ⚠️ HIGH | ☐ |
| Admin notices are dismissible; no persistent site-wide notices | MED | ☐ |
| "Powered By" links default to OFF on the public site | MED | ☐ |
| Uninstall cleans up all options, tables, transients, and meta | MED | ☐ |
| Cron events cleared on deactivation | MED | ☐ |
| No dev folders (`node_modules`, `.git`, tests) in final zip | MED | ☐ |
| All user-visible strings internationalized with literal text domain | MED | ☐ |
| No iframes in admin pages; no ad tracking in WP dashboard | MED | ☐ |

### 11.1 Final Actions Before Upload
- [ ] 🔴 Run PHPCS with WordPress Coding Standards — zero errors
- [ ] 🔴 Run the Plugin Check (PCP) plugin on a clean WP install
- [ ] 🔴 Test on a clean WP install with `WP_DEBUG` and `WP_DEBUG_LOG` enabled
- [ ] Test with Query Monitor — no PHP warnings, notices, or slow queries
- [ ] Test full cycle: install → activate → use → deactivate → uninstall
- [ ] 🔴 Confirm zip structure: single top-level folder matching slug
- [ ] 🔴 Confirm `readme.txt` validator: zero errors
- [ ] 🔴 Confirm WordPress.org account email is live, monitored, no auto-reply

---

## 12. After Submission — Review Process & SVN Workflow
`Source: plugin-developer-faq/ | wordpress.org/plugins/developers/add/`

> **Key numbers:** Review ≤ 14 business days from initial review start · Reply window: 10 business days · Rejection after 3 months of inactivity

### 12.1 During Review — Critical Behaviour Rules 🔴
- [ ] 🔴🆕 Monitor `plugins@wordpress.org` email daily — add it to your whitelist
- [ ] 🔴🆕 Respond to reviewer feedback promptly (within 10 business days)
- [ ] 🔴🆕 **DO NOT resubmit** if rejected for guideline/code issues — just **REPLY to the email**
  - Resubmitting creates a new queue entry and loses your review history
- [ ] 🔴🆕 ONLY resubmit if your plugin was rejected after the 3-month inactivity timeout
  - If the 3-month rejection occurs: resubmit AND reply to the email referencing the previous review
- [ ] 🆕 Do NOT email asking for timeline — review is not prioritizable
  - Exception: security or legal emergency — email `plugins@wordpress.org` and explain
- [ ] 🆕 Never submit a deadline request (the queue is not jumppable)

### 12.2 Going Live — Know Before You Push ⚠️
- [ ] 🔴🆕 Plugin goes **LIVE immediately** when code is first pushed to SVN
  - There is NO staging or preview mode — pushing = public
- [ ] 🔴🆕 Closing a plugin is **PERMANENT** (not a temporary "unpublish")
  - There is no "hide temporarily" option
- [ ] 🆕 Plugin directory takes up to 6 hours to fully reflect SVN changes
- [ ] 🆕 New plugin appears in search results 6–14 days after first SVN commit

### 12.3 Ongoing SVN Release Workflow
- [ ] 🔴 SVN is a RELEASE repo — only commit production-ready code
- [ ] 🔴 Create a new tag in `/tags/{version}/` for each release
- [ ] 🔴 Increment version in PHP header for every code change
- [ ] 🔴 Update `Stable tag` in `trunk/readme.txt` to match new version
- [ ] 🔴 Update the tag's `readme.txt` `Stable tag` too (must match, or auto-updates break)
- [ ] 🆕 No new version needed for readme-only or `/assets/` changes (no code change required)
- [ ] Commit messages are descriptive — not just `"update"` or `"cleanup"`
- [ ] Avoid rapid-fire minor commits that game the Recently Updated list

### 12.4 Maintaining Plugin Health
- [ ] Monitor support forum; respond to posts (subscribe at `wordpress.org/support/plugin/YOURSLUG`)
- [ ] Update `Tested up to` in readme whenever compatibility with a new WP version is confirmed
- [ ] Security vulnerabilities reported immediately to `security@wordpress.org`
- [ ] 🔴 No sockpuppet accounts for fake reviews or fake support tickets
  - Sockpuppeting = all reviews/posts removed AND possible ban of ALL your plugins
- [ ] Plugin contact info on WordPress.org kept current at all times
- [ ] 🆕 Be cautious with unsolicited plugin purchase offers — majority are fraudulent
  - Legitimate buyers are usually from the official company the plugin relates to

---

*Good luck with your submission! 🚀*

*Contact: plugins@wordpress.org (replies within 7 business days)*
*Full guidelines: developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/*
