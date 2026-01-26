import React from 'react';
import { FolderOpen, Package } from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';

/**
 * SourceStatistics Component
 *
 * A reusable component to display product and category statistics
 * for different source types (all, sale, category, specific).
 *
 * Features:
 * - Gradient card design with icons
 * - Loading state support
 * - Conditional rendering (only shows when counts > 0)
 * - Responsive layout with divider
 */

interface SourceStatisticsProps {
	/** Number of categories */
	categoryCount: number;
	/** Number of products */
	productCount: number;
	/** Loading state indicator */
	loading?: boolean;
	/** Whether to show even if counts are zero */
	showEmpty?: boolean;
	/** Optional CSS class name for customization */
	className?: string;
}

export const SourceStatistics: React.FC< SourceStatisticsProps > = ( {
	categoryCount,
	productCount,
	loading = false,
	showEmpty = false,
	className = '',
} ) => {
	// Don't render if no data and not loading, unless showEmpty is true
	if (
		! loading &&
		! showEmpty &&
		categoryCount === 0 &&
		productCount === 0
	) {
		return null;
	}

	return (
		<div
			className={ `bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 ${ className }` }
		>
			{ loading ? (
				// Skeleton loader - exact same structure as data for consistent height
				<div className="flex items-center gap-4 text-sm">
					{ /* Category skeleton */ }
					<div className="flex items-center gap-2">
						<Skeleton className="h-4 w-4 rounded" />
						<Skeleton className="h-4 w-8 rounded" />
						<Skeleton className="h-4 w-20 rounded" />
					</div>

					{ /* Divider */ }
					<div className="h-4 w-px bg-blue-300"></div>

					{ /* Product skeleton */ }
					<div className="flex items-center gap-2">
						<Skeleton className="h-4 w-4 rounded" />
						<Skeleton className="h-4 w-12 rounded" />
						<Skeleton className="h-4 w-24 rounded" />
					</div>
				</div>
			) : (
				<div className="flex items-center gap-4 text-sm">
					{ /* Category Count */ }
					<div className="flex items-center gap-2 text-blue-700">
						<FolderOpen className="h-4 w-4" />
						<span className="font-semibold">{ categoryCount }</span>
						<span className="text-blue-600">
							{ categoryCount === 1 ? 'category' : 'categories' }
						</span>
					</div>

					{ /* Divider */ }
					<div className="h-4 w-px bg-blue-300"></div>

					{ /* Product Count */ }
					<div className="flex items-center gap-2 text-indigo-700">
						<Package className="h-4 w-4" />
						<span className="font-semibold">{ productCount }</span>
						<span className="text-indigo-600">
							{ productCount === 1 ? 'product' : 'products' }{ ' ' }
							included
						</span>
					</div>
				</div>
			) }
		</div>
	);
};
