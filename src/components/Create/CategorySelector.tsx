/**
 * CategorySelector Component
 *
 * A multi-select dropdown component for selecting WooCommerce product categories.
 *
 * === DATA FLOW ARCHITECTURE ===
 *
 * 1. PRELOADING (Parent Component - StepSource):
 *    - When StepSource mounts, it calls `preloadCategories()` from Zustand store
 *    - This ensures categories are cached BEFORE user opens this component
 *    - Result: Instant display with no loading delay
 *
 * 2. CACHING LAYERS:
 *    a) localStorage Cache (30-minute TTL):
 *       - Key: 'productbay_categories_cache'
 *       - Stores: { categories: Category[], timestamp: number }
 *       - Persists across browser sessions
 *
 *    b) Zustand Store Cache (in-memory):
 *       - State: categories[], categoriesLoading, categoriesLastFetched
 *       - Provides instant access across all components
 *       - Single source of truth for React components
 *
 * 3. REFRESH STRATEGIES:
 *    a) Automatic Background Refresh:
 *       - Triggered when component mounts via `refreshCategoriesIfStale()`
 *       - Only runs if cache is 5+ minutes old (but < 30 min)
 *       - Non-blocking: displays cached data immediately while fetching fresh data
 *       - Updates UI automatically when fresh data arrives
 *
 *    b) Manual Force Reload:
 *       - Triggered by user clicking "🔄 Reload" button
 *       - Calls `forceReloadCategories()` - bypasses all caches
 *       - Shows loading spinner while fetching
 *       - Useful when user knows categories have changed
 *
 * 4. STATE MANAGEMENT:
 *    - Categories data: Managed in Zustand store (NOT local state)
 *    - Selected categories: Stored in tableData.config.categories (Zustand)
 *    - Local UI state: dropdown open/closed, search query
 *
 * 5. USER EXPERIENCE:
 *    - First load: Categories may load from API (preloaded in parent)
 *    - Subsequent loads: Instant display from cache
 *    - Stale data: Background refresh with seamless update
 *    - Manual refresh: User has control via reload button
 *    - Statistics: Shows selected count + total products included
 */

import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { ConfirmButton } from '../ui/ConfirmButton';
import { SourceStatistics } from './SourceStatistics';
import { useTableStore } from '../../store/tableStore';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
	XIcon,
	ChevronDownIcon,
	SearchIcon,
	Loader2Icon,
	RefreshCwIcon,
} from 'lucide-react';

