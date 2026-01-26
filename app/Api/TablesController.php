<?php

namespace WpabProductBay\Api;

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
        $data = $this->request->get('data');
        return $this->repository->save_table($data);
    }

    public function destroy($request)
    {
        $id = $request['id'];
        return $this->repository->delete_table($id);
    }
}
