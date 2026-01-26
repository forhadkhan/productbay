import { useState } from 'react';
import { Tabs, TabOption } from '../components/ui/Tabs';
import LivePreview from '@/components/Table/LivePreview';
import { useParams, useNavigate } from 'react-router-dom';
import { TableIcon, MonitorIcon, SettingsIcon } from 'lucide-react';

/* =============================================================================
 * Table Page
 * =============================================================================
 * Main page for configuring an individual table with three sections:
 * - Table: Configure table data and structure
 * - Display: Configure how the table is displayed
 * - Settings: Additional table settings
 * ============================================================================= */

/** Define the available tab values as a union type for type safety */
type TableTabValue = 'table' | 'display' | 'settings';

/** Tab configuration with icons matching the design reference */
const TABLE_TABS: TabOption<TableTabValue>[] = [
    {
        value: 'table',
        label: 'Table',
        icon: <TableIcon />,
    },
    {
        value: 'display',
        label: 'Display',
        icon: <MonitorIcon />,
    },
    {
        value: 'settings',
        label: 'Settings',
        icon: <SettingsIcon />,
    },
];

const Table = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    /** Track which tab is currently active */
    const [activeTab, setActiveTab] = useState<TableTabValue>('table');

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-6">
            <Tabs
                tabs={TABLE_TABS}
                value={activeTab}
                className="md:col-span-3"
                onChange={setActiveTab}
                aria-label="Table configuration tabs"
            >
                {/* Render content based on active tab */}
                {activeTab === 'table' && (
                    <div>
                        <p className="text-gray-700">Table Tab Content</p>
                        {/* TODO: Add table configuration components */}
                    </div>
                )}
                {activeTab === 'display' && (
                    <div>
                        <p className="text-gray-700">Display Tab Content</p>
                        {/* TODO: Add display configuration components */}
                    </div>
                )}
                {activeTab === 'settings' && (
                    <div>
                        <p className="text-gray-700">Settings Tab Content</p>
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
