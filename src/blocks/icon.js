/**
 * ProductBay Block Icon
 *
 * The same SVG used in the WordPress admin menu (Constants::MENU_ICON),
 * adapted for Gutenberg by using `currentColor` so the block inserter
 * and toolbar can tint it correctly.
 *
 * The icon contains two sub-paths encoded in a single `d` attribute:
 *   1. The rounded-rectangle badge/background
 *   2. The inner table-grid symbol
 */
const ProductBayIcon = () => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 64 64"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
		focusable="false"
	>
		<path
			d="M48 0c8.837 0 16 7.163 16 16v32c0 8.837-7.163 16-16 16H16C7.163 64 0 56.837 0 48V16C0 7.163 7.163 0 16 0zM21.756 13.428a8.534 8.534 0 0 0-8.533 8.533v20.267a8.533 8.533 0 0 0 8.533 8.533h20.267a8.533 8.533 0 0 0 8.533-8.534V21.962a8.534 8.534 0 0 0-8.533-8.533zm3.203 17.6v15.466h-3.203a4.267 4.267 0 0 1-4.267-4.267v-11.2zm21.33 0v11.2a4.267 4.267 0 0 1-4.267 4.266H29.227V31.027zM24.96 17.693v9.067h-7.47v-4.8a4.267 4.267 0 0 1 4.267-4.267zm17.064 0a4.267 4.267 0 0 1 4.266 4.267v4.8H29.226v-9.067z"
			fill="currentColor"
		/>
	</svg>
);

export default ProductBayIcon;
