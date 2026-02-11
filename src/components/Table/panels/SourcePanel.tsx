import React from 'react';
import { cn } from '@/utils/cn';
import { __ } from '@wordpress/i18n';
import { Select } from '@/components/ui/Select';
import { DataSource, SourceType } from '@/types';
import SectionHeading from '@/components/Table/SectionHeading';
import { SettingsOption } from '@/components/Table/SettingsOption';
import { CardRadioGroup, CardRadioOption } from '@/components/ui/CardRadioGroup';

/* =============================================================================
 * SourcePanel Component
 * =============================================================================
 * Reusable panel for adjusting the data source configuration.
 * Accepts children to render context-specific selectors (like CategorySelector)
 * which might be coupled to specific stores in the Table Editor.
 * ============================================================================= */

/**
 * Source type options for CardRadioGroup
 */
const SOURCE_OPTIONS: CardRadioOption<SourceType>[] = [
    {
        value: 'all',
        label: __('All Products', 'productbay'),
        helpText: __('Display all published products from your store', 'productbay'),
    },
    {
        value: 'sale',
        label: __('On Sale', 'productbay'),
        helpText: __('Only products with active sale prices', 'productbay'),
    },
    {
        value: 'category',
        label: __('By Category', 'productbay'),
        helpText: __('Select specific product categories', 'productbay'),
    },
    {
        value: 'specific',
        label: __('Specific Products', 'productbay'),
        helpText: __('Hand-pick individual products', 'productbay'),
    },
];

export interface SourcePanelProps {
    source: DataSource;
    setSourceType: (type: SourceType) => void;
    setSourceSort?: (sort: Partial<DataSource['sort']>) => void;
    setSourceQueryArgs?: (args: Partial<DataSource['queryArgs']>) => void;
    className?: string;
    children?: React.ReactNode;
}

export const SourcePanel = ({
    source,
    setSourceType,
    setSourceSort,
    setSourceQueryArgs,
    className,
    children
}: SourcePanelProps) => {

    return (
        <div className={cn('w-full p-4 space-y-8', className)}>
            {/* =================================================================
             * Section 1: Product Source Selection
             * ================================================================= */}
            <section>
                <SectionHeading
                    title={__('Product Source', 'productbay')}
                    description={__('Choose which products to display', 'productbay')}
                    isRequired={true}
                />

                {/* Source type radio cards */}
                <CardRadioGroup
                    name="source-type"
                    options={SOURCE_OPTIONS}
                    value={source.type}
                    onChange={setSourceType}
                    aria-label={__('Select product source', 'productbay')}
                    className="grid grid-cols-2 gap-3"
                    cardClassName="min-w-0"
                />

                {/* Additional Global Defaults (Sort/Stock) - Only show if handlers provided */}
                {setSourceSort && setSourceQueryArgs && (
                    <div className="mt-6 space-y-6 pt-6 border-t border-gray-100">
                        <div className="grid grid-cols-1 gap-6">
                            {/* Default Sort */}
                            <SettingsOption
                                title={__('Default Sort Order', 'productbay')}
                                description={__('How products are ordered initially', 'productbay')}
                                className="border-0 p-2 rounded-md"
                            >
                                <div className="flex gap-2">
                                    <div className="w-32">
                                        <Select
                                            size="sm"
                                            value={source.sort.orderBy}
                                            onChange={(val) => setSourceSort({ orderBy: val })}
                                            options={[
                                                { label: __('Date', 'productbay'), value: 'date' },
                                                { label: __('Title', 'productbay'), value: 'title' },
                                                { label: __('Price', 'productbay'), value: 'price' },
                                                { label: __('Popularity', 'productbay'), value: 'popularity' },
                                                { label: __('Rating', 'productbay'), value: 'rating' },
                                            ]}
                                        />
                                    </div>
                                    <div className="w-24">
                                        <Select
                                            size="sm"
                                            value={source.sort.order}
                                            onChange={(val) => setSourceSort({ order: val as 'ASC' | 'DESC' })}
                                            options={[
                                                { label: __('Descending', 'productbay'), value: 'DESC' },
                                                { label: __('Ascending', 'productbay'), value: 'ASC' },
                                            ]}
                                        />
                                    </div>
                                </div>
                            </SettingsOption>

                            {/* Stock Status */}
                            <SettingsOption
                                title={__('Stock Status', 'productbay')}
                                description={__('Filter by stock availability', 'productbay')}
                                className="border-0 p-2 rounded-md"
                            >
                                <div className="w-36">
                                    <Select
                                        size="sm"
                                        value={source.queryArgs?.stockStatus || 'any'}
                                        onChange={(val) => setSourceQueryArgs({ stockStatus: val as any })}
                                        options={[
                                            { label: __('Any Status', 'productbay'), value: 'any' },
                                            { label: __('In Stock', 'productbay'), value: 'instock' },
                                            { label: __('Out of Stock', 'productbay'), value: 'outofstock' },
                                        ]}
                                    />
                                </div>
                            </SettingsOption>
                        </div>
                    </div>
                )}

                {/* Context-specific children (Stats, Selectors, etc.) */}
                {children && (
                    <div className="mt-6">
                        {children}
                    </div>
                )}
            </section>
        </div>
    );
};
