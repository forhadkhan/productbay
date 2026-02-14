<?php

namespace WpabProductBay\Api;

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

use WpabProductBay\Http\Request;
use WpabProductBay\Data\TableRepository;

class TablesController
{
    protected $repository;
    protected $request;

    public function __construct(TableRepository $repository, Request $request)
    {
        $this->repository = $repository;
        $this->request = $request;
    }

    public function index()
    {
        return $this->repository->get_tables();
    }

    public function show($request)
    {
        $id = $request['id'];
        return $this->repository->get_table($id);
    }

    public function store()
    {
        // Get raw data from $_REQUEST to avoid sanitization destroying nested structures
        // The Repository will handle field-specific sanitization (title, etc.)
        $data = $this->request->get('data');

        if (!$data) {
            return ['error' => 'No data provided'];
        }

        return $this->repository->save_table($data);
    }

    public function destroy($request)
    {
        $id = $request['id'];
        return $this->repository->delete_table($id);
    }
}
