<?php
/**
 * Plugin Name: ProductBay
 * Description: Advanced WooCommerce Product Tables with React Admin.
 * Version: 1.0.0
 * Author: Forhad Khan
 * Text Domain: productbay
 * Domain Path: /languages
 */

namespace ProductBay;

if ( ! defined( 'ABSPATH' ) ) exit;

// Constants
define( 'PRODUCTBAY_VERSION', '1.0.0' );
define( 'PRODUCTBAY_PATH', plugin_dir_path( __FILE__ ) );
define( 'PRODUCTBAY_URL', plugin_dir_url( __FILE__ ) );


// Autoloader (PSR-4 implementation)
spl_autoload_register(function ($class) {
    $prefix = 'ProductBay\\';
    $base_dir = PRODUCTBAY_PATH . 'app/';

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

    if (file_exists($file)) {
        require $file;
    }
});

// Boot Plugin
function run_productbay() {
    $plugin = new Core\Plugin();
    $plugin->run();
}
run_productbay();