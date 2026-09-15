<?php
/**
 * Shared asset cache-busting helper.
 *
 * @package ProductBay
 */

declare(strict_types=1);

namespace WpabProductBay\Utils;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Assets
 *
 * Resolves the version string used to cache-bust an enqueued script or
 * style, honoring PRODUCTBAY_DEV_MODE consistently across every enqueue
 * call site (frontend shortcode, blocks, and admin).
 *
 * @since 1.3.5
 * @package WpabProductBay\Utils
 */
class Assets {

	/**
	 * Resolve the cache-busting version string for an asset file.
	 *
	 * In development (PRODUCTBAY_DEV_MODE true) this always returns the
	 * current time, so an edited asset is never served stale from the
	 * browser cache. In production it returns the file's modification
	 * time, so the browser only re-downloads the asset when it actually
	 * changes; if the file can't be stat'd, PRODUCTBAY_VERSION is used as
	 * a safe fallback instead of silently breaking cache-busting.
	 *
	 * @param string $absolute_path Absolute filesystem path to the asset.
	 * @return string
	 * @since 1.3.5
	 */
	public static function version( string $absolute_path ): string {
		if ( \defined( 'PRODUCTBAY_DEV_MODE' ) && \PRODUCTBAY_DEV_MODE ) {
			return (string) time();
		}

		$mtime = \file_exists( $absolute_path ) ? \filemtime( $absolute_path ) : false;

		return false !== $mtime ? (string) $mtime : PRODUCTBAY_VERSION;
	}
}
