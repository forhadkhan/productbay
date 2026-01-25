<?php

declare(strict_types=1);

namespace WpabProductBay\Core;

/**
 * Class Constants
 * 
 * Centralized constants for the ProductBay plugin.
 *
 * @package WpabProductBay\Core
 */
class Constants
{
    /**
     * Plugin Version
     */
    public const VERSION = '1.0.0';

    /**
     * Plugin Slug
     */
    public const PLUGIN_SLUG = 'productbay';

    /**
     * Menu Slug
     */
    public const MENU_SLUG = 'productbay';

    /**
     * Text Domain
     */
    public const TEXT_DOMAIN = 'productbay';

    /**
     * User Capability required to access settings
     */
    public const CAPABILITY = 'manage_options';

    /**
     * Menu Icon (Base64 SVG)
     */
    public const MENU_ICON = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNDggMEM1Ni44MzY2IDAgNjQgNy4xNjM0NCA2NCAxNlY0OEM2NCA1Ni44MzY2IDU2LjgzNjYgNjQgNDggNjRIMTZDNy4xNjM0NCA2NCAwIDU2LjgzNjYgMCA0OFYxNkMwIDcuMTYzNDQgNy4xNjM0NCAwIDE2IDBINDhaTTIxLjc1NTkgMTMuNDI3N0MxNy4wNDM0IDEzLjQyOCAxMy4yMjMgMTcuMjQ4NSAxMy4yMjI3IDIxLjk2MDlWNDIuMjI3NUM0Ni43MzUzIDUwLjc2MDcgNTAuNTU1NyA0Ni45NDA0IDUwLjU1NTcgNDIuMjI3NVYyMS45NjA5QzUwLjU1NTMgMTcuMjQ4NCA0Ni43MzNTEgMTMuNDI3NyA0Mi4wMjI1IDEzLjQyNzdIMjEuNzU1OUMxNy40ODkzIDQ0LjU4MzkgMTcuNDg5MyA0Mi4yMjc1VjMxLjAyNzNIMjQuOTU5Wk00Ni4yODkxIDMxLjAyNzNWNDIuMjI3NUM0Ni4yODkxIDQ0LjU4MzkgNDQuMzc4OSA0Ni40OTQxIDQyLjAyMjUgNDYuNDk0MUgyOS4yMjU2VjMxLjAyNzNINDYuMjg5MVpNMjQuOTU5IDE3LjY5NDNWMjYuNzYwN0gxNy40ODkzVjIxLjk2MDlDMTcuNDg5NiAxOS42MDQ5IDE5LjM5OTggMTcuNjk0NiAyMS43NTU5IDE3LjY5NDNIMjQuOTU5Wk00Mi4wMjI1MTcuNjk0M0M0NC4zNzg3IDE3LjY5NDMgNDYuMjg4NyAxOS42MDQ4IDQ2LjI4OTEgMjEuOTYwOVYyNi43NjA3SDI5LjIyNTZWMTcuNjk0M0g0Mi4wMjI1WiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=';
}
