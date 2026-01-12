<?php

namespace ProductBay\Core;

use ProductBay\Admin\Admin;

class Plugin
{
    /**
     * @var \ProductBay\Data\TableRepository
     */
    protected $table_repository;

    /**
     * @var \ProductBay\Http\Request
     */
    protected $request;

    public function run()
    {
        $this->load_dependencies();
        $this->init_components();
    }

    private function load_dependencies()
    {
        $this->table_repository = new \ProductBay\Data\TableRepository();
        $this->request = new \ProductBay\Http\Request();
    }

    private function init_components()
    {
        // Admin Area
        if (is_admin()) {
            $admin = new Admin($this->table_repository, $this->request);
            \add_action('admin_menu', [$admin, 'register_menu']);
            \add_action('admin_enqueue_scripts', [$admin, 'enqueue_scripts']);
        }

        // API Router
        $router = new \ProductBay\Http\Router($this->table_repository, $this->request);
        $router->init();

        // Frontend
        $table_renderer = new \ProductBay\Frontend\TableRenderer($this->table_repository);
        $table_renderer->init();

        $ajax_renderer = new \ProductBay\Frontend\AjaxRenderer($this->table_repository, $this->request);
        $ajax_renderer->init();
    }
}
