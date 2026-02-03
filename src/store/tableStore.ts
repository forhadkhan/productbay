import { create } from 'zustand';
import { apiFetch } from '@/utils/api';
import type {
	Column,
	DataSource,
	TableSettings,
	TableStyle,
	ProductTable,
	SourceType,
	createDefaultSource,
	createDefaultSettings,
	createDefaultStyle,
	createDefaultColumns,
} from '@/types';
import {
	createDefaultSource as defaultSource,
	createDefaultSettings as defaultSettings,
	createDefaultStyle as defaultStyle,
	createDefaultColumns as defaultColumns,
} from '@/types';

/* =============================================================================
 * Existing Types (Preserved for backward compatibility)
 * ============================================================================= */

export interface Category {
	id: number;
	name: string;
	count: number;
	slug: string;
}

export interface SourceStats {
	categories: number;
	products: number;
}

export interface Product {
	id: number;
	name: string;
	sku: string;
	price: string;
	image: string;
}

/* =============================================================================
 * Table Store State Interface
 * =============================================================================
 * Central state management for table configuration.
 * Uses 4-key structure matching backend: source, columns, settings, style
 * ============================================================================= */

interface TableStore {
	// =========================================================================
	// Core Table State (4-key structure)
	// =========================================================================

	/** Table metadata */
	tableId: number | null;
	tableTitle: string;
	tableStatus: 'publish' | 'draft';

	/** Data source configuration (_pb_source) */
	source: DataSource;

	/** Column configuration (_pb_columns) */
	columns: Column[];

	/** Functional settings (_pb_settings) */
	settings: TableSettings;

	/** Visual styling (_pb_style) */
	style: TableStyle;

	// =========================================================================
	// UI State
	// =========================================================================

	isLoading: boolean;
	isSaving: boolean;
	error: string | null;
	isDirty: boolean; // Track unsaved changes

	// =========================================================================
	// Category Cache State (preserved from original)
	// =========================================================================

	categories: Category[];
	categoriesLoading: boolean;
	categoriesLastFetched: number | null;

	// =========================================================================
	// Source Statistics State (preserved from original)
	// =========================================================================

	sourceStats: Record<string, SourceStats>;
	sourceStatsLoading: Record<string, boolean>;

	// =========================================================================
	// Legacy State (for backward compatibility during migration)
	// =========================================================================

	/** @deprecated Use source.queryArgs.categoryIds instead */
	tableData: {
		title: string;
		source_type: string;
		columns: { id: string; label: string }[];
		config: {
			categories?: number[];
			products?: number[];
			productObjects?: Record<number, Product>;
			[key: string]: unknown;
		};
	};

	// =========================================================================
	// Core Actions
	// =========================================================================

	/** Set table title */
	setTitle: (title: string) => void;

	/** Set table status (publish/draft) */
	setStatus: (status: 'publish' | 'draft') => void;

	// =========================================================================
	// Source Actions
	// =========================================================================

	/** Set source type (all, sale, category, specific) */
	setSourceType: (type: SourceType) => void;

	/** Update source query arguments */
	setSourceQueryArgs: (args: Partial<DataSource['queryArgs']>) => void;

	/** Update source sort configuration */
	setSourceSort: (sort: Partial<DataSource['sort']>) => void;

	// =========================================================================
	// Column Actions
	// =========================================================================

	/** Add a new column */
	addColumn: (column: Column) => void;

	/** Update an existing column */
	updateColumn: (columnId: string, updates: Partial<Column>) => void;

	/** Remove a column */
	removeColumn: (columnId: string) => void;

	/** Reorder columns (for drag-and-drop) */
	reorderColumns: (sourceIndex: number, destinationIndex: number) => void;

	// =========================================================================
	// Settings Actions
	// =========================================================================

	/** Update feature toggles */
	setFeatures: (features: Partial<TableSettings['features']>) => void;

	/** Update pagination settings */
	setPagination: (pagination: Partial<TableSettings['pagination']>) => void;

	/** Update cart settings */
	setCart: (cart: Partial<TableSettings['cart']>) => void;

	/** Update filter settings */
	setFilters: (filters: Partial<TableSettings['filters']>) => void;

	/** Update performance settings */
	setPerformance: (performance: Partial<TableSettings['performance']>) => void;

	// =========================================================================
	// Style Actions
	// =========================================================================

	/** Update header styles */
	setHeaderStyle: (header: Partial<TableStyle['header']>) => void;

	/** Update body styles */
	setBodyStyle: (body: Partial<TableStyle['body']>) => void;

