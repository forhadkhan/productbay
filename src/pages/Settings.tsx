import { DefaultColumnsConfig } from '@/components/Table/sections/DefaultColumnsConfig';
import { BulkSelectConfig } from '@/components/Table/sections/BulkSelectConfig';
import { DisplayPanel } from '@/components/Table/panels/DisplayPanel';
import { OptionsPanel } from '@/components/Table/panels/OptionsPanel';
import { SaveIcon, RefreshCwIcon, RotateCcwIcon } from 'lucide-react';
import { useEffect, useState, Suspense, lazy, useRef } from 'react';
import { SourcePanel } from '@/components/Table/panels/SourcePanel';
import { useSettingsStore } from '@/store/settingsStore';
import { Tabs, TabOption } from '@/components/ui/Tabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useUrlTab } from '@/hooks/useUrlTab';
import { __ } from '@wordpress/i18n';
import {
	createDefaultSource,
	createDefaultStyle,
	createDefaultSettings,
	createDefaultColumns,
	DataSource,
	TableStyle,
	TableSettings as TableSettingsType
} from '@/types';

// Lazy load settings components
const AdminBarOptions = lazy(() => import('@/components/Settings/AdminBarOptions'));
const UninstallOptions = lazy(() => import('@/components/Settings/UninstallOptions'));

type SettingsTabValue = 'default' | 'plugin';

const VALID_SETTINGS_TABS = ['default', 'plugin'] as const;

const SETTINGS_TABS: TabOption<SettingsTabValue>[] = [
	{
		value: 'default',
		label: __('Default Configuration', 'productbay'),
	},
	{
		value: 'plugin',
		label: __('Plugin Settings', 'productbay'),
	},
];

