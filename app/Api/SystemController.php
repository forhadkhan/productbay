<?php

namespace ProductBay\Api;

use ProductBay\Http\Request;
use ProductBay\Data\TableRepository;

class SystemController
{
    protected $repository;
    protected $request;

    public function __construct(TableRepository $repository, Request $request)
    {
        $this->repository = $repository;
        $this->request = $request;
    }

    public function get_status()
    {
        $wc_active = class_exists('WooCommerce');
        $product_count = 0;

        if ($wc_active) {
            $query = new \WP_Query([
                'post_type' => 'product',
                'post_status' => 'publish',
                'posts_per_page' => 1,
                'fields' => 'ids'
            ]);
            $product_count = $query->found_posts;
        }

        $tables = $this->repository->get_tables();
        $table_count = count($tables);

        return [
            'wc_active' => $wc_active,
            'product_count' => $product_count,
            'table_count' => $table_count,
            'version' => PRODUCTBAY_VERSION
        ];
    }
}
