<?php

namespace ProductBay\Frontend;

use ProductBay\Data\TableRepository;

class TableRenderer
{
    /**
     * @var TableRepository
     */
    protected $repository;

    /**
     * Initialize the renderer
     * 
     * @param TableRepository $repository
     */
    public function __construct(TableRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Initialize hooks (Shortcode)
     */
    public function init()
    {
        \add_shortcode('productbay', [$this, 'render_shortcode']);
    }

    /**
     * Render the shortcode [productbay id="123"]
     * 
     * @param array $atts Shortcode attributes
     * @return string HTML content
     */
    public function render_shortcode($atts)
    {
        $atts = \shortcode_atts([
            'id' => 0
        ], $atts);

        if (empty($atts['id'])) {
            return '';
        }

        $table = $this->repository->get_table(intval($atts['id']));
        if (!$table) {
            return ''; // Or error message
        }

        return $this->render_table_html($table);
    }

    /**
     * Render the table HTML based on configuration
     * 
     * Handles product querying, filtering, and HTML generation.
     * 
     * @param array $table Table data from repository
     * @return string HTML content
     */
    private function render_table_html($table)
    {
        $config = $table['config'] ?? [];
        $columns = $config['columns'] ?? [];

        // Default columns if empty
        if (empty($columns)) {
            $columns = [
                ['id' => 'image', 'label' => 'Image'],
                ['id' => 'name', 'label' => 'Product Name'],
                ['id' => 'price', 'label' => 'Price'],
                ['id' => 'add-to-cart', 'label' => 'Action']
            ];
        }

        // Query Products
        $args = [
            'post_type' => 'product',
            'posts_per_page' => $config['products_per_page'] ?? 10,
            'status' => 'publish'
        ];

        /**
         *  Apply Source Filter
         *  Source Types: all, specific, category, sale
         * 
         * @var string $source_type
         * @var array $config
         * 
         * **/

        // Source Type: all > select all products
        $source_type = $config['source_type'] ?? 'all';

        // Source Type: specific > select specific products
        if ($source_type === 'specific' && !empty($config['products'])) {
            $args['post__in'] = $config['products'];
        }
        // Source Type: category > select products by category
        elseif ($source_type === 'category' && !empty($config['categories'])) {
            $args['tax_query'] = [
                [
                    'taxonomy' => 'product_cat',
                    'field'    => 'term_id',
                    'terms'    => $config['categories'],
                    'operator' => 'IN',
                ],
            ];
        }
        // Source Type: sale > select products on sale
        elseif ($source_type === 'sale') {
            $sale_ids = \wc_get_product_ids_on_sale();
            if (!empty($sale_ids)) {
                $args['post__in'] = $sale_ids;
            } else {
                // Force empty result if no products are on sale
                $args['post__in'] = [0];
            }
        }

        $query = new \WP_Query($args);

        // Basic HTML Structure
        $html = '<div class="productbay-table-wrapper" id="productbay-table-' . $table['id'] . '">';
        $html .= '<table class="productbay-table">';

        // Header
        $html .= '<thead><tr>';
        foreach ($columns as $col) {
            $html .= '<th class="productbay-col-' . esc_attr($col['id']) . '">' . esc_html($col['label']) . '</th>';
        }
        $html .= '</tr></thead>';

        // Body
        $html .= '<tbody>';

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                global $product;

                $html .= '<tr>';
                foreach ($columns as $col) {
                    $html .= '<td class="productbay-col-' . esc_attr($col['id']) . '">';
                    switch ($col['id']) {
                        case 'image':
                            $html .= $product->get_image('thumbnail');
                            break;
                        case 'name':
                            $html .= '<a href="' . get_permalink() . '">' . get_the_title() . '</a>';
                            break;
                        case 'price':
                            $html .= $product->get_price_html();
                            break;
                        case 'add-to-cart':
                            $html .= '<a href="?add-to-cart=' . $product->get_id() . '" class="button productbay-btn">Add to Cart</a>';
                            break;
                        default:
                            $html .= '-';
                    }
                    $html .= '</td>';
                }
                $html .= '</tr>';
            }
            wp_reset_postdata();
        } else {
            $html .= '<tr><td colspan="' . count($columns) . '">No products found.</td></tr>';
        }

        $html .= '</tbody>';
        $html .= '</table>';
        $html .= '</div>';

        return $html;
    }
}
