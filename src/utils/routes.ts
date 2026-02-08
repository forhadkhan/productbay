import { ComponentType } from '@wordpress/element';
import Dashboard from '@/pages/Dashboard';
import EditTable from '@/pages/EditTable';
import Settings from '@/pages/Settings';
import { __ } from '@wordpress/i18n';
import Tables from '@/pages/Tables';
import Design from '@/pages/Design';
import Table from '@/pages/Table';
import Help from '@/pages/Help';

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
	EDIT: '/table/:id',
	SETTINGS: '/settings',
	HELP: '/help',
	TABLES: '/tables',
	DESIGN: '/design',
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
		showInNav: true,
	},
	{
		path: PATHS.TABLES,
		element: Tables,
		label: __('Tables', 'productbay'),
		showInNav: true,
	},
	{
		path: PATHS.DESIGN,
		element: Design,
		label: __('Design', 'productbay'),
		showInNav: false,
	},
	{
		path: PATHS.SETTINGS,
		element: Settings,
		label: __('Settings', 'productbay'),
		showInNav: true,
	},
	{
		path: PATHS.HELP,
		element: Help,
		label: __('Help', 'productbay'),
		showInNav: false,
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
	{
		path: PATHS.EDIT,
		element: EditTable,
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
export const PRODUCTBAY_SUPPORT_URL = 'https://productbay.wpanchorbay.com/support';