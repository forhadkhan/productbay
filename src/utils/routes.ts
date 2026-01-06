import { ComponentType } from '@wordpress/element';
import Dashboard from '../pages/Dashboard';
import EditTable from '../pages/EditTable';
import Settings from '../pages/Settings';

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
        label: 'Tables',
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
    },
    {
        path: PATHS.SETTINGS,
        element: Settings,
        label: 'Settings',
        showInNav: true
    }
];
