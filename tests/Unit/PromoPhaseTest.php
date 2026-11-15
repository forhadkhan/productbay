<?php
/**
 * PromoPhaseTest.
 *
 * @package ProductBay
 */

namespace WpabProductBay\Tests\Unit;

use PHPUnit\Framework\TestCase;
use WpabProductBay\Admin\Promo;

/**
 * Which footer sale line shows at each edge of the Black Friday 2026 campaign.
 *
 * Runs in a separate process: app/ files exit unless ABSPATH is defined, and this
 * suite never boots WordPress, so the constants are defined here, away from the other tests.
 *
 * @runTestsInSeparateProcesses
 * @preserveGlobalState disabled
 */
class PromoPhaseTest extends TestCase {

	/** Campaign start, the value of WPAB_BANNER_STARTS (12 Nov 2026 08:00:00 UTC). */
	const STARTS = 1794470400;

	/** Campaign end, the value of WPAB_BANNER_ENDS (20 Dec 2026 23:59:59 UTC). */
	const ENDS = 1797811199;

	/**
	 * Load the class with the few WordPress constants it needs.
	 */
	protected function setUp(): void {
		parent::setUp();

		if ( ! \defined( 'ABSPATH' ) ) {
			\define( 'ABSPATH', '/tmp/' );
		}
		if ( ! \defined( 'DAY_IN_SECONDS' ) ) {
			\define( 'DAY_IN_SECONDS', 86400 );
		}

		require_once \dirname( __DIR__, 2 ) . '/app/Core/Constants.php';
		require_once \dirname( __DIR__, 2 ) . '/app/Admin/Promo.php';
	}

	/**
	 * Times from FOOTER-PROMO.md section 6 and the phase expected at each.
	 *
	 * @return array<string, array{string, string}>
	 */
	public function phase_provider(): array {
		return array(
			'just before the start'      => array( '2026-11-12 07:59:59', '' ),
			'the start'                  => array( '2026-11-12 08:00:00', 'blackfriday' ),
			'last second of black friday' => array( '2026-11-27 23:59:59', 'blackfriday' ),
			'black friday over'          => array( '2026-11-28 00:00:00', 'sale' ),
			'last second before the last day' => array( '2026-12-19 23:59:58', 'sale' ),
			'last day begins'            => array( '2026-12-19 23:59:59', 'last_day' ),
			'one second before the end'  => array( '2026-12-20 23:59:58', 'last_day' ),
			'the end'                    => array( '2026-12-20 23:59:59', '' ),
		);
	}

	/**
	 * @dataProvider phase_provider
	 *
	 * @param string $utc      UTC time.
	 * @param string $expected Expected phase.
	 */
	public function test_phase_at_each_edge( string $utc, string $expected ) {
		$now = ( new \DateTimeImmutable( $utc, new \DateTimeZone( 'UTC' ) ) )->getTimestamp();

		$this->assertSame( $expected, Promo::phase_at( $now, self::STARTS, self::ENDS ) );
	}

	/**
	 * Without the banner loader (front end, or the loader missing) there is no line.
	 */
	public function test_no_phase_without_the_banner_constants() {
		$this->assertSame( '', Promo::promo_phase( self::STARTS + 10 ) );
	}
}
