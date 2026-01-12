<?php

namespace ProductBay\Frontend;

use ProductBay\Data\TableRepository;

class TableRenderer
{
    protected $repository;

    public function __construct(TableRepository $repository)
    {
        $this->repository = $repository;
    }

    public function init()
    {
        \add_shortcode('productbay', [$this, 'render_shortcode']);
    }

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

        // Apply Source Filter
        if (($config['source_type'] ?? 'all') === 'specific' && !empty($config['specific_products'])) {
            $args['post__in'] = $config['specific_products'];
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
