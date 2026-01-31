<?php

namespace WpabProductBay\Data;

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

class TableRepository
{
    /**
     * Post Type Name
     */
    const POST_TYPE = 'productbay_table';

    /**
     * Get all tables.
     */
    public function get_tables()
    {
        $query = new \WP_Query([
            'post_type' => self::POST_TYPE,
            'posts_per_page' => -1,
            'post_status' => 'publish'
        ]);

        $tables = [];
        foreach ($query->posts as $post) {
            $tables[] = $this->format_table($post);
        }
        return $tables;
    }

    /**
     * Get single table.
     */
    public function get_table($id)
    {
        $post = get_post($id);
        if (!$post || $post->post_type !== self::POST_TYPE) {
            return null;
        }
        return $this->format_table($post);
    }

    /**
     * Save table.
     */
    public function save_table($data)
    {
        $id = isset($data['id']) ? intval($data['id']) : 0;
        $title = isset($data['title']) ? sanitize_text_field($data['title']) : 'Untitled Table';

        $post_data = [
            'post_title' => $title,
            'post_type' => self::POST_TYPE,
            'post_status' => 'publish',
            'meta_input' => [
                '_productbay_config' => $data
            ]
        ];

        if ($id > 0) {
            $post_data['ID'] = $id;
            $post_id = wp_update_post($post_data);
        } else {
            $post_id = wp_insert_post($post_data);
        }

        if (is_wp_error($post_id)) {
            return ['error' => $post_id->get_error_message()];
        }

        return $this->get_table($post_id);
    }

    /**
     * Delete table.
     */
    public function delete_table($id)
    {
        return wp_delete_post($id, true);
    }

    private function format_table($post)
    {
        $config = get_post_meta($post->ID, '_productbay_config', true) ?: [];
        return [
            'id' => $post->ID,
            'title' => $post->post_title,
            'date' => $post->post_date,
            'status' => $post->post_status,
            'shortcode' => '[productbay id="' . $post->ID . '"]',
            'config' => $config
        ];
    }
}
