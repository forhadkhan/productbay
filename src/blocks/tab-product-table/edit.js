import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	Button,
	TextControl,
	Placeholder,
	Spinner,
	Notice,
} from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import ProductBayIcon from '../icon';

/**
 * Edit component for the Tab – Product Table block.
 *
 * Allows users to select multiple product tables and assign each a custom
 * tab label. Renders a ServerSideRender preview of the full tabbed layout.
 *
 * @param {Object} props Block props including attributes and setAttributes.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { tableIds, tabLabels, activeTab } = attributes;
	const blockProps = useBlockProps();

	const [ tables, setTables ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( true );
	const [ fetchError, setFetchError ] = useState( null );
	const [ selectedToAdd, setSelectedToAdd ] = useState( 0 );

	useEffect( () => {
		apiFetch( { path: '/productbay/v1/tables' } )
			.then( ( data ) => {
				setTables( data );
				if ( data.length > 0 && ! selectedToAdd ) {
					setSelectedToAdd( data[ 0 ].id );
				}
				setIsLoading( false );
			} )
			.catch( () => {
				setFetchError(
					__( 'Failed to load tables. Please check your permissions.', 'productbay' )
				);
				setIsLoading( false );
			} );
	}, [] );

	const addTable = () => {
		if ( ! selectedToAdd ) return;
		const id = Number( selectedToAdd );
		if ( tableIds.includes( id ) ) return; // No duplicates.

		const table = tables.find( ( t ) => t.id === id );
		const newLabel = table ? table.title : `Tab ${ tableIds.length + 1 }`;

		setAttributes( {
			tableIds: [ ...tableIds, id ],
			tabLabels: [ ...tabLabels, newLabel ],
		} );
	};

	const removeTable = ( index ) => {
		const newIds = tableIds.filter( ( _, i ) => i !== index );
		const newLabels = tabLabels.filter( ( _, i ) => i !== index );
		
		// Adjust active tab if a preceding or current tab is removed.
		let newActive = activeTab;
		if ( activeTab >= index && activeTab > 0 ) {
			newActive = activeTab - 1;
		}
		
		setAttributes( { 
			tableIds: newIds, 
			tabLabels: newLabels,
			activeTab: newActive
		} );
	};

	const updateLabel = ( index, value ) => {
		const newLabels = [ ...tabLabels ];
		newLabels[ index ] = value;
		setAttributes( { tabLabels: newLabels } );
	};

	const updateTable = ( index, value ) => {
		const newIds = [ ...tableIds ];
		newIds[ index ] = Number( value );
		setAttributes( { tableIds: newIds } );
	};

	/**
	 * Intercept clicks on the SSR preview to detect tab button clicks.
	 * This allows the user to switch tabs directly in the editor.
	 */
	const onPreviewClick = ( event ) => {
		const tabButton = event.target.closest( '.productbay-tab-button' );
		if ( tabButton ) {
			event.preventDefault();
			event.stopPropagation();
			const buttons = Array.from(
				event.currentTarget.querySelectorAll( '.productbay-tab-button' )
			);
			const index = buttons.indexOf( tabButton );
			if ( index !== -1 && index !== activeTab ) {
				setAttributes( { activeTab: index } );
			}
		}
	};

	// Options for adding a new tab (excl. duplicates).
	const availableToAdd = [
		{ label: __( '— Choose a table —', 'productbay' ), value: 0 },
		...tables
			.filter( ( t ) => ! tableIds.includes( t.id ) )
			.map( ( t ) => ( { label: t.title, value: t.id } ) ),
	];

	// Options for swapping an existing tab (all tables).
	const allTableOptions = tables.map( ( t ) => ( {
		label: t.title,
		value: t.id,
	} ) );

	// Options for the active tab selector.
	const activeTabOptions = tableIds.map( ( _, index ) => ( {
		label: tabLabels[ index ] || `Tab ${ index + 1 }`,
		value: index,
	} ) );

	const hasPreview = tableIds.length > 0;

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Tab Settings', 'productbay' ) }>
					{ isLoading && <Spinner /> }

					{ fetchError && (
						<Notice status="error" isDismissible={ false }>
							{ fetchError }
						</Notice>
					) }

					{ ! isLoading && ! fetchError && (
						<>
							{ /* Current Tabs */ }
							{ tableIds.length > 0 && (
								<div style={ { marginBottom: '24px' } }>
									<p style={ { fontWeight: 600, marginBottom: '12px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' } }>
										{ __( 'Current Tabs', 'productbay' ) }
									</p>
									{ tableIds.map( ( id, index ) => (
										<div
											key={ `tab-${ index }` }
											style={ {
												padding: '12px',
												background: index === activeTab ? '#f0f4ff' : '#f8f9fa',
												border: index === activeTab ? '1px solid #4f46e5' : '1px solid #e1e4e7',
												borderRadius: '4px',
												marginBottom: '12px',
												position: 'relative'
											} }
										>
											<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
												<span style={{ fontSize: '11px', fontWeight: 700, color: index === activeTab ? '#4f46e5' : '#757575', textTransform: 'uppercase' }}>
													{ index === activeTab ? __( 'Active Tab', 'productbay' ) : __( 'Tab', 'productbay' ) } { index + 1 }
												</span>
												<Button
													isDestructive
													variant="link"
													onClick={ () => removeTable( index ) }
													style={{ height: 'auto', padding: 0, fontSize: '11px', minHeight: 'auto' }}
												>
													{ __( 'Remove', 'productbay' ) }
												</Button>
											</div>

											<TextControl
												label={ __( 'Tab Label', 'productbay' ) }
												value={ tabLabels[ index ] || '' }
												onChange={ ( val ) => updateLabel( index, val ) }
												style={{ marginBottom: '8px' }}
											/>

											<SelectControl
												label={ __( 'Product Table', 'productbay' ) }
												value={ id }
												options={ allTableOptions }
												onChange={ ( val ) => updateTable( index, val ) }
												style={{ marginBottom: 0 }}
											/>
										</div>
									) ) }
								</div>
							) }

							{ /* Add Tab */ }
							<div style={{ borderTop: '1px solid #eee', paddingTop: '16px' }}>
								<p style={ { fontWeight: 600, marginBottom: '12px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' } }>
									{ __( 'Add New Tab', 'productbay' ) }
								</p>
								<SelectControl
									value={ selectedToAdd }
									options={ availableToAdd }
									onChange={ ( val ) => setSelectedToAdd( Number( val ) ) }
								/>
								<Button
									variant="secondary"
									onClick={ addTable }
									disabled={ ! selectedToAdd || availableToAdd.length <= 1 }
									style={ { width: '100%', justifyContent: 'center' } }
								>
									{ __( '+ Add Tab', 'productbay' ) }
								</Button>
							</div>
						</>
					) }
				</PanelBody>
				
				{ hasPreview && (
					<PanelBody title={ __( 'Advanced Tab Settings', 'productbay' ) } initialOpen={ false }>
						<SelectControl
							label={ __( 'Default Active Tab', 'productbay' ) }
							help={ __( 'Determines which tab is selected by default when the page loads.', 'productbay' ) }
							value={ activeTab }
							options={ activeTabOptions }
							onChange={ ( val ) => setAttributes( { activeTab: Number( val ) } ) }
						/>
					</PanelBody>
				) }
			</InspectorControls>

			<div { ...blockProps } onClick={ onPreviewClick }>
				{ ! hasPreview ? (
					<Placeholder
						icon={ <ProductBayIcon /> }
						label={ __( 'Product Table (Tab)', 'productbay' ) }
						instructions={ isLoading ? __( 'Loading tables...', 'productbay' ) : __( 'Add your first product table to get started.', 'productbay' ) }
					>
						{ isLoading ? (
							<Spinner />
						) : (
							<div style={{ 
								display: 'flex', 
								gap: '12px', 
								width: '100%', 
								maxWidth: '460px', 
								background: '#fff', 
								padding: '24px', 
								borderRadius: '12px', 
								border: '1px solid #e1e4e8', 
								boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
								alignItems: 'center'
							}}>
								<div style={{ flex: 1 }}>
									<SelectControl
										label={ __( 'Choose a table', 'productbay' ) }
										labelPosition="side"
										hideLabelFromVision
										value={ selectedToAdd }
										options={ availableToAdd }
										onChange={ ( val ) => setSelectedToAdd( Number( val ) ) }
										__nextHasNoMarginBottom
									/>
								</div>
								<Button
									variant="primary"
									onClick={ addTable }
									disabled={ ! selectedToAdd || availableToAdd.length <= 1 }
									style={{ height: '30px', flexShrink: 0 }} // Matches standard Gutenberg SelectControl height when NoMarginBottom is on.
								>
									{ __( 'Add Tab', 'productbay' ) }
								</Button>
							</div>
						) }
					</Placeholder>
				) : (
					<ServerSideRender
						block="productbay/tab-product-table"
						attributes={ attributes }
					/>
				) }
			</div>
		</>
	);
}
