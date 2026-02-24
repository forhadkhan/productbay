<?php

namespace WpabProductBay\Frontend;

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

use WpabProductBay\Data\TableRepository;

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
     * @var TableRepository
     */
    protected $repository;

    /**
     * @param TableRepository $repository
     */
    public function __construct(TableRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Initialize the shortcode.
     */
    public function init()
    {
        add_shortcode('productbay', [$this, 'render_product_table']);
    }

    /**
     * Render the product table shortcode.
     *
     * @param array $atts Shortcode attributes.
     * @return string
     */
    public function render_product_table($atts)
    {
        $this->enqueue_assets();

        $atts = shortcode_atts([
            'id' => 0,
        ], $atts, 'productbay');

        $table_id = intval($atts['id']);

        if (!$table_id) {
            return '';
        }

        $table = $this->repository->get_table($table_id);

        if (!$table) {
            return '';
        }

        // Instantiate renderer (or inject if we refactor Plugin.php)
        $renderer = new TableRenderer($this->repository);
        return $renderer->render($table);
    }

    /**
     * Enqueue frontend assets.
     */
    private function enqueue_assets()
    {
        $css_file = PRODUCTBAY_PATH . 'assets/css/frontend.css';
        $css_ver  = file_exists($css_file) ? filemtime($css_file) : PRODUCTBAY_VERSION;

        \wp_enqueue_style(
            'productbay-frontend',
            PRODUCTBAY_URL . 'assets/css/frontend.css',
            [],
            $css_ver
        );

        \wp_enqueue_script(
            'productbay-frontend',
            PRODUCTBAY_URL . 'assets/js/frontend.js',
            ['jquery'],
            PRODUCTBAY_VERSION,
            true
        );

        \wp_localize_script('productbay-frontend', 'productbay_frontend', [
            'ajaxurl' => \admin_url('admin-ajax.php'),
            'nonce' => \wp_create_nonce('productbay_frontend'),
            'cart_url' => wc_get_cart_url(),
            'view_cart_text' => __('View cart', 'productbay'),
            'currency_symbol' => get_woocommerce_currency_symbol(),
            'currency_position' => get_option('woocommerce_currency_pos', 'left'),
            'currency_decimals' => absint(get_option('woocommerce_price_num_decimals', 2)),
            'currency_decimal_sep' => wc_get_price_decimal_separator(),
            'currency_thousand_sep' => wc_get_price_thousand_separator(),
        ]);
    }
}
