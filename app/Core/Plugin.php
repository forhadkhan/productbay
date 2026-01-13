<?php
namespace ProductBay\Core;

use ProductBay\Admin\Admin;

class Plugin {
    public function run() {
        $this->load_dependencies();
        $this->define_admin_hooks();
    }

    private function load_dependencies() {
        // Load Activator/Deactivator, etc. here later
    }

    private function define_admin_hooks() {
        $admin = new Admin();
        add_action( 'admin_menu', [ $admin, 'register_menu' ] );
        add_action( 'admin_enqueue_scripts', [ $admin, 'enqueue_scripts' ] );
    }
}