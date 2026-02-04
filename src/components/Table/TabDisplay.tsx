import React from 'react';
import { cn } from '@/utils/cn';
import { __ } from '@wordpress/i18n';
import { Toggle } from '@/components/ui/Toggle';
import { SettingsOption } from './SettingsOption';
import { useTableStore } from '@/store/tableStore';
import { ColorPicker } from '@/components/ui/ColorPicker';
import SectionHeding from '@/components/Table/SectionHeding';

/* =============================================================================
 * ColorChoice Component (Internal)
 * Standardizes the 2-column color picker layout (Background + Text).
 * ============================================================================= */
interface ColorChoiceProps {
    labelBg: string;
    labelColor: string;
    bgColor: string;
    textColor: string;
    onBgChange: (val: string) => void;
    onColorChange: (val: string) => void;
    className?: string;
}

const ColorChoice = ({
    labelBg,
    labelColor,
    bgColor,
    textColor,
    onBgChange,
    onColorChange,
    className
}: ColorChoiceProps) => (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-4 items-center border-b border-gray-300 py-3", className)}>
        <div className="flex items-center justify-between lg:justify-start lg:gap-8">
            <span className="text-sm text-gray-600 min-w-[72px]">{labelBg}</span>
            <ColorPicker value={bgColor} onChange={onBgChange} />
        </div>
        <div className="flex items-center justify-between lg:justify-start lg:gap-8">
            <span className="text-sm text-gray-600 min-w-[48px]">{labelColor}</span>
            <ColorPicker value={textColor} onChange={onColorChange} />
        </div>
    </div>
);

/* ===================================================================================================
 * TabDisplay Component
 * This component is used to display the table controls and colors for new table or view/update table.
 * =================================================================================================== */

const TabDisplay: React.FC = () => {
    const {
        settings,
        style,
        setFeatures,
        setFilters,
        setPagination,
        setHeaderStyle,
        setBodyStyle,
        setButtonStyle,
    } = useTableStore();

    return (
        <div className="w-full p-4 space-y-8">

            {/* Section A: Table Controls */}
            <section className="space-y-6">
                <SectionHeding
                    title={__('Table Controls', 'productbay')}
                    description={__('Configure table functionality and user controls', 'productbay')}
                />

                <div className="space-y-4 bg-white rounded-lg">
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
                        className="pt-2"
                    >
                        <input
                            type="number"
                            min="1"
                            max="500"
                            value={settings.pagination.limit}
                            onChange={(e) => setPagination({ limit: parseInt(e.target.value) || 10 })}
                            className="w-24 px-3 py-2 text-center border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                </div>
            </section>

            {/* Section B: Colors (Theming) */}
            <section className="space-y-6">
                <SectionHeding
                    title={__('Colors', 'productbay')}
                    description={__('Customize the visual appearance of your table', 'productbay')}
                />

                {/* Add to Cart Button */}
                <div className="space-y-4 hover:bg-gray-50 px-4 py-2 rounded-md m-0 mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 m-0">
                        {__('Add to Cart Button', 'productbay')}
                    </h3>
                    <ColorChoice
                        labelBg={__('Background', 'productbay')}
                        labelColor={__('Text', 'productbay')}
                        bgColor={style.button.bgColor}
                        textColor={style.button.textColor}
                        onBgChange={(val) => setButtonStyle({ bgColor: val })}
                        onColorChange={(val) => setButtonStyle({ textColor: val })}
                    />
                </div>

                {/* Table Header */}
                <div className="space-y-4 hover:bg-gray-50 px-4 py-2 rounded-md m-0 mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 m-0">
                        {__('Table Header', 'productbay')}
                    </h3>
                    <ColorChoice
                        labelBg={__('Background', 'productbay')}
                        labelColor={__('Text', 'productbay')}
                        bgColor={style.header.bgColor}
                        textColor={style.header.textColor}
                        onBgChange={(val) => setHeaderStyle({ bgColor: val })}
                        onColorChange={(val) => setHeaderStyle({ textColor: val })}
                    />
                </div>

                {/* Table Rows */}
                <div className="space-y-4 hover:bg-gray-50 px-4 py-2 rounded-md m-0 mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 m-0">
                        {__('Table Rows', 'productbay')}
                    </h3>
                    <ColorChoice
                        labelBg={__('Background', 'productbay')}
                        labelColor={__('Text', 'productbay')}
                        bgColor={style.body.bgColor}
                        textColor={style.body.textColor}
                        onBgChange={(val) => setBodyStyle({ bgColor: val })}
                        onColorChange={(val) => setBodyStyle({ textColor: val })}
                    />
                </div>

                {/* Alternate Rows (Zebra Striping) */}
                <div className="space-y-4 hover:bg-gray-50 px-4 py-2 rounded-md m-0 mb-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 block m-0">
                                {__('Alternate Rows (Zebra Striping)', 'productbay')}
                            </h3>
                            <p className="text-xs text-gray-500 m-0 mt-1">
                                {__('Improve table readability with alternating row colors', 'productbay')}
                            </p>
                        </div>
                        <Toggle
                            checked={style.body.rowAlternate}
                            onChange={(e) => setBodyStyle({ rowAlternate: e.target.checked })}
                        />
                    </div>

                    <div className={cn(
                        "transition-all duration-300 bg-gray-50 px-4 py-2 rounded-md",
                        style.body.rowAlternate ? "opacity-100" : "opacity-40 pointer-events-none grayscale"
                    )}>
                        <ColorChoice
                            labelBg={__('Alternate Background', 'productbay')}
                            labelColor={__('Alternate Text', 'productbay')}
                            bgColor={style.body.altBgColor}
                            textColor={style.body.altTextColor}
                            onBgChange={(val) => setBodyStyle({ altBgColor: val })}
                            onColorChange={(val) => setBodyStyle({ altTextColor: val })}
                            className="border-none py-0 lg:gap-8"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TabDisplay;