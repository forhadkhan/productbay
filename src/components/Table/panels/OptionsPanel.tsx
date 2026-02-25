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
    className?: string;
}

export const OptionsPanel = ({
    settings,
    setFeatures,
    setPagination,
    setCart,
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
                </div>
            </SettingsSection>

        </div>
    );
};
