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

export const routes: RouteConfig[] = [
    {
        path: '/',
        element: Dashboard,
        label: 'Tables',
        showInNav: true
    },
    {
        path: '/new',
        element: EditTable,
        showInNav: false
    },
    {
        path: '/edit/:id',
        element: EditTable,
        showInNav: false
    },
    {
        path: '/settings',
        element: Settings,
        label: 'Settings',
        showInNav: true
    }
];
