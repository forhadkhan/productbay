import React from 'react';
import { __ } from '@wordpress/i18n';
import { useTableStore } from '@/store/tableStore';
import { Toggle } from '@/components/ui/Toggle';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { cn } from '@/utils/cn';

/* =============================================================================
 * TabDisplay Component
 * =============================================================================
 * Handles "Table Controls" (Features) and "Colors" (Theming).
 * Redesigned to match the "Phase 3 Refined" specification.
 * ============================================================================= */



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
        <div className="w-full p-4 space-y-12">

            {/* Section A: Table Controls */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mt-0">
                        {__('Table Controls', 'productbay')}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {__('Configure table functionality and user controls', 'productbay')}
                    </p>
                </div>

                <div className="space-y-6 bg-white rounded-lg">
                    {/* Enable Search Bar */}
                    <div className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-md">
                        <div>
                            <label className="text-sm font-medium text-gray-900 block">
                                {__('Enable Search Bar', 'productbay')}
                            </label>
                            <p className="text-xs text-gray-500">
                                {__('Allow users to search through products', 'productbay')}
                            </p>
                        </div>
                        <Toggle
                            checked={settings.features.search}
                            onChange={(e) => setFeatures({ search: e.target.checked })}
                        />
                    </div>

                    {/* Enable Pagination */}
                    <div className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-md">
                        <div>
                            <label className="text-sm font-medium text-gray-900 block">
                                {__('Enable Pagination', 'productbay')}
                            </label>
                            <p className="text-xs text-gray-500">
                                {__('Break large product lists into pages', 'productbay')}
                            </p>
                        </div>
                        <Toggle
                            checked={settings.features.pagination}
                            onChange={(e) => setFeatures({ pagination: e.target.checked })}
                        />
                    </div>

                    {/* Products Per Page */}
                    <div className="flex items-center justify-between pt-2 bg-gray-50 px-4 py-2 rounded-md">
                        <div>
                            <label className="text-sm font-medium text-gray-900 block">
                                {__('Products Per Page', 'productbay')}
                            </label>
                            <p className="text-xs text-gray-500">
                                {__('Number of products to display per page', 'productbay')}
                            </p>
                        </div>
                        <input
                            type="number"
                            min="1"
                            max="500"
                            value={settings.pagination.limit}
                            onChange={(e) => setPagination({ limit: parseInt(e.target.value) || 10 })}
                            className="w-24 px-3 py-2 text-center border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Enable Price Range */}
                    <div className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-md">
                        <div>
                            <label className="text-sm font-medium text-gray-900 block">
                                {__('Enable Price Range', 'productbay')}
                            </label>
                            <p className="text-xs text-gray-500">
                                {__('Allow users to filter by price range', 'productbay')}
                            </p>
                        </div>
                        <Toggle
                            checked={settings.features.priceRange}
                            onChange={(e) => setFeatures({ priceRange: e.target.checked })}
                        />
                    </div>

                    {/* Enable Filter */}
                    <div className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-md">
                        <div>
                            <label className="text-sm font-medium text-gray-900 block">
                                {__('Enable Filter', 'productbay')}
                            </label>
                            <p className="text-xs text-gray-500">
                                {__('Show filter options above the table', 'productbay')}
                            </p>
                        </div>
                        <Toggle
                            checked={settings.filters.enabled}
                            onChange={(e) => setFilters({ enabled: e.target.checked })}
                        />
                    </div>


                </div>
            </section>

            <hr className="border-gray-200" />

            {/* Section B: Colors (Theming) */}
            <section className="space-y-8">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        {__('Colors', 'productbay')}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {__('Customize the visual appearance of your table', 'productbay')}
                    </p>
                </div>

                {/* Add to Cart Button */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-900">
                        {__('Add to Cart Button', 'productbay')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b border-gray-100 bg-gray-50 px-4 py-2 rounded-md">
                        <div className="flex items-center justify-between md:justify-start md:gap-8">
                            <span className="text-sm text-gray-600 min-w-24">{__('Background', 'productbay')}</span>
                            <ColorPicker
                                value={style.button.bgColor}
                                onChange={(val) => setButtonStyle({ bgColor: val })}
                            />
                        </div>
                        <div className="flex items-center justify-between md:justify-start md:gap-8">
                            <span className="text-sm text-gray-600 min-w-24">{__('Text', 'productbay')}</span>
                            <ColorPicker
                                value={style.button.textColor}
                                onChange={(val) => setButtonStyle({ textColor: val })}
                            />
                        </div>
                    </div>
                </div>

                {/* Table Header */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-900">
                        {__('Table Header', 'productbay')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b border-gray-100 bg-gray-50 px-4 py-2 rounded-md">
                        <div className="flex items-center justify-between md:justify-start md:gap-8">
                            <span className="text-sm text-gray-600 min-w-24">{__('Background', 'productbay')}</span>
                            <ColorPicker
                                value={style.header.bgColor}
                                onChange={(val) => setHeaderStyle({ bgColor: val })}
                            />
                        </div>
                        <div className="flex items-center justify-between md:justify-start md:gap-8">
                            <span className="text-sm text-gray-600 min-w-24">{__('Text', 'productbay')}</span>
                            <ColorPicker
                                value={style.header.textColor}
                                onChange={(val) => setHeaderStyle({ textColor: val })}
                            />
                        </div>
                    </div>
                </div>

                {/* Table Rows */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-900">
                        {__('Table Rows', 'productbay')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b border-gray-100 bg-gray-50 px-4 py-2 rounded-md">
                        <div className="flex items-center justify-between md:justify-start md:gap-8">
                            <span className="text-sm text-gray-600 min-w-24">{__('Background', 'productbay')}</span>
                            <ColorPicker
                                value={style.body.bgColor}
                                onChange={(val) => setBodyStyle({ bgColor: val })}
                            />
                        </div>
                        <div className="flex items-center justify-between md:justify-start md:gap-8">
                            <span className="text-sm text-gray-600 min-w-24">{__('Text', 'productbay')}</span>
                            <ColorPicker
                                value={style.body.textColor}
                                onChange={(val) => setBodyStyle({ textColor: val })}
                            />
                        </div>
                    </div>
                </div>

                {/* Alternate Rows (Zebra Striping) */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900 block">
                                {__('Alternate Rows (Zebra Striping)', 'productbay')}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                                {__('Improve table readability with alternating row colors', 'productbay')}
                            </p>
                        </div>
                        <Toggle
                            checked={style.body.rowAlternate}
                            onChange={(e) => setBodyStyle({ rowAlternate: e.target.checked })}
                        />
                    </div>

                    <div className={cn(
                        "grid grid-cols-1 md:grid-cols-2 gap-8 items-center transition-all duration-300 bg-gray-50 px-4 py-2 rounded-md",
                        style.body.rowAlternate ? "opacity-100" : "opacity-40 pointer-events-none grayscale"
                    )}>
                        <div className="flex items-center justify-between md:justify-start md:gap-8">
                            <span className="text-sm text-gray-600 min-w-24">{__('Alternate Background', 'productbay')}</span>
                            <ColorPicker
                                value={style.body.altBgColor}
                                onChange={(val) => setBodyStyle({ altBgColor: val })}
                            />
                        </div>
                        <div className="flex items-center justify-between md:justify-start md:gap-8">
                            <span className="text-sm text-gray-600 min-w-24">{__('Alternate Text', 'productbay')}</span>
                            <ColorPicker
                                value={style.body.altTextColor}
                                onChange={(val) => setBodyStyle({ altTextColor: val })}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TabDisplay;
