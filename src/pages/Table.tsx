import { TablePropertiesIcon, MonitorIcon, SettingsIcon, SaveIcon, CopyIcon, InfoIcon, TrashIcon, AlertCircleIcon, PlusIcon, LoaderIcon } from 'lucide-react';
import { EditableText } from '@/components/ui/EditableText';
import ProductBayIcon from '@/components/ui/ProductBayIcon';
import { useParams, useNavigate } from 'react-router-dom';
import LivePreview from '@/components/Table/LivePreview';
import TabOptions from '@/components/Table/TabOptions';
import TabDisplay from '@/components/Table/TabDisplay';
import { Tabs, TabOption } from '@/components/ui/Tabs';
import { useTableStore } from '@/store/tableStore';
import TabTable from '@/components/Table/TabTable';
import { Tooltip } from '@/components/ui/Tooltip';
import { useToast } from '@/context/ToastContext';
import { Toggle } from '@/components/ui/Toggle';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Button } from '@/components/ui/Button';
import { useUrlTab } from '@/hooks/useUrlTab';
import { useState, useEffect } from 'react';
import { PATHS, NEW_TABLE_PATH } from '@/utils/routes';
import { apiFetch } from '@/utils/api';
import { __ } from '@wordpress/i18n';
import { cn } from '@/utils/cn';

/* =============================================================================
 * Table Page
 * =============================================================================
 * Main page for configuring an individual table with three sections:
 * - Table: Configure table data and structure
 * - Display: Configure how the table is displayed
 * - Options: Additional table options
 * 
 * Supports URL-based tab navigation via search params.
 * Example: #/new?tab=options activates Options tab.
 * ============================================================================= */

/** Define the available tab values as a union type for type safety */
type TableTabValue = 'table' | 'display' | 'options';

/**
 * Valid tab values for URL search param validation.
 * Used by useHashTab to validate the ?tab= parameter.
 */
const VALID_TABLE_TABS = ['table', 'display', 'options'] as const;

