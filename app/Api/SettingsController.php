<?php

declare(strict_types=1);

namespace WpabProductBay\Api;

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

use WpabProductBay\Http\Request;

/**
 * Class SettingsController
 *
 * Manages plugin settings via the REST API.
 * Handles reading, updating, and resetting global plugin configuration.
 *
 * @since   1.0.0
 * @package WpabProductBay\Api
 */
class SettingsController extends ApiController
{
    /**
     * WordPress option name for plugin settings.
     *
     * @var string
     */
    const OPTION_NAME = 'productbay_settings';

    /**
     * Initialize the controller.
     *
     * @since 1.0.0
     *
     * @param Request $request HTTP request handler.
     */
    public function __construct(Request $request)
    {
        parent::__construct($request);
    }

    /**
     * Get current plugin settings.
     *
     * Returns stored settings merged with defaults.
     *
     * @since 1.0.0
     *
     * @return array Plugin settings.
     */
    public function get_settings()
    {
        return get_option(self::OPTION_NAME, $this->defaults());
    }

    /**
     * Update settings via REST API.
     * 
     * @param \WP_REST_Request $request The REST request object containing JSON body.
     * @return array The updated settings.
     */
    public function update_settings(\WP_REST_Request $request)
    {
        $settings = $request->get_param('settings');

        if (!is_array($settings)) {
            $settings = [];
        }

        // Merge with defaults to ensure structure
        $settings = array_merge($this->defaults(), $settings);

        update_option(self::OPTION_NAME, $settings);
        return $settings;
    }

    /**
     * Reset all plugin data to factory defaults.
     *
     * Performs a full cleanup: deletes all saved tables (CPT posts),
     * clears associated post meta, removes settings and onboarding state.
     * This restores the plugin to its initial "just installed" state.
     *
     * @return array{success: bool, deleted_tables: int, settings: array} Reset result with defaults.
     */
    public function reset_settings()
    {
        // 1. Delete all ProductBay table posts
        $tables = get_posts([
            'post_type'   => 'productbay_table',
            'numberposts' => -1,
            'post_status' => 'any',
            'fields'      => 'ids',
        ]);

        $deleted_count = 0;
        if (!empty($tables)) {
            foreach ($tables as $table_id) {
                wp_delete_post($table_id, true);
                $deleted_count++;
            }
        }

        // 2. Clear all ProductBay post meta across the site
        global $wpdb;
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- One-time cleanup, caching not needed
        $wpdb->query(
            $wpdb->prepare(
                "DELETE FROM $wpdb->postmeta WHERE meta_key = %s",
                '_productbay_config'
            )
        );

        // 3. Delete plugin settings
        delete_option(self::OPTION_NAME);

        // 4. Reset onboarding state
        delete_option('productbay_onboarding_completed');

        return [
            'success'        => true,
            'deleted_tables' => $deleted_count,
            'settings'       => $this->defaults(),
        ];
    }

    /**
     * Get default plugin settings.
     *
     * Provides the full default configuration structure for new installations
     * and as a fallback for missing settings.
     *
     * @since 1.0.0
     *
     * @return array Default settings array.
     */
    private function defaults()
    {
        return [
            'add_to_cart_text' => 'Add to Cart',
            'products_per_page' => 10,
            'show_admin_bar' => true,
            'delete_on_uninstall' => true,
            'design' => [
                'header_bg' => '#f3f4f6',
                'border_color' => '#e5e7eb'
            ],
            // Default configuration for new tables
            'table_defaults' => [
                'source' => [
                    'type' => 'all',
                    'queryArgs' => [
                        'stockStatus' => 'any',
                    ],
                    'sort' => [
                        'orderBy' => 'date',
                        'order' => 'DESC',
                    ],
                ],
                'style' => [
                    'header' => [
                        'bgColor' => '#f0f0f1',
                        'textColor' => '#333333',
                        'fontSize' => '16px',
                    ],
                    'body' => [
                        'bgColor' => '#ffffff',
                        'textColor' => '#444444',
                        'rowAlternate' => false,
                        'altBgColor' => '#f9f9f9',
                        'altTextColor' => '#444444',
                        'borderColor' => '#e5e5e5',
                    ],
                    'button' => [
                        'bgColor' => '#2271b1',
                        'textColor' => '#ffffff',
                        'borderRadius' => '4px',
                        'icon' => 'cart',
                        'hoverBgColor' => '#135e96',
                        'hoverTextColor' => '#ffffff',
                    ],
                    'layout' => [
                        'borderStyle' => 'solid',
                        'borderColor' => '#e5e5e5',
                        'borderRadius' => '0px',
                        'cellPadding' => 'normal',
                    ],
                    'typography' => [
                        'headerFontWeight' => 'bold',
                    ],
                    'hover' => [
                        'rowHoverEnabled' => true,
                        'rowHoverBgColor' => '#f5f5f5',
                    ],
                    'responsive' => [
                        'mode' => 'standard',
                    ],
                ],
                'settings' => [
                    'features' => [
                        'search' => true,
                        'sorting' => true,
                        'pagination' => true,
                        'export' => false,
                        'priceRange' => false,
                    ],
                    'pagination' => [
                        'limit' => 10,
                        'position' => 'bottom',
                    ],
                    'cart' => [
                        'enable' => true,
                        'method' => 'button',
                        'showQuantity' => true,
                        'ajaxAdd' => true,
                    ],
                    'filters' => [
                        'enabled' => true,
                        'activeTaxonomies' => ['product_cat'],
                    ],
                ]
            ]
        ];
    }
}
