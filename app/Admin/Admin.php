<?php
namespace ProductBay\Admin;

class Admin {
    /**
     * Add the menu page.
     */
    public function register_menu() {
        add_menu_page(
            __( 'ProductBay', 'productbay' ),
            __( 'ProductBay', 'productbay' ),
            'manage_options',
            'productbay',
            [ $this, 'render_app' ],
            'dashicons-grid-view',
            58
        );
    }

    /**
     * Render the React Root Div.
     */
    public function render_app() {
        echo '<div id="productbay-root" class="productbay-wrapper"></div>';
    }

    /**
     * Load the React App.
     */
    public function enqueue_scripts( $hook ) {
        // Only load on our plugin page
        if ( 'toplevel_page_productbay' !== $hook ) {
            return;
        }

        // Auto-generated asset file from webpack build
        $asset_path = PRODUCTBAY_PATH . 'assets/js/admin.asset.php';
        
        if ( ! file_exists( $asset_path ) ) {
            return;
        }

        $asset = include $asset_path;

        wp_enqueue_script(
            'productbay-admin',
            PRODUCTBAY_URL . 'assets/js/admin.js',
            $asset['dependencies'],
            $asset['version'],
            true
        );

        // Pass PHP data to React
        wp_localize_script( 'productbay-admin', 'productBaySettings', [
            'apiUrl' => rest_url( 'productbay/v1/' ),
            'nonce'  => wp_create_nonce( 'wp_rest' ),
        ]);

        // Enqueue styles
        wp_enqueue_style(
            'productbay-admin-css',
            PRODUCTBAY_URL . 'assets/css/admin.css',
            [],
            PRODUCTBAY_VERSION
        );

        // Load translations
        wp_set_script_translations( 'productbay-admin', 'productbay', PRODUCTBAY_PATH . 'languages' );
    }
}
