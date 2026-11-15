declare global {
	/** Footer sale line data from PHP (Promo::footer_data). */
	interface ProductBayPromo {
		phase: '' | 'blackfriday' | 'sale' | 'last_day';
		url: string;
		/** Seconds left until the sale ends, measured on the server. */
		left: number;
	}

	interface Window {
		productBaySettings: {
			apiUrl: string;
			nonce: string;
			pluginUrl: string;
			version: string;
			isFirstTime?: boolean;
			/** Injected by productbay-pro when active. */
			proActive?: boolean;
			/** Injected by productbay-pro — semver string. */
			proVersion?: string;
			/** Footer sale line; the server decides the phase. Empty phase means show nothing. */
			promo?: ProductBayPromo;
		};
	}

	const productBaySettings: {
		apiUrl: string;
		nonce: string;
		pluginUrl: string;
		version: string;
		isFirstTime?: boolean;
		/** Injected by productbay-pro when active. */
		proActive?: boolean;
		/** Injected by productbay-pro — semver string. */
		proVersion?: string;
		/** Footer sale line; the server decides the phase. Empty phase means show nothing. */
		promo?: ProductBayPromo;
	};
}

export {};
