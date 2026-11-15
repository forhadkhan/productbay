import { useEffect, useState } from 'react';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Format seconds as HH:MM:SS.
 *
 * @param seconds Seconds left.
 */
const formatClock = (seconds: number): string => {
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)}`;
};

/**
 * Black Friday sale line in the ProductBay footer, for sites without Pro.
 *
 * The server (Promo::footer_data) decides the phase and sends the seconds left, so the
 * campaign dates live in one place (the shared banner loader) and a wrong clock on the
 * visitor's computer cannot move the countdown. This component only draws the line.
 */
export const FooterPromo = () => {
	const promo = productBaySettings.promo;
	const phase = promo?.phase ?? '';
	const [left, setLeft] = useState<number>(promo?.left ?? 0);

	useEffect(() => {
		if ('last_day' !== phase || !promo) {
			return;
		}
		const end = Date.now() + promo.left * 1000;
		const timer = window.setInterval(() => {
			setLeft(Math.max(0, Math.round((end - Date.now()) / 1000)));
		}, 1000);
		return () => window.clearInterval(timer);
	}, [phase, promo]);

	if (!promo || '' === phase || !promo.url) {
		return null;
	}

	// The sale is over: hide the line the moment the countdown reaches zero.
	if ('last_day' === phase && left <= 0) {
		return null;
	}

	let text: string;
	if ('blackfriday' === phase) {
		text = __('Get ProductBay Pro with 70% OFF this Black Friday', 'productbay');
	} else if ('sale' === phase) {
		text = __('Get ProductBay Pro with 70% OFF', 'productbay');
	} else {
		text = sprintf(
			/* translators: %s: Countdown to the end of the sale, for example 05:32:10. */
			__('Last day: Get ProductBay Pro with 70%% OFF. Ends in %s', 'productbay'),
			formatClock(left)
		);
	}

	return (
		<p className="productbay-footer-promo text-center font-bold text-sm m-0 mt-4 px-4">
			<a
				href={promo.url}
				target="_blank"
				rel="noopener noreferrer"
				className="text-blue-600 hover:underline underline-offset-4 tabular-nums"
			>
				{text}
			</a>
		</p>
	);
};

export default FooterPromo;
