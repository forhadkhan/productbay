<?php
/**
 * Server-side render callback for the Product Table block.
 *
 * @package ProductBay
 */

declare(strict_types=1);

namespace WpabProductBay\Blocks;

// Exit if accessed directly.
if (!defined('ABSPATH')) {
	exit;
}

use WpabProductBay\Data\TableRepository;
use WpabProductBay\Frontend\TableRenderer;

/**
 * Class ProductTableBlock
 *
 * Handles the render_callback for the `productbay/product-table` block.
 * Delegates all rendering to the existing TableRenderer — identical output
 * to the [productbay] shortcode.
 *
 * @package WpabProductBay\Blocks
 * @since   1.1.0
 */
class ProductTableBlock
{
	/**
	 * Repository for table data access.
	 *
	 * @var TableRepository
	 * @since 1.1.0
	 */
	protected $repository;

	/**
	 * Constructor.
	 *
	 * @param TableRepository $repository Table data repository.
	 * @since 1.1.0
	 */
	public function __construct(TableRepository $repository)
	{
		$this->repository = $repository;
	}

	/**
	 * Render the Product Table block on the frontend.
	 *
	 * @param array  $attributes Block attributes from the editor.
	 * @param string $content    Inner block content (unused for dynamic blocks).
	 * @return string Rendered HTML.
	 * @since 1.1.0
	 */
	public function render(array $attributes, string $content): string
	{
		$table_id = absint($attributes['tableId'] ?? 0);

		if (!$table_id) {
			return '';
		}

		$table = $this->repository->get_table($table_id);

		if (!$table) {
			return '';
		}

		// Only render published tables on the frontend.
		if ('publish' !== $table['status'] && !is_preview()) {
			if (\current_user_can('manage_options')) {
				return '<p style="padding:12px 16px;background:#fef3cd;border:1px solid #e9b006;border-radius:4px;color:#664d03;font-size:14px;">'
					. sprintf(
						/* translators: %s: table title */
						\esc_html__('ProductBay: Table "%s" is currently private. It will appear here once it is published.', 'productbay'),
						\esc_html($table['title'])
					)
					. '</p>';
			}
			return '';
		}

		$this->enqueue_assets();

		$renderer = new TableRenderer($this->repository);
		$html = $renderer->render($table);

		// get_block_wrapper_attributes() handles Gutenberg style/color/typography attributes.
		return '<div ' . \get_block_wrapper_attributes() . '>' . $html . '</div>';
	}

	/**
	 * Enqueue frontend CSS and JS required by the table.
	 *
	 * Mirrors the logic in Shortcode::enqueue_assets() so users get identical
	 * asset loading whether the table is embedded via shortcode or block.
	 *
	 * @since 1.1.0
	 *
	 * @return void
	 */
	private function enqueue_assets()
	{
		\wp_enqueue_style(
			'productbay-frontend',
			PRODUCTBAY_URL . 'assets/css/frontend.css',
			array(),
			(string) filemtime(PRODUCTBAY_PATH . 'assets/css/frontend.css')
		);

		\wp_enqueue_script(
			'productbay-frontend',
			PRODUCTBAY_URL . 'assets/js/frontend.js',
			array('jquery'),
			(string) filemtime(PRODUCTBAY_PATH . 'assets/js/frontend.js'),
			true
		);

		if (!\wp_script_is('productbay-frontend', 'localized')) {
			\wp_localize_script(
				'productbay-frontend',
				'productbay_frontend',
				array(
					'ajaxurl'            => \admin_url('admin-ajax.php'),
					'nonce'              => \wp_create_nonce('productbay_frontend'),
					'cart_url'           => \wc_get_cart_url(),
					'currency_symbol'    => \get_woocommerce_currency_symbol(),
					'currency_position'  => \get_option('woocommerce_currency_pos', 'left'),
					'currency_decimals'  => absint(\get_option('woocommerce_price_num_decimals', 2)),
					'currency_decimal_sep'  => \wc_get_price_decimal_separator(),
					'currency_thousand_sep' => \wc_get_price_thousand_separator(),
				)
			);
		}

		/**
		 * Fires after frontend assets are enqueued by a block render.
		 *
		 * @since 1.1.0
		 */
		\do_action('productbay_enqueue_frontend_assets');
	}
}
