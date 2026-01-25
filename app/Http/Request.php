<?php

namespace ProductBay\Http;

class Request
{
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
