<?php
/**
 * Frontend AJAX handler for table filtering and bulk add-to-cart.
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
use WpabProductBay\Http\Request;

/**
 * Class AjaxRenderer
 *
 * Handles frontend AJAX requests for table filtering, search, pagination,
 * and bulk add-to-cart operations. Registered via wp_ajax hooks.
 *
 * @since   1.0.0
 * @package WpabProductBay\Frontend
 */
class AjaxRenderer {

	/**
	 * The table repository instance.
	 *
	 * @var TableRepository
	 */
	protected $repository;

	/**
	 * The HTTP request handler.
	 *
	 * @var Request
	 */
	protected $request;

	/**
	 * Initialize the AJAX renderer.
	 *
	 * @since 1.0.0
	 *
	 * @param TableRepository $repository Table data repository.
	 * @param Request         $request    HTTP request handler.
	 */
	public function __construct( TableRepository $repository, Request $request ) {
		$this->repository = $repository;
		$this->request    = $request;
	}

	/**
	 * Register AJAX action hooks.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'wp_ajax_productbay_filter', array( $this, 'handle_filter' ) );
		\add_action( 'wp_ajax_nopriv_productbay_filter', array( $this, 'handle_filter' ) );

		\add_action( 'wp_ajax_productbay_bulk_add_to_cart', array( $this, 'handle_bulk_add_to_cart' ) );
		\add_action( 'wp_ajax_nopriv_productbay_bulk_add_to_cart', array( $this, 'handle_bulk_add_to_cart' ) );
	}

	/**
	 * Handle table filter/search/pagination AJAX requests.
	 *
	 * Validates nonce, retrieves table config, and returns rendered rows + pagination.
	 *
	 * @since 1.0.0
	 *
	 * @return void Sends JSON response and exits.
	 */
	public function handle_filter() {
		if ( ! check_ajax_referer( 'productbay_frontend', 'nonce', false ) ) {
			\wp_send_json_error( array( 'message' => 'Invalid nonce' ) );
		}

		$table_id = intval( $_POST['table_id'] ?? 0 );
		$s        = sanitize_text_field( wp_unslash( $_POST['s'] ?? '' ) );
		$paged    = intval( $_POST['paged'] ?? 1 );
		$page_url = esc_url_raw( wp_unslash( $_POST['page_url'] ?? '' ) );

		if ( ! $table_id ) {
			\wp_send_json_error( array( 'message' => 'Invalid table ID' ) );
		}

		$table = $this->repository->get_table( $table_id );
		if ( ! $table ) {
			\wp_send_json_error( array( 'message' => 'Table not found' ) );
		}

		// Initialize renderer.
		$renderer = new TableRenderer( $this->repository );

		$response = $renderer->render_ajax_response(
			$table,
			array(
				's'        => $s,
				'paged'    => $paged,
				'page_url' => $page_url,
			)
		);

		\wp_send_json_success( $response );
	}

	/**
	 * Handle bulk add-to-cart AJAX requests.
	 *
	 * Validates nonce, processes each item (with stock and variation checks),
	 * and returns success/error counts.
	 *
	 * @since 1.0.0
	 *
	 * @return void Sends JSON response and exits.
	 */
	public function handle_bulk_add_to_cart() {
		if ( ! check_ajax_referer( 'productbay_frontend', 'nonce', false ) ) {
			\wp_send_json_error( array( 'message' => 'Invalid nonce' ) );
		}

		// Accept items[] array: each item has product_id, quantity, variation_id (optional), attributes (optional).
		$raw_items = wp_unslash( $_POST['items'] ?? array() ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- sanitized below per field
		if ( empty( $raw_items ) || ! is_array( $raw_items ) ) {
			\wp_send_json_error( array( 'message' => __( 'No products selected', 'productbay' ) ) );
		}

		$added_count = 0;
		$errors      = array();

		foreach ( $raw_items as $item ) {
			$product_id   = intval( $item['product_id'] ?? 0 );
			$quantity     = max( 1, intval( $item['quantity'] ?? 1 ) );
			$variation_id = intval( $item['variation_id'] ?? 0 );
			$attributes   = array();

			if ( ! empty( $item['attributes'] ) && is_array( $item['attributes'] ) ) {
				foreach ( $item['attributes'] as $key => $value ) {
					$attributes[ sanitize_text_field( $key ) ] = sanitize_text_field( $value );
				}
			}

			if ( ! $product_id ) {
				continue;
			}

			$product = \wc_get_product( $product_id );
			if ( ! $product ) {
				$errors[] = sprintf(
					/* translators: %d: product ID */
					__( 'Product #%d not found.', 'productbay' ),
					$product_id
				);
				continue;
			}

			// Skip non-purchasable types.
			if ( $product->is_type( 'external' ) || $product->is_type( 'grouped' ) ) {
				continue;
			}

			// Check stock via official WC API.
			if ( ! $product->is_in_stock() ) {
				$errors[] = sprintf(
					/* translators: %s: product name */
					__( '"%s" is out of stock.', 'productbay' ),
					$product->get_name()
				);
				continue;
			}

			// Validate quantity against stock (if managed and no backorders).
			if ( $product->managing_stock() && ! $product->backorders_allowed() ) {
				$stock_qty = $product->get_stock_quantity();
				if ( $stock_qty !== null && $quantity > $stock_qty ) {
					$quantity = $stock_qty; // Cap to available stock.
				}
			}

			// For variable products, validate variation.
			if ( $product->is_type( 'variable' ) ) {
				if ( ! $variation_id ) {
					$errors[] = sprintf(
						/* translators: %s: product name */
						__( 'Please select options for "%s".', 'productbay' ),
						$product->get_name()
					);
					continue;
				}

				$variation = \wc_get_product( $variation_id );
				if ( ! $variation || ! $variation->is_in_stock() ) {
					$errors[] = sprintf(
						/* translators: %s: product name */
						__( 'Selected variation for "%s" is unavailable.', 'productbay' ),
						$product->get_name()
					);
					continue;
				}

				// Validate variation stock quantity.
				if ( $variation->managing_stock() && ! $variation->backorders_allowed() ) {
					$var_stock = $variation->get_stock_quantity();
					if ( $var_stock !== null && $quantity > $var_stock ) {
						$quantity = $var_stock;
					}
				}
			}

			try {
				$added = \WC()->cart->add_to_cart( $product_id, $quantity, $variation_id, $attributes );
				if ( $added ) {
					++$added_count;
				}
			} catch ( \Exception $e ) {
				$errors[] = sprintf(
					/* translators: %s: product name */
					__( 'Could not add "%s" to cart.', 'productbay' ),
					$product->get_name()
				);
			}
		}

		if ( $added_count > 0 ) {
			$response = array(
				/* translators: %d: number of products added to cart */
				'message'     => sprintf( __( '%d product(s) added to cart.', 'productbay' ), $added_count ),
				'added_count' => $added_count,
			);
			if ( ! empty( $errors ) ) {
				$response['warnings'] = $errors;
			}
			\wp_send_json_success( $response );
		} else {
			\wp_send_json_error(
				array(
					'message' => __( 'Failed to add products to cart.', 'productbay' ),
					'errors'  => $errors,
				)
			);
		}
	}
}
