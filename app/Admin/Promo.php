<?php
/**
 * Rules for the shared WPAnchorBay deal banner and the footer sale line.
 *
 * @package ProductBay
 */

declare(strict_types=1);

namespace WpabProductBay\Admin;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use WpabProductBay\Core\Constants;

/**
 * Class Promo
 *
 * The banner itself lives in includes/wpab-banner/ and is shared, byte for byte, by every WPAnchorBay plugin.
 * This class only holds ProductBay's own rules around it: hide it on Pro sites, keep it to the ProductBay screens
 * when ProductBay is the only WPAnchorBay plugin, and work out which footer sale line to show.
 *
 * The campaign dates are never copied here: they come from WPAB_BANNER_STARTS and WPAB_BANNER_ENDS, which the
 * banner loader defines (in wp-admin only).
 *
 * @package ProductBay\Admin
 * @since 1.3.6
 */
final class Promo {

	/**
	 * First second after Black Friday 2026 (27 Nov), 28 Nov 2026 00:00:00 UTC.
	 * From here the footer line stops saying "Black Friday".
	 */
	public const BLACK_FRIDAY_OVER = 1795824000;

	/**
	 * Hooks the banner filter.
	 *
	 * @return void
	 */
	public static function register(): void {
		\add_filter( 'wpab_banner_show', array( __CLASS__, 'banner_show' ), 10, 2 );
	}

	/**
	 * Whether ProductBay Pro is active. The Pro add-on defines this constant when it loads.
	 *
	 * @return bool
	 */
	public static function has_pro(): bool {
		return \defined( 'PRODUCTBAY_PRO_VERSION' );
	}

	/**
	 * Decides whether the shared WPAnchorBay deal banner may show.
	 *
	 * It never shows on a site that has ProductBay Pro. When ProductBay is the only WPAnchorBay plugin on the site,
	 * the banner is kept to the ProductBay screens (not the Plugins screen) and stays closed once a user has closed
	 * it. With other WPAnchorBay plugins active, their own rules apply.
	 *
	 * @param mixed $show  Whether the banner shows.
	 * @param mixed $slugs Brand keys of the active WPAnchorBay plugins.
	 * @return bool
	 */
	public static function banner_show( $show, $slugs = array() ): bool {
		if ( ! $show || self::has_pro() ) {
			return false;
		}

		if ( array( Constants::PLUGIN_SLUG ) !== array_values( (array) $slugs ) ) {
			return true;
		}

		if ( ! self::on_productbay_screen() ) {
			return false;
		}

		$closed = \defined( 'WPAB_BANNER_META' ) ? \get_user_meta( \get_current_user_id(), WPAB_BANNER_META, true ) : array();

		return ! ( is_array( $closed ) && \defined( 'WPAB_BANNER_CAMPAIGN' ) && isset( $closed[ WPAB_BANNER_CAMPAIGN ] ) );
	}

	/**
	 * Whether the current admin screen is one of ProductBay's own pages.
	 * Same rule the admin app uses to decide where it loads.
	 *
	 * @return bool
	 */
	public static function on_productbay_screen(): bool {
		$screen = \function_exists( 'get_current_screen' ) ? \get_current_screen() : null;

		if ( ! $screen ) {
			return false;
		}

		return 'toplevel_page_' . Constants::MENU_SLUG === $screen->id || false !== strpos( $screen->id, 'page_productbay' );
	}

	/**
	 * Which footer sale line to show at a given time, for a campaign window.
	 *
	 * @param int $now    Unix time.
	 * @param int $starts Campaign start, Unix time.
	 * @param int $ends   Campaign end, Unix time (the line is gone from this second).
	 * @return string 'blackfriday', 'sale', 'last_day', or '' for nothing.
	 */
	public static function phase_at( int $now, int $starts, int $ends ): string {
		if ( $now < $starts || $now >= $ends ) {
			return '';
		}

		if ( $now >= $ends - DAY_IN_SECONDS ) {
			return 'last_day';
		}

		return $now < self::BLACK_FRIDAY_OVER ? 'blackfriday' : 'sale';
	}

	/**
	 * Which footer sale line to show at a given time, using the banner's campaign dates.
	 *
	 * @param int $now Unix time.
	 * @return string 'blackfriday', 'sale', 'last_day', or '' for nothing.
	 */
	public static function promo_phase( int $now ): string {
		if ( ! \defined( 'WPAB_BANNER_STARTS' ) || ! \defined( 'WPAB_BANNER_ENDS' ) ) {
			return '';
		}

		return self::phase_at( $now, (int) WPAB_BANNER_STARTS, (int) WPAB_BANNER_ENDS );
	}

	/**
	 * Data for the footer sale line in the admin app. The server decides the phase; the app only draws it.
	 *
	 * The countdown is sent as seconds left on the server, so a wrong clock on the visitor's computer does not
	 * move it. An empty phase means print nothing (Pro is active, or the sale is not running).
	 *
	 * @return array{phase: string, url: string, left: int}
	 */
	public static function footer_data(): array {
		$now   = time();
		$phase = self::has_pro() ? '' : self::promo_phase( $now );

		if ( '' === $phase ) {
			return array(
				'phase' => '',
				'url'   => '',
				'left'  => 0,
			);
		}

		return array(
			'phase' => $phase,
			'url'   => \add_query_arg(
				array(
					'utm_source'   => Constants::PLUGIN_SLUG . '-plugin-admin',
					'utm_medium'   => 'blackfriday-footer',
					'utm_campaign' => 'blackfriday26',
					'utm_content'  => 'pro',
				),
				'https://wpanchorbay.com/deals/'
			),
			'left'  => max( 0, (int) WPAB_BANNER_ENDS - $now ),
		);
	}
}
