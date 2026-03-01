<?php
/**
 * Plugin activation lifecycle handler.
 *
 * @package ProductBay
 */

declare(strict_types=1);

namespace WpabProductBay\Core;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Activator
 *
 * Fired during plugin activation.
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @package WpabProductBay\Core
 * @since 1.0.0
 */
class Activator {

	/**
	 * Activate the plugin.
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public static function activate() {
		// Activation logic here.
	}
}
