import { create } from 'zustand';
import { apiFetch } from '../utils/api';

interface TableColumn {
    id: string;
    label: string;
}

export interface TableData {
    title: string;
    source_type: string;
    columns: TableColumn[];
    config: Record<string, any>;
}

interface TableStore {
    // State
    currentStep: number;
    tableData: TableData;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;

    // Actions
    setStep: (step: number) => void;
    setTableData: (data: Partial<TableData>) => void;
    resetStore: () => void;
    loadTable: (id: number) => Promise<void>;
    saveTable: (id?: string) => Promise<boolean>;
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

export const useTableStore = create<TableStore>((set, get) => ({
    currentStep: 1,
    tableData: DEFAULT_DATA,
    isLoading: false,
    isSaving: false,
    error: null,

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
    }
}));
