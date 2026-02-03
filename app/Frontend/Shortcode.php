<?php

namespace WpabProductBay\Frontend;

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Shortcode
 *
 * Handles the registration and rendering of proper shortcodes.
 *
 * @package WpabProductBay\Frontend
 */
class Shortcode
{
    /**
     * Initialize the shortcode.
     */
    public function init()
    {
        add_shortcode('product_table', [$this, 'render_product_table']);
    }

    /**
     * Render the product table shortcode.
     *
     * @param array $atts Shortcode attributes.
     * @return string
     */
    public function render_product_table($atts)
    {
        return '<div class="productbay-table-placeholder">Product Table Placeholder</div>';
    }
}
