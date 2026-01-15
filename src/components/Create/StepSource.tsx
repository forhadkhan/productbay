import { useEffect } from 'react';
import { StepProps } from './StepSetup';
import { ProductSearch } from './ProductSearch';
import { CategorySelector } from './CategorySelector';
import { SourceStatistics } from './SourceStatistics';
import { useTableStore } from '../../store/tableStore';

const StepSource = ({ showValidation }: StepProps) => {
    const {
        tableData,
        setTableData,
        fetchSourceStats,
        preloadCategories,
        sourceStats,
        sourceStatsLoading
    } = useTableStore();
    const { source_type } = tableData;

    /**
     * Preload categories when component mounts
     * 
     * This ensures categories are cached and ready before the user
     * clicks on the "Category" tab, providing instant display with
     * no loading delay. The preloadCategories action uses intelligent
     * caching (localStorage + Zustand) to minimize API calls.
     */
    useEffect(() => {
        preloadCategories();
    }, [preloadCategories]);

    const categories = {
        all: "Show all published products from your entire store catalog.",
        sale: "Show only products currently on sale (with sale price set).",
        category: "Show products from selected WooCommerce categories.",
        specific: "Manually pick individual products to display."
    };

    // Calculate statistics for 'specific' source (client-side)
    const selectedProductIds = tableData.config.products || [];
    const specificStats = {
        categories: 0, // We don't track categories for specific products yet
        products: selectedProductIds.length
    };

    return (
        <div className="space-y-6">
            <h3 className="font-bold text-blue-800 mb-2">
                Select a source <span className="text-red-500">*</span>
            </h3>
            <div className="mt-2">
                <div className="w-full mx-auto mt-2">
                    <nav className="flex border-b border-gray-300 relative" aria-label="Tabs">
                        {Object.keys(categories).map((type) => (
                            <button
                                key={type}
                                onClick={() => setTableData({ source_type: type })}
                                className={`relative bg-white py-2 px-4 text-sm font-medium capitalize ${source_type === type
                                    ? 'text-blue-600 border border-gray-300 rounded-t-md border-b-0'
                                    : 'text-gray-600 border border-transparent hover:text-blue-500'
                                    }`}
                                style={{
                                    marginBottom: source_type === type ? '-1px' : '0',
                                    zIndex: source_type === type ? 10 : 1,
                                }}
                            >
                                {type === 'all' ? 'All Products' : type}
                            </button>
                        ))}
                    </nav>
                </div>

                <p className="mt-4 text-md text-gray-500">
                    {categories[source_type as keyof typeof categories]}
                </p>
            </div>

            {/* Statistics for 'all' source */}
            {source_type === 'all' && (
                <div className="mt-6 animate-fade-in">
                    <SourceStatistics
                        categoryCount={sourceStats['all']?.categories || 0}
                        productCount={sourceStats['all']?.products || 0}
                        loading={sourceStatsLoading['all'] || !sourceStats['all']}
                    />
                </div>
            )}

            {/* Statistics for 'sale' source */}
            {source_type === 'sale' && (
                <div className="mt-6 animate-fade-in">
                    <SourceStatistics
                        categoryCount={sourceStats['sale']?.categories || 0}
                        productCount={sourceStats['sale']?.products || 0}
                        loading={sourceStatsLoading['sale'] || !sourceStats['sale']}
                    />
                </div>
            )}

            {/* Category selector with built-in statistics */}
            {source_type === 'category' && (
                <div className="mt-6 pt-2 animate-fade-in">
                    <CategorySelector />
                </div>
            )}

            {/* Specific products with search and statistics */}
            {source_type === 'specific' && (
                <div className="mt-6 pt-2 animate-fade-in space-y-3">
                    {/* <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label> */}
                    <ProductSearch />
                </div>
            )}
        </div>
    );
};

export default StepSource;
