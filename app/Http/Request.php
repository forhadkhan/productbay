<?php

namespace WpabProductBay\Http;

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

class Request
{
    private $rawData = [];

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
            strpos(sanitize_text_field(wp_unslash($_SERVER['CONTENT_TYPE'])), 'application/json') !== false
        ) {
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);

            $input = file_get_contents('php://input');
            $data = json_decode($input, true);

            if (is_array($data)) {
                // Store raw data in object property to prevent loss
                $this->rawData = $data;
                // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Nonce verification is handled at the endpoint level
                $_REQUEST = array_merge($_REQUEST, $data);
            }
        }
    }
    /**
     * Get a value from $_REQUEST with sanitization.
     * For 'data' key, returns raw unsanitized data to preserve complex structures.
     */
    public function get($key, $default = null)
    {
        // Special handling for 'data' key - return raw data without sanitization
        if ($key === 'data' && isset($this->rawData['data'])) {
            return $this->rawData['data'];
        }

        // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Nonce verification is handled at the endpoint level
        if (! isset($_REQUEST[$key])) {
            return $default;
        }

        // phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.MissingUnslash, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- Value is sanitized by $this->sanitize() which calls wp_unslash() and sanitize_text_field()
        return $this->sanitize($_REQUEST[$key]);
    }

    /**
     * Sanitize input.
     * Preserves complex data structures (arrays/objects) for API data.
     */
    public function sanitize($value)
    {
        // Preserve arrays and objects - recursively sanitize array values
        if (is_array($value)) {
            return array_map([$this, 'sanitize'], $value);
        }

        // Preserve booleans
        if (is_bool($value)) {
            return $value;
        }

        // Preserve numeric values
        if (is_numeric($value)) {
            return $value;
        }

        // Preserve null
        if (is_null($value)) {
            return $value;
        }

        // Only sanitize actual strings
        if (is_string($value)) {
            return \sanitize_text_field(wp_unslash($value));
        }

        // For any other type, return as-is
        return $value;
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