	/** Update button styles */
	setButtonStyle: (button: Partial<TableStyle['button']>) => void;

	// =========================================================================
	// Persistence Actions
	// =========================================================================

	/** Reset store to defaults */
	resetStore: () => void;

	/** Load table from API */
	loadTable: (id: number) => Promise<void>;

	/** Save table to API */
	saveTable: () => Promise<boolean>;

	// =========================================================================
	// Category Cache Actions (preserved from original)
	// =========================================================================

	preloadCategories: () => Promise<void>;
	refreshCategoriesIfStale: () => Promise<void>;
	forceReloadCategories: () => Promise<void>;

	// =========================================================================
	// Source Statistics Actions (preserved from original)
	// =========================================================================

	fetchSourceStats: (sourceType: string) => Promise<void>;

	// =========================================================================
	// Legacy Actions (for backward compatibility)
	// =========================================================================

	/** @deprecated Use specific setters instead */
	setTableData: (data: Partial<TableStore['tableData']>) => void;

	/** @deprecated - not used in new architecture */
	currentStep: number;
	setStep: (step: number) => void;
}

/* =============================================================================
 * Constants
 * ============================================================================= */

const CACHE_KEY = 'productbay_categories_cache';
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes
const STALE_DURATION = 1000 * 60 * 5;  // 5 minutes

interface CacheData {
	categories: Category[];
	timestamp: number;
}

/* =============================================================================
 * Store Implementation
 * ============================================================================= */

