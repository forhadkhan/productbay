import { __ } from '@wordpress/i18n';
import { Tabs, TabOption } from '@/components/ui/Tabs';
import LivePreview from '@/components/Table/LivePreview';
import { useUrlTab } from '@/hooks/useUrlTab';
import { useParams } from 'react-router-dom';
import { TableIcon, MonitorIcon, SettingsIcon } from 'lucide-react';

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

    /**
     * Sync tab state with URL search params.
     * - Reading: #/new?tab=settings → activeTab = 'settings'
     * - Writing: setActiveTab('display') → URL becomes #/new?tab=display
     */
    const [activeTab, setActiveTab] = useUrlTab<TableTabValue>('table', VALID_TABLE_TABS);

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-6">
            <Tabs
                tabs={TABLE_TABS}
                value={activeTab}
                className="md:col-span-3"
                onChange={setActiveTab}
                aria-label={__('Table configuration tabs', 'productbay')}
            >
                {/* Render content based on active tab */}
                {activeTab === 'table' && (
                    <div>
                        <p className="text-gray-700">{__('Table Tab Content', 'productbay')}</p>
                        {/* TODO: Add table configuration components */}
                    </div>
                )}
                {activeTab === 'display' && (
                    <div>
                        <p className="text-gray-700">{__('Display Tab Content', 'productbay')}</p>
                        {/* TODO: Add display configuration components */}
                    </div>
                )}
                {activeTab === 'settings' && (
                    <div>
                        <p className="text-gray-700">{__('Settings Tab Content', 'productbay')}</p>
                        {/* TODO: Add settings configuration components */}
                    </div>
                )}
            </Tabs>

            <LivePreview
                className="md:col-span-2"
            />
        </div>
    );
};

export default Table;
