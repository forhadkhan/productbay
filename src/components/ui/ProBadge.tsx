/**
 * ProBadge Component
 *
 * Reusable "PRO" pill badge indicating a feature requires ProductBay Pro.
 * Two sizes available: 'default' for inline tags, 'sm' for tight spaces.
 *
 * @since 1.2.0
 */
import { cn } from '@/utils/cn';

interface ProBadgeProps {
	size?: 'default' | 'sm';
	className?: string;
}

export const ProBadge = ({ size = 'default', className }: ProBadgeProps) => (
	<span
		className={cn(
			'inline-flex items-center font-bold rounded tracking-wide shrink-0 select-none',
			size === 'sm'
				? 'text-[9px] px-1.5 py-0.5 bg-blue-100 text-blue-700'
				: 'text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700',
			className
		)}
	>
		PRO
	</span>
);

export default ProBadge;
