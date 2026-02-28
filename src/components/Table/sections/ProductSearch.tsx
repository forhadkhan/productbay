import { __ } from '@wordpress/i18n';
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

const RESULTS_PER_PAGE = 20;

export const ProductSearch: React.FC = () => {
	const { tableData, setTableData } = useTableStore();
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<Product[]>([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [isOpen, setIsOpen] = useState(false);
	const wrapperRef = useRef<HTMLDivElement>(null);

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
	 * Search products with caching and pagination
	 */
	const fetchProducts = useCallback(async (searchQuery: string, pageNum: number, append: boolean = false) => {
		if (searchQuery.length > 0 && searchQuery.length < 2) {
			if (!append) setResults([]);
			return;
		}

		const searchParams = parseSearchQuery(searchQuery);
		const cacheKey = `${searchParams.type}:${searchParams.value.toLowerCase()}:page${pageNum}`;

		if (searchCache.current.has(cacheKey)) {
			console.log('[ProductSearch] Cache hit for:', cacheKey);
			const cachedData = searchCache.current.get(cacheKey)!;
			setResults(prev => append ? [...prev, ...cachedData] : cachedData);
			setHasMore(cachedData.length >= RESULTS_PER_PAGE);
			return;
		}

		setLoading(true);
		try {
			let apiQuery = `products?limit=${RESULTS_PER_PAGE}&page=${pageNum}`;

			// Build API query based on search type
			if (searchParams.type === 'id') {
				apiQuery += `&include=${searchParams.value}`;
			} else if (searchParams.type === 'sku') {
				apiQuery += `&sku=${encodeURIComponent(searchParams.value)}`;
			} else if (searchParams.value) {
				apiQuery += `&search=${encodeURIComponent(searchParams.value)}`;
			}

			const data = await apiFetch<Product[]>(apiQuery);

			// Store in cache
			searchCache.current.set(cacheKey, data);

			setResults(prev => append ? [...prev, ...data] : data);
			setHasMore(data.length >= RESULTS_PER_PAGE);
			setPage(pageNum);

			console.log('[ProductSearch] Fetched and cached:', cacheKey);
		} catch (error) {
			console.error('Failed to search products', error);
			if (!append) setResults([]);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		// Only run if the dropdown is open (focused) OR we have a query
		if (!isOpen && query.length === 0) return;

		const timeoutId = setTimeout(() => {
			fetchProducts(query, 1, false);
		}, 150);
		return () => clearTimeout(timeoutId);
	}, [query, isOpen, fetchProducts]);

	// Handle click outside to close results dropdown
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Infinite scroll handler
	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const target = e.currentTarget;
		if (target.scrollHeight - target.scrollTop <= target.clientHeight + 20) {
			if (!loading && hasMore) {
				fetchProducts(query, page + 1, true);
			}
		}
	};

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
		// It will automatically fetch default suggestions because `isOpen` is still true
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
		<div className="w-full space-y-4" ref={wrapperRef}>
			{ /* Search Input */}
			<div className="relative flex items-center">
				<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
				<Input
					placeholder="Search products by name, or use id:123 or sku:ABC"
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
						setIsOpen(true);
					}}
					onFocus={() => setIsOpen(true)}
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

			{ /* Search Results Inline Container */}
			{isOpen && (
				<div
					className="border border-gray-200 rounded-md shadow-sm max-h-60 overflow-y-auto divide-y divide-gray-100 bg-white"
					onScroll={handleScroll}
				>
					{results.length > 0 ? (
						results.map((product) => (
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
						))
					) : !loading && query.length >= 2 ? (
						<div className="p-4 text-center text-sm text-gray-500">
							{__('No products found for', 'productbay')} "{query}"
						</div>
					) : loading && results.length === 0 ? (
						<div className="p-4 flex justify-center text-sm text-gray-500">
							<Loader2Icon className="h-5 w-5 animate-spin text-gray-400 mr-2" />
							{__('Loading products...', 'productbay')}
						</div>
					) : null}
					{loading && results.length > 0 && (
						<div className="p-3 bg-gray-50/50 flex justify-center text-sm text-gray-500">
							<Loader2Icon className="h-4 w-4 animate-spin text-gray-400 mr-2" />
							{__('Loading more...', 'productbay')}
						</div>
					)}
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
