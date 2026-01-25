import { create } from 'zustand';
import { apiFetch } from '../utils/api';

interface TableColumn {
    id: string;
    label: string;
}

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

export interface TableConfig {
    categories?: number[];
    products?: number[];
    productObjects?: Record<number, Product>; // Store full product details
    [key: string]: any;
}

export interface TableData {
    title: string;
    source_type: string;
    columns: TableColumn[];
    config: TableConfig;
}

interface TableStore {
    // State
    currentStep: number;
    tableData: TableData;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;

    // Category cache state
    categories: Category[];
    categoriesLoading: boolean;
    categoriesLastFetched: number | null;

    // Source statistics state
    sourceStats: Record<string, SourceStats>; // Key: source type (all, sale, etc.)
    sourceStatsLoading: Record<string, boolean>;

    // Actions
    setStep: (step: number) => void;
    setTableData: (data: Partial<TableData>) => void;
    resetStore: () => void;
    loadTable: (id: number) => Promise<void>;
    saveTable: (id?: string) => Promise<boolean>;

    // Category cache actions
    preloadCategories: () => Promise<void>;
    refreshCategoriesIfStale: () => Promise<void>;
    forceReloadCategories: () => Promise<void>;

    // Source statistics actions
    fetchSourceStats: (sourceType: string) => Promise<void>;
}

const DEFAULT_DATA: TableData = {
    title: '',
    source_type: 'all',
    columns: [
        { id: 'image', label: 'Image' },
        { id: 'name', label: 'Product Name' },
        { id: 'price', label: 'Price' },
        { id: 'add-to-cart', label: 'Add to Cart' }
    ],
    config: {}
};

// Constants for category caching
const CACHE_KEY = 'productbay_categories_cache';
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes - full cache expiration
const STALE_DURATION = 1000 * 60 * 5;  // 5 minutes - triggers background refresh

interface CacheData {
    categories: Category[];
    timestamp: number;
}

