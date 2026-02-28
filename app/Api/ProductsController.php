<?php

namespace WpabProductBay\Api;

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

use WpabProductBay\Http\Request;

class ProductsController extends ApiController
{

    /**
     * Initialize the controller
     * 
     * @param Request $request
     */
    public function __construct(Request $request)
    {
        parent::__construct($request);
    }

    /**
     * Search products by name, ID, or SKU.
     * 
     * Supports:
     * - search: Product name search (fuzzy match)
     * - include: Exact product ID
     * - sku: SKU exact match or prefix match
     */
    public function index()
    {
        $search = $this->request->get('search');
        $include = $this->request->get('include'); // For ID search
        $sku = $this->request->get('sku');         // For SKU search
        $limit = $this->request->get('limit', 10);
        $page = $this->request->get('page', 1);

        $is_default_search = empty($search) && empty($include) && empty($sku);

        $args = [
            'limit' => $limit,
            'page' => $page,
            'status' => 'publish',
            'orderby' => $is_default_search ? 'date' : 'title',
            'order' => $is_default_search ? 'DESC' : 'ASC',
        ];

        // Handle ID search (exact match)
        if (!empty($include)) {
            $args['include'] = [(int)$include];
            $args['limit'] = 1; // Only one product by ID
        }
        // Handle SKU search (exact or prefix match)
        elseif (!empty($sku)) {
            // Get all products and filter by SKU
            $args['limit'] = -1; // Get all to filter
            $all_products = \wc_get_products($args);
            $data = [];

            $sku_lower = strtolower($sku);

            foreach ($all_products as $product) {
                $product_sku = strtolower($product->get_sku());

                // Exact match or starts with
                if ($product_sku === $sku_lower || strpos($product_sku, $sku_lower) === 0) {
                    $data[] = [
                        'id' => $product->get_id(),
                        'name' => $product->get_name(),
                        'sku' => $product->get_sku(),
                        'price' => $product->get_price_html(),
                        'image' => \wp_get_attachment_image_url($product->get_image_id(), 'thumbnail'),
                    ];
                }
            }

            // Implement simple array pagination for the SKU manual filter result
            $offset = ($page - 1) * $limit;
            $data = array_slice($data, $offset, $limit);

            return $data;
        }
        // Handle name search (partial match)
        elseif (!empty($search)) {
            $args['s'] = $search;
        }

        $products = \wc_get_products($args);
        $data = [];

        foreach ($products as $product) {
            $data[] = [
                'id' => $product->get_id(),
                'name' => $product->get_name(),
                'sku' => $product->get_sku(),
                'price' => $product->get_price_html(),
                'image' => \wp_get_attachment_image_url($product->get_image_id(), 'thumbnail'),
            ];
        }

        return $data;
    }

    /**
     * Get all product categories.
     */
    public function categories()
    {
        $terms = \get_terms([
            'taxonomy' => 'product_cat',
            'hide_empty' => false,
        ]);

        if (\is_wp_error($terms)) {
            return [];
        }

        $data = [];
        foreach ($terms as $term) {
            $data[] = [
                'id' => $term->term_id,
                'name' => $term->name,
                'count' => $term->count,
                'slug' => $term->slug,
            ];
        }

        return $data;
    }

    /**
     * Get source statistics (category and product counts) for a given source type.
     * 
     * Supported Types:
     * - all: All published products
     * - sale: Products currently on sale (uses WC native logic)
     * 
     * @return array Statistics data with 'categories' and 'products' counts
     */
    public function sourceStats()
    {
        $type = $this->request->get('type', 'all');

        $stats = [
            'categories' => 0,
            'products' => 0
        ];

        switch ($type) {
            case 'all':
                // Count all published products
                $stats['products'] = (int) \wp_count_posts('product')->publish;

                // Count all non-empty categories
                $terms = \get_terms([
                    'taxonomy' => 'product_cat',
                    'hide_empty' => false, // Count all categories
                ]);
                $stats['categories'] = is_array($terms) ? count($terms) : 0;
                break;

            case 'sale':
                // Get products on sale using WC native function (handles dates, variations, etc.)
                $sale_ids = \wc_get_product_ids_on_sale();
                $stats['products'] = count($sale_ids);

                if (!empty($sale_ids)) {
                    // Get unique categories from sale products
                    $terms = \wp_get_object_terms($sale_ids, 'product_cat', ['fields' => 'ids']);
                    if (!is_wp_error($terms)) {
                        $stats['categories'] = count(array_unique($terms));
                    }
                }
                break;
        }

        return $stats;
    }
}
