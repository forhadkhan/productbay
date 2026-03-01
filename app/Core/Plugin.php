<?php
/**
 * Main plugin bootstrap class — loads dependencies and initializes components.
 *
 * @package ProductBay
 */

declare(strict_types=1);

namespace WpabProductBay\Core;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use WpabProductBay\Admin\Admin;

/**
 * Class Plugin
 *
 * The main plugin class which handles the loading of all dependencies.
 *
 * @package WpabProductBay\Core
 */
class Plugin {

	/**
	 * @var \WpabProductBay\Data\TableRepository
	 */
	protected $table_repository;

	/**
	 * @var \WpabProductBay\Http\Request
	 */
	protected $request;

	/**
	 * Run the plugin.
	 *
	 * Loads dependencies and initializes all plugin components.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function run() {
		$this->load_dependencies();
		$this->init_components();
	}

	/**
	 * Load all dependencies for the plugin.
	 *
	 * Initializes the TableRepository and Request classes.
	 *
	 * @return void
	 */
	private function load_dependencies() {
		$this->table_repository = new \WpabProductBay\Data\TableRepository();
		$this->request          = new \WpabProductBay\Http\Request();
	}

	/**
	 * Initialize the plugin components.
	 *
	 * Sets up the Admin area, API Router, and Frontend renderers.
	 *
	 * @return void
	 */
	private function init_components() {
		// Admin Area.
		if ( is_admin() ) {
			$admin = new Admin( $this->table_repository, $this->request );
			\add_action( 'admin_menu', array( $admin, 'register_menu' ) );
			\add_action( 'admin_enqueue_scripts', array( $admin, 'enqueue_scripts' ) );

			// Admin bar - registered inside is_admin() since Admin class is instantiated here.
			// Priority 100 ensures it appears after core items.
			\add_action( 'admin_bar_menu', array( $admin, 'register_admin_bar' ), 100 );
		}

		// API Router.
		$router = new \WpabProductBay\Http\Router( $this->table_repository, $this->request );
		$router->init();

		// Frontend.
		$table_renderer = new \WpabProductBay\Frontend\TableRenderer( $this->table_repository );
		// TableRenderer no longer handles shortcode directy.

		$shortcode = new \WpabProductBay\Frontend\Shortcode( $this->table_repository );
		$shortcode->init();

		$ajax_renderer = new \WpabProductBay\Frontend\AjaxRenderer( $this->table_repository, $this->request );
		$ajax_renderer->init();
	}
}