export const useTableStore = create<TableStore>((set, get) => ({
	// =========================================================================
	// Initial State
	// =========================================================================

	tableId: null,
	tableTitle: '',
	tableStatus: 'draft',
	source: defaultSource(),
	columns: defaultColumns(),
	settings: defaultSettings(),
	style: defaultStyle(),

	isLoading: false,
	isSaving: false,
	error: null,
	isDirty: false,

	categories: [],
	categoriesLoading: false,
	categoriesLastFetched: null,

	sourceStats: {},
	sourceStatsLoading: {},

	// Legacy state for backward compatibility
	currentStep: 1,
	tableData: {
		title: '',
		source_type: 'all',
		columns: [
			{ id: 'image', label: 'Image' },
			{ id: 'name', label: 'Product Name' },
			{ id: 'price', label: 'Price' },
			{ id: 'add-to-cart', label: 'Add to Cart' },
		],
		config: {},
	},

	// =========================================================================
	// Core Actions
	// =========================================================================

	setTitle: (title) => set({
		tableTitle: title,
		isDirty: true,
		// Also update legacy state for backward compatibility
		tableData: { ...get().tableData, title }
	}),

	setStatus: (status) => set({ tableStatus: status, isDirty: true }),

	// =========================================================================
	// Source Actions
	// =========================================================================

	setSourceType: (type) => set((state) => ({
		source: { ...state.source, type },
		isDirty: true,
		// Also update legacy state
		tableData: { ...state.tableData, source_type: type }
	})),

	setSourceQueryArgs: (args) => set((state) => ({
		source: {
			...state.source,
			queryArgs: { ...state.source.queryArgs, ...args }
		},
		isDirty: true,
		// Also update legacy state for categories/products
		tableData: {
			...state.tableData,
			config: {
				...state.tableData.config,
				...(args.categoryIds !== undefined && { categories: args.categoryIds }),
				...(args.postIds !== undefined && { products: args.postIds }),
			}
		}
	})),

	setSourceSort: (sort) => set((state) => ({
		source: {
			...state.source,
			sort: { ...state.source.sort, ...sort }
		},
		isDirty: true,
	})),

	// =========================================================================
	// Column Actions
	// =========================================================================

	addColumn: (column) => set((state) => ({
		columns: [...state.columns, column],
		isDirty: true,
	})),

	updateColumn: (columnId, updates) => set((state) => ({
		columns: state.columns.map((col) =>
			col.id === columnId ? { ...col, ...updates } : col
		),
		isDirty: true,
	})),

	removeColumn: (columnId) => set((state) => ({
		columns: state.columns.filter((col) => col.id !== columnId),
		isDirty: true,
	})),

	reorderColumns: (sourceIndex, destinationIndex) => set((state) => {
		const newColumns = [...state.columns];
		const [removed] = newColumns.splice(sourceIndex, 1);
		newColumns.splice(destinationIndex, 0, removed);

		// Update order property for each column
		const reorderedColumns = newColumns.map((col, index) => ({
			...col,
			advanced: { ...col.advanced, order: index + 1 }
		}));

		return { columns: reorderedColumns, isDirty: true };
	}),

	// =========================================================================
	// Settings Actions
	// =========================================================================

	setFeatures: (features) => set((state) => ({
		settings: {
			...state.settings,
			features: { ...state.settings.features, ...features }
		},
		isDirty: true,
	})),

	setPagination: (pagination) => set((state) => ({
		settings: {
			...state.settings,
			pagination: { ...state.settings.pagination, ...pagination }
		},
		isDirty: true,
	})),

	setCart: (cart) => set((state) => ({
		settings: {
			...state.settings,
			cart: { ...state.settings.cart, ...cart }
		},
		isDirty: true,
	})),

	setFilters: (filters) => set((state) => ({
		settings: {
			...state.settings,
			filters: { ...state.settings.filters, ...filters }
		},
		isDirty: true,
	})),

	setPerformance: (performance) => set((state) => ({
		settings: {
			...state.settings,
			performance: { ...state.settings.performance, ...performance }
		},
		isDirty: true,
	})),

	// =========================================================================
	// Style Actions
	// =========================================================================

	setHeaderStyle: (header) => set((state) => ({
		style: {
			...state.style,
			header: { ...state.style.header, ...header }
		},
		isDirty: true,
	})),

	setBodyStyle: (body) => set((state) => ({
		style: {
			...state.style,
			body: { ...state.style.body, ...body }
		},
		isDirty: true,
	})),

	setButtonStyle: (button) => set((state) => ({
		style: {
			...state.style,
			button: { ...state.style.button, ...button }
		},
		isDirty: true,
	})),

	// =========================================================================
	// Persistence Actions
	// =========================================================================

	resetStore: () => set({
		tableId: null,
		tableTitle: '',
		tableStatus: 'draft',
		source: defaultSource(),
		columns: defaultColumns(),
		settings: defaultSettings(),
		style: defaultStyle(),
		isLoading: false,
		isSaving: false,
		error: null,
		isDirty: false,
		currentStep: 1,
		tableData: {
			title: '',
			source_type: 'all',
			columns: [
				{ id: 'image', label: 'Image' },
				{ id: 'name', label: 'Product Name' },
				{ id: 'price', label: 'Price' },
				{ id: 'add-to-cart', label: 'Add to Cart' },
			],
			config: {},
		},
	}),

	loadTable: async (id) => {
		set({ isLoading: true, error: null });
		try {
			const data = await apiFetch<any>(`tables/${id}`);

			// Map API response to store state
			set({
				tableId: data.id,
				tableTitle: data.title || '',
				tableStatus: data.status || 'draft',
				source: data.source || defaultSource(),
				columns: data.columns || defaultColumns(),
				settings: data.settings || defaultSettings(),
				style: data.style || defaultStyle(),
				isDirty: false,
				// Also set legacy state
				tableData: {
					title: data.title || '',
					source_type: data.source?.type || 'all',
					columns: data.columns?.map((c: Column) => ({ id: c.id, label: c.heading })) || [],
					config: {
						categories: data.source?.queryArgs?.categoryIds || [],
						products: data.source?.queryArgs?.postIds || [],
					},
				},
			});
		} catch (error) {
			console.error('Failed to load table:', error);
			set({ error: 'Failed to load table data' });
		} finally {
			set({ isLoading: false });
		}
	},

	saveTable: async () => {
		const state = get();
		set({ isSaving: true, error: null });

		try {
			// Build payload matching 4-key backend structure
			const payload: ProductTable = {
				id: state.tableId || undefined,
				title: state.tableTitle,
				status: state.tableStatus,
				source: state.source,
				columns: state.columns,
				settings: state.settings,
				style: state.style,
			};

			const response = await apiFetch<{ id: number }>('tables', {
				method: 'POST',
				body: JSON.stringify(payload),
			});

			// Update table ID if this was a new table
			if (response.id && !state.tableId) {
				set({ tableId: response.id });
			}

			set({ isDirty: false });
			return true;
		} catch (error) {
			console.error('Failed to save table:', error);
			set({ error: 'Failed to save table' });
			return false;
		} finally {
			set({ isSaving: false });
		}
	},

	// =========================================================================
	// Legacy Actions (preserved for backward compatibility)
	// =========================================================================

	setStep: (step) => set({ currentStep: step }),

	setTableData: (data) => set((state) => {
		const newTableData = { ...state.tableData, ...data };

		// Sync to new state structure
		const updates: Partial<TableStore> = { tableData: newTableData };

		if (data.title !== undefined) {
			updates.tableTitle = data.title;
		}

		if (data.source_type !== undefined) {
			updates.source = { ...state.source, type: data.source_type as SourceType };
		}

		if (data.config?.categories !== undefined) {
			updates.source = {
				...(updates.source || state.source),
				queryArgs: {
					...(updates.source?.queryArgs || state.source.queryArgs),
					categoryIds: data.config.categories,
				}
			};
		}

		if (data.config?.products !== undefined) {
			updates.source = {
				...(updates.source || state.source),
				queryArgs: {
					...(updates.source?.queryArgs || state.source.queryArgs),
					postIds: data.config.products,
				}
			};
		}

		updates.isDirty = true;

		return updates as TableStore;
	}),

	// =========================================================================
	// Category Cache Actions (preserved from original)
	// =========================================================================

	preloadCategories: async () => {
		if (get().categoriesLoading) return;

		set({ categoriesLoading: true });

		try {
			const cachedData = localStorage.getItem(CACHE_KEY);
			if (cachedData) {
				const parsed: CacheData = JSON.parse(cachedData);
				const now = Date.now();

				if (now - parsed.timestamp < CACHE_DURATION) {
					console.log('[CategoryCache] Using cached categories from localStorage');
					set({
						categories: parsed.categories,
						categoriesLastFetched: parsed.timestamp,
						categoriesLoading: false,
					});
					return;
				}
			}

			console.log('[CategoryCache] Fetching categories from API');
			const data = await apiFetch<Category[]>('categories');
			const timestamp = Date.now();

			const cacheData: CacheData = { categories: data, timestamp };
			localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

			set({
				categories: data,
				categoriesLastFetched: timestamp,
				categoriesLoading: false,
			});
		} catch (error) {
			console.error('[CategoryCache] Failed to load categories:', error);
			set({ categoriesLoading: false });
		}
	},

	refreshCategoriesIfStale: async () => {
		const { categoriesLastFetched, categoriesLoading } = get();

		if (categoriesLoading || !categoriesLastFetched) return;

		const now = Date.now();
		const isStale = now - categoriesLastFetched > STALE_DURATION;

		if (!isStale) return;

		console.log('[CategoryCache] Cache is stale, refreshing in background');

		try {
			const data = await apiFetch<Category[]>('categories');
			const timestamp = Date.now();

			const cacheData: CacheData = { categories: data, timestamp };
			localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

			set({
				categories: data,
				categoriesLastFetched: timestamp,
			});

			console.log('[CategoryCache] Background refresh complete');
		} catch (error) {
			console.error('[CategoryCache] Background refresh failed:', error);
		}
	},

	forceReloadCategories: async () => {
		set({ categoriesLoading: true });

		try {
			console.log('[CategoryCache] Force reloading categories from API');
			const data = await apiFetch<Category[]>('categories');
			const timestamp = Date.now();

			const cacheData: CacheData = { categories: data, timestamp };
			localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

			set({
				categories: data,
				categoriesLastFetched: timestamp,
				categoriesLoading: false,
			});

			console.log('[CategoryCache] Force reload complete');
		} catch (error) {
			console.error('[CategoryCache] Force reload failed:', error);
			set({ categoriesLoading: false });
		}
	},

	// =========================================================================
	// Source Statistics Actions (preserved from original)
	// =========================================================================

	fetchSourceStats: async (sourceType: string) => {
		const { sourceStatsLoading, sourceStats } = get();

		if (sourceStatsLoading[sourceType]) {
			console.log(`[SourceStats] Already loading ${sourceType}, skipping...`);
			return;
		}

		if (sourceStats[sourceType]) {
			console.log(`[SourceStats] Cache hit for ${sourceType}, using cached data`);
			return;
		}

		// Skip client-side calculated sources
		if (sourceType === 'category' || sourceType === 'specific') return;

		set((state) => ({
			sourceStatsLoading: {
				...state.sourceStatsLoading,
				[sourceType]: true,
			},
		}));

		try {
			console.log(`[SourceStats] Fetching stats for source type: ${sourceType}`);
			const data = await apiFetch<SourceStats>(`source-stats?type=${sourceType}`);

			set((state) => ({
				sourceStats: {
					...state.sourceStats,
					[sourceType]: data,
				},
				sourceStatsLoading: {
					...state.sourceStatsLoading,
					[sourceType]: false,
				},
			}));

			console.log(`[SourceStats] Stats loaded for ${sourceType}:`, data);
		} catch (error) {
			console.error(`[SourceStats] Failed to fetch stats for ${sourceType}:`, error);

			set((state) => ({
				sourceStatsLoading: {
					...state.sourceStatsLoading,
					[sourceType]: false,
				},
			}));
		}
	},
}));
