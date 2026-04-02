import { cn } from '@/utils/cn';
import { Slot } from '@wordpress/components';
import { arrayMove, useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { __, _n } from '@wordpress/i18n';
import React, { useState, useMemo } from 'react';
import {
	GripVerticalIcon,
	TrashIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	ImageIcon,
	TypeIcon,
	DollarSignIcon,
	ShoppingCartIcon,
	HashIcon,
	PackageIcon,
	CalendarIcon,
	FileTextIcon,
	TagIcon,
	DatabaseIcon,
	LayoutGridIcon,
	EyeIcon,
	EyeOffIcon,
	CheckIcon,
	StarIcon,
	PlusIcon,
	Settings2Icon,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Column, ColumnType, VisibilityMode, CombinedElement } from '@/types';

/* =============================================================================
 * ColumnItem Component
 * =============================================================================
 * Individual sortable column card with inline editing and advanced settings.
 *
 * Features:
 * - Drag handle for reordering
 * - Inline heading editor
 * - Expandable advanced settings panel
 * - Type-specific icon display
 * - Combined column sub-element picker
 * ============================================================================= */

/**
 * Icon mapping for column types
 */
const COLUMN_ICONS: Record<ColumnType, React.ElementType> = {
	image: ImageIcon,
	name: TypeIcon,
	price: DollarSignIcon,
	button: ShoppingCartIcon,
	sku: HashIcon,
	stock: PackageIcon,
	date: CalendarIcon,
	summary: FileTextIcon,
	tax: TagIcon,
	cf: DatabaseIcon,
	combined: LayoutGridIcon,
	rating: StarIcon,
};

/**
 * Available sub-column types for combined column (excludes 'combined' to prevent nesting)
 */
const COMBINABLE_COLUMN_TYPES: {
	type: ColumnType;
	label: string;
	icon: React.ElementType;
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
	{ type: 'stock', label: __('Stock', 'productbay'), icon: PackageIcon },
	{ type: 'date', label: __('Date', 'productbay'), icon: CalendarIcon },
	{
		type: 'summary',
		label: __('Description', 'productbay'),
		icon: FileTextIcon,
	},
	{ type: 'tax', label: __('Taxonomy', 'productbay'), icon: TagIcon },
	{
		type: 'cf',
		label: __('Custom Field', 'productbay'),
		icon: DatabaseIcon,
	},
	{ type: 'rating', label: __('Rating', 'productbay'), icon: StarIcon },
];

/**
 * Visibility mode labels
 */
const VISIBILITY_OPTIONS: { value: VisibilityMode; label: string }[] = [
	{ value: 'all', label: __('All devices', 'productbay') },
	{ value: 'desktop', label: __('Desktop only', 'productbay') },
	{ value: 'tablet', label: __('Tablet only', 'productbay') },
	{ value: 'mobile', label: __('Mobile only', 'productbay') },
	{ value: 'not-mobile', label: __('Hide on mobile', 'productbay') },
	{ value: 'not-desktop', label: __('Hide on desktop', 'productbay') },
	{ value: 'none', label: __('Hidden', 'productbay') },
];

/**
 * Combined column layout options
 */
const LAYOUT_OPTIONS: { value: 'inline' | 'stacked'; label: string }[] = [
	{ value: 'inline', label: __('Inline (horizontal)', 'productbay') },
	{ value: 'stacked', label: __('Stacked (vertical)', 'productbay') },
];

/**
 * Common WooCommerce meta fields for quick selection
 * These are the most commonly used product meta fields
 */
const COMMON_META_FIELDS: { key: string; label: string }[] = [
	{ key: '_weight', label: __('Weight', 'productbay') },
	{ key: '_length', label: __('Length', 'productbay') },
	{ key: '_width', label: __('Width', 'productbay') },
	{ key: '_height', label: __('Height', 'productbay') },
	{ key: 'total_sales', label: __('Total Sales', 'productbay') },
	{ key: '_purchase_note', label: __('Purchase Note', 'productbay') },
];

export interface ColumnItemProps {
	column: Column;
	onRemove: () => void;
	onUpdate: (updates: Partial<Column>) => void;
}

/**
 * Combined column settings type
 */
interface CombinedSettings {
	layout: 'inline' | 'stacked';
	separator?: string;
	elements: CombinedElement[];
}

/**
 * SubElementItem Component
 *
 * Individual draggable element within a combined column.
 */
const SubElementItem: React.FC<{
	element: CombinedElement;
	onRemove: () => void;
	onUpdate: (updates: Partial<CombinedElement>) => void;
}> = ({ element, onRemove, onUpdate }) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: element.id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const Icon = COLUMN_ICONS[element.type] || TypeIcon;

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(
				'flex flex-col gap-2 p-2 bg-white border border-gray-200 rounded-md shadow-sm',
				isDragging && 'opacity-50 ring-2 ring-blue-500 z-50'
			)}
		>
			<div className="flex items-center gap-2">
				<div
					{...attributes}
					{...listeners}
					className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
				>
					<GripVerticalIcon className="w-4 h-4" />
				</div>
				<Icon className="w-3.5 h-3.5 text-gray-500" />
				<span className="text-xs font-medium text-gray-700 capitalize">
					{element.type.replace('_', ' ')}
				</span>
				<button
					onClick={onRemove}
					className="ml-auto p-1 text-gray-400 hover:text-red-500 rounded hover:bg-red-50"
				>
					<TrashIcon className="w-3.5 h-3.5" />
				</button>
			</div>

			<div className="grid grid-cols-2 gap-2">
				<input
					type="text"
					value={(element.settings?.prefix as string) || ''}
					onChange={(e) =>
						onUpdate({
							settings: { ...element.settings, prefix: e.target.value },
						})
					}
					placeholder={__('Prefix', 'productbay')}
					className="px-2 py-1 text-[11px] border border-gray-200 rounded focus:ring-1 focus:ring-blue-500"
				/>
				<input
					type="text"
					value={(element.settings?.suffix as string) || ''}
					onChange={(e) =>
						onUpdate({
							settings: { ...element.settings, suffix: e.target.value },
						})
					}
					placeholder={__('Suffix', 'productbay')}
					className="px-2 py-1 text-[11px] border border-gray-200 rounded focus:ring-1 focus:ring-blue-500"
				/>
			</div>

			{element.type === 'cf' && (
				<input
					type="text"
					value={(element.settings?.metaKey as string) || ''}
					onChange={(e) =>
						onUpdate({
							settings: { ...element.settings, metaKey: e.target.value },
						})
					}
					placeholder={__('Meta Key', 'productbay')}
					className="w-full px-2 py-1 text-[11px] border border-gray-200 rounded focus:ring-1 focus:ring-blue-500"
				/>
			)}
		</div>
	);
};