export const CategorySelector: React.FC = () => {
	const {
		tableData,
		setTableData,
		categories,
		categoriesLoading,
		refreshCategoriesIfStale,
		forceReloadCategories,
	} = useTableStore();

	const [ open, setOpen ] = useState( false );
	const [ searchQuery, setSearchQuery ] = useState( '' );
	const dropdownRef = useRef< HTMLDivElement >( null );
	const searchInputRef = useRef< HTMLInputElement >( null );

	/**
	 * Background refresh on component mount
	 *
	 * When CategorySelector mounts, check if cached data is stale (> 5 min old).
	 * If stale, fetch fresh data in background while displaying cached version.
	 * This ensures users always see up-to-date data without waiting.
	 */
	useEffect( () => {
		refreshCategoriesIfStale();
	}, [ refreshCategoriesIfStale ] );

	/**
	 * Filter categories based on search query (client-side filtering)
	 */
	const filteredCategories = useMemo( () => {
		if ( searchQuery.trim() === '' ) {
			return categories;
		}
		const query = searchQuery.toLowerCase();
		return categories.filter( ( cat ) =>
			cat.name.toLowerCase().includes( query )
		);
	}, [ searchQuery, categories ] );

	/**
	 * Auto-focus search input when dropdown opens
	 */
	useEffect( () => {
		if ( open && searchInputRef.current ) {
			setTimeout( () => searchInputRef.current?.focus(), 50 );
		} else {
			setSearchQuery( '' );
		}
	}, [ open ] );

	/**
	 * Close dropdown on outside click
	 */
	useEffect( () => {
		const handleClickOutside = ( event: MouseEvent ) => {
			if (
				dropdownRef.current &&
				! dropdownRef.current.contains( event.target as Node )
			) {
				setOpen( false );
			}
		};

		if ( open ) {
			document.addEventListener( 'mousedown', handleClickOutside );
			return () =>
				document.removeEventListener( 'mousedown', handleClickOutside );
		}
	}, [ open ] );

	// Selected category IDs from store
	const selectedIds = tableData.config.categories || [];

	// Get full category objects for selected IDs
	const selectedCategories = categories.filter( ( cat ) =>
		selectedIds.includes( cat.id )
	);

	// Calculate statistics
	const totalProducts = selectedCategories.reduce(
		( sum, cat ) => sum + cat.count,
		0
	);

	/**
	 * Toggle category selection
	 */
	const toggleCategory = ( id: number ) => {
		const newSelected = selectedIds.includes( id )
			? selectedIds.filter( ( catId ) => catId !== id )
			: [ ...selectedIds, id ];

		setTableData( {
			config: {
				...tableData.config,
				categories: newSelected,
			},
		} );
	};

	/**
	 * Remove category from selection
	 */
	const removeCategory = ( id: number ) => {
		const newSelected = selectedIds.filter( ( catId ) => catId !== id );
		setTableData( {
			config: {
				...tableData.config,
				categories: newSelected,
			},
		} );
	};

	/**
	 * Handle manual reload button click
	 */
	const handleReload = async ( e: React.MouseEvent ) => {
		e.stopPropagation();
		await forceReloadCategories();
	};

	/**
	 * Clear selection logic
	 */
	function handleClearSelection(): void {
		setTableData( {
			config: {
				...tableData.config,
				categories: [],
			},
		} );
	}

	return (
		<div className="w-full space-y-3">
			{ /* Main Selector */ }
			<div className="relative" ref={ dropdownRef }>
				{ /* Select Input */ }
				<div
					className={ cn(
						'min-h-[40px] w-full border border-gray-300 rounded-md px-3 py-2 bg-white cursor-pointer transition-colors',
						open
							? 'border-blue-500 ring-2 ring-blue-100'
							: 'hover:border-gray-400'
					) }
					onClick={ () => setOpen( ! open ) }
				>
					<div className="flex items-center justify-between gap-2">
						<div className="flex-1 flex flex-wrap gap-1.5">
							{ categoriesLoading && categories.length === 0 ? (
								<span className="text-gray-500 text-sm flex items-center gap-2">
									<Loader2Icon className="h-4 w-4 animate-spin" />{ ' ' }
									Loading categories...
								</span>
							) : selectedCategories.length === 0 ? (
								<span className="text-gray-400 text-sm">
									Select categories...
								</span>
							) : (
								selectedCategories.map( ( cat ) => (
									<span
										key={ cat.id }
										className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-sm font-medium"
										onClick={ ( e ) => {
											e.stopPropagation();
											removeCategory( cat.id );
										} }
									>
										{ cat.name } ({ cat.count })
										<XIcon className="h-3 w-3 hover:text-blue-900 cursor-pointer" />
									</span>
								) )
							) }
						</div>
						<ChevronDownIcon
							className={ cn(
								'h-4 w-4 text-gray-500 transition-transform flex-shrink-0',
								open && 'transform rotate-180'
							) }
						/>
					</div>
				</div>

				{ /* Dropdown */ }
				{ open && (
					<div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-80 flex flex-col">
						{ /* Search Input */ }
						<div className="p-2 border-b border-gray-200">
							<div className="relative">
								<SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
								<input
									ref={ searchInputRef }
									type="text"
									placeholder="Search categories..."
									className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
									value={ searchQuery }
									onChange={ ( e ) =>
										setSearchQuery( e.target.value )
									}
									onClick={ ( e ) => e.stopPropagation() }
								/>
							</div>
						</div>

						{ /* Options List */ }
						<div className="overflow-y-auto flex-1">
							{ filteredCategories.length === 0 ? (
								<div className="p-3 text-sm text-gray-500 text-center">
									{ searchQuery
										? 'No categories found matching your search.'
										: 'No categories available.' }
								</div>
							) : (
								filteredCategories.map( ( category ) => {
									const isSelected = selectedIds.includes(
										category.id
									);
									return (
										<div
											key={ category.id }
											className={ cn(
												'flex items-center px-3 py-2 text-sm cursor-pointer transition-colors',
												isSelected
													? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
													: 'hover:bg-gray-50'
											) }
											onClick={ ( e ) => {
												e.stopPropagation();
												toggleCategory( category.id );
											} }
										>
											<input
												type="checkbox"
												checked={ isSelected }
												onChange={ () => {} }
												className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
											/>
											<span className="flex-1 font-medium">
												{ category.name }
											</span>
											<span className="text-xs text-gray-400">
												({ category.count })
											</span>
										</div>
									);
								} )
							) }
						</div>

						{ /* Footer with selection count and reload button */ }
						<div className="p-2 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-2 rounded-b-md">
							<span className="text-xs text-gray-600">
								{ selectedIds.length > 0
									? `${ selectedIds.length } ${
											selectedIds.length === 1
												? 'category'
												: 'categories'
									  } selected`
									: 'No categories selected' }
							</span>

							{ /* Action Buttons */ }
							<div className="flex items-center gap-2">
								{ /* Clear selection button with confirmation */ }
								<ConfirmButton
									onConfirm={ handleClearSelection }
									variant="ghost"
									size="xs"
									confirmMessage="Clear all?"
									disabled={ selectedIds.length === 0 }
									className={ cn(
										'flex items-center gap-1.5 font-medium hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-gray-200',
										selectedIds.length === 0
											? 'text-gray-300'
											: 'text-red-600'
									) }
								>
									<XIcon className="h-3 w-3" />
									Clear
								</ConfirmButton>

								{ /* Reload button: Manual refresh */ }
								<Button
									variant="ghost"
									size="xs"
									onClick={ handleReload }
									disabled={ categoriesLoading }
									className={ cn(
										'flex items-center gap-1.5 font-medium transition-colors border border-transparent hover:border-gray-200 cursor-pointer',
										categoriesLoading
											? 'text-gray-400'
											: 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
									) }
									title="Reload categories from server"
								>
									<RefreshCwIcon
										className={ cn(
											'h-3 w-3',
											categoriesLoading && 'animate-spin'
										) }
									/>
									Reload
								</Button>
							</div>
						</div>
					</div>
				) }
			</div>

			{ /* Statistics Display */ }
			<SourceStatistics
				categoryCount={ selectedCategories.length }
				productCount={ totalProducts }
				showEmpty={ true }
			/>
		</div>
	);
};
