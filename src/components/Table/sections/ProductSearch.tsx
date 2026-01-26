import { cn } from '../../../utils/cn';
import { Input } from '../../ui/Input';
import { Tooltip } from '../../ui/Tooltip';
import { apiFetch } from '../../../utils/api';
import { ConfirmButton } from '../../ui/ConfirmButton';
import { useTableStore, Product } from '../../../store/tableStore';
import React, {
	useState,
	useEffect,
	useMemo,
	useCallback,
	useRef,
} from 'react';
import {
	SearchIcon,
	XIcon,
	CheckIcon,
	Loader2Icon,
	Trash2Icon,
	PackageIcon,
} from 'lucide-react';

export const ProductSearch: React.FC = () => {
	const { tableData, setTableData } = useTableStore();
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<Product[]>([]);
	const [loading, setLoading] = useState(false);

	// Cache for search results to avoid redundant API calls
	const searchCache = useRef<Map<string, Product[]>>(new Map());

	// Persistent storage for selected products (full objects with name, id, sku)
	const [selectedProductsMap, setSelectedProductsMap] = useState<
		Map<number, Product>
	>(new Map());

	/**
	 * Parse search query for special syntax
	 *
	 * Supports:
	 * - id:123 or ID:123 (case insensitive) - search by exact ID
	 * - sku:ABC123 or SKU:ABC123 (case insensitive) - search by exact SKU
	 * - regular text - search by product name
	 */
	const parseSearchQuery = (
		q: string
	): { type: 'id' | 'sku' | 'name'; value: string } => {
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
			if (query.length < 2) {
				// Reduced from 3 to 2 for faster results
				setResults([]);
				return;
			}

			const searchParams = parseSearchQuery(query);

			// Build cache key based on search type
			const cacheKey = `${searchParams.type
				}:${searchParams.value.toLowerCase()}`;

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
					apiQuery = `products?sku=${encodeURIComponent(
						searchParams.value
					)}`;
				} else {
					apiQuery = `products?search=${encodeURIComponent(
						searchParams.value
					)}`;
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
		productIds.forEach((id) => {
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
	const toggleProduct = useCallback(
		(product: Product) => {
			const currentIds = tableData.config.products || [];
			const currentObjects = tableData.config.productObjects || {};
			const isSelected = currentIds.includes(product.id);

			let newIds;
			let newObjects;
			let newMap;

			if (isSelected) {
				// Remove product
				newIds = currentIds.filter((id) => id !== product.id);
				newObjects = { ...currentObjects };
				delete newObjects[product.id];

				newMap = new Map(selectedProductsMap);
				newMap.delete(product.id);
			} else {
				// Add product
				newIds = [...currentIds, product.id];
				newObjects = {
					...currentObjects,
					[product.id]: product,
				};

				newMap = new Map(selectedProductsMap);
				newMap.set(product.id, product);
			}

			setSelectedProductsMap(newMap);

			setTableData({
				config: {
					...tableData.config,
					products: newIds,
					productObjects: newObjects,
				},
			});
		},
		[tableData.config, setTableData, selectedProductsMap]
	);

	/**
	 * Confirm remove all action
	 */
	const confirmRemoveAll = useCallback(() => {
		const count = (tableData.config.products || []).length;
		if (count === 0) return;

		setSelectedProductsMap(new Map());
		setTableData({
			config: {
				...tableData.config,
				products: [],
				productObjects: {},
			},
		});
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
	const isSelected = useCallback(
		(id: number) => {
			return selectedIdsSet.has(id);
		},
		[selectedIdsSet]
	);

	return (
		<div className="w-full space-y-4">
			{ /* Search Input */}
			<div className="relative flex items-center">
				<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
				<Input
					placeholder="Search products by name, or use id:123 or sku:ABC"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="pl-9 pr-9"
				/>
				<div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
					{loading ? (
						<Loader2Icon className="h-4 w-4 animate-spin text-gray-400" />
					) : query.length > 0 ? (
						<button
							onClick={handleClearSearch}
							className="bg-transparent cursor-pointer text-gray-400 hover:text-gray-600 p-0 m-0 flex items-center justify-center"
							title="Clear search"
						>
							<XIcon className="h-4 w-4" />
						</button>
					) : null}
				</div>
			</div>

			{ /* Search Results */}
			{results.length > 0 && (
				<div className="border border-gray-200 rounded-md shadow-sm max-h-60 overflow-y-auto divide-y divide-gray-100 bg-white">
					{results.map((product) => (
						<div
							key={product.id}
							className={cn(
								'flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors',
								isSelected(product.id) && 'bg-blue-50/50'
							)}
							onClick={() => toggleProduct(product)}
						>
							<div className="h-10 w-10 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
								{product.image && (
									<img
										src={product.image}
										alt={product.name}
										className="h-full w-full object-cover"
									/>
								)}
							</div>
							<div className="flex-1 min-w-0">
								<div className="text-sm font-medium text-gray-900 truncate">
									{product.name}
								</div>
								<div className="text-xs text-gray-500">
									ID: {product.id} • SKU:{' '}
									{product.sku || 'N/A'}
								</div>
							</div>
							<div
								className={cn(
									'h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center',
									isSelected(product.id)
										? 'bg-primary border-primary text-white'
										: 'text-transparent'
								)}
							>
								<CheckIcon className="h-3 w-3" />
							</div>
						</div>
					))}
				</div>
			)}

			{ /* Selected Products Summary */}
			{selectedProductsMap.size > 0 && (
				<div className="pt-2 space-y-4">
					{ /* Selected Products Tags */}
					<div className="flex flex-wrap gap-2">
						{Array.from(selectedProductsMap.values()).map(
							(product) => (
								<div
									key={product.id}
									className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-sm border border-gray-200"
								>
									<Tooltip
										content={`${product.name} (ID: ${product.id
											}, SKU: ${product.sku || 'N/A'})`}
										className="bg-blue-800"
									>
										<span className="max-w-[150px] truncate block cursor-help">
											{product.name}
										</span>
									</Tooltip>
									<button
										onClick={() =>
											toggleProduct(product)
										}
										title={`Remove "${product.name}"`}
										className="text-gray-400 hover:text-red-500 bg-transparent cursor-pointer p-0 m-0 flex items-center justify-center"
									>
										<XIcon className="h-3 w-3" />
									</button>
								</div>
							)
						)}
					</div>

					{ /* Product count and remove */}
					<div className="flex items-center gap-4 text-sm bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-2 ">
						{ /* Remove all selection */}
						<ConfirmButton
							onConfirm={confirmRemoveAll}
							variant="ghost"
							size="sm"
							confirmMessage={`Remove ${selectedProductsMap.size
								} ${selectedProductsMap.size === 1
									? 'product'
									: 'products'
								}?`}
							className="font-normal text-red-600 hover:text-red-700 rounded-md hover:bg-red-100 px-2 py-0 flex items-center gap-1"
						>
							<Trash2Icon className="h-4 w-4 mr-1" />
							Remove all
						</ConfirmButton>

						{ /* Divider */}
						<div className="h-4 w-px bg-blue-300"></div>

						{ /* Product Count */}
						<div className="flex items-center gap-2 text-indigo-700">
							<PackageIcon className="h-4 w-4" />
							<span className="font-semibold">
								{selectedProductsMap.size}
							</span>
							<span className="text-indigo-600">
								{selectedProductsMap.size === 1
									? 'product'
									: 'products'}{' '}
								included
							</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
