import { useEffect } from 'react';
import { PATHS } from '../utils/routes';
import { useLocation } from 'react-router-dom';

export const useWpMenuSync = () => {
	const location = useLocation();

	useEffect( () => {
		const path = location.pathname;
		let slug = 'productbay'; // Default to Dashboard

		// Determine correct WP Admin page slug based on React Route
		if ( path === PATHS.DASHBOARD ) {
			slug = 'productbay';
		} else if ( path === PATHS.SETTINGS ) {
			slug = 'productbay-settings';
		} else if ( path === PATHS.NEW ) {
			slug = 'productbay-new';
		} else if ( path === PATHS.TABLES || path.startsWith( '/edit' ) ) {
			// Map Tables and Edit pages to 'productbay-tables'
			slug = 'productbay-tables';
		} else if ( path === PATHS.HELP ) {
			// Even though we removed it from menu, if it exists in routes
			slug = 'productbay-help';
		}

		// 1. Update URL Query Parameter (?page=slug) without reload
		const currentUrl = new URL( window.location.href );
		const searchParams = currentUrl.searchParams;

		// Only update if changed to avoid redundant history entries
		if ( searchParams.get( 'page' ) !== slug ) {
			searchParams.set( 'page', slug );
			// Replace state to keep history clean (back button works within React Router hash history)
			const newUrl = `${
				currentUrl.pathname
			}?${ searchParams.toString() }${ window.location.hash }`;
			window.history.replaceState( null, '', newUrl );
		}

		// 2. Update WordPress Admin Menu DOM
		// We look for the link in the ProductBay submenu
		const menuLink = document.querySelector(
			`ul.wp-submenu a[href*="page=${ slug }"]`
		);

		if ( menuLink ) {
			// Find the parent submenu container
			const submenu = menuLink.closest( 'ul.wp-submenu' );

			if ( submenu ) {
				// Remove 'current' class from all siblings
				submenu
					.querySelectorAll( 'li' )
					.forEach( ( li ) => li.classList.remove( 'current' ) );
				submenu
					.querySelectorAll( 'a' )
					.forEach( ( a ) => a.classList.remove( 'current' ) );

				// Add 'current' class to the active item
				const parentLi = menuLink.closest( 'li' );
				if ( parentLi ) {
					parentLi.classList.add( 'current' );
				}
				menuLink.classList.add( 'current' );
			}
		}
	}, [ location ] );
};
