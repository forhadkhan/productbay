import { cn } from '../../utils/cn';
import { ReactNode, KeyboardEvent } from 'react';

/* =============================================================================
 * Tabs Component
 * =============================================================================
 * A reusable tabs component for switching between different views/content.
 * Each tab can display an optional icon alongside its label.
 *
 * Features:
 * - Fully accessible with proper ARIA attributes and keyboard navigation
 * - Visual feedback for active/inactive states
 * - Optional icons for each tab
 * - Controlled component pattern with value/onChange
 * - Customizable through className props
 * ============================================================================= */

/**
 * Represents a single tab option.
 */
export interface TabOption<T extends string = string> {
    /** Unique value identifier for the tab */
    value: T;
    /** Display label for the tab */
    label: string;
    /** Optional icon element to display before the label */
    icon?: ReactNode;
    /** Whether this tab is disabled */
    disabled?: boolean;
}

/**
 * Props for the Tabs component.
 */
export interface TabsProps<T extends string = string> {
    /** Array of tab options */
    tabs: TabOption<T>[];
    /** Currently active tab value */
    value: T;
    /** Callback fired when active tab changes */
    onChange: (value: T) => void;
    /** Content to render for the active tab (optional, can be managed externally) */
    children?: ReactNode;
    /** Additional CSS classes for the container */
    className?: string;
    /** Additional CSS classes for the tab list container */
    tabListClassName?: string;
    /** Additional CSS classes for individual tabs */
    tabClassName?: string;
    /** Additional CSS classes for the content panel */
    contentClassName?: string;
    /** Whether the entire tab group is disabled */
    disabled?: boolean;
    /** Accessible label for the tab list */
    'aria-label'?: string;
}

/**
 * Tabs renders a navigable tab interface with optional icons.
 *
 * The active tab displays with a blue color and subtle background while
 * inactive tabs have a muted gray appearance.
 *
 * @example
 * ```tsx
 * const tabs = [
 *   { value: 'table', label: 'Table', icon: <TableIcon /> },
 *   { value: 'display', label: 'Display', icon: <DisplayIcon /> },
 *   { value: 'settings', label: 'Settings', icon: <SettingsIcon /> },
 * ];
 *
 * <Tabs
 *   tabs={tabs}
 *   value={activeTab}
 *   onChange={setActiveTab}
 * >
 *   {activeTab === 'table' && <TableContent />}
 *   {activeTab === 'display' && <DisplayContent />}
 *   {activeTab === 'settings' && <SettingsContent />}
 * </Tabs>
 * ```
 */
const Tabs = <T extends string = string>({
    tabs,
    value,
    onChange,
    children,
    className,
    tabListClassName,
    tabClassName,
    contentClassName,
    disabled = false,
    'aria-label': ariaLabel,
}: TabsProps<T>) => {
    /**
     * Handles keyboard navigation within the tab list.
     * Arrow keys move focus between tabs, Enter/Space activates a tab.
     */
    const handleKeyDown = (
        event: KeyboardEvent,
        currentIndex: number
    ) => {
        const enabledTabs = tabs.filter((tab) => !tab.disabled && !disabled);
        const currentEnabledIndex = enabledTabs.findIndex(
            (tab) => tab.value === tabs[currentIndex].value
        );

        let newIndex: number | null = null;

        switch (event.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                event.preventDefault();
                newIndex = (currentEnabledIndex + 1) % enabledTabs.length;
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                event.preventDefault();
                newIndex =
                    (currentEnabledIndex - 1 + enabledTabs.length) %
                    enabledTabs.length;
                break;
            case 'Home':
                event.preventDefault();
                newIndex = 0;
                break;
            case 'End':
                event.preventDefault();
                newIndex = enabledTabs.length - 1;
                break;
            default:
                return;
        }

        if (newIndex !== null) {
            const newTab = enabledTabs[newIndex];
            onChange(newTab.value);
            // Focus the newly selected tab button
            const tabElement = document.querySelector(
                `[data-tab-value="${newTab.value}"]`
            ) as HTMLButtonElement;
            tabElement?.focus();
        }
    };

    return (
        <div className={cn('w-full', className)}>
            {/* Tab List - horizontal navigation bar */}
            <div
                role="tablist"
                aria-label={ariaLabel}
                className={cn(
                    'flex',
                    tabListClassName
                )}
            >
                {tabs.map((tab, index) => {
                    const isActive = value === tab.value;
                    const isDisabled = disabled || tab.disabled;

                    return (
                        <button
                            key={tab.value}
                            type="button"
                            role="tab"
                            data-tab-value={tab.value}
                            aria-selected={isActive}
                            aria-controls={`tabpanel-${tab.value}`}
                            tabIndex={isActive ? 0 : -1}
                            disabled={isDisabled}
                            onClick={() => !isDisabled && onChange(tab.value)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className={cn(
                                /* Base tab styles */
                                'relative flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-colors duration-200 bg-transparent rounded-t-lg',
                                'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1',
                                /* Active state: white bg, rounded top, connected to content body */
                                isActive && [
                                    'text-blue-600',
                                    'bg-white',
                                    /* Negative margin to overlap content border, creating seamless connection */
                                    '-mb-px',
                                    'border border-gray-200 border-b-white',
                                ],
                                /* Inactive state: muted gray text */
                                !isActive && [
                                    'text-gray-600 cursor-pointer',
                                    'hover:text-gray-900 hover:bg-gray-50',
                                ],
                                /* Disabled state */
                                isDisabled && [
                                    'cursor-not-allowed opacity-50',
                                    'hover:text-gray-600 hover:bg-transparent',
                                ],
                                tabClassName
                            )}
                        >
                            {/* Optional icon (rendered before label) */}
                            {tab.icon && (
                                <span
                                    className="inline-flex items-center flex-shrink-0 [&>svg]:w-4 [&>svg]:h-4"
                                    aria-hidden="true"
                                >
                                    {tab.icon}
                                </span>
                            )}
                            {/* Tab label */}
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab Panel - content area for the active tab (white background, with border) */}
            {children && (
                <div
                    role="tabpanel"
                    id={`tabpanel-${value}`}
                    aria-labelledby={`tab-${value}`}
                    tabIndex={0}
                    className={cn(
                        'p-4 bg-white border border-gray-200 rounded-b-lg rounded-tr-lg',
                        contentClassName
                    )}
                >
                    {children}
                </div>
            )}
        </div>
    );
}

Tabs.displayName = 'Tabs';

export { Tabs };
