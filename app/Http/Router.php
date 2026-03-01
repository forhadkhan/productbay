<?php

declare(strict_types=1);

namespace WpabProductBay\Http;

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

use WpabProductBay\Data\TableRepository;

/**
 * Class Router
 *
 * Registers all REST API routes for the ProductBay plugin.
 * Maps HTTP methods and endpoints to their respective controller callbacks
 * with capability-based permission checks.
 *
 * @since   1.0.0
 * @package WpabProductBay\Http
 */
class Router
{
    /**
     * @var TableRepository
     */
    protected $repository;

    /**
     * @var Request
     */
    protected $request;

    public function __construct(TableRepository $repository, Request $request)
    {
        $this->repository = $repository;
        $this->request = $request;
    }

    /**
     * Initialize the router by hooking into rest_api_init.
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function init()
    {
        \add_action('rest_api_init', [$this, 'register_routes']);
    }

    /**
     * Register all REST API routes.
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function register_routes()
    {
        $controller = new \WpabProductBay\Api\TablesController($this->repository, $this->request);

        // List Tables
        \register_rest_route('productbay/v1', '/tables', [
            'methods'  => 'GET',
            'callback' => [$controller, 'index'],
            'permission_callback' => [$this, 'permission_check']
        ]);

        // Create/Update Table
        \register_rest_route('productbay/v1', '/tables', [
            'methods'  => 'POST',
            'callback' => [$controller, 'store'],
            'permission_callback' => [$this, 'permission_check']
        ]);

        // Get Single Table
        \register_rest_route('productbay/v1', '/tables/(?P<id>\d+)', [
            'methods'  => 'GET',
            'callback' => [$controller, 'show'],
            'permission_callback' => [$this, 'permission_check']
        ]);

        // Delete Table
        \register_rest_route('productbay/v1', '/tables/(?P<id>\d+)', [
            'methods'  => 'DELETE',
            'callback' => [$controller, 'destroy'],
            'permission_callback' => [$this, 'permission_check']
        ]);

        // Settings
        $settings_controller = new \WpabProductBay\Api\SettingsController($this->request);
        \register_rest_route('productbay/v1', '/settings', [
            'methods'  => 'GET',
            'callback' => [$settings_controller, 'get_settings'],
            'permission_callback' => [$this, 'permission_check']
        ]);

        \register_rest_route('productbay/v1', '/settings', [
            'methods'  => 'POST',
            'callback' => [$settings_controller, 'update_settings'],
            'permission_callback' => [$this, 'permission_check']
        ]);

        \register_rest_route('productbay/v1', '/settings/reset', [
            'methods'  => 'POST',
            'callback' => [$settings_controller, 'reset_settings'],
            'permission_callback' => [$this, 'permission_check']
        ]);

        \register_rest_route('productbay/v1', '/system/status', [
            'methods'  => 'GET',
            'callback' => [new \WpabProductBay\Api\SystemController($this->repository, $this->request), 'get_status'],
            'permission_callback' => [$this, 'permission_check']
        ]);

        \register_rest_route('productbay/v1', '/system/onboard', [
            'methods'  => 'POST',
            'callback' => [new \WpabProductBay\Api\SystemController($this->repository, $this->request), 'mark_onboarded'],
            'permission_callback' => [$this, 'permission_check']
        ]);

        // Products & Categories
        $products_controller = new \WpabProductBay\Api\ProductsController($this->request);

        \register_rest_route('productbay/v1', '/products', [
            'methods'  => 'GET',
            'callback' => [$products_controller, 'index'],
            'permission_callback' => [$this, 'permission_check']
        ]);

        \register_rest_route('productbay/v1', '/categories', [
            'methods'  => 'GET',
            'callback' => [$products_controller, 'categories'],
            'permission_callback' => [$this, 'permission_check']
        ]);

        \register_rest_route('productbay/v1', '/source-stats', [
            'methods'  => 'GET',
            'callback' => [$products_controller, 'sourceStats'],
            'permission_callback' => [$this, 'permission_check']
        ]);

        // Live Preview
        $preview_controller = new \WpabProductBay\Api\PreviewController($this->repository, $this->request);
        \register_rest_route('productbay/v1', '/preview', [
            'methods'  => 'POST',
            'callback' => [$preview_controller, 'preview'],
            'permission_callback' => [$this, 'permission_check']
        ]);
    }



    /**
     * Check if the current user has permission to access the API.
     *
     * @since 1.0.0
     *
     * @return bool True if user has 'manage_options' capability.
     */
    public function permission_check()
    {
        return \current_user_can('manage_options');
    }
}
