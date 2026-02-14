/**
 * Webpack Configuration
 *
 * Extends @wordpress/scripts default config with custom settings:
 * - Custom entry point for admin React app
 * - Custom output directory matching PHP enqueue paths
 * - Path alias for cleaner imports (@/ -> src/)
 *
 * POT extraction is handled by babel.config.js via @wordpress/babel-plugin-makepot
 */
const defaults = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

// Define where the files should go to match your PHP Enqueue
const OUTPUT_DIR = path.resolve(__dirname, 'assets/js');

module.exports = {
	...defaults,

	// 1. Entry Point
	entry: {
		admin: './src/index.tsx',
	},

	// 2. Output Configuration
	output: {
		...defaults.output,
		path: OUTPUT_DIR,
		filename: '[name].js',
		clean: false,
	},

	// 3. Path alias for cleaner imports
	resolve: {
		...defaults.resolve,
		alias: {
			...defaults.resolve.alias,
			'@': path.resolve(__dirname, 'src'),
		},
	},
};
