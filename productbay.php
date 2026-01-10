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
 * Description:       A WooCommerce Product Table plugin to create, save, and manage responsive product lists and order forms.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            WPAnchorBay
 * Author URI:        https://wpanchorbay.com/
 * Text Domain:       productbay
 * Domain Path:       /languages
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.txt
 * Requires Plugins:  woocommerce
 */


// Namespace - ProductBay
namespace ProductBay;

/**
 * Prevent Direct File Access
 * Abort if this file is called directly.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Global Constants
 * Prefixed with PRODUCTBAY_
 */
define( 'PRODUCTBAY_VERSION', '1.0.0' );
define( 'PRODUCTBAY_PATH', plugin_dir_path( __FILE__ ) );
define( 'PRODUCTBAY_URL', plugin_dir_url( __FILE__ ) );

// Autoloader
require_once __DIR__ . '/vendor/autoload.php';

/**
 * Initialization
 */
function productbay_init() {
    $plugin = new Core\Plugin();
    $plugin->run();
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\\productbay_init' );