import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { apiFetch } from '../utils/api';

const Settings = () => {
	const [ settings, setSettings ] = useState< any >( {} );
	const [ loading, setLoading ] = useState( true );
	const [ saving, setSaving ] = useState( false );

	useEffect( () => {
		loadSettings();
	}, [] );

	const loadSettings = async () => {
		try {
			const data = await apiFetch( 'settings' );
			setSettings( data );
		} catch ( error ) {
			console.error( error );
		} finally {
			setLoading( false );
		}
	};

	const handleSave = async () => {
		setSaving( true );
		try {
			await apiFetch( 'settings', {
				method: 'POST',
				body: JSON.stringify( { settings } ),
			} );
			alert( 'Settings saved!' );
		} catch ( error ) {
			alert( 'Failed to save settings' );
		} finally {
			setSaving( false );
		}
	};

	if ( loading )
		return <div className="p-8 text-center">Loading settings...</div>;

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<h1 className="text-2xl font-bold text-gray-800">
				Plugin Settings
			</h1>

			<div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
				<div className="p-6">
					<h3 className="text-lg font-medium text-gray-900 mb-4">
						General Settings
					</h3>
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Add to Cart Button Text
							</label>
							<input
								type="text"
								value={ settings.add_to_cart_text || '' }
								onChange={ ( e ) =>
									setSettings( {
										...settings,
										add_to_cart_text: e.target.value,
									} )
								}
								className="w-full px-4 py-2 border border-gray-300 rounded-md"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Default Products Per Page
							</label>
							<input
								type="number"
								value={ settings.products_per_page || 10 }
								onChange={ ( e ) =>
									setSettings( {
										...settings,
										products_per_page: parseInt(
											e.target.value
										),
									} )
								}
								className="w-full px-4 py-2 border border-gray-300 rounded-md"
							/>
						</div>
					</div>
				</div>

				<div className="p-6">
					<h3 className="text-lg font-medium text-red-600 mb-4">
						Uninstall Options
					</h3>
					<div className="flex items-center justify-between">
						<div>
							<span className="font-medium text-gray-800">
								Delete Data on Uninstall
							</span>
							<p className="text-sm text-gray-500">
								Enable this to wipe all tables and settings when
								deleting the plugin.
							</p>
						</div>
						<input
							type="checkbox"
							checked={ settings.delete_on_uninstall || false }
							onChange={ ( e ) =>
								setSettings( {
									...settings,
									delete_on_uninstall: e.target.checked,
								} )
							}
							className="toggle"
						/>
					</div>
				</div>

				<div className="p-6 bg-gray-50 rounded-b-lg flex justify-end">
					<button
						onClick={ handleSave }
						disabled={ saving }
						className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
					>
						<Save size={ 18 } />
						{ saving ? 'Saving...' : 'Save Changes' }
					</button>
				</div>
			</div>
		</div>
	);
};
export default Settings;
