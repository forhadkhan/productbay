import React from 'react';
import { cn } from '@/utils/cn';
import { __ } from '@wordpress/i18n';
import { TableSettings } from '@/types';
import { Toggle } from '@/components/ui/Toggle';
import { Select } from '@/components/ui/Select';
import SectionHeading from '@/components/Table/SectionHeading';
import { SettingsOption } from '@/components/Table/SettingsOption';

/* =============================================================================
 * OptionsPanel Component
 * =============================================================================
 * Reusable panel for configuring functional table settings.
 * ============================================================================= */

/**
 * SettingsSection Component (Internal Helper)
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
        <SectionHeading
            title={title}
            description={description}
        />
        <div className="">
            {children}
        </div>
    </section>
);

export interface OptionsPanelProps {
    settings: TableSettings;
    setFeatures: (features: Partial<TableSettings['features']>) => void;
    setPagination: (pagination: Partial<TableSettings['pagination']>) => void;
    setCart: (cart: Partial<TableSettings['cart']>) => void;
    setFilters: (filters: Partial<TableSettings['filters']>) => void;
    className?: string;
}

export const OptionsPanel = ({
    settings,
    setFeatures,
    setPagination,
    setCart,
    setFilters,
    className
}: OptionsPanelProps) => {

    return (
        <div className={cn("w-full p-4 space-y-8", className)}>

            {/* Table Controls - User-facing features */}
            <SettingsSection
                title={__('Table Controls', 'productbay')}
                description={__('Configure table functionality and user controls', 'productbay')}
            >
                {/* Enable Search Bar */}
                <SettingsOption
                    title={__('Enable Search Bar', 'productbay')}
                    description={__('Allow users to search through products', 'productbay')}
                >
                    <Toggle
                        checked={settings.features.search}
                        onChange={(e) => setFeatures({ search: e.target.checked })}
                    />
                </SettingsOption>

                {/* Enable Pagination */}
                <SettingsOption
                    title={__('Enable Pagination', 'productbay')}
                    description={__('Break large product lists into pages', 'productbay')}
                >
                    <Toggle
                        checked={settings.features.pagination}
                        onChange={(e) => setFeatures({ pagination: e.target.checked })}
                    />
                </SettingsOption>

                {/* Products Per Page */}
                <SettingsOption
                    title={__('Products Per Page', 'productbay')}
                    description={__('Number of products to display per page', 'productbay')}
                >
                    <input
                        type="number"
                        min="1"
                        max="500"
                        value={settings.pagination.limit}
                        onChange={(e) => setPagination({ limit: parseInt(e.target.value) || 10 })}
                        className="w-24 h-9 px-3 py-2 text-center border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </SettingsOption>

                {/* Enable Price Range */}
                <SettingsOption
                    title={__('Enable Price Range', 'productbay')}
                    description={__('Allow users to filter by price range', 'productbay')}
                >
                    <Toggle
                        checked={settings.features.priceRange}
                        onChange={(e) => setFeatures({ priceRange: e.target.checked })}
                    />
                </SettingsOption>
            </SettingsSection>

            {/* General Settings - Advanced table features */}
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
                    title={__('Pagination Position', 'productbay')}
                    description={__('Where to display pagination controls', 'productbay')}
                >
                    <div className="w-48">
                        <Select
                            size="sm"
                            value={settings.pagination.position}
                            onChange={(val) => setPagination({ position: val as any })}
                            options={[
                                { label: __('Bottom', 'productbay'), value: 'bottom' },
                                { label: __('Top', 'productbay'), value: 'top' },
                                { label: __('Both', 'productbay'), value: 'both' },
                            ]}
                        />
                    </div>
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

                {/* Cart sub-options - Only relevant when Add to Cart is enabled */}
                <div className={cn(
                    "transition-all duration-300",
                    settings.cart.enable ? "opacity-100" : "opacity-40 pointer-events-none grayscale"
                )}>
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
                        <div className="w-48">
                            <Select
                                size="sm"
                                value={settings.cart.method}
                                onChange={(val) => setCart({ method: val as any })}
                                options={[
                                    { label: __('Button (Default)', 'productbay'), value: 'button' },
                                    { label: __('Checkbox (Multi-select)', 'productbay'), value: 'checkbox' },
                                    { label: __('Text Link', 'productbay'), value: 'text' },
                                ]}
                            />
                        </div>
                    </SettingsOption>
                </div>
            </SettingsSection>

            {/* Filter Settings */}
            <SettingsSection
                title={__('Filter Configuration', 'productbay')}
                description={__('Advanced settings for filters', 'productbay')}
            >
                {/* Enable Filter */}
                <SettingsOption
                    title={__('Enable Filter', 'productbay')}
                    description={__('Show filter options above the table', 'productbay')}
                >
                    <Toggle
                        checked={settings.filters.enabled}
                        onChange={(e) => setFilters({ enabled: e.target.checked })}
                    />
                </SettingsOption>

                {/* Filter Position - Only relevant when filters are enabled */}
                <div className={cn(
                    "transition-all duration-300",
                    settings.filters.enabled ? "opacity-100" : "opacity-40 pointer-events-none grayscale"
                )}>
                    <SettingsOption
                        title={__('Filter Position', 'productbay')}
                        description={__('Where should filters appear?', 'productbay')}
                    >
                        <div className="w-48">
                            <Select
                                size="sm"
                                value={settings.filters.position}
                                onChange={(val) => setFilters({ position: val as any })}
                                options={[
                                    { label: __('Above Table (Top)', 'productbay'), value: 'top' },
                                    { label: __('Sidebar', 'productbay'), value: 'sidebar' },
                                    { label: __('Modal / Popup', 'productbay'), value: 'modal' },
                                ]}
                            />
                        </div>
                    </SettingsOption>
                </div>
            </SettingsSection>
        </div>
    );
};
