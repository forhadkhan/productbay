<?php

namespace WpabProductBay\Frontend;

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

use WpabProductBay\Data\TableRepository;
use WpabProductBay\Http\Request;

class AjaxRenderer
{
    protected $repository;
    protected $request;

    public function __construct(TableRepository $repository, Request $request)
    {
        $this->repository = $repository;
        $this->request = $request;
    }

    public function init()
    {
        \add_action('wp_ajax_productbay_filter', [$this, 'handle_filter']);
        \add_action('wp_ajax_nopriv_productbay_filter', [$this, 'handle_filter']);

        \add_action('wp_ajax_productbay_bulk_add_to_cart', [$this, 'handle_bulk_add_to_cart']);
        \add_action('wp_ajax_nopriv_productbay_bulk_add_to_cart', [$this, 'handle_bulk_add_to_cart']);
    }

    public function handle_filter()
    {
        if (!check_ajax_referer('productbay_frontend', 'nonce', false)) {
            \wp_send_json_error(['message' => 'Invalid nonce']);
        }

        $table_id = intval($_POST['table_id'] ?? 0);
        $s = sanitize_text_field($_POST['s'] ?? '');
        $paged = intval($_POST['paged'] ?? 1);

        if (!$table_id) {
            \wp_send_json_error(['message' => 'Invalid table ID']);
        }

        $table = $this->repository->get_table($table_id);
        if (!$table) {
            \wp_send_json_error(['message' => 'Table not found']);
        }

        // Initialize renderer
        $renderer = new TableRenderer($this->repository);

        $response = $renderer->render_ajax_response($table, [
            's' => $s,
            'paged' => $paged,
        ]);

        \wp_send_json_success($response);
    }

    public function handle_bulk_add_to_cart()
    {
        if (!check_ajax_referer('productbay_frontend', 'nonce', false)) {
            \wp_send_json_error(['message' => 'Invalid nonce']);
        }

        $product_ids = $_POST['product_ids'] ?? [];
        if (empty($product_ids) || !is_array($product_ids)) {
            \wp_send_json_error(['message' => 'No products selected']);
        }

        $added_count = 0;
        foreach ($product_ids as $id) {
            $id = intval($id);
            if ($id && \wc_get_product($id)) {
                // Add to cart with default processing
                try {
                    $added = \WC()->cart->add_to_cart($id);
                    if ($added) {
                        $added_count++;
                    }
                } catch (\Exception $e) {
                    // Ignore errors for individual items, try to continue
                }
            }
        }

        if ($added_count > 0) {
            \wp_send_json_success(['message' => sprintf(__('%d products added to cart', 'productbay'), $added_count)]);
        } else {
            \wp_send_json_error(['message' => __('Failed to add products to cart', 'productbay')]);
        }
    }
}
