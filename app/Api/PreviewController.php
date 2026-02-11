<?php

namespace WpabProductBay\Api;

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

use WpabProductBay\Http\Request;
use WpabProductBay\Data\TableRepository;
use WpabProductBay\Frontend\TableRenderer;

class PreviewController
{
    /**
     * @var TableRepository
     */
    protected $repository;

    /**
     * @var Request
     */
    protected $request;

    /**
     * @param TableRepository $repository
     * @param Request $request
     */
    public function __construct(TableRepository $repository, Request $request)
    {
        $this->repository = $repository;
        $this->request = $request;
    }

    /**
     * Render the table preview
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function preview($request)
    {
        $data = $request->get_json_params();

        // If 'data' wrapper exists (like in save), unwrap it
        if (isset($data['data'])) {
            $data = $data['data'];
        }

        // Initialize Renderer
        // We might want to inject this, but for now instantiating is fine as it has simple dependencies
        $renderer = new TableRenderer($this->repository);
        
        // Render the HTML
        $html = $renderer->render($data);

        return \rest_ensure_response(['html' => $html]);
    }
}
