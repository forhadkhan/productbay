/**
 * cn Utility
 * 
 * A helper function for merging Tailwind CSS classes using clsx and tailwind-merge.
 * 
 * @since 1.0.0
 */
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
