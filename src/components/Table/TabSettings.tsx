import React from 'react';
import { __ } from '@wordpress/i18n';
import { useTableStore } from '@/store/tableStore';
import { Toggle } from '@/components/ui/Toggle';
import { SettingsIcon, ShoppingCartIcon, FilterIcon, ZapIcon, SlidersIcon } from 'lucide-react';

/* =============================================================================
 * TabSettings Component
 * =============================================================================
 * Handles advanced configuration for the table:
 * - General Features (Sorting, Export, Mobile Accordion)
 * - Cart Settings (Method, Quantity, AJAX)
 * - Filter Configuration (Position)
 * - Performance (Product Limit)
 * ============================================================================= */

/**
 * Section container helper
 */
const SettingsSection = ({
    icon: Icon,
    title,
    description,
    children
}: {
    icon: React.ElementType,
    title: string,
    description?: string,
    children: React.ReactNode
}) => (
    <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 flex items-start gap-3">
            <div className="p-2 bg-white border border-gray-200 rounded-md text-gray-500 shadow-sm">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
            </div>
        </div>
        <div className="p-5 space-y-6">
            {children}
        </div>
    </section>
);

/**
 * Settings Row helper
 */
const SettingsRow = ({
    label,
    description,
    control
}: {
    label: string,
    description: string,
    control: React.ReactNode
}) => (
    <div className="flex items-center justify-between">
        <div>
            <label className="text-sm font-medium text-gray-900 block">{label}</label>
            <p className="text-xs text-gray-500">{description}</p>
        </div>
        {control}
    </div>
);

const TabSettings: React.FC = () => {
    const {
        settings,
        setFeatures,
        setPagination,
        setCart,
        setFilters,
        setPerformance,
    } = useTableStore();

    return (
        <div className="max-w-4xl mx-auto py-6 space-y-8">

            {/* General Settings */}
            <SettingsSection
                icon={SettingsIcon}
                title={__('General Settings', 'productbay')}
                description={__('Configure core table features', 'productbay')}
            >
                <SettingsRow
                    label={__('Enable Sorting', 'productbay')}
                    description={__('Allow users to click column headers to sort', 'productbay')}
                    control={
                        <Toggle
                            checked={settings.features.sorting}
                            onChange={(e) => setFeatures({ sorting: e.target.checked })}
                        />
                    }
                />
                <SettingsRow
                    label={__('Enable Export', 'productbay')}
                    description={__('Show buttons to export table to CSV/PDF', 'productbay')}
                    control={
                        <Toggle
                            checked={settings.features.export}
                            onChange={(e) => setFeatures({ export: e.target.checked })}
                        />
                    }
                />
                <SettingsRow
                    label={__('Responsive Accordion', 'productbay')}
                    description={__('Collapse extra columns into an accordion on mobile', 'productbay')}
                    control={
                        <Toggle
                            checked={settings.features.responsiveCollapse}
                            onChange={(e) => setFeatures({ responsiveCollapse: e.target.checked })}
                        />
                    }
                />

                <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-gray-900 block">
                                {__('Pagination Position', 'productbay')}
                            </label>
                            <p className="text-xs text-gray-500">{__('Where to display pagination controls', 'productbay')}</p>
                        </div>
                        <select
                            value={settings.pagination.position}
                            onChange={(e) => setPagination({ position: e.target.value as any })}
                            className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="bottom">{__('Bottom', 'productbay')}</option>
                            <option value="top">{__('Top', 'productbay')}</option>
                            <option value="both">{__('Both', 'productbay')}</option>
                        </select>
                    </div>
                </div>
            </SettingsSection>

            {/* Cart Settings */}
            <SettingsSection
                icon={ShoppingCartIcon}
                title={__('Cart / functionality', 'productbay')}
                description={__('Configure Add to Cart behavior', 'productbay')}
            >
                <SettingsRow
                    label={__('Enable Add to Cart', 'productbay')}
                    description={__('Allow users to add products to cart directly', 'productbay')}
                    control={
                        <Toggle
                            checked={settings.cart.enable}
                            onChange={(e) => setCart({ enable: e.target.checked })}
                        />
                    }
                />

                {settings.cart.enable && (
                    <div className="space-y-6 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-1">
                        <SettingsRow
                            label={__('Show Quantity', 'productbay')}
                            description={__('Display quantity selector next to button', 'productbay')}
                            control={
                                <Toggle
                                    checked={settings.cart.showQuantity}
                                    onChange={(e) => setCart({ showQuantity: e.target.checked })}
                                />
                            }
                        />
                        <SettingsRow
                            label={__('AJAX Add to Cart', 'productbay')}
                            description={__('Add to cart without reloading the page', 'productbay')}
                            control={
                                <Toggle
                                    checked={settings.cart.ajaxAdd}
                                    onChange={(e) => setCart({ ajaxAdd: e.target.checked })}
                                />
                            }
                        />

                        <div className="flex items-center justify-between">
                            <div>
                                <label className="text-sm font-medium text-gray-900 block">
                                    {__('Cart Method', 'productbay')}
                                </label>
                                <p className="text-xs text-gray-500">{__('Interaction style for adding to cart', 'productbay')}</p>
                            </div>
                            <select
                                value={settings.cart.method}
                                onChange={(e) => setCart({ method: e.target.value as any })}
                                className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="button">{__('Button (Default)', 'productbay')}</option>
                                <option value="checkbox">{__('Checkbox (Multi-select)', 'productbay')}</option>
                                <option value="text">{__('Text Link', 'productbay')}</option>
                            </select>
                        </div>
                    </div>
                )}
            </SettingsSection>

            {/* Filter Settings */}
            <SettingsSection
                icon={FilterIcon}
                title={__('Filter Configuration', 'productbay')}
                description={__('Advanced settings for filters', 'productbay')}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <label className="text-sm font-medium text-gray-900 block">
                            {__('Filter Position', 'productbay')}
                        </label>
                        <p className="text-xs text-gray-500">{__('Where should filters appear?', 'productbay')}</p>
                    </div>
                    <select
                        value={settings.filters.position}
                        onChange={(e) => setFilters({ position: e.target.value as any })}
                        className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="top">{__('Above Table (Top)', 'productbay')}</option>
                        <option value="sidebar">{__('Sidebar', 'productbay')}</option>
                        <option value="modal">{__('Modal / Popup', 'productbay')}</option>
                    </select>
                </div>
            </SettingsSection>

            {/* Performance Settings */}
            <SettingsSection
                icon={ZapIcon}
                title={__('Performance', 'productbay')}
                description={__('Optimization settings', 'productbay')}
            >
                <SettingsRow
                    label={__('Lazy Loading', 'productbay')}
                    description={__('Load products as user scrolls (Infinite Scroll)', 'productbay')}
                    control={
                        <Toggle
                            checked={settings.features.lazyLoad}
                            onChange={(e) => setFeatures({ lazyLoad: e.target.checked })}
                        />
                    }
                />

                <div className="flex items-center justify-between">
                    <div>
                        <label className="text-sm font-medium text-gray-900 block">
                            {__('Max Product Limit', 'productbay')}
                        </label>
                        <p className="text-xs text-gray-500">{__('Hard limit on number of products to query', 'productbay')}</p>
                    </div>
                    <input
                        type="number"
                        min="1"
                        max="10000"
                        value={settings.performance.productLimit}
                        onChange={(e) => setPerformance({ productLimit: parseInt(e.target.value) || 200 })}
                        className="w-24 px-3 py-2 text-center border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </SettingsSection>
        </div>
    );
};

export default TabSettings;
