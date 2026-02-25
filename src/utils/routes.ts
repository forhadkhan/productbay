import { ComponentType } from '@wordpress/element';
import Dashboard from '@/pages/Dashboard';
import Settings from '@/pages/Settings';
import { __ } from '@wordpress/i18n';
import Tables from '@/pages/Tables';
import Table from '@/pages/Table';

/**
 * Route configuration interface
 * Defines structure for navigation routes
 */
export interface RouteConfig {
	path: string;
	element: ComponentType;
	label?: string;
	showInNav?: boolean;
}

/**
 * Application path constants
 * Centralized path definitions for routing
 */
export const PATHS = {
	DASHBOARD: '/dash',
	NEW: '/new',
	SETTINGS: '/settings',
	TABLES: '/tables',
	TABLE_EDITOR: '/table/:id',
} as const;

/**
 * Application routes configuration
 * Includes path, component, and navigation visibility
 * Labels are translatable for i18n support
 */
export const routes: RouteConfig[] = [
	{
		path: PATHS.DASHBOARD,
		element: Dashboard,
		label: __('Dashboard', 'productbay'),
		showInNav: false,
	},
	{
		path: PATHS.TABLES,
		element: Tables,
		label: __('Tables', 'productbay'),
		showInNav: true,
	},
	{
		path: PATHS.SETTINGS,
		element: Settings,
		label: __('Settings', 'productbay'),
		showInNav: true,
	},
	{
		path: PATHS.NEW,
		element: Table,
		showInNav: false,
	},
	{
		path: PATHS.TABLE_EDITOR,
		element: Table,
		showInNav: false,
	},
];

/** WooCommerce admin paths */
export const WC_PRODUCTS_PATH = '/wp-admin/edit.php?post_type=product';
export const WC_ADD_PRODUCT_PATH = '/wp-admin/post-new.php?post_type=product';
export const WC_ADMIN_PRODUCTS_PATH =
	'/wp-admin/admin.php?page=wc-admin&task=products';

export const PRODUCTBAY_VIDEO_GUIDE_URL = 'https://www.youtube.com/watch?v=VIDEO_ID';
export const PRODUCTBAY_DOCUMENTATION_URL = 'https://productbay.wpanchorbay.com';
export const PRODUCTBAY_SUPPORT_URL = 'https://wpanchorbay.com/support/';
export const PRODUCTBAY_LANDING_PAGE_URL = 'https://wpanchorbay.com/productbay/';