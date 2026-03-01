<?php

declare(strict_types=1);

namespace WpabProductBay\Api;

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

use WpabProductBay\Http\Request;
use WpabProductBay\Data\TableRepository;
use WpabProductBay\Frontend\TableRenderer;

/**
 * Class PreviewController
 *
 * Handles live preview rendering for the table editor.
 * Accepts table configuration via POST and returns rendered HTML.
 *
 * @since   1.0.0
 * @package WpabProductBay\Api
 */
class PreviewController extends ApiController
{
    /**
     * The table repository instance.
     *
     * @var TableRepository
     */
    protected $repository;

    /**
     * Initialize the controller.
     *
     * @since 1.0.0
     *
     * @param TableRepository $repository Table data repository.
     * @param Request         $request    HTTP request handler.
     */
    public function __construct(TableRepository $repository, Request $request)
    {
        parent::__construct($request);
        $this->repository = $repository;
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

        // Include the frontend CSS URL so the React preview iframe
        // can load the base stylesheet for proper style isolation
        $css_file = PRODUCTBAY_PATH . 'assets/css/frontend.css';
        $css_ver  = file_exists($css_file) ? filemtime($css_file) : PRODUCTBAY_VERSION;
        $css_url  = PRODUCTBAY_URL . 'assets/css/frontend.css?ver=' . $css_ver;

        return \rest_ensure_response([
            'html'   => $html,
            'cssUrl' => $css_url,
        ]);
    }
}
