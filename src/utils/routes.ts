import { ComponentType } from '@wordpress/element';
import Dashboard from '../pages/Dashboard';
import EditTable from '../pages/EditTable';
import Settings from '../pages/Settings';
import Tables from '../pages/Tables';
import Design from '../pages/Design';
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
} as const;

export const routes: RouteConfig[] = [
    {
        path: PATHS.DASHBOARD,
        element: Dashboard,
        label: 'Dashboard',
        showInNav: true
    },
    {
        path: '/tables',
        element: Tables,
        label: 'Tables',
        showInNav: true
    },
    {
        path: '/design',
        element: Design,
        label: 'Design',
        showInNav: true
    },
    {
        path: PATHS.SETTINGS,
        element: Settings,
        label: 'Settings',
        showInNav: true
    },
    {
        path: '/help',
        element: Help,
        label: 'Help',
        showInNav: true
    },
    {
        path: PATHS.NEW,
        element: EditTable,
        showInNav: false
    },
    {
        path: PATHS.EDIT,
        element: EditTable,
        showInNav: false
    }
];
