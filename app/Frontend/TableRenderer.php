<?php

namespace WpabProductBay\Frontend;

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

use WpabProductBay\Data\TableRepository;

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
        // Registration is done in Plugin.php, but if we need hooks specific to renderer
    }

    /**
     * Render the table HTML based on configuration
     * 
     * Handles product querying, filtering, and HTML generation.
     * Use public access to allow calling from PreviewController and Shortcode.
     * 
     * @param array $table Full table configuration matching ProductTable interface
     * @param array $runtime_args Runtime arguments (search, sort, paged)
     * @return string HTML content
     */
    public function render($table, $runtime_args = [])
    {
        // Ensure we have a valid table structure
        $table_id = $table['id'] ?? 0;

        // Generate a unique ID for this render instance (handling multiple tables per page)
        $unique_id = 'productbay-table-' . ($table_id ?: 'preview-' . mt_rand(1000, 9999));

        $source = $table['source'] ?? [];
        $columns = $table['columns'] ?? [];
        $settings = $table['settings'] ?? [];
        $style = $table['style'] ?? [];

        // 1. Prepare Query Arguments
        $args = $this->build_query_args($source, $settings, $runtime_args);

        // 2. Execute Query
        $query = new \WP_Query($args);

        // 3. Generate Styles
        $css = $this->generate_styles($unique_id, $style, $columns);

        // 4. Build HTML
        ob_start();

        // Output Styles
        echo "<style>{$css}</style>";

        echo '<div class="productbay-wrapper" id="' . esc_attr($unique_id) . '" data-table-id="' . esc_attr($table_id) . '">';

        // Toolbar: Bulk Actions + Search
        echo '<div class="productbay-toolbar">';

        // Bulk Actions
        echo '<div class="productbay-bulk-actions">';
        echo '<button class="productbay-btn-bulk" disabled>';
        echo '<span class="dashicons dashicons-cart"></span> ' . __('Add to Cart', 'productbay');
        echo '</button>';
        echo '</div>';

        // Search & Filter Bar (if enabled)
        if (!empty($settings['features']['search'])) {
            $this->render_search_bar($settings, $runtime_args['s'] ?? '');
        }

        echo '</div>'; // End Toolbar

        echo '<div class="productbay-table-container">';
        echo '<table class="productbay-table">';

        // Table Header
        echo '<thead><tr>';



        foreach ($columns as $col) {
            // Check visibility
            if ($this->should_hide_column($col)) continue;

            $th_classes = $this->get_column_classes($col);
            $th_style = $this->get_column_styles($col);

            echo '<th class="' . esc_attr(implode(' ', $th_classes)) . '" style="' . esc_attr($th_style) . '">';
            if ($col['type'] === 'checkbox') {
                echo '<input type="checkbox" class="productbay-select-all" />';
            } elseif (!empty($col['advanced']['showHeading'])) {
                echo esc_html($col['heading']);
            }
            echo '</th>';
        }
        echo '</tr></thead>';

        // Table Body
        echo '<tbody>';

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                global $product;

                // Ensure global product is set (for WC functions)
                if (!is_object($product)) {
                    $product = wc_get_product(get_the_ID());
                }

                echo '<tr>';


                foreach ($columns as $col) {
                    if ($this->should_hide_column($col)) continue;

                    $td_classes = $this->get_column_classes($col);

                    echo '<td class="' . esc_attr(implode(' ', $td_classes)) . '">';
                    $this->render_cell($col, $product);
                    echo '</td>';
                }
                echo '</tr>';
            }
            wp_reset_postdata();
        } else {
            $colspan = count(array_filter($columns, function ($c) {
                return !$this->should_hide_column($c);
            })); // Checkbox is now a normal column
            echo '<tr><td colspan="' . $colspan . '" class="productbay-empty">' . __('No products found.', 'productbay') . '</td></tr>';
        }

        echo '</tbody>';
        echo '</table>';
        echo '</div>'; // .productbay-table-container

        // Pagination (if enabled)
        if (!empty($settings['features']['pagination'])) {
            $this->render_pagination($query, $settings);
        }

        echo '</div>'; // .productbay-wrapper

        return ob_get_clean();
    }

    /**
     * Build WP_Query arguments from source configuration
     */
    private function build_query_args($source, $settings, $runtime_args = [])
    {
        $args = [
            'post_type' => 'product',
            'post_status' => 'publish',
            'posts_per_page' => $settings['pagination']['limit'] ?? 10,
            'orderby' => $source['sort']['orderBy'] ?? 'date',
            'order' => $source['sort']['order'] ?? 'DESC',
        ];

        // Ensure proper paging
        // TODO: Handle 'paged' query var for frontend pagination
        $paged = $runtime_args['paged'] ?? ((get_query_var('paged')) ? get_query_var('paged') : 1);
        $args['paged'] = $paged;

        // Handle Search
        if (!empty($runtime_args['s'])) {
            $args['s'] = sanitize_text_field($runtime_args['s']);
        }

        $source_type = $source['type'] ?? 'all';
        $query_args = $source['queryArgs'] ?? [];

        switch ($source_type) {
            case 'specific':
                if (!empty($query_args['postIds'])) {
                    $args['post__in'] = $query_args['postIds'];
                    $args['orderby'] = 'post__in'; // Preserve specific order
                } else {
                    // No products selected
                    $args['post__in'] = [0];
                }
                break;

            case 'category':
                if (!empty($query_args['categoryIds'])) {
                    $args['tax_query'] = [
                        [
                            'taxonomy' => 'product_cat',
                            'field'    => 'term_id',
                            'terms'    => $query_args['categoryIds'],
                            'operator' => 'IN',
                        ],
                    ];
                }
                break;

            case 'sale':
                $sale_ids = \wc_get_product_ids_on_sale();
                $args['post__in'] = !empty($sale_ids) ? $sale_ids : [0];
                break;
        }

        // Handle Excludes
        if (!empty($query_args['excludes'])) {
            $args['post__not_in'] = $query_args['excludes'];
        }

        // Handle Stock Status
        $stock_status = $query_args['stockStatus'] ?? 'any';
        if ($stock_status !== 'any') {
            $args['meta_query'][] = [
                'key' => '_stock_status',
                'value' => $stock_status,
            ];
        }

        // Handle Price Range
        if (isset($query_args['priceRange']['min']) || isset($query_args['priceRange']['max'])) {
            $min = $query_args['priceRange']['min'] ?? 0;
            $max = $query_args['priceRange']['max'];

            $price_query = [
                'key' => '_price',
                'value' => [$min, $max ?: 999999999], // Handle null max
                'compare' => 'BETWEEN',
                'type' => 'NUMERIC'
            ];

            $args['meta_query'][] = $price_query;
        }

        return $args;
    }

    /**
     * Render a single cell content
     */
    private function render_cell($col, $product)
    {
        $type = $col['type'];
        $settings = $col['settings'] ?? [];

        switch ($type) {
            case 'checkbox':
                echo '<input type="checkbox" class="productbay-select-product" value="' . esc_attr($product->get_id()) . '" data-price="' . esc_attr($product->get_price()) . '" />';
                break;

            case 'image':
                $size = $settings['imageSize'] ?? 'thumbnail';
                $img = $product->get_image($size);
                if (($settings['linkTarget'] ?? '') === 'product') {
                    echo '<a href="' . esc_url($product->get_permalink()) . '">' . $img . '</a>';
                } else {
                    echo $img;
                }
                break;

            case 'name':
                echo '<a href="' . esc_url($product->get_permalink()) . '" class="productbay-product-title">' . esc_html($product->get_name()) . '</a>';
                break;

            case 'price':
                echo $product->get_price_html();
                break;

            case 'sku':
                echo esc_html($product->get_sku());
                break;

            case 'stock':
                // Custom stock HTML
                echo wc_get_stock_html($product);
                break;

            case 'button':
                // Use WooCommerce template for add to cart button
                woocommerce_template_loop_add_to_cart();
                break;

            case 'summary':
                echo wp_trim_words($product->get_short_description(), 10);
                break;

            default:
                echo '';
        }
    }

    /**
     * Generate CSS based on Style configuration
     */
    private function generate_styles($id, $style, $columns)
    {
        $css = "";
        $header = $style['header'] ?? [];
        $body = $style['body'] ?? [];
        $button = $style['button'] ?? [];
        $layout = $style['layout'] ?? [];
        $hover = $style['hover'] ?? [];

        // Header Styles
        $css .= "#{$id} .productbay-table thead th {";
        if (!empty($header['bgColor'])) $css .= "background-color: {$header['bgColor']};";
        if (!empty($header['textColor'])) $css .= "color: {$header['textColor']};";
        if (!empty($header['fontSize'])) $css .= "font-size: {$header['fontSize']};";
        $css .= "}";

        // Body Styles
        $css .= "#{$id} .productbay-table tbody td {";
        if (!empty($body['bgColor'])) $css .= "background-color: {$body['bgColor']};";
        if (!empty($body['textColor'])) $css .= "color: {$body['textColor']};";
        if (!empty($layout['borderColor'])) $css .= "border-color: {$layout['borderColor']};";
        $css .= "}";

        // Alternate Rows
        if (!empty($body['rowAlternate'])) {
            $css .= "#{$id} .productbay-table tbody tr:nth-child(even) td {";
            if (!empty($body['altBgColor'])) $css .= "background-color: {$body['altBgColor']};";
            if (!empty($body['altTextColor'])) $css .= "color: {$body['altTextColor']};";
            $css .= "}";
        }

        // Hover Effect
        if (!empty($hover['rowHoverEnabled'])) {
            $css .= "#{$id} .productbay-table tbody tr:hover td {";
            if (!empty($hover['rowHoverBgColor'])) $css .= "background-color: {$hover['rowHoverBgColor']};";
            $css .= "}";
        }

        // Button Styles via class override
        $css .= "#{$id} .productbay-table .button, #{$id} .productbay-table .added_to_cart {";
        if (!empty($button['bgColor'])) $css .= "background-color: {$button['bgColor']} !important;";
        if (!empty($button['textColor'])) $css .= "color: {$button['textColor']} !important;";
        if (!empty($button['borderRadius'])) $css .= "border-radius: {$button['borderRadius']};";
        $css .= "}";

        $css .= "#{$id} .productbay-table .button:hover {";
        if (!empty($button['hoverBgColor'])) $css .= "background-color: {$button['hoverBgColor']} !important;";
        if (!empty($button['hoverTextColor'])) $css .= "color: {$button['hoverTextColor']} !important;";
        $css .= "}";

        // Image Styles
        $css .= "#{$id} img {";
        $css .= "max-width: 100%;";
        $css .= "height: auto;";
        $css .= "display: block;";
        $css .= "padding: 2px;";
        $css .= "border-radius: 3px;";
        $css .= "}";

        // Column Widths
        foreach ($columns as $col) {
            $width = $col['advanced']['width'] ?? ['value' => 0, 'unit' => 'auto'];
            if ($width['value'] > 0 && $width['unit'] !== 'auto') {
                $css .= "#{$id} .productbay-col-" . esc_attr($col['id']) . " { width: {$width['value']}{$width['unit']}; }";
            }
        }

        return $css;
    }

    private function should_hide_column($col)
    {
        return ($col['advanced']['visibility'] ?? 'default') === 'none';
        // Note: For device-specific hiding, we usually add classes like 'hidden md:block'.
        // Since we are not using Tailwind on frontend output necessarily, we might rely on media queries 
        // generated in generate_styles or use utility classes if the theme supports them.
        // For now, implementing 'none'.
    }

    private function get_column_classes($col)
    {
        $classes = ['productbay-col-' . $col['id']];
        if ($col['type'] === 'checkbox') {
            $classes[] = 'productbay-col-select';
        }
        return $classes;
    }

    private function get_column_styles($col)
    {
        return '';
    }

    private function render_search_bar($settings, $value = '')
    {
        // Placeholder for search input
        // Placeholder for search input
        echo '<div class="productbay-search ' . (!empty($value) ? 'has-value' : '') . '">';
        echo '<input type="text" value="' . esc_attr($value) . '" placeholder="' . __('Search products...', 'productbay') . '" />';
        echo '<span class="dashicons dashicons-dismiss productbay-search-clear" title="' . __('Clear', 'productbay') . '"></span>';
        echo '</div>';
    }

    private function render_pagination($query, $settings)
    {
        $paged = (get_query_var('paged')) ? get_query_var('paged') : 1;
        // Override paged if passed in query args (for AJAX)
        if (!empty($query->query['paged'])) {
            $paged = $query->query['paged'];
        }

        $total = $query->max_num_pages;

        if ($total > 1) {
            echo '<div class="productbay-pagination">';
            echo paginate_links([
                'base' => str_replace(999999999, '%#%', esc_url(get_pagenum_link(999999999))),
                'format' => '?paged=%#%',
                'current' => max(1, $paged),
                'total' => $total,
                'prev_text' => '&laquo;',
                'next_text' => '&raquo;',
            ]);
            echo '</div>';
        }
    }

    /**
     * Render AJAX response (rows and pagination)
     * 
     * @param array $table
     * @param array $runtime_args
     * @return array
     */
    public function render_ajax_response($table, $runtime_args)
    {
        $source = $table['source'] ?? [];
        $columns = $table['columns'] ?? [];
        $settings = $table['settings'] ?? [];

        $args = $this->build_query_args($source, $settings, $runtime_args);
        $query = new \WP_Query($args);

        ob_start();
        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                global $product;
                if (!is_object($product)) {
                    $product = \wc_get_product(get_the_ID());
                }

                echo '<tr>';


                foreach ($columns as $col) {
                    if ($this->should_hide_column($col)) continue;
                    $td_classes = $this->get_column_classes($col);
                    echo '<td class="' . esc_attr(implode(' ', $td_classes)) . '">';
                    $this->render_cell($col, $product);
                    echo '</td>';
                }
                echo '</tr>';
            }
            wp_reset_postdata();
        } else {
            $colspan = count(array_filter($columns, function ($c) {
                return !$this->should_hide_column($c);
            }));
            echo '<tr><td colspan="' . $colspan . '" class="productbay-empty">' . __('No products found.', 'productbay') . '</td></tr>';
        }
        $rows = ob_get_clean();

        ob_start();
        if (!empty($settings['features']['pagination'])) {
            $this->render_pagination($query, $settings);
        }
        $pagination = ob_get_clean();

        return [
            'html' => $rows,
            'pagination' => $pagination,
        ];
    }
}
