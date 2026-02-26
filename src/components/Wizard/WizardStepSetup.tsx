import React, { useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { useTableStore } from '@/store/tableStore';
import { SourcePanel } from '@/components/Table/panels/SourcePanel';
import { SourceStatistics } from '@/components/Table/sections/SourceStatistics';
import { CategorySelector } from '@/components/Table/sections/CategorySelector';
import { ProductSearch } from '@/components/Table/sections/ProductSearch';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { AlertCircleIcon, ExternalLinkIcon } from 'lucide-react';
import { WC_PRODUCTS_PATH } from '@/utils/routes';

/* =============================================================================
 * WizardStepSetup
 * =============================================================================
 * Step 1: Table name and product source configuration.
 * Collects the table name via a text input and allows the user to pick
 * a product source (all, sale, category, specific).
 * ============================================================================= */

interface WizardStepSetupProps {
    /** Current title error message (if validation failed) */
    titleError?: string;
    /** Callback to clear the title error */
    onTitleErrorClear?: () => void;
}

const WizardStepSetup: React.FC<WizardStepSetupProps> = ({
    titleError,
    onTitleErrorClear,
}) => {
    const {
        tableTitle,
        setTitle,
        source,
        setSourceType,
        sourceStats,
        sourceStatsLoading,
        fetchSourceStats,
        preloadCategories,
    } = useTableStore();

    /** Preload categories on mount for instant display */
    useEffect(() => {
        preloadCategories();
    }, [preloadCategories]);

    /** Fetch source statistics when source type changes */
    useEffect(() => {
        fetchSourceStats(source.type);
    }, [source.type, fetchSourceStats]);

    const currentStats = sourceStats[source.type];
    const isStatsLoading = sourceStatsLoading[source.type] || !currentStats;

    /**
     * Handle table name input change
     */
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        if (titleError && onTitleErrorClear) {
            onTitleErrorClear();
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8">

            <h1 className="text-center text-2xl font-bold text-gray-800 my-4 pb-2">{__('Create a New Table', 'productbay')}</h1>

            {/* Table Name Input */}
            <div className="space-y-2">
                <label
                    htmlFor="wizard-table-name"
                    className="block text-sm font-semibold text-gray-700"
                >
                    {__('Table Name', 'productbay')}
                    <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                    id="wizard-table-name"
                    type="text"
                    autoFocus
                    value={tableTitle}
                    onChange={handleNameChange}
                    placeholder={__('e.g. Summer Sale Products', 'productbay')}
                    className={`w-full h-12 px-4 text-base border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 ${titleError
                        ? 'border-red-400 focus:ring-red-300 bg-red-50'
                        : 'border-gray-300 focus:ring-blue-300 focus:border-blue-400'
                        }`}
                />
                {titleError && (
                    <p className="text-sm text-red-500 mt-1">{titleError}</p>
                )}
            </div>

            {/* Product Source Selection */}
            <div className="space-y-4">
                <SourcePanel source={source} setSourceType={setSourceType}>
                    {/* All Products */}
                    {source.type === 'all' && (
                        <div className="animate-fade-in space-y-4">
                            <SourceStatistics
                                categoryCount={currentStats?.categories || 0}
                                productCount={currentStats?.products || 0}
                                loading={isStatsLoading}
                                showEmpty={true}
                            />
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

                    {/* Sale Products */}
                    {source.type === 'sale' && (
                        <div className="animate-fade-in space-y-4">
                            <SourceStatistics
                                categoryCount={currentStats?.categories || 0}
                                productCount={currentStats?.products || 0}
                                loading={isStatsLoading}
                                showEmpty={true}
                            />
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
                                            href={WC_PRODUCTS_PATH}
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

                    {/* Category */}
                    {source.type === 'category' && (
                        <div className="animate-fade-in">
                            <CategorySelector />
                        </div>
                    )}

                    {/* Specific Products */}
                    {source.type === 'specific' && (
                        <div className="animate-fade-in">
                            <ProductSearch />
                        </div>
                    )}
                </SourcePanel>
            </div>
        </div>
    );
};

export default WizardStepSetup;
