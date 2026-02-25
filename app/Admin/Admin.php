<?php

declare(strict_types=1);

namespace WpabProductBay\Admin;

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

use WpabProductBay\Core\Constants;

/**
 * Class Admin
 *
 * Handles the administrative area functionality of the plugin.
 * This class is responsible for registering menu pages, enqueueing scripts,
 * and initializing the React application container.
 *
 * @package ProductBay\Admin
 */
class Admin
{
    /**
     * The repository instance (placeholder for future implementation).
     *
     * @var mixed
     */
    protected $repository;

    /**
     * The request instance (placeholder for future implementation).
     *
     * @var mixed
     */
    protected $request;

    /**
     * Initialize the class and set its properties.
     *
     * @param mixed $repository Repository instance.
     * @param mixed $request    Request instance.
     */
    public function __construct($repository, $request)
    {
        $this->repository = $repository;
        $this->request = $request;
    }

    /**
     * Register the administration menu for this plugin into the WordPress Dashboard menu.
     *
     * Registers a top-level menu page and several submenus to navigate the React application.
     *
     * @return void
     */
    public function register_menu(): void
    {
        // Register top-level menu page in WordPress admin sidebar
        \add_menu_page(
            // $page_title: The text displayed in the browser title bar when the menu page is active
            \__('ProductBay', 'productbay'),
            // $menu_title: The text shown in the admin sidebar menu
            \__('ProductBay', 'productbay'),
            // $capability: The user capability required to access this menu (e.g., 'manage_options')
            Constants::CAPABILITY,
            // $menu_slug: Unique identifier for this menu, used in URLs (?page=productbay)
            Constants::MENU_SLUG,
            // $callback: Function to render the page content (outputs React app container)
            [$this, 'render_app'],
            // $icon_url: Dashicon class or base64-encoded SVG for the menu icon
            Constants::MENU_ICON,
            // $position: Menu position in sidebar (58 places it after WooCommerce's Products at 56)
            58
        );

        // Register "Tables" as the default submenu (sharing the parent slug)
        // This makes "Tables" the page that loads when clicking the top-level "ProductBay" menu
        \add_submenu_page(
            // $parent_slug: The slug of the parent menu
            Constants::MENU_SLUG,
            // $page_title: Browser title bar text
            \__('Tables', 'productbay'),
            // $menu_title: Text displayed in the submenu list
            \__('Tables', 'productbay'),
            // $capability: User capability required
            Constants::CAPABILITY,
            // $menu_slug: Same as parent to make it the default
            Constants::MENU_SLUG,
            // $callback: Function to render page content
            [$this, 'render_app']
        );

        // Register "Settings" submenu
        \add_submenu_page(
            Constants::MENU_SLUG,
            \__('Settings', 'productbay'),
            \__('Settings', 'productbay'),
            Constants::CAPABILITY,
            Constants::MENU_SLUG . '-settings',
            [$this, 'render_app']
        );

        // Register "Create New Table" submenu
        \add_submenu_page(
            Constants::MENU_SLUG,
            \__('Create New Table', 'productbay'),
            \__('Create New Table', 'productbay'),
            Constants::CAPABILITY,
            Constants::MENU_SLUG . '-new',
            [$this, 'render_app']
        );

        // Register submenu under WooCommerce's "Products" menu
        // Uses a redirect callback to open the ProductBay tables in its proper admin URL
        \add_submenu_page(
            'edit.php?post_type=product',
            \__('Tables', 'productbay'),
            \__('Tables', 'productbay'),
            Constants::CAPABILITY,
            Constants::MENU_SLUG . '-woo-tables',
            [$this, 'redirect_to_productbay']
        );
    }

