<?php

/**
 * Uninstall ProductBay
 *
 * This file is called when the plugin is deleted from the WordPress admin dashboard.
 * It is responsible for cleaning up all plugin-related data from the database,
 * ensuring no "ghost data" or orphan tables/options are left behind.
 * 
 * @since      1.0.0    
 * @package    ProductBay
 * @author     WPAnchorBay
 * @copyright  2026 WPAnchorBay
 * @license    GPL-2.0-or-later
 * @link       https://wpanchorbay.com/products/productbay
 */

// If uninstall.php is not called by WordPress, die.
if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

/**
 * Cleanup Logic:
 * 
 * 1. Check if the user has enabled "Delete data on uninstall" (Default: true)
 * 2. Delete all 'productbay_table' posts (Custom Post Type)
 * 3. Delete all post meta associated with these posts
 * 4. Delete plugin options and settings
 */

$productbay_settings = get_option('productbay_settings');

/**
 * Robust Boolean Check:
 * If the setting is not in the database, we default to 'true' 
 * (as defined in the plugin's default configuration).
 */
$productbay_delete_on_uninstall = true;
if (is_array($productbay_settings) && isset($productbay_settings['delete_on_uninstall'])) {
    $productbay_delete_on_uninstall = (bool) $productbay_settings['delete_on_uninstall'];
}

// Proceed only if delete_on_uninstall is true (enabled by default)
if ($productbay_delete_on_uninstall) {

    // 1. Delete all Table posts
    // We fetch only IDs for better performance during batch deletion
    $productbay_tables = get_posts([
        'post_type'   => 'productbay_table',
        'numberposts' => -1,
        'post_status' => 'any',
        'fields'      => 'ids',
    ]);

    if (!empty($productbay_tables)) {
        foreach ($productbay_tables as $productbay_table_id) {
            // Force delete (true) bypasses the trash and removes all associated meta
            wp_delete_post($productbay_table_id, true);
        }
    }

    // 2. Delete Plugin Options
    delete_option('productbay_settings');

    // 3. Clear any potential transients or temporary data
    // (Add transient cleanup here if implemented in the future)

    // 4. Extra Safety Net: Clear all ProductBay metadata across the site
    global $wpdb;
    // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- One-time cleanup during uninstall, caching not needed
    $wpdb->query(
        $wpdb->prepare(
            "DELETE FROM $wpdb->postmeta WHERE meta_key = %s",
            '_productbay_config'
        )
    );
}
