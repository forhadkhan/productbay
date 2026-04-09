import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { SearchIcon, XIcon, CheckIcon, Loader2Icon } from 'lucide-react';
import { useTableStore } from '@/store/tableStore';
import { Input } from '@/components/ui/Input';
import { apiFetch } from '@/utils/api';
import { __ } from '@wordpress/i18n';
import { Product } from '@/types';
import { cn } from '@/utils/cn';

const RESULTS_PER_PAGE = 20;

/**
 * ProductSearch Component
 *
 * Provides a search interface for hand-picking individual products.
 * Selected products are managed via the centralized tableStore.
 */
export const ProductSearch: React.FC = () => {
	const { source, setSourceQueryArgs } = useTableStore();
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<Product[]>([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [isOpen, setIsOpen] = useState(false);
	const wrapperRef = useRef<HTMLDivElement>(null);

	// Cache for search results to avoid redundant API calls
	const searchCache = useRef<Map<string, Product[]>>(new Map());

	/**
	 * Parse search query for special syntax (ID or SKU)
	 */
	const parseSearchQuery = (q: string): { type: 'id' | 'sku' | 'name'; value: string } => {
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
	const fetchProducts = useCallback(
		async (searchQuery: string, pageNum: number, append: boolean = false) => {
			if (searchQuery.length > 0 && searchQuery.length < 2) {
				if (!append) setResults([]);
				return;
			}

			const searchParams = parseSearchQuery(searchQuery);
			const cacheKey = `${searchParams.type
				}:${searchParams.value.toLowerCase()}:page${pageNum}`;

			if (searchCache.current.has(cacheKey)) {
				const cachedData = searchCache.current.get(cacheKey)!;
				setResults((prev) => (append ? [...prev, ...cachedData] : cachedData));
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

				setResults((prev) => (append ? [...prev, ...data] : data));
				setHasMore(data.length >= RESULTS_PER_PAGE);
				setPage(pageNum);
			} catch (error) {
				console.error('Failed to search products', error);
				if (!append) setResults([]);
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	// Debounced search trigger
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
	 * Memoized Set of selected product IDs for O(1) lookup
	 */
	const selectedIdsSet = useMemo(() => {
		return new Set(source.queryArgs.postIds || []);
	}, [source.queryArgs.postIds]);

	/**
	 * Toggle a product selection in the centralized store
	 */
	const toggleProduct = useCallback(
		(product: Product) => {
			const currentIds = source.queryArgs.postIds || [];
			const currentObjects = source.queryArgs.productObjects || {};
			const isSelected = currentIds.includes(product.id);

			let nextIds = [...currentIds];
			let nextObjects = { ...currentObjects };

			if (isSelected) {
				nextIds = nextIds.filter((id) => id !== product.id);
				delete nextObjects[product.id];
			} else {
				nextIds.push(product.id);
				nextObjects[product.id] = product;
			}

			setSourceQueryArgs({
				postIds: nextIds,
				productObjects: nextObjects,
			});
		},
		[source.queryArgs.postIds, source.queryArgs.productObjects, setSourceQueryArgs]
	);

	/**
	 * Clear search input
	 */
	const handleClearSearch = useCallback(() => {
		setQuery('');
	}, []);

	/**
	 * Selection check
	 */
	const isProductSelected = useCallback(
		(id: number) => {
			return selectedIdsSet.has(id);
		},
		[selectedIdsSet]
	);

	return (
		<div className="w-full" ref={wrapperRef}>
			{/* Search Input Container */}
			<div className="relative flex items-center">
				<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
				<Input
					placeholder={__('Search products by name, ID (id:123), or SKU (sku:ABC)...', 'productbay')}
					value={query}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						setQuery(e.target.value);
						setIsOpen(true);
					}}
					onFocus={() => setIsOpen(true)}
					className="pl-9 pr-9 h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-100 transition-all shadow-sm"
				/>
				<div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
					{loading ? (
						<Loader2Icon className="h-4 w-4 animate-spin text-gray-400" />
					) : query.length > 0 ? (
						<button
							onClick={handleClearSearch}
							className="bg-transparent cursor-pointer text-gray-400 hover:text-gray-600 p-0 m-0 flex items-center justify-center transition-colors"
							title={__('Clear search', 'productbay')}
						>
							<XIcon className="h-4 w-4" />
						</button>
					) : null}
				</div>
			</div>

			{/* Inline Search Results */}
			{isOpen && (
				<div
					className="mt-2 border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto divide-y divide-gray-100 bg-white z-10 animate-in fade-in slide-in-from-top-2 duration-200"
					onScroll={handleScroll}
				>
					{results.length > 0 ? (
						results.map((product) => (
							<div
								key={product.id}
								className={cn(
									'flex items-center gap-3 p-3 cursor-pointer hover:bg-blue-50/50 transition-colors group',
									isProductSelected(product.id) && 'bg-blue-50/30'
								)}
								onClick={() => toggleProduct(product)}
							>
								<div className="h-10 w-10 bg-gray-100 rounded flex-shrink-0 overflow-hidden border border-gray-200 group-hover:border-blue-200 transition-colors">
									{product.image ? (
										<img
											src={product.image}
											alt={product.name}
											className="h-full w-full object-cover"
										/>
									) : (
										<div className="h-full w-full flex items-center justify-center text-gray-300">
											<SearchIcon className="h-4 w-4" />
										</div>
									)}
								</div>
								<div className="flex-1 min-w-0">
									<div className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-700 transition-colors">
										{product.name}
									</div>
									<div className="text-xs text-gray-500 font-mono mt-0.5">
										#{product.id} {product.sku && `• ${product.sku}`}
									</div>
								</div>
								<div
									className={cn(
										'h-5 w-5 rounded-full border flex items-center justify-center transition-all',
										isProductSelected(product.id)
											? 'bg-blue-600 border-blue-600 text-white shadow-sm'
											: 'border-gray-300 text-transparent group-hover:border-blue-300'
									)}
								>
									<CheckIcon className="h-3 w-3" />
								</div>
							</div>
						))
					) : !loading && query.length >= 2 ? (
						<div className="p-8 text-center text-sm text-gray-500">
							<p>{__('No products found matching your search.', 'productbay')}</p>
						</div>
					) : loading && results.length === 0 ? (
						<div className="p-8 flex flex-col items-center justify-center text-sm text-gray-500">
							<Loader2Icon className="h-6 w-6 animate-spin text-blue-500 mb-2" />
							{__('Searching products...', 'productbay')}
						</div>
					) : (
						<div className="p-6 text-center text-sm text-gray-400">
							{__('Start typing to find products...', 'productbay')}
						</div>
					)}
					{loading && results.length > 0 ? (
						<div className="p-3 bg-gray-50/50 flex justify-center text-xs text-gray-500 italic">
							<Loader2Icon className="h-3 w-3 animate-spin text-gray-400 mr-2" />
							{__('Loading more results...', 'productbay')}
						</div>
					) : null}
				</div>
			)}
		</div>
	);
};