    /**
     * Register ProductBay in the WordPress admin bar.
     *
     * Adds a top-level node with the plugin icon and dropdown submenu items
     * for quick access to Dashboard, Tables, Settings, and Create New Table.
     * This feature can be enabled/disabled from Settings > Plugin tab.
     *
     * @param \WP_Admin_Bar $wp_admin_bar The WordPress admin bar instance.
     * @return void
     */
    public function register_admin_bar(\WP_Admin_Bar $wp_admin_bar): void
    {
        // Only show for users with appropriate capabilities
        if (!\current_user_can(Constants::CAPABILITY)) {
            return;
        }

        // Check if admin bar is enabled in plugin settings
        // Retrieve the setting from database, default to true if not set
        $settings = \get_option('productbay_settings', []);
        $show_admin_bar = $settings['show_admin_bar'] ?? true;

        if (!$show_admin_bar) {
            return;
        }

        // Add parent node with icon using flexbox for perfect alignment
        $wp_admin_bar->add_node([
            'id'    => Constants::MENU_SLUG,
            'title' => '<span style="display: flex; align-items: center;">'
                . '<span>' . \__('ProductBay', 'productbay') . '</span>'
                . '</span>',
            // Link to the main productbay page (now Tables)
            'href'  => \admin_url('admin.php?page=' . Constants::MENU_SLUG),
            'meta'  => [
                'title' => \__('ProductBay', 'productbay'),
            ],
        ]);

        // Add Tables submenu
        $wp_admin_bar->add_node([
            'id'     => Constants::MENU_SLUG . '-tables',
            'parent' => Constants::MENU_SLUG,
            'title'  => \__('Tables', 'productbay'),
            'href'   => \admin_url('admin.php?page=' . Constants::MENU_SLUG),
        ]);

        // Add Settings submenu
        $wp_admin_bar->add_node([
            'id'     => Constants::MENU_SLUG . '-settings',
            'parent' => Constants::MENU_SLUG,
            'title'  => \__('Settings', 'productbay'),
            'href'   => \admin_url('admin.php?page=' . Constants::MENU_SLUG . '-settings'),
        ]);

        // Add "Create New Table" submenu
        $wp_admin_bar->add_node([
            'id'     => Constants::MENU_SLUG . '-new',
            'parent' => Constants::MENU_SLUG,
            'title'  => \__('Create New Table', 'productbay'),
            'href'   => \admin_url('admin.php?page=' . Constants::MENU_SLUG . '-new'),
        ]);
    }

    /**
     * Render the React App Root Container.
     *
     * This function outputs the HTML div where the React application will mount.
     *
     * @return void
     */
    public function render_app(): void
    {
        echo '<div id="productbay-root" class="productbay-wrapper"></div>';
    }

    /**
     * Redirect from WooCommerce Products submenu to ProductBay Tables.
     *
     * This callback is used for the "Tables" menu item under Products.
     * It redirects to the ProductBay admin page, ensuring proper menu highlighting
     * and a clean URL structure.
     *
     * @return void
     */
    public function redirect_to_productbay(): void
    {
        // Redirect to the main plugin page which is now Tables (#/tables is default but optional if handled in React)
        // We explicitly add #/tables for clarity and exact routing
        $redirect_url = \admin_url('admin.php?page=' . Constants::MENU_SLUG . '#/tables');
        \wp_safe_redirect($redirect_url);
        exit;
    }

    /**
     * Enqueue the admin-specific stylesheets and JavaScript files.
     *
     * This method checks if the current page is a ProductBay page and only then loads
     * the necessary assets, ensuring performance optimization on other admin pages.
     *
     * @param string $hook The current admin page hook.
     * @return void
     */
    public function enqueue_scripts(string $hook): void
    {
        // Allow loading on any productbay page
        if (strpos($hook, 'page_productbay') === false && $hook !== 'toplevel_page_' . Constants::MENU_SLUG) {
            return;
        }

        // Auto-generated asset file from webpack build
        $asset_path = PRODUCTBAY_PATH . 'assets/js/admin.asset.php';

        if (! file_exists($asset_path)) {
            return;
        }

        $asset = include $asset_path;

        // Enqueue the main React app script
        \wp_enqueue_script(
            'productbay-admin',
            PRODUCTBAY_URL . 'assets/js/admin.js',
            $asset['dependencies'],
            $asset['version'],
            true
        );

        // Pass PHP data to React script via localization
        \wp_localize_script('productbay-admin', 'productBaySettings', [
            'apiUrl'    => \rest_url(Constants::PLUGIN_SLUG . '/v1/'),
            'nonce'     => \wp_create_nonce('wp_rest'),
            'pluginUrl' => PRODUCTBAY_URL,
        ]);

        // Enqueue global admin styles with smart cache busting
        // Uses file modification time in dev mode for instant refresh,
        // or plugin version in production for proper cache control
        $css_path = PRODUCTBAY_PATH . 'assets/css/admin.css';
        $css_version = \defined('PRODUCTBAY_DEV_MODE') && PRODUCTBAY_DEV_MODE && \file_exists($css_path)
            ? (string) \filemtime($css_path)
            : Constants::VERSION;

        \wp_enqueue_style(
            'productbay-admin-css',
            PRODUCTBAY_URL . 'assets/css/admin.css',
            [],
            $css_version
        );

        // Load translations for the React app
        \wp_set_script_translations('productbay-admin', Constants::TEXT_DOMAIN, PRODUCTBAY_PATH . 'languages');
    }
}
