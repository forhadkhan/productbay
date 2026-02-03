const fs = require('fs-extra');
const archiver = require('archiver');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PLUGIN_SLUG = 'productbay';
// Go up one level from 'scripts' to root
const ROOT_DIR = path.join(__dirname, '..');
const BUILD_DIR = path.join(ROOT_DIR, 'dist');
const PLUGIN_DIR = path.join(BUILD_DIR, PLUGIN_SLUG);

// Read version from package.json
const packageJson = require(path.join(ROOT_DIR, 'package.json'));

// Default: slug-only for WordPress.org compatibility
// Use --versioned flag for GitHub releases or archival purposes
const includeVersion = process.argv.includes('--versioned');
const ZIP_NAME = includeVersion
	? `${PLUGIN_SLUG}-${packageJson.version}.zip`
	: `${PLUGIN_SLUG}.zip`;

// Files/Folders to COPY to the release
const INCLUDES = [
	'app',
	'assets',
	'languages',
	// 'vendor',    // We generate this inside PLUGIN_DIR
	'productbay.php',
	'uninstall.php',
	'readme.txt',
	'index.php',
	'LICENSE',
	'composer.json',
	'composer.lock',
];

(async () => {
	try {
		console.log('🚀 Starting Release Build with Bun...');

		// 1. Clean previous builds
		console.log('🧹 Cleaning old build...');
		await fs.remove(BUILD_DIR);
		await fs.remove(path.join(ROOT_DIR, ZIP_NAME));
		await fs.ensureDir(PLUGIN_DIR);

		// 2. Run Production Build (React + Tailwind)
		console.log('🛠  Building assets...');
		// Using 'bun run build' ensures it uses your Bun environment
		execSync('bun run build', { stdio: 'inherit', cwd: ROOT_DIR });

		// 3. Copy Files FIRST
		console.log('xcopy  Copying plugin files...');
		for (const item of INCLUDES) {
			const src = path.join(ROOT_DIR, item);
			const dest = path.join(PLUGIN_DIR, item);
			if (await fs.pathExists(src)) {
				await fs.copy(src, dest);
			}
		}

		// 4. Install Production Composer Dependencies (In the Staging Folder)
		console.log('📦 Installing Production Composer Dependencies...');
		execSync('composer install --no-dev --optimize-autoloader', {
			stdio: 'inherit',
			cwd: PLUGIN_DIR, // Run INSIDE the build folder
		});

		// 5. Create Zip
		console.log('🤐 Zipping...');
		const output = fs.createWriteStream(path.join(ROOT_DIR, ZIP_NAME));
		const archive = archiver('zip', { zlib: { level: 9 } });

		output.on('close', () => {
			console.log(
				`✅ Success! Created ${ZIP_NAME} (${archive.pointer()} bytes)`
			);
			// No cleanup needed!
		});

		archive.on('error', (err) => {
			throw err;
		});

		archive.pipe(output);
		// This puts the 'productbay' folder inside the zip (Standard WP requirement)
		archive.directory(BUILD_DIR, false);
		await archive.finalize();
	} catch (err) {
		console.error('❌ Error during build:', err);
		process.exit(1);
	}
})();
