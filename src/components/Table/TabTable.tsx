import { cn } from '@/utils/cn';
import { useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { useTableStore } from '@/store/tableStore';
import SectionHeading from '@/components/Table/SectionHeading';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { AlertCircleIcon, ExternalLinkIcon } from 'lucide-react';
import ColumnEditor from '@/components/Table/sections/ColumnEditor';
import { ProductSearch } from '@/components/Table/sections/ProductSearch';
import { SourceStatistics } from '@/components/Table/sections/SourceStatistics';
import { CategorySelector } from '@/components/Table/sections/CategorySelector';
import { SourcePanel } from '@/components/Table/panels/SourcePanel';

/* =============================================================================
 * TabTable Component
 * =============================================================================
 * First tab in the table configuration interface.
 * Handles:
 * 1. Product source selection (all, sale, category, specific)
 * 2. Source-specific configuration (category picker, product search)
 * 3. Column configuration (TODO: drag-and-drop column editor)
 * ============================================================================= */

export interface TabTableProps {
    className?: string;
}

/**
 * TabTable Component
 * 
 * Renders the Table configuration tab with source selection and column config.
 */
const TabTable = ({ className }: TabTableProps) => {
    const {
        source,
        setSourceType,
        setSourceSort,
        setSourceQueryArgs,
        sourceStats,
        sourceStatsLoading,
        fetchSourceStats,
        preloadCategories,
    } = useTableStore();

    /**
     * Preload categories on mount for instant display when "By Category" is selected
     */
    useEffect(() => {
        preloadCategories();
    }, [preloadCategories]);

    /**
     * Fetch source statistics when source type changes
     * This provides product counts for 'all' and 'sale' sources
     */
    useEffect(() => {
        fetchSourceStats(source.type);
    }, [source.type, fetchSourceStats]);

    /**
     * Get current stats for the selected source type
     */
    const currentStats = sourceStats[source.type];
    const isStatsLoading = sourceStatsLoading[source.type] || !currentStats;

    return (
        <div className={cn('w-full', className)}>

            {/* Source Panel wraps the selection logic */}
            <SourcePanel
                source={source}
                setSourceType={setSourceType}
                setSourceSort={setSourceSort}
                setSourceQueryArgs={setSourceQueryArgs}
            >
                {/* All Products - Show statistics */}
                {source.type === 'all' && (
                    <div className="animate-fade-in space-y-4">
                        <SourceStatistics
                            categoryCount={currentStats?.categories || 0}
                            productCount={currentStats?.products || 0}
                            loading={isStatsLoading}
                            showEmpty={true}
                        />

                        {/* Warning if no products */}
                        {!isStatsLoading && currentStats?.products === 0 && (
                            <Alert variant="warning" className="bg-amber-50 border-amber-200">
                                <AlertCircleIcon className="w-4 h-4 mt-0.5 text-amber-600" />
                                <AlertDescription className="text-amber-800">
                                    <p className="font-bold m-0">
                                        {__('No products found!', 'productbay')}
                                    </p>
                                    <p className="text-sm mt-2 m-0">
                                        {__('Your WooCommerce store appears to be empty. Add some products to create a table.', 'productbay')}
                                    </p>
                                    <a
                                        target="_blank"
                                        href={`${(window as any).ajaxurl?.split('admin-ajax.php')[0]}post-new.php?post_type=product`}
                                        className="mt-2 inline-flex items-center text-sm text-amber-900 hover:text-blue-600 border border-amber-900 hover:border-blue-500 px-2 py-1 rounded-md"
                                    >
                                        {__('Add your first product', 'productbay')}
                                        <ExternalLinkIcon className="w-3 h-3 ml-1" />
                                    </a>
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                )}

                {/* Sale Products - Show statistics */}
                {source.type === 'sale' && (
                    <div className="animate-fade-in space-y-4">
                        <SourceStatistics
                            categoryCount={currentStats?.categories || 0}
                            productCount={currentStats?.products || 0}
                            loading={isStatsLoading}
                            showEmpty={true}
                        />

                        {/* Warning if no sale products */}
                        {!isStatsLoading && currentStats?.products === 0 && (
                            <Alert variant="warning" className="bg-amber-50 border-amber-200">
                                <AlertCircleIcon className="w-4 h-4 mt-0.5 text-amber-600" />
                                <AlertDescription className="text-amber-800">
                                    <p className="font-bold m-0">
                                        {__('No products on sale!', 'productbay')}
                                    </p>
                                    <p className="text-sm mt-2 m-0">
                                        {__('Set sale prices on some products to use this source type.', 'productbay')}
                                    </p>
                                    <a
                                        target="_blank"
                                        href={`${(window as any).ajaxurl?.split('admin-ajax.php')[0]}edit.php?post_type=product`}
                                        className="mt-2 inline-flex items-center text-sm text-amber-900 hover:text-blue-600 border border-amber-900 hover:border-blue-500 px-2 py-1 rounded-md"
                                    >
                                        {__('Manage products', 'productbay')}
                                        <ExternalLinkIcon className="w-3 h-3 ml-1" />
                                    </a>
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                )}

                {/* Category - Show category selector */}
                {source.type === 'category' && (
                    <div className="animate-fade-in">
                        <CategorySelector />
                    </div>
                )}

                {/* Specific Products - Show product search */}
                {source.type === 'specific' && (
                    <div className="animate-fade-in">
                        <ProductSearch />
                    </div>
                )}
            </SourcePanel>

            {/* =================================================================
             * Section 2: Column Configuration
             * ================================================================= */}
            <section className="border-t border-gray-200 pt-8 px-4">
                <SectionHeading
                    title={__('Table Columns', 'productbay')}
                    description={__('Configure which columns to display and their order', 'productbay')}
                    isRequired={true}
                />
                <ColumnEditor />
            </section>
        </div>
    );
};

export default TabTable;