import { Save } from 'lucide-react';
import { apiFetch } from '@/utils/api';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { Tabs, TabOption } from '@/components/ui/Tabs';

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
	const [settings, setSettings] = useState<any>({});
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [activeTab, setActiveTab] = useState<SettingsTabValue>('default');

	/** Toast hook for displaying notifications */
	const { toast } = useToast();

	useEffect(() => {
		loadSettings();
	}, []);

	const loadSettings = async () => {
		try {
			const data = await apiFetch('settings');
			setSettings(data);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleSave = async () => {
		setSaving(true);
		try {
			await apiFetch('settings', {
				method: 'POST',
				body: JSON.stringify({ settings }),
			});
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
		} finally {
			setSaving(false);
		}
	};

	if (loading)
		return <div className="p-8 text-center">Loading settings...</div>;

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-800 m-0">
					Settings
				</h1>
				<Button
					onClick={handleSave}
					disabled={saving}
					variant="default"
					size="sm"
					className="w-36"
				>
					<Save className="w-4 h-4 mr-2" />
					{saving ? 'Saving...' : 'Save Changes'}
				</Button>
			</div>

			<Tabs
				tabs={SETTINGS_TABS}
				value={activeTab}
				onChange={setActiveTab}
				aria-label="Settings tabs"
			>
				{/* Default Tab Content */}
				{activeTab === 'default' && (
					<div className="space-y-6">
						<div className="p-6">
							<h3 className="text-lg font-medium text-gray-900 mb-4">
								General Settings
							</h3>
							<div className="space-y-4">
								<p>Settings will be available soon.</p>
							</div>
						</div>
					</div>
				)}

				{/* Advanced Tab Content */}
				{activeTab === 'advanced' && (
					<div className="space-y-6">
						{/* Toast Testing Section */}
						<div className="p-6">
							<h3 className="text-lg font-medium text-gray-900 mb-4">
								Advanced Settings
							</h3>
							<div className="space-y-4">
								<p>Settings will be available soon.</p>
							</div>
						</div>
					</div>
				)}

				{/* Plugin Tab Content */}
				{activeTab === 'plugin' && (
					<div className="space-y-6">
						<div className="p-6">
							<h3 className="text-lg font-semibold text-red-600 mb-4">
								Uninstall Options
							</h3>
							<div className="flex items-center justify-between p-4 border border-red-100 bg-red-50 rounded-lg">
								<div>
									<span className="font-medium text-gray-800">
										Delete Data on Uninstall
									</span>
									<p className="text-sm text-gray-600 mt-1">
										Enable this to wipe all tables and settings when
										deleting the plugin.
									</p>
								</div>
								<input
									type="checkbox"
									checked={settings.delete_on_uninstall || false}
									onChange={(e) =>
										setSettings({
											...settings,
											delete_on_uninstall: e.target.checked,
										})
									}
									className="toggle"
								/>
							</div>
						</div>
					</div>
				)}
			</Tabs>
		</div>
	);
};
export default Settings;
