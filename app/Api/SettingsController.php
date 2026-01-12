<?php

namespace ProductBay\Api;

use ProductBay\Http\Request;

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

    public function update_settings()
    {
        $settings = $this->request->get('settings');
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
            'delete_on_uninstall' => false,
            'design' => [
                'header_bg' => '#f3f4f6',
                'border_color' => '#e5e7eb'
            ]
        ];
    }
}
