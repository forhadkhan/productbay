import { useEffect, useState, Suspense, lazy, useRef } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { Tabs, TabOption } from '@/components/ui/Tabs';
import { SaveIcon, RefreshCwIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/context/ToastContext';
import { useUrlTab } from '@/hooks/useUrlTab';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { __ } from '@wordpress/i18n';

// Lazy load settings components
const AdminBarOptions = lazy(() => import('@/components/Settings/AdminBarOptions'));
const UninstallOptions = lazy(() => import('@/components/Settings/UninstallOptions'));

type SettingsTabValue = 'default' | 'advanced' | 'plugin';

/**
 * Valid tab values for URL search param validation.
 * Used by useHashTab to validate the ?tab= parameter.
 */
const VALID_SETTINGS_TABS = ['default', 'advanced', 'plugin'] as const;

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
 * Supports URL-based tab navigation via search params.
 * Example: #/settings?tab=plugin activates Plugin tab.
 */
const Settings = () => {
	/**
	 * Sync tab state with URL search params.
	 * - Reading: #/settings?tab=plugin → activeTab = 'plugin'
	 * - Writing: setActiveTab('advanced') → URL becomes #/settings?tab=advanced
	 */
	const [activeTab, setActiveTab] = useUrlTab<SettingsTabValue>('default', VALID_SETTINGS_TABS);

	// State to control reload modal visibility
	const [showReloadModal, setShowReloadModal] = useState(false);

	// Ref to track the admin bar setting value before save
	const adminBarValueBeforeSave = useRef<boolean | undefined>(undefined);

	// Use Zustand store
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

	/** Toast hook for displaying notifications */
	const { toast } = useToast();

	useEffect(() => {
		// Fetch settings on mount (store handles caching)
		fetchSettings();
	}, [fetchSettings]);

	/**
	 * Handle save button click.
	 * Detects if admin bar setting changed and shows reload modal if needed.
	 */
	const handleSave = async () => {
		// Capture the original admin bar value before saving
		adminBarValueBeforeSave.current = originalSettings.show_admin_bar;

		try {
			await saveSettings();
			toast({
				title: __('Settings saved!', 'productbay'),
				description: __('Your settings have been saved successfully.', 'productbay'),
				type: 'success',
			});

			// Check if admin bar setting changed (requires page reload)
			const adminBarChanged = adminBarValueBeforeSave.current !== settings.show_admin_bar;
			if (adminBarChanged) {
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

	/**
	 * Handle page reload when user confirms in modal.
	 */
	const handleReload = () => {
		window.location.reload();
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

			{/* Reload Required Modal - shown when admin bar setting changes */}
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
