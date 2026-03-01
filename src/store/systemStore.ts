/**
 * System Store
 * 
 * Manages global system status, such as WooCommerce activation 
 * and general plugin metadata.
 * 
 * @since 1.0.0
 */
import { create } from 'zustand';
import { apiFetch } from '../utils/api';

export interface SystemStatus {
	wc_active: boolean;
	product_count: number;
	table_count: number;
	version: string;
}

interface SystemStore {
	status: SystemStatus | null;
	loading: boolean;
	error: string | null;
	fetchStatus: () => Promise<void>;
}

export const useSystemStore = create<SystemStore>((set, get) => ({
	status: null,
	loading: false,
	error: null,
	fetchStatus: async () => {
		// If we already have data, we're not technically "loading" in a blocking way
		// but we still want to indicate a background refresh might be happening if needed.
		// For this UI, we'll just set loading=true only if we have NO data.
		if (!get().status) {
			set({ loading: true });
		}

		try {
			const data = await apiFetch<SystemStatus>('system/status');
			set({ status: data, loading: false, error: null });
		} catch (err: any) {
			set({ error: err.message, loading: false });
		}
	},
}));
