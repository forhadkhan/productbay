import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { apiFetch } from '../utils/api';

const Design = () => {
	const [ settings, setSettings ] = useState< any >( { design: {} } );
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
			alert( 'Design settings saved!' );
		} catch ( error ) {
			alert( 'Failed to save settings' );
		} finally {
			setSaving( false );
		}
	};

	const updateDesign = ( key: string, value: string ) => {
		setSettings( {
			...settings,
			design: {
				...settings.design,
				[ key ]: value,
			},
		} );
	};

	if ( loading )
		return (
			<div className="p-8 text-center">Loading design settings...</div>
		);

	const design = settings.design || {
		header_bg: '#f3f4f6',
		border_color: '#e5e7eb',
	};

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<h1 className="text-2xl font-bold text-gray-800">
				Global Design Defaults
			</h1>
			<p className="text-gray-500">
				These settings apply to all new tables. You can override them in
				individual table settings.
			</p>

			<div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
				<div className="p-6">
					<h3 className="text-lg font-medium text-gray-900 mb-6">
						Color Palette
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Header Background
							</label>
							<div className="flex items-center gap-3">
								<input
									type="color"
									value={ design.header_bg }
									onChange={ ( e ) =>
										updateDesign(
											'header_bg',
											e.target.value
										)
									}
									className="h-10 w-20 p-1 rounded border border-gray-300 cursor-pointer"
								/>
								<span className="text-gray-500 font-mono text-sm">
									{ design.header_bg }
								</span>
							</div>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Border Color
							</label>
							<div className="flex items-center gap-3">
								<input
									type="color"
									value={ design.border_color }
									onChange={ ( e ) =>
										updateDesign(
											'border_color',
											e.target.value
										)
									}
									className="h-10 w-20 p-1 rounded border border-gray-300 cursor-pointer"
								/>
								<span className="text-gray-500 font-mono text-sm">
									{ design.border_color }
								</span>
							</div>
						</div>
					</div>
				</div>

				<div className="p-6 bg-gray-50 rounded-b-lg flex justify-end">
					<button
						onClick={ handleSave }
						disabled={ saving }
						className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
					>
						<Save size={ 18 } />
						{ saving ? 'Saving...' : 'Save Global Design' }
					</button>
				</div>
			</div>
		</div>
	);
};

export default Design;
