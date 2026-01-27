import { useEffect, useState, Suspense, lazy } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { Tabs, TabOption } from '@/components/ui/Tabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';
import { SaveIcon } from 'lucide-react';
import { __ } from '@wordpress/i18n';

// Lazy load settings components
const UninstallOptions = lazy(() => import('@/components/Settings/UninstallOptions'));

type SettingsTabValue = 'default' | 'advanced' | 'plugin';

/**
 * Settings tab configuration with translated labels
 */
const SETTINGS_TABS: TabOption<SettingsTabValue>[] = [
	{
		value: 'default',
		label: __('Default', 'productbay'),
	},
	{
		value: 'advanced',
		label: __('Advanced', 'productbay'),
	},
	{
		value: 'plugin',
		label: __('Plugin', 'productbay'),
	},
];

/**
 * Settings Page Component
 *
 * Manages plugin settings with tabbed interface for Default, Advanced, and Plugin options.
 */
const Settings = () => {
	const [activeTab, setActiveTab] = useState<SettingsTabValue>('default');

	// Use Zustand store
	const {
		settings,
		loading,
		saving,
		isDirty,
		fetchSettings,
		updateSettings,
		saveSettings
	} = useSettingsStore();

	/** Toast hook for displaying notifications */
	const { toast } = useToast();

	useEffect(() => {
		// Fetch settings on mount (store handles caching)
		fetchSettings();
	}, [fetchSettings]);

	const handleSave = async () => {
		try {
			await saveSettings();
			toast({
				title: __('Settings saved!', 'productbay'),
				description: __('Your settings have been saved successfully.', 'productbay'),
				type: 'success',
			});
		} catch (error) {
			toast({
				title: __('Failed to save settings', 'productbay'),
				description: (error as Error).message || __('An error occurred while saving your settings.', 'productbay'),
				type: 'error',
			});
		}
	};

	// Generic fallback skeleton for tab content while code is loading
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
			{/* Header */}
			<div className="flex items-center justify-between">
				{/* Title */}
				<h1 className="text-2xl font-bold text-gray-800 m-0">
					{__('Settings', 'productbay')}
				</h1>
				{/* Save Button */}
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

			{/* Tabs */}
			<Tabs
				tabs={SETTINGS_TABS}
				value={activeTab}
				onChange={setActiveTab}
				aria-label={__('Settings tabs', 'productbay')}
			>
				{/* Tab Content */}
				<Suspense fallback={<SettingsTabSkeleton />}>
					{/* Default Tab Content */}
					{activeTab === 'default' && (
						<div className="space-y-6">
							<div className="p-6">
								<h3 className="text-lg font-medium text-gray-900 mt-0 mb-4">
									{__('General Settings', 'productbay')}
								</h3>
								<p className="text-gray-500">{__('Settings will be available soon', 'productbay')}</p>
							</div>
						</div>
					)}

					{/* Advanced Tab Content */}
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

					{/* Plugin Tab Content */}
					{activeTab === 'plugin' && (
						<div className="space-y-6">
							<UninstallOptions
								settings={settings}
								setSettings={updateSettings}
								loading={loading}
							/>
						</div>
					)}
				</Suspense>
			</Tabs>
		</div>
	);
};
export default Settings;