export const useTableStore = create<TableStore>((set, get) => ({
    currentStep: 1,
    tableData: DEFAULT_DATA,
    isLoading: false,
    isSaving: false,
    error: null,

    // Category cache state
    categories: [],
    categoriesLoading: false,
    categoriesLastFetched: null,

    // Source statistics state
    sourceStats: {},
    sourceStatsLoading: {},

    setStep: (step) => set({ currentStep: step }),

    setTableData: (data) => set((state) => ({
        tableData: { ...state.tableData, ...data }
    })),

    resetStore: () => set({
        currentStep: 1,
        tableData: DEFAULT_DATA,
        isLoading: false,
        error: null
    }),

    loadTable: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const data = await apiFetch<any>(`tables/${id}`);
            set({
                tableData: {
                    title: data.title,
                    source_type: data.source_type || 'all',
                    columns: data.columns || DEFAULT_DATA.columns,
                    config: data.config || {}
                }
            });
        } catch (error) {
            console.error('Failed to load table:', error);
            set({ error: 'Failed to load table data' });
        } finally {
            set({ isLoading: false });
        }
    },

    saveTable: async (id) => {
        set({ isSaving: true, error: null });
        const { tableData } = get();

        try {
            await apiFetch('tables', {
                method: 'POST',
                body: JSON.stringify({
                    id: id,
                    ...tableData
                })
            });
            return true;
        } catch (error) {
            console.error('Failed to save table:', error);
            set({ error: 'Failed to save table' });
            return false;
        } finally {
            set({ isSaving: false });
        }
    },

    /**
     * Preload categories with intelligent caching
     * 
     * Data Flow:
     * 1. Check localStorage cache first
     * 2. If cache exists and is valid (< 30 min old), use it
     * 3. If cache is expired or missing, fetch from WordPress API
     * 4. Update both localStorage and Zustand store state
     * 
     * This is called by parent components (like StepSource) on mount
     * to ensure categories are ready before the user interacts with CategorySelector.
     */
    preloadCategories: async () => {
        // Avoid redundant fetches if already loading
        if (get().categoriesLoading) return;

        set({ categoriesLoading: true });

        try {
            // Step 1: Check localStorage cache
            const cachedData = localStorage.getItem(CACHE_KEY);
            if (cachedData) {
                const parsed: CacheData = JSON.parse(cachedData);
                const now = Date.now();

                // Step 2: Use cache if not expired (< 30 minutes)
                if (now - parsed.timestamp < CACHE_DURATION) {
                    console.log('[CategoryCache] Using cached categories from localStorage');
                    set({
                        categories: parsed.categories,
                        categoriesLastFetched: parsed.timestamp,
                        categoriesLoading: false
                    });
                    return;
                }
            }

            // Step 3: Fetch fresh data from API
            console.log('[CategoryCache] Fetching categories from API');
            const data = await apiFetch<Category[]>('categories');
            const timestamp = Date.now();

            // Step 4: Update both caches
            const cacheData: CacheData = { categories: data, timestamp };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

            set({
                categories: data,
                categoriesLastFetched: timestamp,
                categoriesLoading: false
            });
        } catch (error) {
            console.error('[CategoryCache] Failed to load categories:', error);
            set({ categoriesLoading: false });
        }
    },

    /**
     * Refresh categories if cache is stale (background refresh)
     * 
     * This is called when CategorySelector mounts. If the cached data is older
     * than 5 minutes (but less than 30 minutes), it will fetch fresh data in the
     * background without blocking the UI. Users see cached data immediately and
     * get automatic updates when fresh data arrives.
     * 
     * Data Flow:
     * 1. Check if cache is stale (> 5 min old)
     * 2. If stale, fetch from API in background (non-blocking)
     * 3. Update localStorage and store when fresh data arrives
     */
    refreshCategoriesIfStale: async () => {
        const { categoriesLastFetched, categoriesLoading } = get();

        // Skip if already loading or no cache exists
        if (categoriesLoading || !categoriesLastFetched) return;

        const now = Date.now();
        const isStale = now - categoriesLastFetched > STALE_DURATION;

        // Only refresh if stale
        if (!isStale) return;

        console.log('[CategoryCache] Cache is stale, refreshing in background');

        try {
            const data = await apiFetch<Category[]>('categories');
            const timestamp = Date.now();

            // Update both caches
            const cacheData: CacheData = { categories: data, timestamp };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

            set({
                categories: data,
                categoriesLastFetched: timestamp
            });

            console.log('[CategoryCache] Background refresh complete');
        } catch (error) {
            console.error('[CategoryCache] Background refresh failed:', error);
        }
    },

    /**
     * Force reload categories (manual user-triggered refresh)
     * 
     * Bypasses all caches and fetches fresh data from the API.
     * This is triggered when the user clicks the "Reload" button.
     * 
     * Data Flow:
     * 1. Set loading state (shows spinner in UI)
     * 2. Fetch fresh data from WordPress API
     * 3. Clear old cache and update with new data
     * 4. Update store state and clear loading
     */
    forceReloadCategories: async () => {
        set({ categoriesLoading: true });

        try {
            console.log('[CategoryCache] Force reloading categories from API');
            const data = await apiFetch<Category[]>('categories');
            const timestamp = Date.now();

            // Update both caches
            const cacheData: CacheData = { categories: data, timestamp };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

            set({
                categories: data,
                categoriesLastFetched: timestamp,
                categoriesLoading: false
            });

            console.log('[CategoryCache] Force reload complete');
        } catch (error) {
            console.error('[CategoryCache] Force reload failed:', error);
            set({ categoriesLoading: false });
        }
    },

    /**
     * Fetch source statistics for a given source type
     * 
     * Fetches product and category counts for 'all' and 'sale' source types.
     * For 'category' and 'specific', stats are calculated client-side.
     * 
     * Data Flow:
     * 1. Set loading state for this source type
     * 2. Fetch from WordPress API (/source-stats?type=...)
     * 3. Update sourceStats cache
     * 4. Clear loading state
     * 
     * Caching: In-memory only (Zustand store), no localStorage persistence.
     * Stats may change frequently as products are added/removed.
     */
    fetchSourceStats: async (sourceType: string) => {
        const { sourceStatsLoading, sourceStats } = get();

        // Skip if already loading
        if (sourceStatsLoading[sourceType]) {
            console.log(`[SourceStats] Already loading ${sourceType}, skipping...`);
            return;
        }

        // Skip if data already exists (cache hit)
        if (sourceStats[sourceType]) {
            console.log(`[SourceStats] Cache hit for ${sourceType}, using cached data`);
            return;
        }

        // Skip client-side calculated sources
        if (sourceType === 'category' || sourceType === 'specific') return;

        // Set loading state for this source
        set((state) => ({
            sourceStatsLoading: {
                ...state.sourceStatsLoading,
                [sourceType]: true
            }
        }));

        try {
            console.log(`[SourceStats] Fetching stats for source type: ${sourceType}`)
            const data = await apiFetch<SourceStats>(`source-stats?type=${sourceType}`);

            set((state) => ({
                sourceStats: {
                    ...state.sourceStats,
                    [sourceType]: data
                },
                sourceStatsLoading: {
                    ...state.sourceStatsLoading,
                    [sourceType]: false
                }
            }));

            console.log(`[SourceStats] Stats loaded for ${sourceType}:`, data);
        } catch (error) {
            console.error(`[SourceStats] Failed to fetch stats for ${sourceType}:`, error);

            // Clear loading state on error
            set((state) => ({
                sourceStatsLoading: {
                    ...state.sourceStatsLoading,
                    [sourceType]: false
                }
            }));
        }
    }
}));
