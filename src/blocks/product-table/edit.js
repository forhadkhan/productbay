import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, Placeholder, Spinner, Notice } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import ProductBayIcon from '../icon';

/**
 * Edit component for the Product Table block.
 *
 * Fetches available tables from the REST API and allows the user to select
 * one via the Inspector Controls panel. A live ServerSideRender preview
 * is shown once a table is selected.
 *
 * @param {Object} props Block props including attributes and setAttributes.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { tableId } = attributes;
	const blockProps = useBlockProps();

	const [ tables, setTables ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( true );
	const [ fetchError, setFetchError ] = useState( null );

	useEffect( () => {
		apiFetch( { path: '/productbay/v1/tables' } )
			.then( ( data ) => {
				setTables( data );
				setIsLoading( false );
			} )
			.catch( () => {
				setFetchError( __( 'Failed to load tables. Please check your permissions.', 'productbay' ) );
				setIsLoading( false );
			} );
	}, [] );

	const tableOptions = [
		{ label: __( '— Select a table —', 'productbay' ), value: 0 },
		...tables.map( ( t ) => ( { label: t.title, value: t.id } ) ),
	];

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Table Settings', 'productbay' ) }>
					{ tableId > 0 && (
						<div style={ { marginBottom: '16px' } }>
							<Notice status="info" isDismissible={ false }>
								{ __( 'Editor Preview: Interactive features (Search, Filter, Add to Cart) are disabled in the editor, but will work perfectly on the frontend.', 'productbay' ) }
							</Notice>
						</div>
					) }
					{ isLoading && <Spinner /> }
					{ fetchError && <p style={ { color: 'red' } }>{ fetchError }</p> }
					{ ! isLoading && ! fetchError && (
						<SelectControl
							label={ __( 'Select Product Table', 'productbay' ) }
							value={ tableId }
							options={ tableOptions }
							onChange={ ( value ) =>
								setAttributes( { tableId: Number( value ) } )
							}
						/>
					) }
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ ! tableId ? (
					<Placeholder
						icon={ <ProductBayIcon /> }
						label={ __( 'Product Table', 'productbay' ) }
						instructions={ isLoading ? __( 'Loading tables...', 'productbay' ) : __( 'Select a product table to get started.', 'productbay' ) }
					>
						{ isLoading ? (
							<Spinner />
						) : (
							<div style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '300px', flexDirection: 'column' }}>
								<SelectControl
									label={ __( 'Choose a table', 'productbay' ) }
									labelPosition="side"
									hideLabelFromVision
									value={ tableId }
									options={ tableOptions }
									onChange={ ( value ) =>
										setAttributes( { tableId: Number( value ) } )
									}
								/>
							</div>
						) }
					</Placeholder>
				) : (
					<ServerSideRender
						block="productbay/product-table"
						attributes={ attributes }
					/>
				) }
			</div>
		</>
	);
}
