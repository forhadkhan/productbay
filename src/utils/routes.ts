import { ComponentType } from '@wordpress/element';
import Dashboard from '../pages/Dashboard';
import EditTable from '../pages/EditTable';
import Settings from '../pages/Settings';
import Tables from '../pages/Tables';
import Design from '../pages/Design';
import Table from '../pages/Table';
import Help from '../pages/Help';

export interface RouteConfig {
	path: string;
	element: ComponentType;
	label?: string;
	showInNav?: boolean;
}

export const PATHS = {
	DASHBOARD: '/',
	NEW: '/new',
	EDIT: '/edit/:id',
	SETTINGS: '/settings',
	HELP: '/help',
	TABLES: '/tables',
	DESIGN: '/design',
} as const;

export const routes: RouteConfig[] = [
	{
		path: PATHS.DASHBOARD,
		element: Dashboard,
		label: 'Dashboard',
		showInNav: true,
	},
	{
		path: PATHS.TABLES,
		element: Tables,
		label: 'Tables',
		showInNav: true,
	},
	{
		path: PATHS.DESIGN,
		element: Design,
		label: 'Design',
		showInNav: false,
	},
	{
		path: PATHS.SETTINGS,
		element: Settings,
		label: 'Settings',
		showInNav: true,
	},
	{
		path: PATHS.HELP,
		element: Help,
		label: 'Help',
		showInNav: false,
	},
	{
		path: PATHS.NEW,
		element: Table,
		showInNav: false,
	},
	{
		path: PATHS.EDIT,
		element: EditTable,
		showInNav: false,
	},
];

export const WC_PRODUCTS_PATH = '/wp-admin/edit.php?post_type=product';
export const WC_ADD_PRODUCT_PATH = '/wp-admin/post-new.php?post_type=product';
export const WC_ADMIN_PRODUCTS_PATH =
	'/wp-admin/admin.php?page=wc-admin&task=products';
