declare global {
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
	};
}

export {};
