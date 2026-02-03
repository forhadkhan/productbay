import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/* =============================================================================
 * useUrlTab Hook
 * =============================================================================
 * A reusable hook that syncs tab state with URL search parameters.
 * 
 * Note: Since this app uses HashRouter (URL like #/settings), we cannot use
 * hash fragments for tabs. Instead, we use search params (e.g., #/settings?tab=plugin).
 * 
 * Features:
 * - Reads initial tab from URL search params on mount (e.g., `?tab=plugin` -> 'plugin')
 * - Updates URL search params when tab changes (without page reload)
 * - Falls back to default tab if param is invalid or empty
 * 
 * Usage:
 *   const [activeTab, setActiveTab] = useUrlTab<MyTabType>('default', validTabs);
 *   // URL: #/settings?tab=plugin -> activeTab = 'plugin'
 *   // setActiveTab('advanced') -> URL becomes #/settings?tab=advanced
 * ============================================================================= */

/**
 * Custom hook to sync tab state with URL search parameters
 *
 * @template T - Union type of valid tab values
 * @param defaultTab - The default tab to use when param is empty/invalid
 * @param validTabs - Array of valid tab values for validation
 * @param paramName - Name of the search parameter (default: 'tab')
 * @returns Tuple of [activeTab, setActiveTab] similar to useState
 */
export const useUrlTab = <T extends string>(
    defaultTab: T,
    validTabs: readonly T[],
    paramName: string = 'tab'
): [T, (tab: T) => void] => {
    const [searchParams, setSearchParams] = useSearchParams();

    /**
     * Get current tab from URL search params.
     * Returns defaultTab if param is empty or invalid.
     */
    const getActiveTab = useCallback((): T => {
        const tabParam = searchParams.get(paramName) as T;
        return validTabs.includes(tabParam) ? tabParam : defaultTab;
    }, [searchParams, defaultTab, validTabs, paramName]);

    /**
     * Update URL search params when tab changes.
     * Uses replace to avoid polluting browser history with tab changes.
     */
    const setActiveTab = useCallback(
        (tab: T) => {
            setSearchParams(
                (prev) => {
                    // Preserve existing params while updating the tab param
                    const newParams = new URLSearchParams(prev);
                    newParams.set(paramName, tab);
                    return newParams;
                },
                { replace: true }
            );
        },
        [setSearchParams, paramName]
    );

    return [getActiveTab(), setActiveTab];
};

export default useUrlTab;
