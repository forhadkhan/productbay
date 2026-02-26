<?php

namespace WpabProductBay\Api;

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

use WpabProductBay\Http\Request;

class SettingsController extends ApiController
{
    const OPTION_NAME = 'productbay_settings';

    public function __construct(Request $request)
    {
        parent::__construct($request);
    }

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
