/**
 * ColumnEditor Component
 *
 * Manages the table column configuration including adding, removing,
 * renaming, and reordering columns via drag-and-drop.
 *
 * @since 1.0.0
 */
import React from 'react';
import { cn } from '@/utils/cn';
import { __, _n } from '@wordpress/i18n';
import { generateColumnId } from '@/types';
import { Button } from '@/components/ui/Button';
import type { Column, ColumnType } from '@/types';
import { ProBadge } from '@/components/ui/ProBadge';
import { ProFeatureGate } from '@/components/ui/ProFeatureGate';
import ColumnItem from '@/components/Table/sections/ColumnItem';
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from '@dnd-kit/core';
import {
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
	ImageIcon,
	TypeIcon,
	DollarSignIcon,
	ShoppingCartIcon,
	HashIcon,
	FileTextIcon,
	CheckIcon,
	AlertTriangleIcon,
	InfoIcon,
	ChevronDownIcon,
	PackageIcon,
	CalendarIcon,
	TagIcon,
	DatabaseIcon,
	LayoutGridIcon,
	StarIcon,
	Settings2Icon,
} from 'lucide-react';

/* =============================================================================
 * ColumnEditor Component
 * =============================================================================
 * Drag-and-drop column configuration for product tables.
 *
 * Features:
 * - Sortable column list with drag handles
 * - Toggle columns on/off (no duplicates allowed)
 * - Remove columns
 * - Expandable column settings
 * ============================================================================= */

/**
 * Available column types with their metadata
 */
const COLUMN_TYPES: {
	type: ColumnType;
	label: string;
	icon: React.ElementType;
	isPro?: boolean;
}[] = [
		{ type: 'image', label: __('Image', 'productbay'), icon: ImageIcon },
		{ type: 'name', label: __('Product Name', 'productbay'), icon: TypeIcon },
		{ type: 'price', label: __('Price', 'productbay'), icon: DollarSignIcon },
		{
			type: 'button',
			label: __('Add to Cart', 'productbay'),
			icon: ShoppingCartIcon,
		},
		{ type: 'sku', label: __('SKU', 'productbay'), icon: HashIcon },
		{
			type: 'summary',
			label: __('Description', 'productbay'),
			icon: FileTextIcon,
		},
		{ type: 'stock', label: __('Stock', 'productbay'), icon: PackageIcon },
		{ type: 'date', label: __('Date', 'productbay'), icon: CalendarIcon },
		{ type: 'tax', label: __('Taxonomy', 'productbay'), icon: TagIcon },
		{ type: 'rating', label: __('Rating', 'productbay'), icon: StarIcon },
		{
			type: 'cf',
			label: __('Custom Field', 'productbay'),
			icon: DatabaseIcon,
			isPro: true,
		},
		{
			type: 'combined',
			label: __('Combined', 'productbay'),
			icon: LayoutGridIcon,
			isPro: true,
		},
	];

export interface ColumnEditorProps {
	className?: string;
	columns: Column[];
	onAddColumn: (column: Column) => void;
	onReorderColumns: (oldIndex: number, newIndex: number) => void;
	onRemoveColumn: (columnId: string) => void;
	onUpdateColumn: (columnId: string, updates: Partial<Column>) => void;
}

/**
 * ColumnEditor Component
 *
 * Renders the sortable column list with add/remove functionality.
 */
