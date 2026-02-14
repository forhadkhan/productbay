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
            'post_status' => 'any' // Return all tables (publish, draft, etc.)
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

        // Frontend sends 'title' and 'status', not 'tableTitle' and 'tableStatus'
        $title = isset($data['title']) ? sanitize_text_field($data['title']) : 'Untitled Table';
        $status = isset($data['status']) ? $data['status'] : 'publish';

        // Extract components
        $source = isset($data['source']) ? $data['source'] : [];
        $columns = isset($data['columns']) ? $data['columns'] : [];
        $settings = isset($data['settings']) ? $data['settings'] : [];
        $style = isset($data['style']) ? $data['style'] : [];




        $post_data = [
            'post_title' => $title,
            'post_type' => self::POST_TYPE,
            'post_status' => $status,
            'meta_input' => [
                '_productbay_source' => $source,
                '_productbay_columns' => $columns,
                '_productbay_settings' => $settings,
                '_productbay_style' => $style,
                // Validating existence of legacy key removal
                '_productbay_config' => '' // Clear legacy config to avoid confusion
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
        // Retrieve individual meta keys
        $source = get_post_meta($post->ID, '_productbay_source', true) ?: [];
        $columns = get_post_meta($post->ID, '_productbay_columns', true) ?: [];
        $settings = get_post_meta($post->ID, '_productbay_settings', true) ?: [];
        $style = get_post_meta($post->ID, '_productbay_style', true) ?: [];



        // Fallback for legacy data if source is empty but legacy config exists
        if (empty($source)) {
            $legacy_config = get_post_meta($post->ID, '_productbay_config', true);
            if (!empty($legacy_config)) {
                // Attempt to map from legacy if possible, or just return basic structure
                // For now, if migration is needed, it should be done separately. 
                // We return empty defaults which front-end will handle.
            }
        }

        return [
            'id' => $post->ID,
            'title' => $post->post_title,
            'status' => $post->post_status,
            'date' => $post->post_date,
            'shortcode' => '[productbay id="' . $post->ID . '"]',
            'source' => $source,
            'columns' => $columns,
            'settings' => $settings,
            'style' => $style,
        ];
    }
}