const Settings = () => {
	const [activeTab, setActiveTab] = useUrlTab<SettingsTabValue>('default', VALID_SETTINGS_TABS);
	const [showReloadModal, setShowReloadModal] = useState(false);
	const adminBarValueBeforeSave = useRef<boolean | undefined>(undefined);

	const {
		settings,
		loading,
		saving,
		isDirty,
		originalSettings,
		fetchSettings,
		updateSettings,
		saveSettings
	} = useSettingsStore();

	const { toast } = useToast();

	useEffect(() => {
		fetchSettings();
	}, [fetchSettings]);

	// Ensure table_defaults structure exists
	const tableDefaults = settings.table_defaults || {};
	const source = tableDefaults.source || createDefaultSource();
	const style = tableDefaults.style || createDefaultStyle();
	const tableSettings = tableDefaults.settings || createDefaultSettings();
	const columns = tableDefaults.columns || createDefaultColumns();

	// -- Handlers for Panels --

	const updateDefaults = (key: 'source' | 'style' | 'settings' | 'columns', data: any) => {
		updateSettings({
			...settings,
			table_defaults: {
				...tableDefaults,
				[key]: key === 'columns' ? data : { ...tableDefaults[key], ...data }
			}
		});
	};

	// Source Handlers
	const setSourceType = (type: any) => updateDefaults('source', { ...source, type });

	// Column Handler
	const setColumns = (cols: any) => updateDefaults('columns', cols);

	// Style Handlers
	const setHeaderStyle = (v: any) => updateDefaults('style', { ...style, header: { ...style.header, ...v } });
	const setBodyStyle = (v: any) => updateDefaults('style', { ...style, body: { ...style.body, ...v } });
	const setButtonStyle = (v: any) => updateDefaults('style', { ...style, button: { ...style.button, ...v } });
	const setLayoutStyle = (v: any) => updateDefaults('style', { ...style, layout: { ...style.layout, ...v } });
	const setTypographyStyle = (v: any) => updateDefaults('style', { ...style, typography: { ...style.typography, ...v } });
	const setHoverStyle = (v: any) => updateDefaults('style', { ...style, hover: { ...style.hover, ...v } });

	// Settings Handlers
	const setFeatures = (v: any) => updateDefaults('settings', { ...tableSettings, features: { ...tableSettings.features, ...v } });
	const setPagination = (v: any) => updateDefaults('settings', { ...tableSettings, pagination: { ...tableSettings.pagination, ...v } });
	const setCart = (v: any) => updateDefaults('settings', { ...tableSettings, cart: { ...tableSettings.cart, ...v } });


	const handleSave = async () => {
		adminBarValueBeforeSave.current = originalSettings.show_admin_bar;

		try {
			await saveSettings();
			toast({
				title: __('Settings saved!', 'productbay'),
				description: __('Your settings have been saved successfully.', 'productbay'),
				type: 'success',
			});

			if (adminBarValueBeforeSave.current !== settings.show_admin_bar) {
				setShowReloadModal(true);
			}
		} catch (error) {
			toast({
				title: __('Failed to save settings', 'productbay'),
				description: (error as Error).message || __('An error occurred while saving your settings.', 'productbay'),
				type: 'error',
			});
		}
	};

	const handleReload = () => {
		window.location.reload();
	};

	const [showResetModal, setShowResetModal] = useState(false);

	const handleResetDefaults = () => {
		setShowResetModal(true);
	};

	const confirmResetDefaults = () => {
		updateSettings({
			...settings,
			table_defaults: {
				source: createDefaultSource(),
				style: createDefaultStyle(),
				settings: createDefaultSettings(),
				columns: createDefaultColumns()
			}
		});
		setShowResetModal(false);
		toast({
			title: __('Defaults Reset', 'productbay'),
			description: __('Global default settings have been reset to factory values.', 'productbay'),
			type: 'success',
		});
	};

	const SettingsTabSkeleton = () => (
		<div className="p-6 space-y-6">
			<div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-6" />
			<div className="space-y-4">
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
			</div>
		</div>
	);

	return (
		<div className="w-full space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-800 m-0">
					{__('Settings', 'productbay')}
				</h1>
				<div className="flex items-center gap-3">
					{activeTab === 'default' && (
						<Button
							variant="outline"
							size="sm"
							onClick={handleResetDefaults}
							className="text-gray-500 hover:text-gray-700"
							title={__('Reset to Factory Defaults', 'productbay')}
						>
							<RotateCcwIcon className="w-4 h-4 mr-2" />
							{__('Reset Defaults', 'productbay')}
						</Button>
					)}
					<Button
						onClick={handleSave}
						disabled={saving || !isDirty}
						variant="default"
						size="sm"
						className={`w-36 ${saving || !isDirty ? 'cursor-not-allowed' : 'cursor-pointer'}`}
					>
						<SaveIcon className="w-4 h-4 mr-2" />
						{saving ? __('Saving...', 'productbay') : __('Save Changes', 'productbay')}
					</Button>
				</div>
			</div>

			<Tabs
				tabs={SETTINGS_TABS}
				value={activeTab}
				onChange={setActiveTab}
				aria-label={__('Settings tabs', 'productbay')}
			>
				<Suspense fallback={<SettingsTabSkeleton />}>
					{activeTab === 'default' && (
						<div className="space-y-10 p-6">
							<div className="max-w-4xl space-y-10">
								<div>
									<h2 className="text-lg font-bold text-gray-900 mb-2">{__('Default Source', 'productbay')}</h2>
									<p className="text-gray-500 mb-6">{__('Configure the default data source settings for new tables.', 'productbay')}</p>

									<SourcePanel
										source={source}
										setSourceType={setSourceType}
										className="border-none"
									/>
								</div>

								<hr className="border-b-2 border-gray-200" />

								<div className="flex flex-col gap-8">
									<div>
										<h2 className="text-lg font-bold text-gray-900 mb-2">{__('Default Columns', 'productbay')}</h2>
										<p className="text-gray-500 mb-6">{__('Configure the default columns for new tables.', 'productbay')}</p>
										<DefaultColumnsConfig
											columns={columns}
											onChange={setColumns}
										/>
									</div>

									{/* Bulk Select Configuration */}
									<BulkSelectConfig
										value={tableSettings.features.bulkSelect}
										onChange={(config) => setFeatures({ bulkSelect: config })}
									/>
								</div>

								<hr className="border-b-2 border-gray-200" />

								<div>
									<h2 className="text-lg font-bold text-gray-900 mb-2">{__('Default Styling', 'productbay')}</h2>
									<p className="text-gray-500 mb-6">{__('Set the default look and feel for your tables.', 'productbay')}</p>
									<DisplayPanel
										style={style}
										setHeaderStyle={setHeaderStyle}
										setBodyStyle={setBodyStyle}
										setButtonStyle={setButtonStyle}
										setLayoutStyle={setLayoutStyle}
										setTypographyStyle={setTypographyStyle}
										setHoverStyle={setHoverStyle}
										className="border-none"
									/>
								</div>

								<hr className="border-b-2 border-gray-200" />

								<div>
									<h2 className="text-lg font-bold text-gray-900 mb-2">{__('Default Functionality', 'productbay')}</h2>
									<p className="text-gray-500 mb-6">{__('Configure default features like sorting, pagination, and filters.', 'productbay')}</p>
									<OptionsPanel
										settings={tableSettings}
										setFeatures={setFeatures}
										setPagination={setPagination}
										setCart={setCart}
										className="border-none"
									/>
								</div>
							</div>
						</div>
					)}



					{activeTab === 'plugin' && (
						<div className="space-y-6">
							<AdminBarOptions
								settings={settings}
								setSettings={updateSettings}
								loading={loading}
							/>
							<UninstallOptions
								settings={settings}
								setSettings={updateSettings}
								loading={loading}
							/>
						</div>
					)}
				</Suspense>
			</Tabs>

			<Modal
				isOpen={showReloadModal}
				onClose={() => setShowReloadModal(false)}
				title={__('Page Reload Required', 'productbay')}
				maxWidth="sm"
				closeOnBackdropClick={false}
				primaryButton={{
					text: __('Reload Now', 'productbay'),
					onClick: handleReload,
					variant: 'primary',
					icon: <RefreshCwIcon className="w-4 h-4" />,
				}}
				secondaryButton={{
					text: __('Later', 'productbay'),
					onClick: () => setShowReloadModal(false),
					variant: 'secondary',
				}}
			>
				<p className="text-gray-600 m-0">
					{__('The admin bar setting requires a page reload to take effect. Would you like to reload now?', 'productbay')}
				</p>
			</Modal>

			<Modal
				isOpen={showResetModal}
				onClose={() => setShowResetModal(false)}
				title={__('Reset Global Defaults?', 'productbay')}
				maxWidth="sm"
				closeOnBackdropClick={true}
				primaryButton={{
					text: __('Yes, Reset Defaults', 'productbay'),
					onClick: confirmResetDefaults,
					variant: 'danger',
					icon: <RotateCcwIcon className="w-4 h-4" />,
				}}
				secondaryButton={{
					text: __('Cancel', 'productbay'),
					onClick: () => setShowResetModal(false),
					variant: 'secondary',
				}}
			>
				<p className="text-gray-600 m-0">
					{__('Are you sure you want to reset all global default configurations to their factory settings? This action cannot be undone.', 'productbay')}
				</p>
			</Modal>
		</div>
	);
};
export default Settings;
