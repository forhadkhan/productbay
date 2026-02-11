import { __ } from '@wordpress/i18n';
import type { TableSettings, VisibilityMode } from '@/types';
import { Toggle } from '@/components/ui/Toggle';
import { Select } from '@/components/ui/Select';
import { SettingsOption } from '@/components/Table/SettingsOption';

export interface BulkSelectConfigProps {
    value?: TableSettings['features']['bulkSelect'];
    onChange: (config: TableSettings['features']['bulkSelect']) => void;
}

const VISIBILITY_OPTIONS = [
    { value: 'all', label: __('All devices', 'productbay') },
    { value: 'desktop', label: __('Desktop only', 'productbay') },
    { value: 'tablet', label: __('Tablet only', 'productbay') },
    { value: 'mobile', label: __('Mobile only', 'productbay') },
    { value: 'not-mobile', label: __('Hide on mobile', 'productbay') },
    { value: 'not-desktop', label: __('Hide on desktop', 'productbay') },
    { value: 'none', label: __('Hidden', 'productbay') },
];

/**
 * BulkSelectConfig Component
 * 
 * Reusable component for configuring bulk selection settings.
 */
export const BulkSelectConfig = ({ value, onChange }: BulkSelectConfigProps) => {
    // Default config to ensure we always have values to work with
    const config = value || {
        enabled: true,
        position: 'first',
        width: { value: 64, unit: 'px' },
        visibility: 'all'
    };

    const handleChange = (updates: Partial<typeof config>) => {
        onChange({ ...config, ...updates });
    };

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{__('Bulk Actions & Selection', 'productbay')}</h3>

            {/* Bulk Select Toggle */}
            <SettingsOption
                title={__('Enable Bulk Selection', 'productbay')}
                description={__('Adds a checkbox column and an "Add to Cart" button for bulk actions.', 'productbay')}
                className="px-0 hover:bg-transparent"
            >
                <Toggle
                    checked={config.enabled ?? true}
                    onChange={(e) => handleChange({ enabled: e.target.checked })}
                />
            </SettingsOption>

            {/* Conditional Settings */}
            {(config.enabled ?? true) && (
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Position */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            {__('Column Position', 'productbay')}
                        </label>
                        <Select
                            value={config.position ?? 'first'}
                            onChange={(val) => handleChange({ position: val as 'first' | 'last' })}
                            options={[
                                { value: 'first', label: __('First Column (Left)', 'productbay') },
                                { value: 'last', label: __('Last Column (Right)', 'productbay') }
                            ]}
                            size="xs"
                        />
                    </div>

                    {/* Visibility */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            {__('Visibility', 'productbay')}
                        </label>
                        <Select
                            value={config.visibility ?? 'all'}
                            onChange={(val) => handleChange({ visibility: val as VisibilityMode })}
                            options={VISIBILITY_OPTIONS}
                            size="xs"
                        />
                    </div>

                    {/* Width */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            {__('Column Width', 'productbay')}
                        </label>
                        <div className="flex gap-2">
                            {/* Only show value input when not 'auto' */}
                            {config.width?.unit !== 'auto' && (
                                <input
                                    type="number"
                                    min="0"
                                    value={config.width?.value ?? 64}
                                    onChange={(e) => handleChange({
                                        width: {
                                            ...(config.width || { unit: 'px' }),
                                            value: parseInt(e.target.value) || 0
                                        }
                                    })}
                                    className="flex-1 min-w-0 px-3 h-8 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            )}
                            <div className="flex-1">
                                <Select
                                    value={config.width?.unit ?? 'px'}
                                    onChange={(val) => handleChange({
                                        width: {
                                            ...(config.width || { value: 64 }),
                                            unit: val as 'px' | '%' | 'auto'
                                        }
                                    })}
                                    options={[
                                        { value: 'px', label: 'px' },
                                        { value: '%', label: '%' },
                                        { value: 'auto', label: __('Auto', 'productbay') }
                                    ]}
                                    size="xs"
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