const ColumnEditor: React.FC<ColumnEditorProps> = ({
	className,
	columns,
	onAddColumn,
	onReorderColumns,
	onRemoveColumn,
	onUpdateColumn,
}) => {
	const [showAddMenu, setShowAddMenu] = React.useState(false);

	/**
	 * Get set of currently selected column types for quick lookup
	 */
	const selectedTypes = React.useMemo(() => new Set(columns.map((col) => col.type)), [columns]);

	/**
	 * Calculate width validation warnings
	 * Returns an array of warning objects with type and message
	 */
	const widthWarnings = React.useMemo(() => {
		const warnings: { type: 'warning' | 'info'; message: string }[] = [];

		if (columns.length === 0) return warnings;

		// Calculate total percentage width
		const percentageColumns = columns.filter((col) => col.advanced.width.unit === '%');
		const totalPercentage = percentageColumns.reduce(
			(sum, col) => sum + col.advanced.width.value,
			0
		);

		// Check for total percentage exceeding 100%
		if (totalPercentage > 100) {
			warnings.push({
				type: 'warning',
				message: __(
					`Column widths total ${totalPercentage}%. Table may require horizontal scrolling.`,
					'productbay'
				),
			});
		}

		// Check for single column taking 100%
		const fullWidthColumn = columns.find(
			(col) => col.advanced.width.unit === '%' && col.advanced.width.value >= 100
		);
		if (fullWidthColumn && columns.length > 1) {
			warnings.push({
				type: 'warning',
				message: __(
					`"${fullWidthColumn.heading}" takes 100% width. Other columns will be compressed.`,
					'productbay'
				),
			});
		}

		// Check for all fixed px columns (no responsive sizing)
		const allFixedPx = columns.every((col) => col.advanced.width.unit === 'px');
		if (allFixedPx && columns.length > 1) {
			warnings.push({
				type: 'info',
				message: __(
					'All columns use fixed pixel widths. Table may not adapt well to different screen sizes.',
					'productbay'
				),
			});
		}

		return warnings;
	}, [columns]);

	/**
	 * DnD sensors for mouse and keyboard interaction
	 */
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8, // Require 8px movement before drag starts
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	/**
	 * Handle drag end - reorder columns
	 */
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = columns.findIndex((col) => col.id === active.id);
			const newIndex = columns.findIndex((col) => col.id === over.id);
			onReorderColumns(oldIndex, newIndex);
		}
	};

	/**
	 * Toggle a column type - add if not present, remove if already added
	 */
	const handleToggleColumn = (type: ColumnType) => {
		const existingColumn = columns.find((col) => col.type === type);

		if (existingColumn) {
			// Column exists - remove it
			onRemoveColumn(existingColumn.id);
		} else {
			// Column doesn't exist - add it
			const typeConfig = COLUMN_TYPES.find((t) => t.type === type);
			if (!typeConfig) return;

			const newColumn: Column = {
				id: generateColumnId(),
				type,
				heading: typeConfig.label,
				advanced: {
					showHeading: true,
					width: { value: 0, unit: 'auto' },
					visibility: 'all',
					order: columns.length + 1,
				},
				settings: {},
			};

			onAddColumn(newColumn);
		}
	};

	return (
		<div className={cn('space-y-4', className)}>
			{/* Width Validation Warnings */}
			{widthWarnings.length > 0 && (
				<div className="space-y-2">
					{widthWarnings.map((warning, index) => (
						<div
							key={index}
							className={cn(
								'flex items-start gap-2 px-3 py-2 text-sm rounded-lg',
								warning.type === 'warning'
									? 'bg-amber-50 text-amber-800 border border-amber-200'
									: 'bg-blue-50 text-blue-800 border border-blue-200'
							)}
						>
							{warning.type === 'warning' ? (
								<AlertTriangleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
							) : (
								<InfoIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
							)}
							<span>{warning.message}</span>
						</div>
					))}
				</div>
			)}

			{/* Column List */}
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={columns.map((col) => col.id)}
					strategy={verticalListSortingStrategy}
				>
					<div className="space-y-2">
						{columns.map((column) => (
							<ColumnItem
								key={column.id}
								column={column}
								onRemove={() => onRemoveColumn(column.id)}
								onUpdate={(updates: Partial<Column>) => onUpdateColumn(column.id, updates)}
							/>
						))}
					</div>
				</SortableContext>
			</DndContext>

			{/* Empty State */}
			{columns.length === 0 && (
				<div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
					<p className="text-sm">
						{__(
							'No columns configured. Add some columns to build your table.',
							'productbay'
						)}
					</p>
				</div>
			)}

			{/* Add Column Button */}
			<div className="relative">
				<Button
					variant="outline"
					size="sm"
					onClick={() => setShowAddMenu(!showAddMenu)}
					className="w-full justify-center cursor-pointer"
				>
					<Settings2Icon className="w-4 h-4 mr-2" />
					{__('Manage Columns', 'productbay')}
				</Button>

				{/* Add Column Dropdown Menu */}
				{showAddMenu && (
					<div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-blue-600 rounded-lg shadow-lg z-50">
						<div className="p-2 grid grid-cols-2 gap-1">
							{COLUMN_TYPES.map(({ type, label, icon: Icon, isPro }) => {
								const isSelected = selectedTypes.has(type);
								const isProFeature =
									isPro &&
									!(window as any).productBaySettings?.proVersion;

								return (
									<ProFeatureGate
										key={type}
										featureName={label}
										description={__('This column type is a Pro feature. Upgrade to create more advanced tables.', 'productbay')}
									>
										<button
											onClick={() => handleToggleColumn(type)}
											className={cn(
												'flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors text-left border border-transparent w-full',
												isProFeature
													? 'opacity-75 hover:bg-gray-50'
													: 'cursor-pointer hover:bg-orange-50 hover:border-orange-200',
												isSelected && !isProFeature
													? 'bg-blue-100 text-blue-700'
													: 'text-gray-700'
											)}
											title={
												isProFeature
													? __('Available in Pro version', 'productbay')
													: ''
											}
										>
											<Icon className="w-4 h-4 flex-shrink-0" />
											<span
												className={cn(
													'truncate flex-1',
													isProFeature && 'text-gray-500'
												)}
											>
												{label}
											</span>
											{isProFeature && (
												<ProBadge size="sm" className="ml-auto" />
											)}
											{isSelected && !isProFeature && (
												<CheckIcon className="w-4 h-4 flex-shrink-0 text-blue-600" />
											)}
										</button>
									</ProFeatureGate>
								);
							})}
						</div>
						{/* Close Caret */}
						<button
							onClick={() => setShowAddMenu(false)}
							title={__('Close', 'productbay')}
							className="w-full rounded-b-lg flex justify-center items-center p-1 text-gray-600 hover:text-gray-800 bg-transparent hover:bg-gray-200 cursor-pointer"
							aria-label={__('Close', 'productbay')}
						>
							<ChevronDownIcon className="w-4 h-4 bg-gray-200" />
						</button>
					</div>
				)}
			</div>

			{/* Overlay to close menu */}
			{showAddMenu && (
				<div className="fixed inset-0 z-40" onClick={() => setShowAddMenu(false)} />
			)}
		</div>
	);
};

export default ColumnEditor;
