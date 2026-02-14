import { useEffect } from 'react';
import { PATHS } from '../utils/routes';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to sync WordPress admin menu active state with React Router.
 *
 * Solves the UX issue where WordPress sidebar menu items don't highlight
 * correctly when navigating within a React SPA that uses client-side routing.
 *
 * How it works:
 * 1. Listens to React Router location changes
 * 2. Maps the current React route to the corresponding WP admin menu slug
 * 3. Updates the browser URL's ?page= query parameter (without reload)
 * 4. Manipulates the DOM to toggle WordPress's .current class on menu items
 */
export const useWpMenuSync = () => {
	const location = useLocation();

	useEffect(() => {
		const path = location.pathname;
		let slug = 'productbay'; // Default to "productbay" (Tables)

		// Determine correct WP Admin page slug based on React Route
		if (path === PATHS.DASHBOARD) {
			slug = 'productbay'; // Dashboard technically hidden/gone, map to main
		} else if (path === PATHS.SETTINGS) {
			slug = 'productbay-settings';
		} else if (path === PATHS.NEW) {
			slug = 'productbay-new';
		} else if (path === PATHS.TABLES || path.startsWith('/edit')) {
			// Map Tables to main 'productbay' slug as it is now the default
			slug = 'productbay';
		} else if (path === PATHS.HELP) {
			slug = 'productbay-help';
		}

		// 1. Update URL Query Parameter (?page=slug) without reload
		const currentUrl = new URL(window.location.href);
		const searchParams = currentUrl.searchParams;

		// Only update if changed to avoid redundant history entries
		if (searchParams.get('page') !== slug) {
			searchParams.set('page', slug);
			// Replace state to keep history clean (back button works within React Router hash history)
			const newUrl = `${currentUrl.pathname}?${searchParams.toString()}${window.location.hash}`;
			window.history.replaceState(null, '', newUrl);
		}

		// 2. Update WordPress Admin Menu DOM
		// Find the submenu link matching our target slug
		const allSubMenuLinks = document.querySelectorAll('ul.wp-submenu a');

		const menuLink = Array.from(allSubMenuLinks).find((link) => {
			const href = link.getAttribute('href');
			if (!href) return false;

			// Only match relative admin.php links OR absolute links starting with current origin
			// This filters out external links that may contain page= in encoded params
			const isRelativeAdminLink = href.startsWith('admin.php');
			const isAbsoluteAdminLink = href.startsWith(window.location.origin) && href.includes('admin.php');

			if (!isRelativeAdminLink && !isAbsoluteAdminLink) {
				return false;
			}

			try {
				// Parse the href to extract the 'page' parameter exactly
				const url = new URL(href, window.location.origin);
				return url.searchParams.get('page') === slug;
			} catch {
				// Fallback: if URL parsing fails, check for exact match with boundaries
				return href.includes(`page=${slug}&`) || href.endsWith(`page=${slug}`);
			}
		});

		if (menuLink) {
			// Find the parent submenu container
			const submenu = menuLink.closest('ul.wp-submenu');

			if (submenu) {
				// Remove 'current' class from all siblings
				submenu
					.querySelectorAll('li')
					.forEach((li) => li.classList.remove('current'));
				submenu
					.querySelectorAll('a')
					.forEach((a) => a.classList.remove('current'));

				// Add 'current' class to the active item
				const parentLi = menuLink.closest('li');
				if (parentLi) {
					parentLi.classList.add('current');
				}
				menuLink.classList.add('current');
			}
		}
	}, [location]);
};
