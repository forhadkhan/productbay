import App from './App';
import { PATHS } from './utils/routes';

import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';

domReady( () => {
	// Handle deep linking from WP Admin Menu
	if ( ! window.location.hash ) {
		const urlParams = new URLSearchParams( window.location.search );
		const page = urlParams.get( 'page' );

		switch ( page ) {
			case 'productbay-tables':
				window.location.hash = `#${ PATHS.TABLES }`;
				break;
			case 'productbay-new':
				window.location.hash = `#${ PATHS.NEW }`;
				break;
			case 'productbay-settings':
				window.location.hash = `#${ PATHS.SETTINGS }`;
				break;
			case 'productbay':
				window.location.hash = `#${ PATHS.DASHBOARD }`;
				break;
		}
	}

	const container = document.getElementById( 'productbay-root' );

	if ( container ) {
		const root = createRoot( container );
		root.render( <App /> );
	}
} );
