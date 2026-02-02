import { memo } from 'react';
import { __ } from '@wordpress/i18n';
import { Toggle } from '@/components/ui/Toggle';
import { Skeleton } from '@/components/ui/Skeleton';

interface AdminBarOptionsProps {
    settings: any;
    setSettings: (settings: any) => void;
    loading: boolean;
}

/**
 * AdminBarOptions Component
 *
 * Settings section for controlling the display of ProductBay in the WordPress admin bar.
 * When enabled, the plugin will show a quick-access menu in the top admin bar.
 */
const AdminBarOptions = memo(({ settings, setSettings, loading }: AdminBarOptionsProps) => {
    // Show skeleton loading state while settings are being fetched
    if (loading) {
        return (
            <div className="p-6">
                <div className="h-7 w-40 bg-gray-200 rounded animate-pulse mb-6" />
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                    <div className="space-y-2">
                        <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <Skeleton className="h-6 w-11 rounded-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mt-0 mb-4">
                {__('Admin Bar', 'productbay')}
            </h3>
            <div className="flex items-center justify-between p-4 border border-gray-200 bg-gray-50 rounded-lg">
                <div>
                    <span className="font-medium text-gray-800">
                        {__('Show in Admin Bar', 'productbay')}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                        {__('Display ProductBay menu in the WordPress admin bar at the top of the page for quick access.', 'productbay')}
                    </p>
                </div>
                <Toggle
                    checked={settings.show_admin_bar ?? true}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            show_admin_bar: e.target.checked,
                        })
                    }
                    disabled={loading}
                    className="flex-shrink-0 border-gray-200"
                />
            </div>
        </div>
    );
});

export default AdminBarOptions;
