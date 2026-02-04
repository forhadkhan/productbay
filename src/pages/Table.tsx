import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { useParams } from 'react-router-dom';
import { useUrlTab } from '@/hooks/useUrlTab';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { Tabs, TabOption } from '@/components/ui/Tabs';
import LivePreview from '@/components/Table/LivePreview';
import TabTable from '@/components/Table/TabTable';
import { EditableText } from '@/components/ui/EditableText';
import { TableIcon, MonitorIcon, SettingsIcon, SaveIcon } from 'lucide-react';
import TabDisplay from '@/components/Table/TabDisplay';
import TabSettings from '@/components/Table/TabSettings';

/* =============================================================================
 * Table Page
 * =============================================================================
 * Main page for configuring an individual table with three sections:
 * - Table: Configure table data and structure
 * - Display: Configure how the table is displayed
 * - Settings: Additional table settings
 * 
 * Supports URL-based tab navigation via search params.
 * Example: #/new?tab=settings activates Settings tab.
 * ============================================================================= */

/** Define the available tab values as a union type for type safety */
type TableTabValue = 'table' | 'display' | 'settings';

/**
 * Valid tab values for URL search param validation.
 * Used by useHashTab to validate the ?tab= parameter.
 */
const VALID_TABLE_TABS = ['table', 'display', 'settings'] as const;

/** Tab configuration with icons matching the design reference */
const TABLE_TABS: TabOption<TableTabValue>[] = [
    {
        value: 'table',
        label: __('Table', 'productbay'),
        icon: <TableIcon />,
    },
    {
        value: 'display',
        label: __('Display', 'productbay'),
        icon: <MonitorIcon />,
    },
    {
        value: 'settings',
        label: __('Settings', 'productbay'),
        icon: <SettingsIcon />,
    },
];

/**
 * Table Page Component
 *
 * Displays tabbed interface for configuring individual table with live preview.
 */
const Table = () => {
    const { id } = useParams<{ id: string }>();

    // Table name state with validation
    const [tableName, setTableName] = useState<string>('');
    const [nameError, setNameError] = useState<string | undefined>(undefined);

    // Table active/inactive status
    const [isActive, setIsActive] = useState<boolean>(true);

    /**
     * Handle table name change with validation.
     * Clears error on valid input, sets error if empty.
     */
    const handleNameChange = (newName: string) => {
        setTableName(newName);
        if (newName.trim() === '') {
            setNameError(__('Table name is required', 'productbay'));
        } else {
            setNameError(undefined);
        }
    };

    /**
     * Sync tab state with URL search params.
     * - Reading: #/new?tab=settings → activeTab = 'settings'
     * - Writing: setActiveTab('display') → URL becomes #/new?tab=display
     */
    const [activeTab, setActiveTab] = useUrlTab<TableTabValue>('table', VALID_TABLE_TABS);

    return (
        <>
            {/* Header: Table name on left, controls on right */}
            <div className="flex items-center justify-between mb-6">
                <EditableText
                    value={tableName}
                    error={nameError}
                    onChange={handleNameChange}
                    placeholder={__('Enter table name...', 'productbay')}
                />
                <div className="flex items-center gap-4">
                    {/* Active/Inactive toggle with status indicator - hover feedback on container */}
                    <div className="flex items-center gap-2 hover:bg-white px-4 py-2 rounded-md transition-colors">
                        {/* Status dot indicator */}
                        <span
                            className={`size-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'
                                }`}
                        />
                        {/* Status label with dynamic color - fixed width to prevent layout shift */}
                        <span
                            className={`text-sm font-medium min-w-[52px] ${isActive ? 'text-green-600' : 'text-gray-500'
                                }`}
                        >
                            {isActive ? __('Active', 'productbay') : __('Inactive', 'productbay')}
                        </span>
                        {/* Toggle switch - only way to toggle */}
                        <Toggle
                            size="sm"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            title={isActive ? __('Click toggle to deactivate', 'productbay') : __('Click toggle to activate', 'productbay')}
                        />
                    </div>
                    {/* Save Table button */}
                    <Button size="sm">
                        <SaveIcon className="size-4 mr-2" />
                        {__('Save Table', 'productbay')}
                    </Button>
                </div>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-6">
                <Tabs
                    tabs={TABLE_TABS}
                    value={activeTab}
                    className="md:col-span-3"
                    onChange={setActiveTab}
                    aria-label={__('Table configuration tabs', 'productbay')}
                >
                    {/* Render content based on active tab */}
                    {activeTab === 'table' && <TabTable />}
                    {activeTab === 'display' && <TabDisplay />}
                    {activeTab === 'settings' && <TabSettings />}
                </Tabs>

                <LivePreview
                    className="md:col-span-2"
                />
            </div>
        </>
    );
};

export default Table;