/**
 * ColumnItem Component
 *
 * Renders a single draggable column card with settings.
 */
const ColumnItem: React.FC<ColumnItemProps> = ({ column, onRemove, onUpdate }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const isProActive = !!(window as any).productBaySettings?.proVersion;

	// Sensors for sub-elements reordering
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
		useSensor(KeyboardSensor)
	);

	/**
	 * Get combined settings from column.settings
	 */
	const combinedSettings: CombinedSettings = useMemo(() => {
		if (column.type !== 'combined') return { layout: 'inline', elements: [] };

		const settings = column.settings || {};
		const rawElements = (settings.elements as any[]) || [];

		// Data transformation for backward compatibility
		const elements: CombinedElement[] = rawElements.map((el) => {
			if (typeof el === 'string') {
				return { id: `el-${Math.random().toString(36).substr(2, 9)}`, type: el as ColumnType };
			}
			return el as CombinedElement;
		});

		return {
			layout: (settings.layout as 'inline' | 'stacked') || 'inline',
			separator: (settings.separator as string) || '',
			elements,
		};
	}, [column.settings, column.type]);

	/**
	 * Sortable hook for drag-and-drop
	 */
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: column.id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	/**
	 * Get the icon component for this column type
	 */
	const IconComponent = COLUMN_ICONS[column.type] || TypeIcon;

	/**
	 * Handle heading change
	 */
	const handleHeadingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onUpdate({ heading: e.target.value });
	};

	/**
	 * Handle visibility change
	 */
	const handleVisibilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		onUpdate({
			advanced: {
				...column.advanced,
				visibility: e.target.value as VisibilityMode,
			},
		});
	};

	/**
	 * Handle width value change
	 */
	const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value) || 0;
		onUpdate({
			advanced: {
				...column.advanced,
				width: { ...column.advanced.width, value },
			},
		});
	};

	/**
	 * Handle width unit change
	 */
	const handleWidthUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		onUpdate({
			advanced: {
				...column.advanced,
				width: {
					...column.advanced.width,
					unit: e.target.value as 'auto' | 'px' | '%',
				},
			},
		});
	};

	/**
	 * Toggle show heading
	 */
	const handleToggleHeading = () => {
		onUpdate({
			advanced: {
				...column.advanced,
				showHeading: !column.advanced.showHeading,
			},
		});
	};

	/**
	 * Combined Column Handlers
	 */
	const handleAddElement = (type: ColumnType) => {
		const newElement: CombinedElement = {
			id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
			type,
			settings: {},
		};
		onUpdate({
			settings: {
				...column.settings,
				elements: [...combinedSettings.elements, newElement],
			},
		});
	};

	const handleRemoveSubElement = (id: string) => {
		onUpdate({
			settings: {
				...column.settings,
				elements: combinedSettings.elements.filter((el) => el.id !== id),
			},
		});
	};

	const handleUpdateSubElement = (id: string, updates: Partial<CombinedElement>) => {
		onUpdate({
			settings: {
				...column.settings,
				elements: combinedSettings.elements.map((el) =>
					el.id === id ? { ...el, ...updates } : el
				),
			},
		});
	};

	const handleSubDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (over && active.id !== over.id) {
			const oldIndex = combinedSettings.elements.findIndex((el) => el.id === active.id);
			const newIndex = combinedSettings.elements.findIndex((el) => el.id === over.id);
			onUpdate({
				settings: {
					...column.settings,
					elements: arrayMove(combinedSettings.elements, oldIndex, newIndex),
				},
			});
		}
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(
				'bg-white border border-gray-200 rounded-lg overflow-hidden transition-shadow',
				isDragging && 'shadow-lg ring-2 ring-blue-400 opacity-90',
				!isDragging && 'hover:bg-orange-50 hover:border-orange-200'
			)}
		>
			{/* Main Row */}
			<div className="flex items-center gap-2 px-3 py-2">
				{/* Drag Handle */}
				<button
					{...attributes}
					{...listeners}
					className="flex-shrink-0 bg-transparent text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
					aria-label={__('Drag to reorder', 'productbay')}
					title={__('Drag to reorder', 'productbay')}
				>
					<GripVerticalIcon className="w-4 h-4" />
				</button>

				{/* Column Type Icon */}
				<div className="hidden md:flex-shrink-0 w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
					<IconComponent className="w-4 h-4 text-gray-600" />
				</div>

				{/* Heading Input */}
				<input
					type="text"
					value={column.heading}
					onChange={handleHeadingChange}
					className="flex-1 min-w-0 text-sm font-medium text-gray-900 rounded-none bg-transparent border-0 border-b border-transparent hover:border-gray-400 focus:border-blue-500 focus:ring-0 px-1 py-0.5 transition-colors"
					placeholder={__('Column heading', 'productbay')}
					title={__('Edit column heading', 'productbay')}
				/>

				{/* Column Type Badge */}
				<div className="flex items-center gap-1 flex-shrink-0">
					<span
						className="text-[10px] text-gray-500 bg-gray-100 border border-gray-300 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider"
						title={`Column type: ${column.type}`}
					>
						{column.type}
					</span>
					{(column.type === 'cf' || column.type === 'combined') && !isProActive && (
						<span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded tracking-wide">
							PRO
						</span>
					)}
				</div>

				{/* Combined Elements Count Badge */}
				{column.type === 'combined' && combinedSettings.elements.length > 0 && (
					<span className="flex-shrink-0 text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
						{combinedSettings.elements.length}{' '}
						{_n('element', 'elements', combinedSettings.elements.length, 'productbay')}
					</span>
				)}

				{/* Heading Visibility Toggle */}
				<button
					onClick={handleToggleHeading}
					className={cn(
						'flex-shrink-0 bg-transparent p-1 rounded transition-colors rounded-md cursor-pointer flex items-center hover:bg-gray-100',
						column.advanced.showHeading
							? 'text-gray-400 hover:text-gray-600'
							: 'text-amber-500 hover:text-amber-600'
					)}
					title={
						column.advanced.showHeading
							? __('Heading visible - Click to hide column header text', 'productbay')
							: __('Heading hidden - Click to show column header text', 'productbay')
					}
				>
					{column.advanced.showHeading ? (
						<EyeIcon className="w-4 h-4" />
					) : (
						<EyeOffIcon className="w-4 h-4" />
					)}
				</button>

				{/* Remove Button */}
				<button
					onClick={onRemove}
					className="flex-shrink-0 bg-transparent p-1 text-gray-400 hover:text-red-500 transition-colors rounded-md cursor-pointer flex items-center hover:bg-red-100"
					aria-label={__('Remove column', 'productbay')}
					title={__('Remove column', 'productbay')}
				>
					<TrashIcon className="w-4 h-4" />
				</button>

				{/* Expand/Collapse Button */}
				<button
					onClick={() => setIsExpanded(!isExpanded)}
					className="flex-shrink-0 border border-gray-300 bg-transparent p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-md cursor-pointer flex items-center hover:bg-gray-100"
					aria-label={
						isExpanded
							? __('Collapse settings', 'productbay')
							: __('Expand settings', 'productbay')
					}
					title={
						isExpanded
							? __('Collapse settings', 'productbay')
							: __('Expand settings', 'productbay')
					}
				>
					{isExpanded ? (
						<ChevronUpIcon className="w-4 h-4" />
					) : (
						<ChevronDownIcon className="w-4 h-4" />
					)}
				</button>
			</div>

			{/* Advanced Settings Panel */}
			{isExpanded && (
				<div className="px-4 py-3 bg-gray-50 border-t border-gray-200 space-y-4">
					<div className="grid grid-cols-2 gap-4">
						{/* Width Setting */}
						<div>
							<label className="block text-xs font-medium text-gray-700 mb-1">
								{__('Width', 'productbay')}
							</label>
							<div className="flex flex-col md:flex-row gap-2">
								{/* Only show value input when not 'auto' */}
								{column.advanced.width.unit !== 'auto' && (
									<input
										type="number"
										min="0"
										value={column.advanced.width.value}
										onChange={handleWidthChange}
										className="flex-1 min-w-0 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
									/>
								)}
								<select
									value={column.advanced.width.unit}
									onChange={handleWidthUnitChange}
									className="flex-1 px-2 py-1 pr-8 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.25rem_center] bg-no-repeat"
								>
									<option value="auto">{__('Auto', 'productbay')}</option>
									<option value="px">px</option>
									<option value="%">%</option>
								</select>
							</div>
						</div>

						{/* Visibility Setting */}
						<div>
							<label className="block text-xs font-medium text-gray-700 mb-1">
								{__('Visibility', 'productbay')}
							</label>
							<select
								value={column.advanced.visibility}
								onChange={handleVisibilityChange}
								className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
							>
								{VISIBILITY_OPTIONS.map((opt) => (
									<option key={opt.value} value={opt.value}>
										{opt.label}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Rating Column Settings */}
					{column.type === 'rating' && (
						<div className="space-y-3 pt-3 border-t border-gray-200">
							<h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
								{__('Rating Settings', 'productbay')}
							</h4>
							<div>
								<label className="block text-xs font-medium text-gray-700 mb-1">
									{__('Display Format', 'productbay')}
								</label>
								<select
									value={(column.settings?.displayFormat as string) || 'stars'}
									onChange={(e) =>
										onUpdate({
											settings: { ...column.settings, displayFormat: e.target.value },
										})
									}
									className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
								>
									<option value="stars">{__('Stars (Custom)', 'productbay')}</option>
									<option value="text">{__('Text Based', 'productbay')}</option>
									<option value="woocommerce">
										{__('WooCommerce Default', 'productbay')}
									</option>
								</select>
							</div>
						</div>
					)}

					{/* Combined Column Settings */}
					{column.type === 'combined' && (
						<div className="space-y-3 pt-3 border-t border-gray-200">
							<div className="flex items-center justify-between">
								<h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
									{__('Combined Column Elements', 'productbay')}
								</h4>
								{!isProActive && (
									<span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
										PRO
									</span>
								)}
							</div>

							{!isProActive ? (
								<div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-center">
									<LayoutGridIcon className="w-8 h-8 text-blue-400 mx-auto mb-2 opacity-50" />
									<p className="text-sm font-medium text-blue-900 mb-1">
										{__('Combined Column is a Pro Feature', 'productbay')}
									</p>
									<p className="text-xs text-blue-700">
										{__(
											'Create complex cells by combining images, text, and icons.',
											'productbay'
										)}
									</p>
									<Slot name="productbay-pro-combined-cta" />
								</div>
							) : (
								<div className="space-y-4">
									{/* Layout & Separator */}
									<div className="grid grid-cols-2 gap-3">
										<div>
											<label className="block text-xs font-medium text-gray-700 mb-1">
												{__('Layout', 'productbay')}
											</label>
											<select
												value={combinedSettings.layout}
												onChange={(e) =>
													onUpdate({
														settings: {
															...column.settings,
															layout: e.target.value as 'inline' | 'stacked',
														},
													})
												}
												className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
											>
												{LAYOUT_OPTIONS.map((opt) => (
													<option key={opt.value} value={opt.value}>
														{opt.label}
													</option>
												))}
											</select>
										</div>
										{combinedSettings.layout === 'inline' && (
											<div>
												<label className="block text-xs font-medium text-gray-700 mb-1">
													{__('Separator', 'productbay')}
												</label>
												<input
													type="text"
													value={combinedSettings.separator || ''}
													onChange={(e) =>
														onUpdate({
															settings: {
																...column.settings,
																separator: e.target.value,
															},
														})
													}
													placeholder="e.g. | or •"
													className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
												/>
											</div>
										)}
									</div>

									{/* Sub-elements list */}
									<div className="space-y-2">
										<p className="text-xs font-medium text-gray-600">
											{__('Elements & Order', 'productbay')}
										</p>
										<DndContext
											sensors={sensors}
											collisionDetection={closestCenter}
											onDragEnd={handleSubDragEnd}
										>
											<SortableContext
												items={combinedSettings.elements.map((el) => el.id)}
												strategy={verticalListSortingStrategy}
											>
												<div className="space-y-2 border-l-2 border-gray-200 pl-3">
													{combinedSettings.elements.map((element) => (
														<SubElementItem
															key={element.id}
															element={element}
															onRemove={() => handleRemoveSubElement(element.id)}
															onUpdate={(updates) =>
																handleUpdateSubElement(element.id, updates)
															}
														/>
													))}
												</div>
											</SortableContext>
										</DndContext>
									</div>

									{/* Quick Add Sub-Element */}
									<div className="pt-2">
										<p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-2">
											{__('Add Sub-Element', 'productbay')}
										</p>
										<div className="flex flex-wrap gap-1">
											{COMBINABLE_COLUMN_TYPES.map((type) => (
												<Button
													key={type.type}
													variant="outline"
													size="xs"
													onClick={() => handleAddElement(type.type)}
													className="h-7 text-[11px] px-2"
												>
													<PlusIcon className="w-3 h-3 mr-1" />
													{type.label}
												</Button>
											))}
										</div>
									</div>
								</div>
							)}
						</div>
					)}

					{/* Custom Field Settings */}
					{column.type === 'cf' && (
						<div className="space-y-3 pt-3 border-t border-gray-200">
							<div className="flex items-center justify-between">
								<h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
									{__('Custom Field Settings', 'productbay')}
								</h4>
								{!isProActive && (
									<span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
										PRO
									</span>
								)}
							</div>

							{!isProActive ? (
								<div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-center">
									<DatabaseIcon className="w-8 h-8 text-blue-400 mx-auto mb-2 opacity-50" />
									<p className="text-sm font-medium text-blue-900 mb-1">
										{__('Custom Field is a Pro Feature', 'productbay')}
									</p>
									<p className="text-xs text-blue-700 mb-3">
										{__(
											'Display any product meta field (Weight, Dimensions, or 3rd party fields).',
											'productbay'
										)}
									</p>
									<Slot name="productbay-pro-cf-cta" />
								</div>
							) : (
								<div className="space-y-4">
									{/* Slot for Pro Advanced Meta Selector */}
									<Slot
										name="productbay-pro-cf-settings"
										fillProps={{ column, onUpdate }}
									/>

									{/* Fallback to simple input if slot is empty */}
									<div className="pt-3 border-t border-gray-100">
										<label className="block text-xs font-medium text-gray-700 mb-1">
											{__('Meta Key (Manual Override)', 'productbay')}
										</label>
										<input
											type="text"
											value={(column.settings?.metaKey as string) || ''}
											onChange={(e) =>
												onUpdate({
													settings: { ...column.settings, metaKey: e.target.value },
												})
											}
											className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
										/>
									</div>
								</div>
							)}

							{/* Common Prefix/Suffix Settings (Shared for Free/Pro) */}
							<div className="grid grid-cols-2 gap-3 pt-2">
								<div>
									<label className="block text-xs font-medium text-gray-700 mb-1">
										{__('Prefix', 'productbay')}
									</label>
									<input
										type="text"
										value={(column.settings?.prefix as string) || ''}
										onChange={(e) =>
											onUpdate({
												settings: { ...column.settings, prefix: e.target.value },
											})
										}
										placeholder={__('e.g., Weight:', 'productbay')}
										className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>
								<div>
									<label className="block text-xs font-medium text-gray-700 mb-1">
										{__('Suffix', 'productbay')}
									</label>
									<input
										type="text"
										value={(column.settings?.suffix as string) || ''}
										onChange={(e) =>
											onUpdate({
												settings: { ...column.settings, suffix: e.target.value },
											})
										}
										placeholder={__('e.g., kg', 'productbay')}
										className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default ColumnItem;
