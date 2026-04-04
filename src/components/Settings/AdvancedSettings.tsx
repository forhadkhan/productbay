import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { apiFetch } from '@/utils/api';
import { ProductTable } from '@/types';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';
import { ProBadge } from '@/components/ui/ProBadge';
import { useSettingsStore } from '@/store/settingsStore';
import { ProFeatureGate } from '@/components/ui/ProFeatureGate';
import { useImportExportStore } from '@/store/importExportStore';
import { SettingsOption } from '@/components/Table/SettingsOption';
import { DownloadIcon, UploadIcon, Settings2Icon, Loader2Icon } from 'lucide-react';

/**
 * AdvancedSettings Component
 */
const AdvancedSettings = () => {
    const { settings, updateSettings } = useSettingsStore();
    const { openImportModal, openExportModal } = useImportExportStore();
    const [exportLoading, setExportLoading] = useState(false);

    /**
     * Handler for exporting all tables
     */
    const handleExportAll = async () => {
        setExportLoading(true);
        try {
            const tables = await apiFetch<ProductTable[]>('tables');
            openExportModal(tables);
        } catch (error) {
            console.error('Failed to fetch tables for export', error);
        } finally {
            setExportLoading(false);
        }
    };

    /**
     * Handler for updating nested import/export settings
     */
    const updateImportExportSetting = (key: string, value: any) => {
        updateSettings({
            ...settings,
            import_export: {
                ...(settings.import_export || {}),
                [key]: value,
            },
        });
    };

    return (
        <div className="space-y-8 p-6 max-w-4xl">
            {/* Import & Export Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900 m-0">
                        {__('Import & Export', 'productbay')}
                    </h3>
                    <ProBadge />
                </div>

                <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
                    {__(
                        'Seamlessly transfer your table configurations and plugin settings between different WordPress installations. Ideal for moving from staging to production or sharing setups across multiple sites.',
                        'productbay'
                    )}
                </p>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 shadow-sm">
                    {/* Master Toggle */}
                    <SettingsOption
                        title={__('Enable Import/Export Features', 'productbay')}
                        description={__(
                            'Enable the import/export engine. This adds export buttons to the tables list and editor.',
                            'productbay'
                        )}
                    >
                        <ProFeatureGate
                            description={__(
                                'Unlock the ability to migrate your tables and settings with a single click.',
                                'productbay'
                            )}
                        >
                            <Toggle
                                checked={!!settings.enable_import_export}
                                onChange={(e) => updateSettings({ enable_import_export: e.target.checked })}
                            />
                        </ProFeatureGate>
                    </SettingsOption>

                    {/* Action Buttons */}
                    <div className="p-5 flex flex-wrap gap-4 bg-gray-50/30">
                        <ProFeatureGate featureName={__('Import Tables', 'productbay')}>
                            <Button variant="outline" onClick={openImportModal} className="flex items-center gap-2">
                                <UploadIcon className="w-4 h-4 text-blue-500" />
                                {__('Import Tables', 'productbay')}
                            </Button>
                        </ProFeatureGate>

                        <ProFeatureGate featureName={__('Export Tables', 'productbay')}>
                            <Button
                                variant="outline"
                                onClick={handleExportAll}
                                disabled={exportLoading}
                                className="flex items-center gap-2"
                            >
                                {exportLoading ? (
                                    <Loader2Icon className="w-4 h-4 animate-spin text-orange-500" />
                                ) : (
                                    <DownloadIcon className="w-4 h-4 text-orange-500" />
                                )}
                                {__('Export All Tables', 'productbay')}
                            </Button>
                        </ProFeatureGate>
                    </div>

                    {/* Secondary Settings */}
                    <div className="p-5 space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Settings2Icon className="w-4 h-4 text-gray-400" />
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest m-0">
                                {__('Export Configuration', 'productbay')}
                            </h4>
                        </div>

                        <SettingsOption
                            title={__('Include Global Plugin Settings', 'productbay')}
                            description={__(
                                'When exporting tables, also include your main plugin preferences (styling, defaults, etc.).',
                                'productbay'
                            )}
                        >
                            <ProFeatureGate featureName={__('Include Settings', 'productbay')}>
                                <Toggle
                                    checked={!!settings.import_export?.include_settings}
                                    onChange={(e) => updateImportExportSetting('include_settings', e.target.checked)}
                                />
                            </ProFeatureGate>
                        </SettingsOption>

                        <SettingsOption
                            title={__('Default Settings Import Mode', 'productbay')}
                            description={__(
                                'Merge: Keep current settings and add missing ones. Replace: Overwrite current settings with the imported ones.',
                                'productbay'
                            )}
                        >
                            <ProFeatureGate featureName={__('Import Mode', 'productbay')}>
                                <select
                                    value={settings.import_export?.settings_import_mode || 'merge'}
                                    onChange={(e) =>
                                        updateImportExportSetting('settings_import_mode', e.target.value)
                                    }
                                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-wp-bg transition-all"
                                >
                                    <option value="merge">{__('Merge (Safe)', 'productbay')}</option>
                                    <option value="replace">{__('Replace (Full Overwrite)', 'productbay')}</option>
                                </select>
                            </ProFeatureGate>
                        </SettingsOption>
                    </div>
                </div>
            </section>

            {/* Future Advanced Sections can go here */}
        </div>
    );
};

export default AdvancedSettings;