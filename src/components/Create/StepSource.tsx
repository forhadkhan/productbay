import { useEffect } from 'react';
import { StepProps } from './StepSetup';
import { StepHeading } from './StepHeading';
import { ProductSearch } from './ProductSearch';
import { Alert, AlertDescription } from '../ui/Alert';
import { CategorySelector } from './CategorySelector';
import { SourceStatistics } from './SourceStatistics';
import { useTableStore } from '../../store/tableStore';
import { CircleCheckIcon, CircleIcon, AlertCircleIcon } from 'lucide-react';

// Human-readable labels for source types
const SOURCE_LABELS: Record<string, string> = {
    all: 'All Products',
    sale: 'Sale Products',
    category: 'Specific Categories',
    specific: 'Individual Products'
};

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
     * Preload categories and fetch stats when component mounts or source type changes
     */
    useEffect(() => {
        preloadCategories();
    }, [preloadCategories]);

    // Fetch source statistics based on selected source type
    useEffect(() => {
        fetchSourceStats(source_type);
    }, [source_type, fetchSourceStats]);

    const categories = {
        all: "Show all published products from your entire store catalog.",
        sale: "Show only products currently on sale (with sale price set).",
        category: "Show products from selected WooCommerce categories.",
        specific: "Manually pick individual products to display."
    };

    // Calculate statistics for 'specific' source (client-side)
    const selectedProductIds = tableData.config.products || [];
    const selectedCategoryIds = tableData.config.categories || [];
    const specificStats = {
        categories: 0, // We don't track categories for specific products yet
        products: selectedProductIds.length
    };

    // Check if source selection is complete
    const isSourceComplete =
        source_type === 'all' ||
        source_type === 'sale' ||
        (source_type === 'category' && selectedCategoryIds.length > 0) ||
        (source_type === 'specific' && selectedProductIds.length > 0);

    // Validation logic
    const hasValidationError = showValidation && (
        (source_type === 'category' && selectedCategoryIds.length === 0) ||
        (source_type === 'specific' && selectedProductIds.length === 0)
    );

    const getValidationMessage = () => {
        if (!showValidation) return null;
        if (source_type === 'category' && selectedCategoryIds.length === 0) {
            return 'Please select at least one category to continue.';
        }
        if (source_type === 'specific' && selectedProductIds.length === 0) {
            return 'Please select at least one product to continue.';
        }
        return null;
    };

    return (
        <div className="space-y-6">
            {/* Source Selection - Show selected source type and validation status */}
            <StepHeading title="Source:">
                <span className={`inline-flex items-center rounded-full font-medium border px-2 py-1 justify-center text-sm ${isSourceComplete
                    ? 'bg-green-50 border-green-300 text-green-700'
                    : 'bg-gray-50 border-gray-300 text-gray-600'
                    }`}>
                    {isSourceComplete
                        ? <CircleCheckIcon className="w-4 h-4 mr-1.5" />
                        : <CircleIcon className="w-4 h-4 mr-1.5" />
                    }
                    {SOURCE_LABELS[source_type] || 'All Products'}
                </span>
            </StepHeading>
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
                                {SOURCE_LABELS[type]}
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

            {/* Validation Error Message */}
            {hasValidationError && (
                <Alert variant="destructive" className="mt-4">
                    <AlertCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <AlertDescription>{getValidationMessage()}</AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default StepSource;
