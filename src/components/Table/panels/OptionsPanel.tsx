import React from 'react';
import { cn } from '@/utils/cn';
import { __ } from '@wordpress/i18n';
import { TableSettings } from '@/types';
import { Toggle } from '@/components/ui/Toggle';
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

                {/* Enable Image Lightbox */}
                <SettingsOption
                    title={__('Enable Image Lightbox', 'productbay')}
                    description={__('Show full-size product images in a popup when clicked', 'productbay')}
                >
                    <Toggle
                        checked={settings.features.lightbox ?? true}
                        onChange={(e) => setFeatures({ lightbox: e.target.checked })}
                    />
                </SettingsOption>
            </SettingsSection>

            {/* Price Range Filter Settings */}
            <SettingsSection
                title={__('Price Range Filter', 'productbay')}
                description={__('Configure frontend price filtering options', 'productbay')}
            >
                <SettingsOption
                    title={__('Enable Price Filter', 'productbay')}
                    description={__('Allow users to filter products by price', 'productbay')}
                >
                    <Toggle
                        checked={settings.features.priceFilter?.enabled ?? false}
                        onChange={(e) => setFeatures({
                            priceFilter: {
                                ...(settings.features.priceFilter ?? { mode: 'both', step: 1, customMin: null, customMax: null }),
                                enabled: e.target.checked
                            }
                        })}
                    />
                </SettingsOption>

                <div className={cn(
                    "transition-all duration-300",
                    settings.features.priceFilter?.enabled ? "opacity-100" : "opacity-40 pointer-events-none grayscale"
                )}>
                    <SettingsOption
                        title={__('Filter Mode', 'productbay')}
                        description={__('Display slider, numeric inputs, or both', 'productbay')}
                    >
                        <select
                            value={settings.features.priceFilter?.mode ?? 'both'}
                            onChange={(e) => setFeatures({
                                priceFilter: {
                                    ...(settings.features.priceFilter ?? { enabled: false, step: 1, customMin: null, customMax: null }),
                                    mode: e.target.value as 'slider' | 'input' | 'both'
                                }
                            })}
                            className="w-32 h-9 px-3 py-1 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                            <option value="both">{__('Both', 'productbay')}</option>
                            <option value="slider">{__('Slider Only', 'productbay')}</option>
                            <option value="input">{__('Inputs Only', 'productbay')}</option>
                        </select>
                    </SettingsOption>

                    <SettingsOption
                        title={__('Slider Step Amount', 'productbay')}
                        description={__('The increment step value for the price slider', 'productbay')}
                    >
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={settings.features.priceFilter?.step ?? 1}
                            onChange={(e) => setFeatures({
                                priceFilter: {
                                    ...(settings.features.priceFilter ?? { enabled: false, mode: 'both', customMin: null, customMax: null }),
                                    step: parseFloat(e.target.value) || 1
                                }
                            })}
                            className="w-24 h-9 px-3 py-2 text-center border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </SettingsOption>

                    <SettingsOption
                        title={__('Custom Minimum Price', 'productbay')}
                        description={__('Leave empty to auto-detect from table products', 'productbay')}
                    >
                        <input
                            type="number"
                            min="0"
                            placeholder="Auto"
                            value={settings.features.priceFilter?.customMin ?? ''}
                            onChange={(e) => setFeatures({
                                priceFilter: {
                                    ...(settings.features.priceFilter ?? { enabled: false, mode: 'both', step: 1, customMax: null }),
                                    customMin: e.target.value === '' ? null : parseFloat(e.target.value)
                                }
                            })}
                            className="w-24 h-9 px-3 py-2 text-center border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </SettingsOption>

                    <SettingsOption
                        title={__('Custom Maximum Price', 'productbay')}
                        description={__('Leave empty to auto-detect from table products', 'productbay')}
                    >
                        <input
                            type="number"
                            min="0"
                            placeholder="Auto"
                            value={settings.features.priceFilter?.customMax ?? ''}
                            onChange={(e) => setFeatures({
                                priceFilter: {
                                    ...(settings.features.priceFilter ?? { enabled: false, mode: 'both', step: 1, customMin: null }),
                                    customMax: e.target.value === '' ? null : parseFloat(e.target.value)
                                }
                            })}
                            className="w-24 h-9 px-3 py-2 text-center border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </SettingsOption>
                </div>
            </SettingsSection>

            {/* Taxonomy & Type Filters */}
            <SettingsSection
                title={__('Taxonomy & Type Filters', 'productbay')}
                description={__('Configure frontend dropdown filters', 'productbay')}
            >
                <SettingsOption
                    title={__('Enable Categories Filter', 'productbay')}
                    description={__('Allow users to filter products by category', 'productbay')}
                >
                    <Toggle
                        checked={settings.filters?.showCategory ?? true}
                        onChange={(e) => setFilters({ showCategory: e.target.checked })}
                    />
                </SettingsOption>
                <SettingsOption
                    title={__('Enable Product Type Filter', 'productbay')}
                    description={__('Allow users to filter by product type (Simple, Variable, etc.)', 'productbay')}
                >
                    <Toggle
                        checked={settings.filters?.showType ?? true}
                        onChange={(e) => setFilters({ showType: e.target.checked })}
                    />
                </SettingsOption>
            </SettingsSection>

            {/* Cart Settings */}
            <SettingsSection
                title={__('Cart / Functionality', 'productbay')}
                description={__('Configure Add to Cart behavior', 'productbay')}
            >
                <SettingsOption
                    title={__('AJAX Add to Cart', 'productbay')}
                    description={__('Add products to cart inline without page reload. When disabled, button links to product page instead.', 'productbay')}
                >
                    <Toggle
                        checked={settings.cart.enable}
                        onChange={(e) => setCart({ enable: e.target.checked })}
                    />
                </SettingsOption>

                {/* Cart sub-options - Only relevant when AJAX Add to Cart is enabled */}
                <div className={cn(
                    "transition-all duration-300",
                    settings.cart.enable ? "opacity-100" : "opacity-40 pointer-events-none grayscale"
                )}>
                    <SettingsOption
                        title={__('Show Quantity Selector', 'productbay')}
                        description={__('Display quantity input next to add-to-cart button', 'productbay')}
                    >
                        <Toggle
                            checked={settings.cart.showQuantity}
                            onChange={(e) => setCart({ showQuantity: e.target.checked })}
                        />
                    </SettingsOption>

                    <SettingsOption
                        title={__('Variation Badges', 'productbay')}
                        description={__('Show badges indicating which variations were added to cart', 'productbay')}
                    >
                        <Toggle
                            checked={settings.features.variationBadges}
                            onChange={(e) => setFeatures({ variationBadges: e.target.checked })}
                        />
                    </SettingsOption>
                    <SettingsOption
                        title={__('Show Clear All Button', 'productbay')}
                        description={__('Display a button to instantly clear all selected products', 'productbay')}
                    >
                        <Toggle
                            checked={settings.features.clearAllButton}
                            onChange={(e) => setFeatures({ clearAllButton: e.target.checked })}
                        />
                    </SettingsOption>

                    <SettingsOption
                        title={__('Selected Items View Panel', 'productbay')}
                        description={__('Show a floating panel displaying all selected items with individual quantities', 'productbay')}
                    >
                        <Toggle
                            checked={settings.features.selectedItemsPanel?.enabled ?? true}
                            onChange={(e) => setFeatures({
                                selectedItemsPanel: {
                                    ...settings.features.selectedItemsPanel,
                                    enabled: e.target.checked
                                }
                            })}
                        />
                    </SettingsOption>
                </div>
            </SettingsSection>

        </div>
    );
};
