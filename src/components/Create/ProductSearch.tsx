import { cn } from '../../utils/cn';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { apiFetch } from '../../utils/api';
import { useTableStore, Product } from '../../store/tableStore';
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { SearchIcon, XIcon, CheckIcon, Loader2Icon, Trash2Icon, PackageIcon } from 'lucide-react';

export const ProductSearch: React.FC = () => {
    const { tableData, setTableData } = useTableStore();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [showRemoveAllModal, setShowRemoveAllModal] = useState(false);

    // Cache for search results to avoid redundant API calls
    const searchCache = useRef<Map<string, Product[]>>(new Map());

    // Persistent storage for selected products (full objects with name, id, sku)
    const [selectedProductsMap, setSelectedProductsMap] = useState<Map<number, Product>>(new Map());

    /**
     * Parse search query for special syntax
     * 
     * Supports:
     * - id:123 or ID:123 (case insensitive) - search by exact ID
     * - sku:ABC123 or SKU:ABC123 (case insensitive) - search by exact SKU
     * - regular text - search by product name
     */
    const parseSearchQuery = (q: string): { type: 'id' | 'sku' | 'name', value: string } => {
        const trimmed = q.trim();

        // Check for ID search (case insensitive)
        const idMatch = trimmed.match(/^id:(.+)$/i);
        if (idMatch) {
            return { type: 'id', value: idMatch[1].trim() };
        }

        // Check for SKU search (case insensitive)
        const skuMatch = trimmed.match(/^sku:(.+)$/i);
        if (skuMatch) {
            return { type: 'sku', value: skuMatch[1].trim() };
        }

        return { type: 'name', value: trimmed };
    };

    /**
     * Search products with caching and optimized debounce
     * 
     * Performance optimizations:
     * - Reduced debounce from 250ms to 150ms (ultra-fast response)
     * - Caches search results in memory to avoid redundant API calls
     * - Checks cache before making API request
     * - Supports ID and SKU search with special syntax
     */
    useEffect(() => {
        const searchProducts = async () => {
            if (query.length < 2) { // Reduced from 3 to 2 for faster results
                setResults([]);
                return;
            }

            const searchParams = parseSearchQuery(query);

            // Build cache key based on search type
            const cacheKey = `${searchParams.type}:${searchParams.value.toLowerCase()}`;

            // Check cache first
            if (searchCache.current.has(cacheKey)) {
                console.log('[ProductSearch] Cache hit for:', cacheKey);
                setResults(searchCache.current.get(cacheKey)!);
                return;
            }

            setLoading(true);
            try {
                let apiQuery = '';

                // Build API query based on search type
                if (searchParams.type === 'id') {
                    apiQuery = `products?include=${searchParams.value}`;
                } else if (searchParams.type === 'sku') {
                    apiQuery = `products?sku=${encodeURIComponent(searchParams.value)}`;
                } else {
                    apiQuery = `products?search=${encodeURIComponent(searchParams.value)}`;
                }

                const data = await apiFetch<Product[]>(apiQuery);

                // Store in cache
                searchCache.current.set(cacheKey, data);
                setResults(data);

                console.log('[ProductSearch] Fetched and cached:', cacheKey);
            } catch (error) {
                console.error('Failed to search products', error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        // Reduced debounce from 250ms to 150ms for ultra-fast response
        const timeoutId = setTimeout(searchProducts, 150);
        return () => clearTimeout(timeoutId);
    }, [query]);

    /**
     * Sync selectedProductsMap from tableData on mount
     */
    useEffect(() => {
        const productIds = tableData.config.products || [];
        const productObjects = tableData.config.productObjects || {};

        const map = new Map<number, Product>();
        productIds.forEach(id => {
            if (productObjects[id]) {
                map.set(id, productObjects[id]);
            }
        });

        setSelectedProductsMap(map);
    }, []);

    /**
     * Memoized Set of selected product IDs for O(1) lookup
     */
    const selectedIdsSet = useMemo(() => {
        return new Set(tableData.config.products || []);
    }, [tableData.config.products]);

    /**
     * Optimized toggleProduct with full product persistence
     */
    const toggleProduct = useCallback((product: Product) => {
        const currentIds = tableData.config.products || [];
        const currentObjects = tableData.config.productObjects || {};
        const isSelected = currentIds.includes(product.id);

        let newIds;
        let newObjects;
        let newMap;

        if (isSelected) {
            // Remove product
            newIds = currentIds.filter(id => id !== product.id);
            newObjects = { ...currentObjects };
            delete newObjects[product.id];

            newMap = new Map(selectedProductsMap);
            newMap.delete(product.id);
        } else {
            // Add product
            newIds = [...currentIds, product.id];
            newObjects = {
                ...currentObjects,
                [product.id]: product
            };

            newMap = new Map(selectedProductsMap);
            newMap.set(product.id, product);
        }

        setSelectedProductsMap(newMap);

        setTableData({
            config: {
                ...tableData.config,
                products: newIds,
                productObjects: newObjects
            }
        });
    }, [tableData.config, setTableData, selectedProductsMap]);

    /**
     * Remove all selected products with confirmation
     */
    const handleRemoveAll = useCallback(() => {
        const count = (tableData.config.products || []).length;
        if (count === 0) return;
        setShowRemoveAllModal(true);
    }, [tableData.config]);

    /**
     * Confirm remove all action
     */
    const confirmRemoveAll = useCallback(() => {
        setSelectedProductsMap(new Map());
        setTableData({
            config: {
                ...tableData.config,
                products: [],
                productObjects: {}
            }
        });
        setShowRemoveAllModal(false);
    }, [tableData.config, setTableData]);

    /**
     * Clear search input
     */
    const handleClearSearch = useCallback(() => {
        setQuery('');
        setResults([]);
    }, []);

    /**
     * Fast O(1) selection check using Set
     */
    const isSelected = useCallback((id: number) => {
        return selectedIdsSet.has(id);
    }, [selectedIdsSet]);

    return (
        <div className="w-full space-y-4">
            {/* Search Input */}
            <div className="relative">
                <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search products by name, or use id:123 or sku:ABC"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-9 pr-9"
                />
                {loading ? (
                    <Loader2Icon className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-gray-400" />
                ) : query.length > 0 ? (
                    <button
                        onClick={handleClearSearch}
                        className="absolute bg-transparent cursor-pointer right-3 top-2.5 h-4 w-4 text-gray-400 hover:text-gray-600 p-0 m-0"
                        title="Clear search"
                    >
                        <XIcon className="h-4 w-4 p-0 m-0" />
                    </button>
                ) : null}
            </div>

            {/* Search Results */}
            {results.length > 0 && (
                <div className="border border-gray-200 rounded-md shadow-sm max-h-60 overflow-y-auto divide-y divide-gray-100 bg-white">
                    {results.map(product => (
                        <div
                            key={product.id}
                            className={cn(
                                "flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors",
                                isSelected(product.id) && "bg-blue-50/50"
                            )}
                            onClick={() => toggleProduct(product)}
                        >
                            <div className="h-10 w-10 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                                {product.image && <img src={product.image} alt={product.name} className="h-full w-full object-cover" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">{product.name}</div>
                                <div className="text-xs text-gray-500">ID: {product.id} • SKU: {product.sku || 'N/A'}</div>
                            </div>
                            <div className={cn(
                                "h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center",
                                isSelected(product.id) ? "bg-primary border-primary text-white" : "text-transparent"
                            )}>
                                <CheckIcon className="h-3 w-3" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Selected Products Summary */}
            {selectedProductsMap.size > 0 && (
                <div className="pt-2 space-y-4">
                    {/* Selected Products Tags */}
                    <div className="flex flex-wrap gap-2">
                        {Array.from(selectedProductsMap.values()).map(product => (
                            <div key={product.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-sm border border-gray-200">
                                <span className="max-w-[150px] truncate" title={`${product.name} (ID: ${product.id}, SKU: ${product.sku || 'N/A'})`}>
                                    {product.name}
                                </span>
                                <button
                                    onClick={() => toggleProduct(product)}
                                    className="text-gray-400 hover:text-red-500 bg-transparent cursor-pointer p-0 m-0"
                                    title="Remove"
                                >
                                    <XIcon className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Product count and remove */}
                    <div className="flex items-center gap-4 text-sm bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 ">
                        {/* Remove all selection */}
                        <button
                            onClick={handleRemoveAll}
                            className="bg-transparent text-red-600 hover:text-red-700 rounded-full hover:bg-red-100 px-2 cursor-pointer flex items-center gap-1"
                        >
                            <Trash2Icon className="h-4 w-4 mr-2" />
                            Remove all
                        </button>

                        {/* Divider */}
                        <div className="h-4 w-px bg-blue-300"></div>

                        {/* Product Count */}
                        <div className="flex items-center gap-2 text-indigo-700">
                            <PackageIcon className="h-4 w-4" />
                            <span className="font-semibold">{selectedProductsMap.size}</span>
                            <span className="text-indigo-600">
                                {selectedProductsMap.size === 1 ? 'product' : 'products'} included
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Remove All Confirmation Modal */}
            <Modal
                isOpen={showRemoveAllModal}
                onClose={() => setShowRemoveAllModal(false)}
                title="Remove All Products"
                className="bg-gray-50"
                maxWidth="sm"
                primaryButton={{
                    text: "Remove All",
                    onClick: confirmRemoveAll,
                    variant: "danger",
                }}
                secondaryButton={{
                    text: "Cancel",
                    onClick: () => setShowRemoveAllModal(false),
                    variant: "secondary"
                }}
            >
                <p>
                    Are you sure you want to remove <strong>{selectedProductsMap.size}</strong> selected product{selectedProductsMap.size > 1 ? 's' : ''}?
                </p>
                <p className="mt-2 text-sm text-gray-500">
                    This action cannot be undone.
                </p>
            </Modal>
        </div>
    );
};
