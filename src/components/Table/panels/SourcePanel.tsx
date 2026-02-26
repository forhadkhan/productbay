import React from 'react';
import { cn } from '@/utils/cn';
import { __ } from '@wordpress/i18n';
import { DataSource, SourceType } from '@/types';
import SectionHeading from '@/components/Table/SectionHeading';
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
    className?: string;
    children?: React.ReactNode;
}

export const SourcePanel = ({
    source,
    setSourceType,
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
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    cardClassName="min-w-0"
                />


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
