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

        // Only render published tables on the frontend.
        if ($table['status'] !== 'publish') {
            // Show a helpful notice to admins so they know why the table isn't rendering.
            if (current_user_can('manage_options')) {
                return '<p style="padding:12px 16px;background:#fef3cd;border:1px solid #e9b006ff;border-radius:4px;color:#664d03;font-size:14px;">'
                    . sprintf(
                        /* translators: %s: table title */
                        esc_html__('ProductBay: Table "%s" is currently private. It will appear here once it is published.', 'productbay'),
                        esc_html($table['title'])
                    )
                    . '</p>';
            }
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
