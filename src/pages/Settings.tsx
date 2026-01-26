import { useEffect, useState, Suspense, lazy } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { Tabs, TabOption } from '@/components/ui/Tabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';
import { Save } from 'lucide-react';

// Lazy load settings components
const UninstallOptions = lazy(() => import('@/components/Settings/UninstallOptions'));

type SettingsTabValue = 'default' | 'advanced' | 'plugin';

const SETTINGS_TABS: TabOption<SettingsTabValue>[] = [
	{
		value: 'default',
		label: 'Default',
	},
	{
		value: 'advanced',
		label: 'Advanced',
	},
	{
		value: 'plugin',
		label: 'Plugin',
	},
];

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
				title: 'Settings saved!',
				description: 'Your settings have been saved successfully.',
				type: 'success',
			});
		} catch (error) {
			toast({
				title: 'Failed to save settings',
				description: 'An error occurred while saving your settings.',
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
					Settings
				</h1>
				{/* Save Button */}
				<Button
					onClick={handleSave}
					disabled={saving || !isDirty}
					variant="default"
					size="sm"
					className={`w-36 ${saving || !isDirty ? 'cursor-not-allowed' : 'cursor-pointer'}`}
				>
					<Save className="w-4 h-4 mr-2" />
					{saving ? 'Saving...' : 'Save Changes'}
				</Button>
			</div>

			{/* Tabs */}
			<Tabs
				tabs={SETTINGS_TABS}
				value={activeTab}
				onChange={setActiveTab}
				aria-label="Settings tabs"
			>
				{/* Tab Content */}
				<Suspense fallback={<SettingsTabSkeleton />}>
					{/* Default Tab Content */}
					{activeTab === 'default' && (
						<div className="space-y-6">
							<div className="p-6">
								<h3 className="text-lg font-medium text-gray-900 mt-0 mb-4">
									General Settings
								</h3>
								<p className="text-gray-500">Settings will be available soon</p>
							</div>
						</div>
					)}

					{/* Advanced Tab Content */}
					{activeTab === 'advanced' && (
						<div className="space-y-6">
							<div className="p-6">
								<h3 className="text-lg font-medium text-gray-900 mt-0 mb-4">
									Advanced Settings
								</h3>
								<p className="text-gray-500">Settings will be available soon</p>
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
