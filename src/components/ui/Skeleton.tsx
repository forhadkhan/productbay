import { cn } from '../../utils/cn';

/**
 * Skeleton component used for showing loading states.
 * Renders a pulsing placeholder box.
 */

const Skeleton = ({ className, ...props }: React.ComponentProps<'div'>) => {
	return (
		<div
			data-slot="skeleton"
			className={cn(
				'bg-gray-200 rounded-md animate-pulse',
				className
			)}
			{...props}
		/>
	);
};

export { Skeleton };
