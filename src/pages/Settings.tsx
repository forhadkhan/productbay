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
	DataSource,
	TableStyle,
	TableSettings as TableSettingsType
} from '@/types';

// Lazy load settings components
const AdminBarOptions = lazy(() => import('@/components/Settings/AdminBarOptions'));
const UninstallOptions = lazy(() => import('@/components/Settings/UninstallOptions'));

type SettingsTabValue = 'default' | 'advanced' | 'plugin';

const VALID_SETTINGS_TABS = ['default', 'advanced', 'plugin'] as const;

const SETTINGS_TABS: TabOption<SettingsTabValue>[] = [
	{
		value: 'default',
		label: __('Default Configuration', 'productbay'),
	},
	{
		value: 'advanced',
		label: __('Advanced', 'productbay'),
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

	// -- Handlers for Panels --

	const updateDefaults = (key: 'source' | 'style' | 'settings', data: any) => {
		updateSettings({
			...settings,
			table_defaults: {
				...tableDefaults,
				[key]: { ...tableDefaults[key], ...data }
			}
		});
	};

	// Source Handlers
	const setSourceType = (type: any) => updateDefaults('source', { ...source, type });
	const setSourceSort = (sort: any) => updateDefaults('source', { ...source, sort: { ...source.sort, ...sort } });
	const setSourceQueryArgs = (args: any) => updateDefaults('source', { ...source, queryArgs: { ...source.queryArgs, ...args } });

	// Style Handlers
	const setHeaderStyle = (v: any) => updateDefaults('style', { ...style, header: { ...style.header, ...v } });
	const setBodyStyle = (v: any) => updateDefaults('style', { ...style, body: { ...style.body, ...v } });
	const setButtonStyle = (v: any) => updateDefaults('style', { ...style, button: { ...style.button, ...v } });
	const setLayoutStyle = (v: any) => updateDefaults('style', { ...style, layout: { ...style.layout, ...v } });
	const setTypographyStyle = (v: any) => updateDefaults('style', { ...style, typography: { ...style.typography, ...v } });
	const setHoverStyle = (v: any) => updateDefaults('style', { ...style, hover: { ...style.hover, ...v } });
	const setResponsiveStyle = (v: any) => updateDefaults('style', { ...style, responsive: { ...style.responsive, ...v } });

	// Settings Handlers
	const setFeatures = (v: any) => updateDefaults('settings', { ...tableSettings, features: { ...tableSettings.features, ...v } });
	const setPagination = (v: any) => updateDefaults('settings', { ...tableSettings, pagination: { ...tableSettings.pagination, ...v } });
	const setCart = (v: any) => updateDefaults('settings', { ...tableSettings, cart: { ...tableSettings.cart, ...v } });
	const setFilters = (v: any) => updateDefaults('settings', { ...tableSettings, filters: { ...tableSettings.filters, ...v } });
	const setPerformance = (v: any) => updateDefaults('settings', { ...tableSettings, performance: { ...tableSettings.performance, ...v } });


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

	const handleResetDefaults = () => {
		if (confirm(__('Are you sure you want to reset all default configurations to factory settings?', 'productbay'))) {
			updateSettings({
				...settings,
				table_defaults: {
					source: createDefaultSource(),
					style: createDefaultStyle(),
					settings: createDefaultSettings()
				}
			});
		}
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
									<div className="border border-gray-200 rounded-lg bg-white">
										<SourcePanel
											source={source}
											setSourceType={setSourceType}
											setSourceSort={setSourceSort}
											setSourceQueryArgs={setSourceQueryArgs}
											className="border-none"
										/>
									</div>
								</div>

								<div>
									<h2 className="text-lg font-bold text-gray-900 mb-2">{__('Default Styling', 'productbay')}</h2>
									<p className="text-gray-500 mb-6">{__('Set the default look and feel for your tables.', 'productbay')}</p>
									<div className="border border-gray-200 rounded-lg bg-white">
										<DisplayPanel
											style={style}
											setHeaderStyle={setHeaderStyle}
											setBodyStyle={setBodyStyle}
											setButtonStyle={setButtonStyle}
											setLayoutStyle={setLayoutStyle}
											setTypographyStyle={setTypographyStyle}
											setHoverStyle={setHoverStyle}
											setResponsiveStyle={setResponsiveStyle}
											className="border-none"
										/>
									</div>
								</div>

								<div>
									<h2 className="text-lg font-bold text-gray-900 mb-2">{__('Default Functionality', 'productbay')}</h2>
									<p className="text-gray-500 mb-6">{__('Configure default features like sorting, pagination, and filters.', 'productbay')}</p>
									<div className="border border-gray-200 rounded-lg bg-white">
										<OptionsPanel
											settings={tableSettings}
											setFeatures={setFeatures}
											setPagination={setPagination}
											setCart={setCart}
											setFilters={setFilters}
											setPerformance={setPerformance}
											className="border-none"
										/>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'advanced' && (
						<div className="space-y-6">
							<div className="p-6">
								<h3 className="text-lg font-medium text-gray-900 mt-0 mb-4">
									{__('Advanced Settings', 'productbay')}
								</h3>
								<p className="text-gray-500">{__('Settings will be available soon', 'productbay')}</p>
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
		</div>
	);
};
export default Settings;
