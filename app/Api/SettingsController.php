<?php

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

namespace WpabProductBay\Api;

use WpabProductBay\Http\Request;

class SettingsController
{
    protected $request;
    const OPTION_NAME = 'productbay_settings';

    public function __construct(Request $request)
    {
        $this->request = $request;
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
            'delete_on_uninstall' => true,
            'design' => [
                'header_bg' => '#f3f4f6',
                'border_color' => '#e5e7eb'
            ]
        ];
    }
}
