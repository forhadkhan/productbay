import React from 'react';
import { __ } from '@wordpress/i18n';
import { Toggle } from '@/components/ui/Toggle';
import { useTableStore } from '@/store/tableStore';
import SectionHeading from '@/components/Table/SectionHeading';
import SettingsOption from '@/components/Table/SettingsOption';

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
 * SettingsSection Component (Internal Helper)
 * 
 * Provides a standardized container for a group of settings.
 * Now leverages SectionHeading for consistent titling and layout.
 */
interface SettingsSectionProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

const SettingsSection = ({
    title,
    description,
    children
}: SettingsSectionProps) => (
    <section className="space-y-6">
        {/* standardized heading with icon support conceptually, 
            though SectionHeading currently doesn't show the icon, 
            we keep it for potential future UI expansion. */}
        <SectionHeading
            title={title}
            description={description}
        />
        <div className="">
            {children}
        </div>
    </section>
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
        <div className="w-full p-4 space-y-8">

            {/* General Settings */}
            <SettingsSection
                title={__('General Settings', 'productbay')}
                description={__('Configure core table features', 'productbay')}
            >
                <SettingsOption
                    title={__('Enable Sorting', 'productbay')}
                    description={__('Allow users to click column headers to sort', 'productbay')}
                >
                    <Toggle
                        checked={settings.features.sorting}
                        onChange={(e) => setFeatures({ sorting: e.target.checked })}
                    />
                </SettingsOption>
                <SettingsOption
                    title={__('Enable Export', 'productbay')}
                    description={__('Show buttons to export table to CSV/PDF', 'productbay')}
                >
                    <Toggle
                        checked={settings.features.export}
                        onChange={(e) => setFeatures({ export: e.target.checked })}
                    />
                </SettingsOption>
                <SettingsOption
                    title={__('Responsive Accordion', 'productbay')}
                    description={__('Collapse extra columns into an accordion on mobile', 'productbay')}
                >
                    <Toggle
                        checked={settings.features.responsiveCollapse}
                        onChange={(e) => setFeatures({ responsiveCollapse: e.target.checked })}
                    />
                </SettingsOption>

                <SettingsOption
                    title={__('Pagination Position', 'productbay')}
                    description={__('Where to display pagination controls', 'productbay')}
                >
                    <select
                        value={settings.pagination.position}
                        onChange={(e) => setPagination({ position: e.target.value as any })}
                        className="text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="bottom">{__('Bottom', 'productbay')}</option>
                        <option value="top">{__('Top', 'productbay')}</option>
                        <option value="both">{__('Both', 'productbay')}</option>
                    </select>
                </SettingsOption>
            </SettingsSection>

            {/* Cart Settings */}
            <SettingsSection
                title={__('Cart / functionality', 'productbay')}
                description={__('Configure Add to Cart behavior', 'productbay')}
            >
                <SettingsOption
                    title={__('Enable Add to Cart', 'productbay')}
                    description={__('Allow users to add products to cart directly', 'productbay')}
                >
                    <Toggle
                        checked={settings.cart.enable}
                        onChange={(e) => setCart({ enable: e.target.checked })}
                    />
                </SettingsOption>

                {settings.cart.enable && (
                    <>
                        <SettingsOption
                            title={__('Show Quantity', 'productbay')}
                            description={__('Display quantity selector next to button', 'productbay')}
                        >
                            <Toggle
                                checked={settings.cart.showQuantity}
                                onChange={(e) => setCart({ showQuantity: e.target.checked })}
                            />
                        </SettingsOption>
                        <SettingsOption
                            title={__('AJAX Add to Cart', 'productbay')}
                            description={__('Add to cart without reloading the page', 'productbay')}
                        >
                            <Toggle
                                checked={settings.cart.ajaxAdd}
                                onChange={(e) => setCart({ ajaxAdd: e.target.checked })}
                            />
                        </SettingsOption>

                        <SettingsOption
                            title={__('Cart Method', 'productbay')}
                            description={__('Interaction style for adding to cart', 'productbay')}
                        >
                            <select
                                value={settings.cart.method}
                                onChange={(e) => setCart({ method: e.target.value as any })}
                                className="text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="button">{__('Button (Default)', 'productbay')}</option>
                                <option value="checkbox">{__('Checkbox (Multi-select)', 'productbay')}</option>
                                <option value="text">{__('Text Link', 'productbay')}</option>
                            </select>
                        </SettingsOption>
                    </>
                )}
            </SettingsSection>

            {/* Filter Settings */}
            <SettingsSection
                title={__('Filter Configuration', 'productbay')}
                description={__('Advanced settings for filters', 'productbay')}
            >
                <SettingsOption
                    title={__('Filter Position', 'productbay')}
                    description={__('Where should filters appear?', 'productbay')}
                >
                    <select
                        value={settings.filters.position}
                        onChange={(e) => setFilters({ position: e.target.value as any })}
                        className="text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="top">{__('Above Table (Top)', 'productbay')}</option>
                        <option value="sidebar">{__('Sidebar', 'productbay')}</option>
                        <option value="modal">{__('Modal / Popup', 'productbay')}</option>
                    </select>
                </SettingsOption>
            </SettingsSection>

            {/* Performance Settings */}
            <SettingsSection
                title={__('Performance', 'productbay')}
                description={__('Optimization settings', 'productbay')}
            >
                <SettingsOption
                    title={__('Lazy Loading', 'productbay')}
                    description={__('Load products as user scrolls (Infinite Scroll)', 'productbay')}
                >
                    <Toggle
                        checked={settings.features.lazyLoad}
                        onChange={(e) => setFeatures({ lazyLoad: e.target.checked })}
                    />
                </SettingsOption>

                <SettingsOption
                    title={__('Max Product Limit', 'productbay')}
                    description={__('Hard limit on number of products to query', 'productbay')}
                >
                    <input
                        type="number"
                        min="1"
                        max="10000"
                        value={settings.performance.productLimit}
                        onChange={(e) => setPerformance({ productLimit: parseInt(e.target.value) || 200 })}
                        className="w-24 px-3 py-2 text-center border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </SettingsOption>
            </SettingsSection>
        </div>
    );
};

export default TabSettings;