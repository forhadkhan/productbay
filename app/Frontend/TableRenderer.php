<?php
/**
 * Server-side HTML/CSS renderer for product tables.
 *
 * @package ProductBay
 */

declare(strict_types=1);

namespace WpabProductBay\Frontend;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use WpabProductBay\Data\TableRepository;

/**
 * Class TableRenderer
 *
 * Renders product tables on the frontend using WP_Query.
 * Generates HTML markup and scoped CSS from table configuration.
 *
 * @since   1.0.0
 * @package ProductBay
 */
class TableRenderer {

	/**
	 * Repository for table data access.
	 *
	 * @var TableRepository
	 * @since 1.0.0
	 */
	protected $repository;

	/**
	 * Cart settings for the current render context.
	 *
	 * @var array
	 * @since 1.0.0
	 */
	protected $cart_settings = array(
		'enable'       => true,
		'showQuantity' => true,
	);

	/**
	 * Initialize the renderer.
	 *
	 * @param TableRepository $repository Table repository instance.
	 * @since 1.0.0
	 */
	public function __construct( TableRepository $repository ) {
		$this->repository = $repository;
	}

	/**
	 * Initialize hooks (Shortcode).
	 *
	 * @since 1.0.0
	 */
	public function init() {
		// Registration is done in Plugin.php, but if we need hooks specific to renderer.
	}

	/**
	 * Render the table HTML based on configuration
	 *
	 * Handles product querying, filtering, and HTML generation.
	 * Use public access to allow calling from PreviewController and Shortcode.
	 *
	 * @param array $table        Full table configuration matching ProductTable interface.
	 * @param array $runtime_args Runtime arguments (search, sort, paged).
	 * @return string HTML content
	 * @since 1.0.0
	 */
	public function render( $table, $runtime_args = array() ) {
		// Ensure we have a valid table structure.
		$table_id = $table['id'] ?? 0;

		// Generate a unique ID for this render instance (handling multiple tables per page).
		$unique_id = 'productbay-table-' . ( $table_id ?: 'preview-' . wp_rand( 1000, 9999 ) );

		$source   = $table['source'] ?? array();
		$columns  = $table['columns'] ?? array();
		$settings = $table['settings'] ?? array();
		$style    = $table['style'] ?? array();

		// Store cart settings for use in render methods.
		$this->cart_settings = wp_parse_args(
			$settings['cart'] ?? array(),
			array(
				'enable'       => true,
				'showQuantity' => true,
			)
		);

		// 1. Prepare Query Arguments.
		$args = $this->build_query_args( $source, $settings, $runtime_args );

		// 2. Execute Query.
		$query = new \WP_Query( $args );

		// 3. Generate Styles.
		$css = $this->generate_styles( $unique_id, $style, $columns, $settings );

		// 4. Build HTML.
		ob_start();

		// Output Styles.
        // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS is generated internally by generate_styles(), not user input
		echo '<style>' . wp_strip_all_tags( $css ) . '</style>';

		// Bulk select configuration (used throughout the render).
		$bulk_select   = $settings['features']['bulkSelect'] ?? array(
			'enabled'  => true,
			'position' => 'last',
			'width'    => array(
				'value' => 64,
				'unit'  => 'px',
			),
		);
		$bulk_position = $bulk_select['position'] ?? 'last';
		echo '<div class="productbay-wrapper" id="' . esc_attr( $unique_id ) . '" data-table-id="' . esc_attr( $table_id ) . '" data-select-position="' . esc_attr( $bulk_position ) . '">';

		// Toolbar: Bulk Actions + Search.
		echo '<div class="productbay-toolbar">';

		// Bulk Actions (Add to Cart Button).
		if ( $bulk_select['enabled'] ) {
			echo '<div class="productbay-bulk-actions">';
			echo '<button class="productbay-button productbay-btn-bulk" disabled>';
			echo '<svg class="productbay-icon-cart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> ';
			echo esc_html__( 'Add to Cart', 'productbay' );
			echo '</button>';
			echo '</div>'; // End .productbay-bulk-actions.
		}

		// Search & Filter Bar (if enabled).
		if ( ! empty( $settings['features']['search'] ) ) {
			$this->render_search_bar( $settings, $runtime_args['s'] ?? '' );
		}

		echo '</div>'; // End Toolbar.

		echo '<div class="productbay-table-container">';
		echo '<table class="productbay-table">';

		// Table Header.
		echo '<thead><tr>';

		// Select All Column (Bulk Select - First).
		if ( $bulk_select['enabled'] && $bulk_position === 'first' ) {
			echo '<th class="productbay-col-select"><input type="checkbox" class="productbay-select-all" /></th>';
		}

		foreach ( $columns as $col ) {
			// Check visibility.
			if ( $this->should_hide_column( $col ) ) {
				continue;
			}

			$th_classes = $this->get_column_classes( $col );
			$th_style   = $this->get_column_styles( $col );

			echo '<th class="' . esc_attr( implode( ' ', $th_classes ) ) . '" style="' . esc_attr( $th_style ) . '">';
			if ( ! empty( $col['advanced']['showHeading'] ) ) {
				echo esc_html( $col['heading'] );
			}
			echo '</th>';
		}

		// Bulk Select - Last Position.
		if ( $bulk_select['enabled'] && $bulk_position === 'last' ) {
			echo '<th class="productbay-col-select"><input type="checkbox" class="productbay-select-all" /></th>';
		}

		echo '</tr></thead>';

		// Table Body.
		echo '<tbody>';

		if ( $query->have_posts() ) {
			while ( $query->have_posts() ) {
				$query->the_post();
                // phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- WooCommerce global
				global $product;

				// Ensure global product is set (for WC functions).
				if ( ! is_object( $product ) ) {
					$product = wc_get_product( get_the_ID() );
				}
                // phpcs:enable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound

				$product_type = $product->get_type();
				$in_stock     = $product->is_in_stock() ? '1' : '0';
				echo '<tr data-product-type="' . esc_attr( $product_type ) . '" data-product-id="' . esc_attr( $product->get_id() ) . '" data-in-stock="' . esc_attr( $in_stock ) . '">';

				// Bulk Select - First Position.
				if ( $bulk_select['enabled'] && ( $bulk_select['position'] ?? 'last' ) === 'first' ) {
					$can_select = $product->is_in_stock() && ! $product->is_type( 'external' ) && ! $product->is_type( 'grouped' ) && ! $product->is_type( 'variable' ) && $product->is_purchasable();
					echo '<td class="productbay-col-select">';
					echo '<input type="checkbox" class="productbay-select-product" value="' . esc_attr( $product->get_id() ) . '" data-price="' . esc_attr( $product->get_price() ) . '"' . ( $can_select ? '' : ' disabled' ) . ' />';
					echo '</td>';
				}

				foreach ( $columns as $col ) {
					if ( $this->should_hide_column( $col ) ) {
						continue;
					}

					$td_classes = $this->get_column_classes( $col );

					echo '<td class="' . esc_attr( implode( ' ', $td_classes ) ) . '">';
					$this->render_cell( $col, $product );
					echo '</td>';
				}

				// Bulk Select - Last Position.
				if ( $bulk_select['enabled'] && ( $bulk_select['position'] ?? 'last' ) === 'last' ) {
					$can_select = $product->is_in_stock() && ! $product->is_type( 'external' ) && ! $product->is_type( 'grouped' ) && ! $product->is_type( 'variable' ) && $product->is_purchasable();
					echo '<td class="productbay-col-select">';
					echo '<input type="checkbox" class="productbay-select-product" value="' . esc_attr( $product->get_id() ) . '" data-price="' . esc_attr( $product->get_price() ) . '"' . ( $can_select ? '' : ' disabled' ) . ' />';
					echo '</td>';
				}

				echo '</tr>';
			}
			wp_reset_postdata();
		} else {
			$colspan = count(
				array_filter(
					$columns,
					function ( $c ) {
						return ! $this->should_hide_column( $c );
					}
				)
			);

			// Add +1 if bulk select enabled.
			if ( $bulk_select['enabled'] ?? true ) {
				++$colspan;
			}
			echo '<tr><td colspan="' . intval( $colspan ) . '" class="productbay-empty">' . esc_html__( 'No products found.', 'productbay' ) . '</td></tr>';
		}

		echo '</tbody>';
		echo '</table>';
		echo '</div>'; // End .productbay-table-container.

		// Pagination (if enabled).
		if ( ! empty( $settings['features']['pagination'] ) ) {
			$this->render_pagination( $query, $settings, $runtime_args );
		}

		echo '</div>'; // .productbay-wrapper.

		return ob_get_clean();
	}