/** Tab configuration with icons matching the design reference */
const TABLE_TABS: TabOption<TableTabValue>[] = [
    {
        value: 'table',
        label: __('Table', 'productbay'),
        icon: <TablePropertiesIcon />,
    },
    {
        value: 'display',
        label: __('Display', 'productbay'),
        icon: <MonitorIcon />,
    },
    {
        value: 'options',
        label: __('Options', 'productbay'),
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
    const isNewTable = !id || id === 'new';
    const navigate = useNavigate();
    const { copy: copyToClipboard } = useCopyToClipboard();

    // Store access
    const {
        tableId,
        tableTitle,
        setTitle,
        tableStatus,
        setStatus,
        loadTable,
        saveTable,
        isLoading,
        error
    } = useTableStore();

    // Load data on mount or ID change
    useEffect(() => {
        if (!isNewTable) {
            loadTable(parseInt(id));
        } else {
            // Reset store for new table
            useTableStore.getState().resetStore();
        }
    }, [id, isNewTable, loadTable]);

    // Toast notification
    const { toast } = useToast();

    // Validation state
    const [titleError, setTitleError] = useState<string | undefined>(undefined);

    const shortcode = `[productbay id="${tableId}"]`;

    // Handle Delete
    const handleDelete = async () => {
        if (!confirm(__('Are you sure you want to delete this table? This action cannot be undone.', 'productbay'))) {
            return;
        }

        try {
            await apiFetch(`tables/${tableId}`, { method: 'DELETE' });
            toast({
                title: __('Deleted', 'productbay'),
                description: __('Table deleted successfully.', 'productbay'),
                type: 'success'
            });
            // Redirect to tables list (Soft navigation)
            navigate(PATHS.TABLES);
        } catch (error) {
            toast({
                title: __('Error', 'productbay'),
                description: __('Failed to delete table.', 'productbay'),
                type: 'error'
            });
        }
    };

    // Handle Save
    const [isSaving, setIsSaving] = useState(false);
    const handleSave = async () => {
        // Validation: Table Name is required
        if (!tableTitle.trim()) {
            const errorMsg = __('Table name is required.', 'productbay');
            setTitleError(errorMsg);
            toast({
                title: __('Validation Error', 'productbay'),
                description: errorMsg,
                type: 'error'
            });
            return;
        }

        setIsSaving(true);
        const success = await saveTable();
        setIsSaving(false);

        if (success) {
            toast({
                title: __('Success', 'productbay'),
                description: __('Table saved successfully.', 'productbay'),
                type: 'success'
            });

            // If it was a new table, redirect to the edit URL with the new ID
            const newId = useTableStore.getState().tableId;
            if (isNewTable && newId) {
                // Soft redirect to the edit route
                navigate(PATHS.TABLE_EDITOR.replace(':id', newId.toString()));
            }
        } else {
            toast({
                title: __('Error', 'productbay'),
                description: error || __('Failed to save table.', 'productbay'),
                type: 'error'
            });
        }
    };

    /**
     * Handle table name change
     */
    const handleNameChange = (newName: string) => {
        setTitle(newName);
        if (titleError) setTitleError(undefined);
    };

    /**
     * Sync tab state with URL search params.
     * - Reading: #/new?tab=options → activeTab = 'options'
     * - Writing: setActiveTab('display') → URL becomes #/new?tab=display
     */
    const [activeTab, setActiveTab] = useUrlTab<TableTabValue>('table', VALID_TABLE_TABS);

    // Derived state for UI
    const isActive = tableStatus === 'publish';

    if (isLoading && !isNewTable) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <ProductBayIcon className="animate-pulse size-12" />
            </div>
        );
    }

    // Error / Not Found State
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="bg-red-50 p-4 rounded-full mb-4 flex items-center justify-center">
                    <AlertCircleIcon className="size-8 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {__('Table Not Found', 'productbay')}
                </h2>
                <p className="text-gray-500 max-w-md mb-6">
                    {__('The table you are looking for does not exist or has been deleted.', 'productbay')}
                </p>
                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => navigate(PATHS.TABLES)}
                    >
                        {__('View Tables', 'productbay')}
                    </Button>
                    <Button
                        onClick={() => {
                            // Reset store and go to new table
                            useTableStore.getState().resetStore();
                            navigate(NEW_TABLE_PATH.path);
                        }}
                        className="cursor-pointer"
                    >
                        <PlusIcon className="size-4 mr-2" />
                        {NEW_TABLE_PATH.label}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Conditional: Shortcode for already saved table */}
            {tableId && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <span className="font-semibold text-lg text-blue-900">{__('Shortcode:', 'productbay')}</span>
                    <code className="bg-gray-100 text-lg px-2 py-1 rounded border border-gray-200 text-gray-800 font-mono">
                        {shortcode}
                    </code>
                    <div className="flex items-center justify-between gap-2">
                        <Tooltip content={__('Copy this shortcode and paste it into any Page or Post to display this table. ', 'productbay')}>
                            <InfoIcon className="size-6 text-gray-500 cursor-pointer" />
                        </Tooltip>
                        <Button
                            size="xs"
                            variant="outline"
                            onClick={() => {
                                copyToClipboard(shortcode);
                            }}
                            className="bg-white hover:bg-blue-100 text-blue-700 border-blue-200 cursor-pointer"
                        >
                            <CopyIcon className="size-3 mr-1.5" />
                            {__('Copy', 'productbay')}
                        </Button>
                    </div>
                </div>
            )}

            {/* Header: Table name on left, controls on right */}
            <div className="sticky top-[32px] z-20 bg-wp-bg/95 backdrop-blur-sm -mx-4 px-4 py-3 mb-4 border-b border-gray-200/50 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="order-2 md:order-1">
                        <EditableText
                            value={tableTitle}
                            onChange={handleNameChange}
                            error={titleError}
                            placeholder={__('Enter table name...', 'productbay')}
                        />
                    </div>
                    <div className="flex items-center justify-between md:justify-left gap-4 order-1 md:order-2">
                        {/* Delete Button (Only for existing tables) */}
                        {!isNewTable && (
                            <Tooltip content={__('Delete this table', 'productbay')}>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleDelete}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 cursor-pointer"
                                >
                                    <TrashIcon className="size-4" />
                                </Button>
                            </Tooltip>
                        )}

                        {/* Active/Inactive toggle with status indicator - hover feedback on container */}
                        <div className="flex items-center gap-2 hover:bg-white px-4 py-2 rounded-md transition-colors">
                            {/* Status dot indicator */}
                            <span
                                className={cn("size-2 rounded-full", isActive ? 'bg-green-500' : 'bg-gray-400')}
                            />
                            {/* Status label with dynamic color - fixed width to prevent layout shift */}
                            <span
                                className={cn("text-sm font-medium min-w-[52px]", isActive ? 'text-green-600' : 'text-gray-500')}
                            >
                                {isActive ? __('Active', 'productbay') : __('Inactive', 'productbay')}
                            </span>
                            {/* Toggle switch - only way to toggle */}
                            <Toggle
                                size="sm"
                                checked={isActive}
                                onChange={(e) => setStatus(e.target.checked ? 'publish' : 'draft')}
                                title={isActive ? __('Click toggle to deactivate', 'productbay') : __('Click toggle to activate', 'productbay')}
                            />
                        </div>
                        {/* Save Table button */}
                        <Button
                            size="default"
                            onClick={handleSave}
                            disabled={isSaving || isLoading}
                            className={`w-32 flex items-center justify-between cursor-pointer ${isSaving ? 'opacity-75 cursor-wait' : ''}`}
                        >
                            {isSaving ? __('Saving...', 'productbay') : __('Save Table', 'productbay')}
                            {isSaving ? (
                                <LoaderIcon className="size-4 ml-2 animate-spin" />
                            ) : (
                                <SaveIcon className="size-4 ml-2" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
            {/* Table configuration tabs */}
            <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-6 rounded-lg">
                {/* Table configuration tabs */}
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
                    {activeTab === 'options' && <TabOptions />}
                </Tabs>

                {/* Live preview section */}
                <div className="md:col-span-2">
                    <LivePreview
                        className="sticky top-[132px] z-10"
                    />
                </div>
            </div>
        </>
    );
};

export default Table;
