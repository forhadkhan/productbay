<?php

namespace WpabProductBay\Http;

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

class Request
{
    public function __construct()
    {
        $this->handleJsonInput();
    }

    /**
     * Handle JSON input for REST API requests
     */
    private function handleJsonInput()
    {
        if (
            isset($_SERVER['CONTENT_TYPE']) &&
            strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false
        ) {
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);

            // error_log('ProductBay API Input: ' . print_r($data, true));

            if (is_array($data)) {
                $_REQUEST = array_merge($_REQUEST, $data);
            }
        }
    }
    /**
     * Get a value from $_REQUEST with sanitization.
     */
    public function get($key, $default = null)
    {
        if (! isset($_REQUEST[$key])) {
            return $default;
        }

        return $this->sanitize($_REQUEST[$key]);
    }

    /**
     * Sanitize input.
     */
    public function sanitize($value)
    {
        if (is_array($value)) {
            return array_map([$this, 'sanitize'], $value);
        }

        if (is_bool($value)) {
            return $value;
        }

        return \sanitize_text_field(wp_unslash($value));
    }

    /**
     * Get integer value.
     */
    public function int($key, $default = 0)
    {
        $value = $this->get($key, $default);
        return intval($value);
    }
}
