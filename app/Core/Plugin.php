<?php
/**
 * Main plugin bootstrap class — loads dependencies and initializes components.
 *
 * @package ProductBay
 */

declare(strict_types=1);

namespace WpabProductBay\Core;

// Exit if accessed directly.
if (!defined('ABSPATH')) {
	exit;
}

use WpabProductBay\Admin\Admin;
use WpabProductBay\Blocks\BlockManager;

/**
 * Class Plugin
 *
 * The main plugin class which handles the loading of all dependencies.
 *
 * @package WpabProductBay\Core
 * @since 1.0.0
 */
class Plugin
{

	/**
	 * Repository for table data access.
	 *
	 * @var \WpabProductBay\Data\TableRepository
	 * @since 1.0.0
	 */
	protected $table_repository;

	/**
	 * HTTP request wrapper instance.
	 *
	 * @var \WpabProductBay\Http\Request
	 * @since 1.0.0
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
	public function run()
	{
		$this->load_dependencies();
		$this->init_components();
	}

	/**
	 * Load all dependencies for the plugin.
	 *
	 * Initializes the TableRepository and Request classes.
	 *
	 * @return void
	 * @since 1.0.0
	 */
	private function load_dependencies()
	{
		$this->table_repository = new \WpabProductBay\Data\TableRepository();
		$this->request = new \WpabProductBay\Http\Request();
	}

	/**
	 * Initialize the plugin components.
	 *
	 * Sets up the Admin area, API Router, and Frontend renderers.
	 *
	 * @return void
	 * @since 1.0.0
	 */
	private function init_components()
	{
		// Gutenberg Blocks (must run on 'init', not 'plugins_loaded').
		$block_manager = new BlockManager($this->table_repository);
		\add_action('init', array($block_manager, 'init'));

		// Admin Area.
		if (is_admin()) {
			$admin = new Admin($this->table_repository, $this->request);
			\add_action('admin_menu', array($admin, 'register_menu'));
			\add_action('admin_enqueue_scripts', array($admin, 'enqueue_scripts'));

			// Admin bar - registered inside is_admin() since Admin class is instantiated here.
			// Priority 100 ensures it appears after core items.
			\add_action('admin_bar_menu', array($admin, 'register_admin_bar'), 100);

			// Filter plugin name in plugins list.
			\add_filter('all_plugins', array($admin, 'change_plugin_display_name'));

			// Add plugin action links.
			\add_filter('plugin_action_links_' . PRODUCTBAY_PLUGIN_BASENAME, array($admin, 'add_plugin_action_links'));

			/**
			 * Fires after the admin component is initialized.
			 *
			 * @since 1.0.0
			 *
			 * @param Admin $admin The Admin instance.
			 */
			\do_action('productbay_admin_init', $admin);
		}

		// API Router.
		$router = new \WpabProductBay\Http\Router($this->table_repository, $this->request);
		$router->init();

		// Frontend.
		$table_renderer = new \WpabProductBay\Frontend\TableRenderer($this->table_repository);
		// TableRenderer no longer handles shortcode directy.

		$shortcode = new \WpabProductBay\Frontend\Shortcode($this->table_repository);
		$shortcode->init();

		$ajax_renderer = new \WpabProductBay\Frontend\AjaxRenderer($this->table_repository, $this->request);
		$ajax_renderer->init();

		/**
		 * Fires after all plugin components are loaded and initialized.
		 *
		 * This is the primary hook for add-on plugins to bootstrap themselves.
		 *
		 * @since 1.0.0
		 *
		 * @param Plugin $plugin The main Plugin instance.
		 */
		\do_action('productbay_loaded', $this);
	}
}