import { create } from 'zustand';
import { apiFetch } from '@/utils/api';

interface SettingsState {
    settings: any;
    originalSettings: any;
    loading: boolean;
    saving: boolean;
    error: string | null;
    hasLoaded: boolean;
    isDirty: boolean;
    fetchSettings: (force?: boolean) => Promise<void>;
    updateSettings: (newSettings: any) => void;
    saveSettings: () => Promise<void>;
    resetSettings: () => Promise<any>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
    settings: {},
    originalSettings: {},
    loading: false,
    saving: false,
    error: null,
    hasLoaded: false,
    isDirty: false,

    fetchSettings: async (force = false) => {
        const { hasLoaded, loading } = get();
        // Return if already loaded and not forced, or currently loading
        if ((hasLoaded && !force) || loading) return;

        set({ loading: true, error: null });
        try {
            const data = await apiFetch('settings');
            set({
                settings: data,
                originalSettings: JSON.parse(JSON.stringify(data)), // Deep copy
                loading: false,
                hasLoaded: true,
                isDirty: false
            });
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            set({
                error: 'Failed to load settings',
                loading: false
            });
        }
    },

    updateSettings: (newSettings: any) => {
        const { originalSettings } = get();
        const isDirty = JSON.stringify(newSettings) !== JSON.stringify(originalSettings);
        set({ settings: newSettings, isDirty });
    },

    saveSettings: async () => {
        const { settings } = get();
        set({ saving: true, error: null });
        try {
            await apiFetch('settings', {
                method: 'POST',
                body: JSON.stringify({ settings }),
            });
            // Update originalSettings to match the saved settings
            set({
                saving: false,
                originalSettings: JSON.parse(JSON.stringify(settings)),
                isDirty: false
            });
        } catch (error) {
            console.error('Failed to save settings:', error);
            set({
                error: 'Failed to save settings',
                saving: false
            });
            throw error; // Re-throw to handle in component (e.g., show toast)
        }
    },

    resetSettings: async () => {
        set({ saving: true, error: null });
        try {
            const data = await apiFetch<{ success: boolean; deleted_tables: number; settings: any }>('settings/reset', {
                method: 'POST',
            });
            set({
                settings: data.settings,
                originalSettings: JSON.parse(JSON.stringify(data.settings)),
                saving: false,
                isDirty: false
            });
            return data;
        } catch (error) {
            console.error('Failed to reset settings:', error);
            set({
                error: 'Failed to reset settings',
                saving: false
            });
            throw error;
        }
    },
}));
