<?php

/**
 * ProductBay
 *
 * @package           productbay
 * @author            WPAnchorBay
 * @copyright         2026 WPAnchorBay
 * @license           GPL-2.0-or-later
 *
 * @wordpress-plugin
 * Plugin Name:       ProductBay
 * Plugin URI:        https://wpanchorbay.com/productbay
 * Source URI:        https://github.com/forhadakhan/productbay
 * Description:       WooCommerce product tables with search, filters, and pagination for high-converting, responsive product listings and easy browsing.
 * Version:           1.0.0
 * Stable tag:        1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            WPAnchorBay
 * Author URI:        https://wpanchorbay.com/
 * Text Domain:       productbay
 * Domain Path:       /languages
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.txt
 * Requires Plugins:  woocommerce
 * WC requires at least: 6.1
 */


// Namespace - ProductBay
namespace WpabProductBay;

/**
 * Prevent Direct File Access
 * Abort if this file is called directly.
 */
if (! defined('ABSPATH')) {
    exit;
}

/**
 * Global Constants
 * Prefixed with PRODUCTBAY_
 */
define('PRODUCTBAY_VERSION', '1.0.0');
define('PRODUCTBAY_PLUGIN_NAME', 'productbay');
define('PRODUCTBAY_TEXT_DOMAIN', 'productbay');
define('PRODUCTBAY_OPTION_NAME', 'productbay');
define('PRODUCTBAY_URL', \plugin_dir_url(__FILE__));
define('PRODUCTBAY_PATH', \plugin_dir_path(__FILE__));
define('PRODUCTBAY_PLUGIN_BASENAME', \plugin_basename(__FILE__));

// Autoloader (must be loaded before using any composer packages)
require_once __DIR__ . '/vendor/autoload.php';

/**
 * Load Environment Variables from .env file (development only)
 * The .env file should NOT be included in production releases.
 * If .env doesn't exist, the plugin uses production defaults.
 */
$dotenv_path = __DIR__ . '/.env';
if (\file_exists($dotenv_path) && \class_exists('Dotenv\\Dotenv')) {
    $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->safeLoad();
}

/**
 * Development Mode Constant
 * Loaded from .env file if available, defaults to false for production.
 * When true: enables file-based cache busting, debug features, etc.
 * When false: uses production-optimized settings.
 */
define('PRODUCTBAY_DEV_MODE', \filter_var($_ENV['PRODUCTBAY_DEV_MODE'] ?? false, FILTER_VALIDATE_BOOLEAN));

/**
 * Initialization
 */
function productbay_init()
{
    $plugin = new Core\Plugin();
    $plugin->run();
}
add_action('plugins_loaded', __NAMESPACE__ . '\\productbay_init');