	/**
	 * Build WP_Query arguments from source configuration.
	 *
	 * @param array $source       Source configuration (categories, products, etc.).
	 * @param array $settings     Table settings (pagination, features).
	 * @param array $runtime_args Runtime arguments (paged, search, sort).
	 * @return array WP_Query arguments.
	 * @since 1.0.0
	 */
	private function build_query_args( $source, $settings, $runtime_args = array() ) {
		$args = array(
			'post_type'      => 'product',
			'post_status'    => 'publish',
			'posts_per_page' => $settings['pagination']['limit'] ?? 10,
			'orderby'        => $source['sort']['orderBy'] ?? 'date',
			'order'          => $source['sort']['order'] ?? 'DESC',
		);

		// Ensure proper paging is set.
		// TODO: Handle 'paged' query var for frontend pagination.
		$paged         = $runtime_args['paged'] ?? ( ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1 );
		$args['paged'] = $paged;

		// Handle Search.
		if ( ! empty( $runtime_args['s'] ) ) {
			$args['s'] = sanitize_text_field( $runtime_args['s'] );
		}

		$source_type = $source['type'] ?? 'all';
		$query_args  = $source['queryArgs'] ?? array();

		switch ( $source_type ) {
			case 'specific':
				if ( ! empty( $query_args['postIds'] ) ) {
					$args['post__in'] = $query_args['postIds'];
					$args['orderby']  = 'post__in'; // Preserve specific order.
				} else {
					// No products selected.
					$args['post__in'] = array( 0 );
				}
				break;

			case 'category':
				if ( ! empty( $query_args['categoryIds'] ) ) {
					$args['tax_query'] = array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query -- Required for category filtering
						array(
							'taxonomy' => 'product_cat',
							'field'    => 'term_id',
							'terms'    => $query_args['categoryIds'],
							'operator' => 'IN',
						),
					);
				} else {
					// No categories selected, return no products.
					$args['post__in'] = array( 0 );
				}
				break;

			case 'sale':
				$sale_ids         = \wc_get_product_ids_on_sale();
				$args['post__in'] = ! empty( $sale_ids ) ? $sale_ids : array( 0 );
				break;
		}

		// Handle Excludes.
		if ( ! empty( $query_args['excludes'] ) ) {
			$args['post__not_in'] = $query_args['excludes']; // phpcs:ignore WordPressVIPMinimum.Performance.WPQueryParams.PostNotIn_post__not_in -- Required for product exclusion
		}

