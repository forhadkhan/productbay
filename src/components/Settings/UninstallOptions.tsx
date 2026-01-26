import { memo } from 'react';
import { Skeleton } from '../ui/Skeleton';

interface UninstallOptionsProps {
    settings: any;
    setSettings: (settings: any) => void;
    loading: boolean;
}

const UninstallOptions = memo(({ settings, setSettings, loading }: UninstallOptionsProps) => {
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
            <h3 className="text-lg font-semibold text-red-600 mt-0 mb-4">
                Uninstall Options
            </h3>
            <div className="flex items-center justify-between p-4 border border-red-100 bg-red-50 rounded-lg">
                <div>
                    <span className="font-medium text-gray-800">
                        Delete Data on Uninstall
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                        Enable this to wipe all tables and settings when
                        deleting the plugin.
                    </p>
                </div>
                <input
                    type="checkbox"
                    checked={settings.delete_on_uninstall || false}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            delete_on_uninstall: e.target.checked,
                        })
                    }
                    className="toggle"
                    disabled={loading}
                />
            </div>
        </div>
    );
});

export default UninstallOptions;
