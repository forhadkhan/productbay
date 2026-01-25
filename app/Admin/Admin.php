<?php

namespace ProductBay\Admin;

class Admin
{
    protected $repository;
    protected $request;

    public function __construct($repository, $request)
    {
        $this->repository = $repository;
        $this->request = $request;
    }

    /**
     * Add the menu page.
     */
    public function register_menu()
    {
        \add_menu_page(
            \__('ProductBay', 'productbay'),
            \__('ProductBay', 'productbay'),
            'manage_options',
            'productbay',
            [$this, 'render_app'],
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNNDggMGM4LjgzNyAwIDE2IDcuMTYzIDE2IDE2djMyYzAgOC44MzctNy4xNjMgMTYtMTYgMTZIMTZDNy4xNjMgNjQgMCA1Ni44MzcgMCA0OFYxNkMwIDcuMTYzIDcuMTYzIDAgMTYgMHpNMjEuNzU2IDEzLjQyOGE4LjUzNCA4LjUzNCAwIDAgMC04LjUzMyA4LjUzM3YyMC4yNjdhOC41MzMgOC41MzMgMCAwIDAgOC41MzMgOC41MzNoMjAuMjY3YTguNTMzIDguNTMzIDAgMCAwIDguNTMzLTguNTM0VjIxLjk2MmE4LjUzNCA4LjUzNCAwIDAgMC04LjUzMy04LjUzM3ptMy4yMDMgMTcuNnYxNS40NjZoLTMuMjAzYTQuMjY3IDQuMjY3IDAgMCAxLTQuMjY3LTQuMjY3di0xMS4yem0yMS4zMyAwdjExLjJhNC4yNjcgNC4yNjcgMCAwIDEtNC4yNjcgNC4yNjZIMjkuMjI3VjMxLjAyN3pNMjQuOTYgMTcuNjkzdjkuMDY3aC03LjQ3di00LjhhNC4yNjcgNC4yNjcgMCAwIDEgNC4yNjctNC4yNjd6bTE3LjA2NCAwYTQuMjY3IDQuMjY3IDAgMCAxIDQuMjY2IDQuMjY3djQuOEgyOS4yMjZ2LTkuMDY3eiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==',
            58
        );

        // Submenus
        \add_submenu_page(
            'productbay',
            \__('Dashboard', 'productbay'),
            \__('Dashboard', 'productbay'),
            'manage_options',
            'productbay',
            [$this, 'render_app']
        );

        \add_submenu_page(
            'productbay',
            \__('Tables', 'productbay'),
            \__('Tables', 'productbay'),
            'manage_options',
            'productbay-tables',
            [$this, 'render_app']
        );

        \add_submenu_page(
            'productbay',
            \__('Settings', 'productbay'),
            \__('Settings', 'productbay'),
            'manage_options',
            'productbay-settings',
            [$this, 'render_app']
        );

        \add_submenu_page(
            'productbay',
            \__('Add New Table', 'productbay'),
            \__('Add New Table', 'productbay'),
            'manage_options',
            'productbay-new',
            [$this, 'render_app']
        );
    }

    /**
     * Render the React Root Div.
     */
    public function render_app()
    {
        echo '<div id="productbay-root" class="productbay-wrapper"></div>';
    }

    /**
     * Load the React App.
     */
    public function enqueue_scripts($hook)
    {
        // Allow loading on any productbay page
        if (strpos($hook, 'page_productbay') === false && $hook !== 'toplevel_page_productbay') {
            return;
        }

        // Auto-generated asset file from webpack build
        $asset_path = PRODUCTBAY_PATH . 'assets/js/admin.asset.php';

        if (! file_exists($asset_path)) {
            return;
        }

        $asset = include $asset_path;

        \wp_enqueue_script(
            'productbay-admin',
            PRODUCTBAY_URL . 'assets/js/admin.js',
            $asset['dependencies'],
            $asset['version'],
            true
        );

        // Pass PHP data to React
        \wp_localize_script('productbay-admin', 'productBaySettings', [
            'apiUrl' => \rest_url('productbay/v1/'),
            'nonce'  => \wp_create_nonce('wp_rest'),
        ]);

        // Enqueue styles
        \wp_enqueue_style(
            'productbay-admin-css',
            PRODUCTBAY_URL . 'assets/css/admin.css',
            [],
            PRODUCTBAY_VERSION
        );

        // Load translations
        \wp_set_script_translations('productbay-admin', 'productbay', PRODUCTBAY_PATH . 'languages');
    }
}
