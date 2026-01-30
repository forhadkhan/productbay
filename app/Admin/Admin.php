<?php

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

declare(strict_types=1);

namespace WpabProductBay\Admin;

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
        // Register top-level menu page
        \add_menu_page(
            \__('ProductBay', Constants::TEXT_DOMAIN),
            \__('ProductBay', Constants::TEXT_DOMAIN),
            Constants::CAPABILITY,
            Constants::MENU_SLUG,
            [$this, 'render_app'],
            Constants::MENU_ICON,
            58
        );

        // Register "Dashboard" submenu with unique slug for proper menu sync
        \add_submenu_page(
            Constants::MENU_SLUG,
            \__('Dashboard', Constants::TEXT_DOMAIN),
            \__('Dashboard', Constants::TEXT_DOMAIN),
            Constants::CAPABILITY,
            Constants::MENU_SLUG . '-dash',
            [$this, 'render_app']
        );

        // Register "Tables" submenu
        \add_submenu_page(
            Constants::MENU_SLUG,
            \__('Tables', Constants::TEXT_DOMAIN),
            \__('Tables', Constants::TEXT_DOMAIN),
            Constants::CAPABILITY,
            Constants::MENU_SLUG . '-tables',
            [$this, 'render_app']
        );

        // Register "Settings" submenu
        \add_submenu_page(
            Constants::MENU_SLUG,
            \__('Settings', Constants::TEXT_DOMAIN),
            \__('Settings', Constants::TEXT_DOMAIN),
            Constants::CAPABILITY,
            Constants::MENU_SLUG . '-settings',
            [$this, 'render_app']
        );

        // Register "Add New Table" submenu
        \add_submenu_page(
            Constants::MENU_SLUG,
            \__('Add New Table', Constants::TEXT_DOMAIN),
            \__('Add New Table', Constants::TEXT_DOMAIN),
            Constants::CAPABILITY,
            Constants::MENU_SLUG . '-new',
            [$this, 'render_app']
        );

        // Register submenu under WooCommerce's "Products" menu
        // Uses WooCommerce's product post type parent slug for integration
        \add_submenu_page(
            'edit.php?post_type=product',
            \__('Tables', Constants::TEXT_DOMAIN),
            \__('Tables', Constants::TEXT_DOMAIN),
            Constants::CAPABILITY,
            Constants::MENU_SLUG . '-dash',
            [$this, 'render_app']
        );

        // Remove the auto-generated duplicate parent menu entry
        // WordPress automatically creates a submenu with the parent's slug
        // We remove it since we have a dedicated Dashboard submenu
        \remove_submenu_page(Constants::MENU_SLUG, Constants::MENU_SLUG);
    }

    /**
     * Register ProductBay in the WordPress admin bar.
     *
     * Adds a top-level node with the plugin icon and dropdown submenu items
     * for quick access to Dashboard, Tables, Settings, and Add New Table.
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

        // Add parent node with icon using flexbox for perfect alignment
        $wp_admin_bar->add_node([
            'id'    => Constants::MENU_SLUG,
            'title' => '<span style="display: flex; align-items: center;">'
                . '<span>' . \__('ProductBay', Constants::TEXT_DOMAIN) . '</span>'
                . '</span>',
            'href'  => \admin_url('admin.php?page=' . Constants::MENU_SLUG . '-dash'),
            'meta'  => [
                'title' => \__('ProductBay', Constants::TEXT_DOMAIN),
            ],
        ]);

        // Add Dashboard submenu
        $wp_admin_bar->add_node([
            'id'     => Constants::MENU_SLUG . '-dash',
            'parent' => Constants::MENU_SLUG,
            'title'  => \__('Dashboard', Constants::TEXT_DOMAIN),
            'href'   => \admin_url('admin.php?page=' . Constants::MENU_SLUG . '-dash'),
        ]);

        // Add Tables submenu
        $wp_admin_bar->add_node([
            'id'     => Constants::MENU_SLUG . '-tables',
            'parent' => Constants::MENU_SLUG,
            'title'  => \__('Tables', Constants::TEXT_DOMAIN),
            'href'   => \admin_url('admin.php?page=' . Constants::MENU_SLUG . '-tables'),
        ]);

        // Add Settings submenu
        $wp_admin_bar->add_node([
            'id'     => Constants::MENU_SLUG . '-settings',
            'parent' => Constants::MENU_SLUG,
            'title'  => \__('Settings', Constants::TEXT_DOMAIN),
            'href'   => \admin_url('admin.php?page=' . Constants::MENU_SLUG . '-settings'),
        ]);

        // Add "Add New Table" submenu
        $wp_admin_bar->add_node([
            'id'     => Constants::MENU_SLUG . '-new',
            'parent' => Constants::MENU_SLUG,
            'title'  => \__('Add New Table', Constants::TEXT_DOMAIN),
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
            'apiUrl' => \rest_url(Constants::PLUGIN_SLUG . '/v1/'),
            'nonce'  => \wp_create_nonce('wp_rest'),
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