		// Handle Stock Status.
		$stock_status = $query_args['stockStatus'] ?? 'any';
		if ( $stock_status !== 'any' ) {
			$args['meta_query'][] = array(
				'key'   => '_stock_status',
				'value' => $stock_status,
			);
		}

		// Handle Price Range.
		if ( isset( $query_args['priceRange']['min'] ) || isset( $query_args['priceRange']['max'] ) ) {
			$min = $query_args['priceRange']['min'] ?? 0;
			$max = $query_args['priceRange']['max'];

			$price_query = array(
				'key'     => '_price',
				'value'   => array( $min, $max ?: 999999999 ), // Handle null max.
				'compare' => 'BETWEEN',
				'type'    => 'NUMERIC',
			);

			$args['meta_query'][] = $price_query;
		}

		return $args;
	}

	/**
	 * Render a single cell content.
	 *
	 * @param array       $col     Column configuration.
	 * @param \WC_Product $product WooCommerce product object.
	 * @since 1.0.0
	 */
	private function render_cell( $col, $product ) {
		$type     = $col['type'];
		$settings = $col['settings'] ?? array();

		switch ( $type ) {

			case 'image':
				$size = $settings['imageSize'] ?? 'thumbnail';
				$img  = $product->get_image( $size );
				if ( ( $settings['linkTarget'] ?? '' ) === 'product' ) {
					echo '<a href="' . esc_url( $product->get_permalink() ) . '">' . wp_kses_post( $img ) . '</a>';
				} else {
					echo wp_kses_post( $img );
				}
				break;

			case 'name':
				echo '<a href="' . esc_url( $product->get_permalink() ) . '" class="productbay-product-title">' . esc_html( $product->get_name() ) . '</a>';
				break;

			case 'price':
				echo '<span class="productbay-price">' . wp_kses_post( $product->get_price_html() ) . '</span>';
				break;

			case 'sku':
				echo esc_html( $product->get_sku() );
				break;

			case 'stock':
				echo wp_kses_post( wc_get_stock_html( $product ) );
				break;

			case 'button':
				$this->render_button_cell( $product );
				break;

			case 'summary':
				echo wp_kses_post( wp_trim_words( $product->get_short_description(), 10 ) );
				break;

			default:
				echo '';
		}
	}

	/**
	 * Render the button cell based on product type and stock status.
	 * Respects cart settings:
	 *   - cart.enable (AJAX): When false, button links to product page.
	 *   - cart.showQuantity: When false, quantity input is hidden.
	 *
	 * @param \WC_Product $product WooCommerce product object.
	 * @since 1.0.0
	 */
	private function render_button_cell( $product ) {
		$ajax_enabled  = ! empty( $this->cart_settings['enable'] );
		$show_quantity = ! empty( $this->cart_settings['showQuantity'] );

		// External/Affiliate: always link out to external URL.
		if ( $product->is_type( 'external' ) ) {
			$url  = $product->get_product_url();
			$text = $product->get_button_text() ?: __( 'Buy product', 'productbay' );
			echo '<div class="productbay-btn-cell">';
			echo '<a href="' . esc_url( $url ) . '" class="productbay-button productbay-btn-external" target="_blank" rel="noopener noreferrer">' . esc_html( $text ) . '</a>';
			echo '</div>';
			return;
		}

		// Grouped: always redirect to product page.
		if ( $product->is_type( 'grouped' ) ) {
			echo '<div class="productbay-btn-cell">';
			echo '<a href="' . esc_url( $product->get_permalink() ) . '" class="productbay-button productbay-btn-grouped">' . esc_html__( 'View Options', 'productbay' ) . '</a>';
			echo '</div>';
			return;
		}

		// Out of stock: disabled button.
		if ( ! $product->is_in_stock() ) {
			echo '<div class="productbay-btn-cell">';
			echo '<button class="productbay-button productbay-btn-outofstock" disabled>' . esc_html__( 'Out of Stock', 'productbay' ) . '</button>';
			echo '</div>';
			return;
		}

		// AJAX disabled: link to product page for simple & variable.
		if ( ! $ajax_enabled ) {
			$text = $product->is_type( 'variable' )
				? __( 'Select Options', 'productbay' )
				: $product->add_to_cart_text();
			echo '<div class="productbay-btn-cell">';
			echo '<a href="' . esc_url( $product->get_permalink() ) . '" class="productbay-button productbay-btn-addtocart">' . esc_html( $text ) . '</a>';
			echo '</div>';
			return;
		}

		// Variable: render attribute dropdowns + quantity + add to cart.
		if ( $product->is_type( 'variable' ) ) {
			$this->render_variable_button_cell( $product );
			return;
		}

		// Simple (or any other purchasable type): quantity + add to cart.
		$is_purchasable = $product->is_purchasable();
		echo '<div class="productbay-btn-cell">';
		if ( $is_purchasable && $show_quantity ) {
			$this->render_quantity_input( $product );
		}
		$disabled_attr = $is_purchasable ? '' : ' disabled';
		echo '<button class="productbay-button productbay-btn-addtocart" data-product-id="' . esc_attr( $product->get_id() ) . '"' . esc_attr( $disabled_attr ) . '>';
		echo esc_html( $product->add_to_cart_text() );
		echo '</button>';
		echo '</div>';
	}

	/**
	 * Render variation attribute dropdowns and add-to-cart button for variable products.
	 * Uses WC_Product_Variable::get_variation_attributes() and get_available_variations().
	 *
	 * @param \WC_Product_Variable $product WooCommerce variable product object.
	 * @since 1.0.0
	 */
	private function render_variable_button_cell( $product ) {
		$attributes           = $product->get_variation_attributes();
		$available_variations = $product->get_available_variations( 'array' );

		echo '<div class="productbay-btn-cell productbay-variable-wrap" data-product-id="' . esc_attr( $product->get_id() ) . '" data-product-variations="' . esc_attr( wp_json_encode( $available_variations ) ) . '">';

		// Attribute dropdowns.
		echo '<div class="productbay-variation-selects">';
		foreach ( $attributes as $attribute_name => $options ) {
			$attr_label     = wc_attribute_label( $attribute_name, $product );
			$sanitized_name = sanitize_title( $attribute_name );

			echo '<select class="productbay-variation-select" data-attribute-name="attribute_' . esc_attr( $sanitized_name ) . '">';
			echo '<option value="">' . esc_html( $attr_label ) . '&hellip;</option>';

			foreach ( $options as $option ) {
				$option_label = $option;
				// For taxonomy-based attributes, get the term name.
				if ( taxonomy_exists( $attribute_name ) ) {
					$term = get_term_by( 'slug', $option, $attribute_name );
					if ( $term && ! is_wp_error( $term ) ) {
						$option_label = $term->name;
					}
				}
				echo '<option value="' . esc_attr( $option ) . '">' . esc_html( $option_label ) . '</option>';
			}
			echo '</select>';
		}
		echo '</div>';

		// Hidden variation ID input.
		echo '<input type="hidden" class="productbay-variation-id" value="" />';

		// Variation price display.
		echo '<span class="productbay-variation-price"></span>';

		// Quantity + Add to Cart (disabled until variation selected).
		$is_purchasable = $product->is_purchasable();
		$show_quantity  = ! empty( $this->cart_settings['showQuantity'] );
		echo '<div class="productbay-btn-cell">';
		if ( $is_purchasable && $show_quantity ) {
			$this->render_quantity_input( $product );
		}
		echo '<button class="productbay-button productbay-btn-addtocart" data-product-id="' . esc_attr( $product->get_id() ) . '" disabled>';
		echo esc_html__( 'Add to cart', 'productbay' );
		echo '</button>';
		echo '</div>';

		echo '</div>';
	}

	/**
	 * Render a quantity number input with stock-aware constraints.
	 * Uses WC_Product::get_stock_quantity() and backorders_allowed().
	 *
	 * @param \WC_Product $product WooCommerce product object.
	 * @since 1.0.0
	 */
	private function render_quantity_input( $product ) {
		$min       = 1;
		$max       = '';
		$stock_qty = $product->get_stock_quantity();

		// Only set max if stock is managed and backorders are not allowed.
		if ( $product->managing_stock() && ! $product->backorders_allowed() && $stock_qty !== null ) {
			$max = $stock_qty;
		}

		echo '<div class="productbay-qty-wrap">';
		echo '<input type="number" class="productbay-qty" value="1" min="' . esc_attr( $min ) . '"';
		if ( $max !== '' ) {
			echo ' max="' . esc_attr( $max ) . '"';
		}
		echo ' step="1" />';
		echo '<div class="productbay-qty-btns">';
		echo '<button type="button" class="productbay-qty-btn productbay-qty-plus" aria-label="' . esc_attr__( 'Increase quantity', 'productbay' ) . '">&#9650;</button>';
		echo '<button type="button" class="productbay-qty-btn productbay-qty-minus" aria-label="' . esc_attr__( 'Decrease quantity', 'productbay' ) . '">&#9660;</button>';
		echo '</div>';
		echo '</div>';
	}

	/**
	 * Sanitize a CSS color value.
	 *
	 * Accepts hex colors (#rgb, #rrggbb, #rrggbbaa), rgb(), rgba(), hsl(), and hsla().
	 * Returns an empty string for any value that does not match safe patterns.
	 *
	 * @since 1.0.0
	 *
	 * @param string $color Raw color value from config.
	 * @return string Sanitized color or empty string.
	 */
	private function sanitize_css_color( $color ) {
		if ( ! is_string( $color ) ) {
			return '';
		}

		$color = trim( $color );

		// Hex: #rgb, #rrggbb, #rrggbbaa.
		if ( preg_match( '/^#[0-9a-fA-F]{3,8}$/', $color ) ) {
			return $color;
		}

		// Match rgb(), rgba(), hsl(), hsla() with only safe characters (digits, commas, spaces, dots, %).
		if ( preg_match( '/^(rgb|rgba|hsl|hsla)\([0-9,.\s%\/]+\)$/', $color ) ) {
			return $color;
		}

		return '';
	}

	/**
	 * Sanitize a CSS dimensional value (e.g. "16px", "1.5rem", "100%").
	 *
	 * Strips anything that isn't a number, dot, or an allowed unit.
	 * Returns an empty string if the value does not match safe patterns.
	 *
	 * @since 1.0.0
	 *
	 * @param string $value Raw CSS value from config.
	 * @return string Sanitized CSS dimensional value or empty string.
	 */
	private function sanitize_css_value( $value ) {
		if ( ! is_string( $value ) ) {
			return '';
		}

		$value = trim( $value );

		// Match number + optional unit (px, %, em, rem, pt).
		if ( preg_match( '/^[0-9]+(\.[0-9]+)?(px|%|em|rem|pt)?$/', $value ) ) {
			return $value;
		}

		return '';
	}

	/**
	 * Sanitize a column width unit against an allow-list.
	 *
	 * @since 1.0.0
	 *
	 * @param string $unit Raw unit string.
	 * @return string Sanitized unit or 'auto'.
	 */
	private function sanitize_css_unit( $unit ) {
		$allowed = array( 'px', '%', 'em', 'rem', 'auto' );
		return in_array( $unit, $allowed, true ) ? $unit : 'auto';
	}

	/**
	 * Generate scoped CSS based on the table's style configuration.
	 *
	 * All user-controlled values (colors, sizes, border styles) are sanitized
	 * before interpolation to prevent CSS injection.
	 *
	 * @since 1.0.0
	 *
	 * @param string $id       Unique table wrapper ID (already escaped).
	 * @param array  $style    Style configuration from the table.
	 * @param array  $columns  Column definitions for width styles.
	 * @param array  $settings Table settings (features, pagination, cart, etc.).
	 * @return string Generated CSS string.
	 */
	private function generate_styles( $id, $style, $columns, $settings = array() ) {
		$css    = '';
		$header = $style['header'] ?? array();
		$body   = $style['body'] ?? array();
		$button = $style['button'] ?? array();
		$layout = $style['layout'] ?? array();
		$hover  = $style['hover'] ?? array();

		$typography = $style['typography'] ?? array();

		// Header Styles.
		$css   .= "#{$id} .productbay-table thead th {";
		$h_bg   = $this->sanitize_css_color( $header['bgColor'] ?? '' );
		$h_text = $this->sanitize_css_color( $header['textColor'] ?? '' );
		$h_font = $this->sanitize_css_value( $header['fontSize'] ?? '' );
		if ( $h_bg ) {
			$css .= "background-color: {$h_bg};";
		}
		if ( $h_text ) {
			$css .= "color: {$h_text};";
		}
		if ( $h_font ) {
			$css .= "font-size: {$h_font};";
		}

		if ( ! empty( $typography['headerFontWeight'] ) ) {
			$weight_map = array(
				'normal'    => '400',
				'bold'      => '600',
				'extrabold' => '800',
			);
			$weight     = $weight_map[ $typography['headerFontWeight'] ] ?? '600';
			$css       .= "font-weight: {$weight};";
		}

		if ( ! empty( $typography['headerTextTransform'] ) ) {
			$transform_map = array(
				'uppercase'   => 'uppercase',
				'lowercase'   => 'lowercase',
				'capitalize'  => 'capitalize',
				'normal-case' => 'none',
			);
			$transform     = $transform_map[ $typography['headerTextTransform'] ] ?? 'uppercase';
			$css          .= "text-transform: {$transform};";
			if ( $transform === 'none' ) {
				$css .= 'letter-spacing: normal;';
			}
		}
		$css .= '}';

		// Body Styles — base td.
		$b_bg   = $this->sanitize_css_color( $body['bgColor'] ?? '' );
		$b_text = $this->sanitize_css_color( $body['textColor'] ?? '' );
		$css   .= "#{$id} .productbay-table tbody td {";
		$css   .= 'vertical-align: top;';
		if ( $b_bg ) {
			$css .= "background-color: {$b_bg};";
		}
		if ( $b_text ) {
			$css .= "color: {$b_text};";
		}
		$css .= '}';

		// Body text color: override specific child elements that have hardcoded colors.
		if ( $b_text ) {
			$css .= "#{$id} .productbay-table tbody td .productbay-product-title,";
			$css .= "#{$id} .productbay-table tbody td a:not(.productbay-button),";
			$css .= "#{$id} .productbay-table tbody td .productbay-price,";
			$css .= "#{$id} .productbay-table tbody td .productbay-price ins,";
			$css .= "#{$id} .productbay-table tbody td .productbay-price ins .woocommerce-Price-amount,";
			$css .= "#{$id} .productbay-table tbody td .productbay-price del,";
			$css .= "#{$id} .productbay-table tbody td .productbay-price del .woocommerce-Price-amount {";
			$css .= "color: {$b_text} !important;";
			$css .= '}';
		}

		// Layout & Spacing Styles.
		$allowed_border_styles = array( 'none', 'solid', 'dashed', 'dotted', 'double' );
		$raw_border_style      = $layout['borderStyle'] ?? '';
		$b_style               = in_array( $raw_border_style, $allowed_border_styles, true ) ? $raw_border_style : 'solid';
		$b_color               = $this->sanitize_css_color( $layout['borderColor'] ?? '#e2e8f0' );

		if ( $b_style === 'none' ) {
			$css .= "#{$id} .productbay-table-container { border: none; }";
			$css .= "#{$id} .productbay-table th, #{$id} .productbay-table td { border: none; }";
		} elseif ( $b_style && $b_color ) {
				$css .= "#{$id} .productbay-table-container { border: 1px {$b_style} {$b_color}; }";
				$css .= "#{$id} .productbay-table th, #{$id} .productbay-table td { border-bottom: 1px {$b_style} {$b_color}; }";
		} elseif ( $b_color ) {
			$css .= "#{$id} .productbay-table-container { border-color: {$b_color}; }";
			$css .= "#{$id} .productbay-table th, #{$id} .productbay-table td { border-bottom-color: {$b_color}; }";
		}

		$radius_enabled = $layout['borderRadiusEnabled'] ?? true;
		if ( $radius_enabled && isset( $layout['borderRadius'] ) ) {
			$radius = intval( $layout['borderRadius'] );
			$css   .= "#{$id} .productbay-table-container { border-radius: {$radius}px; }";
		} elseif ( ! $radius_enabled ) {
			$css .= "#{$id} .productbay-table-container { border-radius: 0; }";
		}

		if ( ! empty( $layout['cellPadding'] ) ) {
			$cell_padding_map = array(
				'compact'  => '8px 12px',
				'normal'   => '12px 16px',
				'spacious' => '16px 24px',
			);
			$padding          = $cell_padding_map[ $layout['cellPadding'] ] ?? '12px 16px';
			$css             .= "#{$id} .productbay-table th, #{$id} .productbay-table td { padding: {$padding}; }";
		}

		// Alternate Rows.
		if ( ! empty( $body['rowAlternate'] ) ) {
			$alt_bg   = $this->sanitize_css_color( $body['altBgColor'] ?? '' );
			$alt_text = $this->sanitize_css_color( $body['altTextColor'] ?? '' );
			$css     .= "#{$id} .productbay-table tbody tr:nth-child(even) td {";
			if ( $alt_bg ) {
				$css .= "background-color: {$alt_bg};";
			}
			if ( $alt_text ) {
				$css .= "color: {$alt_text};";
			}
			$css .= '}';

			// Alt row text color: override specific child elements.
			if ( $alt_text ) {
				$css .= "#{$id} .productbay-table tbody tr:nth-child(even) td .productbay-product-title,";
				$css .= "#{$id} .productbay-table tbody tr:nth-child(even) td a:not(.productbay-button),";
				$css .= "#{$id} .productbay-table tbody tr:nth-child(even) td .productbay-price,";
				$css .= "#{$id} .productbay-table tbody tr:nth-child(even) td .productbay-price ins,";
				$css .= "#{$id} .productbay-table tbody tr:nth-child(even) td .productbay-price ins .woocommerce-Price-amount,";
				$css .= "#{$id} .productbay-table tbody tr:nth-child(even) td .productbay-price del,";
				$css .= "#{$id} .productbay-table tbody tr:nth-child(even) td .productbay-price del .woocommerce-Price-amount {";
				$css .= "color: {$alt_text} !important;";
				$css .= '}';
			}
		}

		// Hover Effect.
		if ( ! empty( $hover['rowHoverEnabled'] ) ) {
			$hov_bg   = $this->sanitize_css_color( $hover['rowHoverBgColor'] ?? '' );
			$hov_text = $this->sanitize_css_color( $hover['rowHoverTextColor'] ?? '' );
			$css     .= "#{$id} .productbay-table tbody tr:hover td {";
			if ( $hov_bg ) {
				$css .= "background-color: {$hov_bg};";
			}
			if ( $hov_text ) {
				$css .= "color: {$hov_text};";
			}
			$css .= '}';

			// Hover text color: override specific child elements.
			if ( $hov_text ) {
				$css .= "#{$id} .productbay-table tbody tr:hover td .productbay-product-title,";
				$css .= "#{$id} .productbay-table tbody tr:hover td a:not(.productbay-button),";
				$css .= "#{$id} .productbay-table tbody tr:hover td .productbay-price,";
				$css .= "#{$id} .productbay-table tbody tr:hover td .productbay-price ins,";
				$css .= "#{$id} .productbay-table tbody tr:hover td .productbay-price ins .woocommerce-Price-amount,";
				$css .= "#{$id} .productbay-table tbody tr:hover td .productbay-price del,";
				$css .= "#{$id} .productbay-table tbody tr:hover td .productbay-price del .woocommerce-Price-amount {";
				$css .= "color: {$hov_text} !important;";
				$css .= '}';
			}
		}

		// Button Styles via class override.
		$btn_bg       = $this->sanitize_css_color( $button['bgColor'] ?? '' );
		$btn_text     = $this->sanitize_css_color( $button['textColor'] ?? '' );
		$btn_radius   = $this->sanitize_css_value( $button['borderRadius'] ?? '' );
		$btn_hov_bg   = $this->sanitize_css_color( $button['hoverBgColor'] ?? '' );
		$btn_hov_text = $this->sanitize_css_color( $button['hoverTextColor'] ?? '' );

		$css .= "#{$id} .productbay-button {";
		$css .= 'display: inline-flex;';
		$css .= 'align-items: center;';
		$css .= 'justify-content: center;';
		$css .= 'min-width: 160px;';
		$css .= 'transition: background-color 0.2s ease, color 0.2s ease;';
		if ( $btn_bg ) {
			$css .= "background-color: {$btn_bg} !important;";
		}
		if ( $btn_text ) {
			$css .= "color: {$btn_text} !important;";
		}
		if ( $btn_radius ) {
			$css .= "border-radius: {$btn_radius};";
		}
		$css .= '}';

		$css .= "#{$id} .productbay-button:hover {";
		if ( $btn_hov_bg ) {
			$css .= "background-color: {$btn_hov_bg} !important;";
		}
		if ( $btn_hov_text ) {
			$css .= "color: {$btn_hov_text} !important;";
		}
		$css .= '}';

		// Added to cart checkmark (SVG).
		$css .= "#{$id} .productbay-button.added {";
		$css .= 'gap: 6px;';
		$css .= '}';
		$css .= "#{$id} .productbay-table .button.added::after {";
		$css .= "content: '';";
		$css .= 'display: inline-block;';
		$css .= 'width: 16px;';
		$css .= 'height: 16px;';
		$css .= "-webkit-mask-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E\");";
		$css .= "mask-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E\");";
		$css .= '-webkit-mask-size: contain;';
		$css .= 'mask-size: contain;';
		$css .= '-webkit-mask-repeat: no-repeat;';
		$css .= 'mask-repeat: no-repeat;';
		$css .= '-webkit-mask-position: center;';
		$css .= 'mask-position: center;';
		$css .= 'background-color: currentColor;';
		$css .= '}';

		// View Cart (.productbay-added-to-cart) Ghost Button Styles.
		$css .= "#{$id} .productbay-table .productbay-added-to-cart {";
		$css .= 'display: block !important;';
		$css .= 'width: max-content !important;';
		$css .= 'background: transparent !important;';
		$css .= 'border: none;';
		$css .= 'color: inherit !important;';
		$css .= 'padding: 4px 0 !important;';
		$css .= 'margin-top: 8px;';
		$css .= 'text-decoration: none !important;';
		$css .= 'font-weight: 500;';
		$css .= 'transition: background-color 0.2s ease, color 0.2s ease;';
		$css .= '}';
		$css .= "#{$id} .productbay-table .productbay-added-to-cart::after {";
		$css .= "content: '';";
		$css .= 'display: inline-block;';
		$css .= 'vertical-align: middle;';
		$css .= 'margin-left: 8px;';
		$css .= 'margin-top: -2px;';
		$css .= 'width: 16px;';
		$css .= 'height: 16px;';
		$css .= "-webkit-mask-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='5' y1='12' x2='19' y2='12'%3E%3C/line%3E%3Cpolyline points='12 5 19 12 12 19'%3E%3C/polyline%3E%3C/svg%3E\");";
		$css .= "mask-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='5' y1='12' x2='19' y2='12'%3E%3C/line%3E%3Cpolyline points='12 5 19 12 12 19'%3E%3C/polyline%3E%3C/svg%3E\");";
		$css .= '-webkit-mask-size: contain;';
		$css .= 'mask-size: contain;';
		$css .= '-webkit-mask-repeat: no-repeat;';
		$css .= 'mask-repeat: no-repeat;';
		$css .= '-webkit-mask-position: center;';
		$css .= 'mask-position: center;';
		$css .= 'background-color: currentColor;';
		$css .= '}';
		$css .= "#{$id} .productbay-table .productbay-added-to-cart:hover {";
		$css .= 'text-decoration: underline !important;';
		$css .= 'text-underline-offset: 4px;';
		$css .= 'background: transparent !important;';
		$css .= '}';

		// Image styles.
		$css .= "#{$id} img {";
		$css .= 'max-width: 100%;';
		$css .= 'height: auto;';
		$css .= 'display: block;';
		$css .= 'padding: 2px;';
		$css .= 'border-radius: 3px;';
		$css .= '}';

		// Column Widths.
		foreach ( $columns as $col ) {
			$width   = $col['advanced']['width'] ?? array(
				'value' => 0,
				'unit'  => 'auto',
			);
			$w_value = intval( $width['value'] );
			$w_unit  = $this->sanitize_css_unit( $width['unit'] ?? 'auto' );
			if ( $w_value > 0 && $w_unit !== 'auto' ) {
				$css .= "#{$id} .productbay-col-" . esc_attr( $col['id'] ) . " { width: {$w_value}{$w_unit}; }";
			}
		}

		// Bulk Select Width.
		$bulk_select = $settings['features']['bulkSelect'] ?? array(
			'enabled'  => true,
			'position' => 'last',
			'width'    => array(
				'value' => 64,
				'unit'  => 'px',
			),
		);
		if ( $bulk_select['enabled'] ) {
			$width    = $bulk_select['width'];
			$bs_value = intval( $width['value'] );
			$bs_unit  = $this->sanitize_css_unit( $width['unit'] ?? 'px' );
			if ( $bs_value > 0 && $bs_unit !== 'auto' ) {
				$css .= "#{$id} .productbay-col-select { width: {$bs_value}{$bs_unit}; }";
			}
		}

		return $css;
	}

	/**
	 * Check whether a column should be hidden from output.
	 *
	 * @param array $col Column configuration.
	 * @return bool True if the column visibility is set to 'none'.
	 * @since 1.0.0
	 */
	private function should_hide_column( $col ) {
		return ( $col['advanced']['visibility'] ?? 'default' ) === 'none';
	}

	/**
	 * Get CSS classes for a column, including responsive visibility classes.
	 *
	 * Breakpoints:
	 *   Mobile:  <= 767px
	 *   Tablet:  768px – 1023px
	 *   Desktop: >= 1024px
	 *
	 * @param array $col Column configuration.
	 * @return string[]
	 * @since 1.0.0
	 */
	private function get_column_classes( $col ) {
		$classes = array( 'productbay-col-' . $col['id'] );

		$visibility = $col['advanced']['visibility'] ?? 'default';

		$visibility_class_map = array(
			'desktop'     => 'productbay-desktop-only',
			'tablet'      => 'productbay-tablet-only',
			'mobile'      => 'productbay-mobile-only',
			'not-mobile'  => 'productbay-hide-mobile',
			'not-desktop' => 'productbay-hide-desktop',
			'not-tablet'  => 'productbay-hide-tablet',
			'min-tablet'  => 'productbay-min-tablet',
		);

		if ( isset( $visibility_class_map[ $visibility ] ) ) {
			$classes[] = $visibility_class_map[ $visibility ];
		}

		return $classes;
	}

	/**
	 * Get inline styles for a column.
	 *
	 * @param array $col Column configuration.
	 * @return string Inline CSS string (currently empty, reserved for future use).
	 * @since 1.0.0
	 */
	private function get_column_styles( $col ) {
		return '';
	}

	/**
	 * Render the search bar HTML.
	 *
	 * @param array  $settings Table settings.
	 * @param string $value    Current search value.
	 * @return void
	 * @since 1.0.0
	 */
	private function render_search_bar( $settings, $value = '' ) {
		// Placeholder for search input.
		// Placeholder for search input.
		echo '<div class="productbay-search ' . ( ! empty( $value ) ? 'has-value' : '' ) . '">';
		echo '<input type="text" value="' . esc_attr( $value ) . '" placeholder="' . esc_attr__( 'Search products...', 'productbay' ) . '" />';
		echo '<span class="productbay-search-clear" title="' . esc_attr__( 'Clear', 'productbay' ) . '"></span>';
		echo '</div>';
	}

	/**
	 * Render pagination links.
	 *
	 * @param \WP_Query $query        The current query object.
	 * @param array     $settings     Table settings.
	 * @param array     $runtime_args Runtime arguments (page_url, etc.).
	 * @return void
	 * @since 1.0.0
	 */
	private function render_pagination( $query, $settings, $runtime_args = array() ) {
		$paged = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
		// Override paged if passed in query args (for AJAX).
		if ( ! empty( $query->query['paged'] ) ) {
			$paged = $query->query['paged'];
		}

		$total = $query->max_num_pages;

		if ( $total > 1 ) {
			$base_url = ! empty( $runtime_args['page_url'] ) ? $runtime_args['page_url'] : get_pagenum_link( 999999999 );

			// If base_url was from get_pagenum_link(999999999), it has 999999999.
			// If from runtime_args, it's a clean URL.
			$base = str_replace( '999999999', '%#%', $base_url );

			// If it's a clean URL without %#%, add it for the paged param.
			if ( strpos( $base, '%#%' ) === false ) {
				$base = add_query_arg( 'paged', '%#%', $base );
			}

			echo '<div class="productbay-pagination">';
			echo wp_kses_post(
				paginate_links(
					array(
						'base'      => $base,
						'format'    => '',
						'current'   => max( 1, $paged ),
						'total'     => $total,
						'prev_text' => '&laquo;',
						'next_text' => '&raquo;',
					)
				)
			);
			echo '</div>';
		}
	}

	/**
	 * Render AJAX response (rows and pagination)
	 *
	 * @param array $table        Full table configuration.
	 * @param array $runtime_args Runtime arguments (search, sort, paged).
	 * @return array
	 * @since 1.0.0
	 */
	public function render_ajax_response( $table, $runtime_args ) {
		$source   = $table['source'] ?? array();
		$columns  = $table['columns'] ?? array();
		$settings = $table['settings'] ?? array();

		// Store cart settings for use in render methods.
		$this->cart_settings = wp_parse_args(
			$settings['cart'] ?? array(),
			array(
				'enable'       => true,
				'showQuantity' => true,
			)
		);

		$args  = $this->build_query_args( $source, $settings, $runtime_args );
		$query = new \WP_Query( $args );

		ob_start();
		if ( $query->have_posts() ) {
			while ( $query->have_posts() ) {
				$query->the_post();
                // phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- WooCommerce global
				global $product;
				if ( ! is_object( $product ) ) {
					$product = \wc_get_product( get_the_ID() );
				}
                // phpcs:enable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound

				$product_type = $product->get_type();
				$in_stock     = $product->is_in_stock() ? '1' : '0';
				echo '<tr data-product-type="' . esc_attr( $product_type ) . '" data-product-id="' . esc_attr( $product->get_id() ) . '" data-in-stock="' . esc_attr( $in_stock ) . '">';

				// Bulk Select - First.
				$bulk_select = $settings['features']['bulkSelect'] ?? array(
					'enabled'  => true,
					'position' => 'last',
				);
				if ( $bulk_select['enabled'] && ( $bulk_select['position'] ?? 'last' ) === 'first' ) {
					$can_select = $product->is_in_stock() && ! $product->is_type( 'external' ) && ! $product->is_type( 'grouped' ) && ! $product->is_type( 'variable' ) && $product->is_purchasable();
					echo '<td class="productbay-col-select">';
					echo '<input type="checkbox" class="productbay-select-product" value="' . esc_attr( $product->get_id() ) . '" data-price="' . esc_attr( $product->get_price() ) . '"' . ( $can_select ? '' : ' disabled' ) . ' />';
					echo '</td>';
				}

				foreach ( $columns as $col ) {
					if ( $this->should_hide_column( $col ) ) {
						continue;
					}
					$td_classes = $this->get_column_classes( $col );
					echo '<td class="' . esc_attr( implode( ' ', $td_classes ) ) . '">';
					$this->render_cell( $col, $product );
					echo '</td>';
				}

				// Bulk Select - Last.
				if ( $bulk_select['enabled'] && ( $bulk_select['position'] ?? 'last' ) === 'last' ) {
					$can_select = $product->is_in_stock() && ! $product->is_type( 'external' ) && ! $product->is_type( 'grouped' ) && ! $product->is_type( 'variable' ) && $product->is_purchasable();
					echo '<td class="productbay-col-select">';
					echo '<input type="checkbox" class="productbay-select-product" value="' . esc_attr( $product->get_id() ) . '" data-price="' . esc_attr( $product->get_price() ) . '"' . ( $can_select ? '' : ' disabled' ) . ' />';
					echo '</td>';
				}
				echo '</tr>';
			}
			wp_reset_postdata();
		} else {
			$colspan = count(
				array_filter(
					$columns,
					function ( $c ) {
						return ! $this->should_hide_column( $c );
					}
				)
			);
			// Add +1 if bulk select enabled.
			if ( $settings['features']['bulkSelect']['enabled'] ?? true ) {
				++$colspan;
			}
			echo '<tr><td colspan="' . intval( $colspan ) . '" class="productbay-empty">' . esc_html__( 'No products found.', 'productbay' ) . '</td></tr>';
		}
		$rows = ob_get_clean();

		ob_start();
		if ( ! empty( $settings['features']['pagination'] ) ) {
			$this->render_pagination( $query, $settings, $runtime_args );
		}
		$pagination = ob_get_clean();

		return array(
			'html'       => $rows,
			'pagination' => $pagination,
		);
	}
}
