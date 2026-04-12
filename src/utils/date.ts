/**
 * Date Utilities
 *
 * Lightweight formatting and manipulation helpers.
 *
 * @since 1.2.1
 */

import { __ } from '@wordpress/i18n';

const MONTH_NAMES = [
	__('January', 'productbay'),
	__('February', 'productbay'),
	__('March', 'productbay'),
	__('April', 'productbay'),
	__('May', 'productbay'),
	__('June', 'productbay'),
	__('July', 'productbay'),
	__('August', 'productbay'),
	__('September', 'productbay'),
	__('October', 'productbay'),
	__('November', 'productbay'),
	__('December', 'productbay'),
];

const DAY_NAMES = [
	__('Sunday', 'productbay'),
	__('Monday', 'productbay'),
	__('Tuesday', 'productbay'),
	__('Wednesday', 'productbay'),
	__('Thursday', 'productbay'),
	__('Friday', 'productbay'),
	__('Saturday', 'productbay'),
];

/**
 * Formats a Date object or string into a specified format.
 *
 * Supported tokens:
 * - yyyy: 2024
 * - yy: 24
 * - MMMM: January
 * - MMM: Jan
 * - MM: 01
 * - M: 1
 * - dd: 01
 * - d: 1
 * - HH: 13
 * - hh: 01
 * - mm: 30
 * - ss: 15
 * - a: AM/PM
 */
export const formatDate = (date: Date | string | null | undefined, formatStr: string): string => {
	if (!date) return '';

	const d = typeof date === 'string' ? new Date(date.includes('T') ? date : date.replace(/-/g, '/')) : date;

	if (isNaN(d.getTime())) return String(date);

	const year = d.getFullYear();
	const month = d.getMonth();
	const day = d.getDate();
	const hours = d.getHours();
	const minutes = d.getMinutes();
	const seconds = d.getSeconds();

	const map: Record<string, string | number> = {
		yyyy: year,
		yy: String(year).slice(-2),
		MMMM: MONTH_NAMES[month],
		MMM: MONTH_NAMES[month].slice(0, 3),
		MM: String(month + 1).padStart(2, '0'),
		M: month + 1,
		dd: String(day).padStart(2, '0'),
		d: day,
		HH: String(hours).padStart(2, '0'),
		hh: String(hours % 12 || 12).padStart(2, '0'),
		mm: String(minutes).padStart(2, '0'),
		ss: String(seconds).padStart(2, '0'),
		a: hours >= 12 ? 'PM' : 'AM',
	};

	return formatStr.replace(/(yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|hh|mm|ss|a)/g, (match) => String(map[match]));
};

/**
 * Returns a YYYY-MM-DD string for today.
 */
export const todayStr = (): string => {
	const now = new Date();
	const y = now.getFullYear();
	const m = String(now.getMonth() + 1).padStart(2, '0');
	const d = String(now.getDate()).padStart(2, '0');
	return `${y}-${m}-${d}`;
};

/**
 * Splits a string into components safely.
 */
export const parseDateString = (str: string) => {
	const [datePart, timePart] = str.split(' ');
	const [y, m, d] = (datePart || '').split('-').map(Number);
	const [hh, mm] = (timePart || '00:00').split(':').map(Number);
	return { year: y, month: (m || 1) - 1, day: d || 1, hours: hh || 0, minutes: mm || 0 };
};
