<?php
/**
 * Orchestrates registration of all ProductBay Gutenberg blocks.
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

/**
 * Class BlockManager
 *
 * Registers all Gutenberg blocks and wires their PHP render callbacks.
 * Must be initialised on the WordPress `init` hook.
 *
 * @package WpabProductBay\Blocks
 * @since   1.1.0
 */
class BlockManager
{
	/**
	 * Repository for table data access.
	 *
	 * @var TableRepository
	 * @since 1.1.0
	 */
	protected $table_repository;

	/**
	 * Constructor.
	 *
	 * @param TableRepository $repository Table data repository.
	 * @since 1.1.0
	 */
	public function __construct(TableRepository $repository)
	{
		$this->table_repository = $repository;
	}

	/**
	 * Register all blocks.
	 *
	 * Called from Plugin::init_components() on the `init` action.
	 *
	 * @since 1.1.0
	 *
	 * @return void
	 */
	public function init()
	{
		$product_table_block     = new ProductTableBlock($this->table_repository);
		$tab_product_table_block = new TabProductTableBlock($this->table_repository);

		// Register the shared frontend CSS handle.
		$css_path = PRODUCTBAY_PATH . 'assets/css/frontend.css';
		\wp_register_style(
			'productbay-frontend',
			PRODUCTBAY_URL . 'assets/css/frontend.css',
			array(),
			file_exists($css_path) ? (string) filemtime($css_path) : PRODUCTBAY_VERSION
		);

		// Register the tabs CSS handle.
		$tabs_css_path = PRODUCTBAY_PATH . 'assets/css/block-tabs.css';
		\wp_register_style(
			'productbay-tabs',
			PRODUCTBAY_URL . 'assets/css/block-tabs.css',
			array(),
			file_exists($tabs_css_path) ? (string) filemtime($tabs_css_path) : PRODUCTBAY_VERSION
		);

		\register_block_type(
			PRODUCTBAY_PATH . 'blocks/product-table',
			array(
				'render_callback'      => array($product_table_block, 'render'),
				'style_handles'        => array('productbay-frontend'),
				'editor_style_handles' => array('productbay-frontend'),
			)
		);

		\register_block_type(
			PRODUCTBAY_PATH . 'blocks/tab-product-table',
			array(
				'render_callback'      => array($tab_product_table_block, 'render'),
				'style_handles'        => array('productbay-frontend', 'productbay-tabs'),
				'editor_style_handles' => array('productbay-frontend', 'productbay-tabs'),
			)
		);

		// Force the styles into the editor's iFrame for ServerSideRender accuracy.
		\add_action('enqueue_block_editor_assets', array($this, 'enqueue_editor_preview_styles'));
		
		// This tells WordPress to load these styles in the editor's visual area.
		\add_editor_style(PRODUCTBAY_URL . 'assets/css/frontend.css');
		\add_editor_style(PRODUCTBAY_URL . 'assets/css/block-tabs.css');
	}

	/**
	 * Enqueue frontend styles in the block editor context.
	 *
	 * @since 1.1.0
	 */
	public function enqueue_editor_preview_styles()
	{
		\wp_enqueue_style('productbay-frontend');
		\wp_enqueue_style('productbay-tabs');
	}
}
