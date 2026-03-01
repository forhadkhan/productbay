import type { Column, ColumnType, VisibilityMode } from '@/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { __, _n } from '@wordpress/i18n';
import React, { useState } from 'react';
import { cn } from '@/utils/cn';
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
} from 'lucide-react';

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
};

/**
 * Available sub-column types for combined column (excludes 'combined' to prevent nesting)
 */
const COMBINABLE_COLUMN_TYPES: { type: ColumnType; label: string; icon: React.ElementType }[] = [
    { type: 'image', label: __('Image', 'productbay'), icon: ImageIcon },
    { type: 'name', label: __('Product Name', 'productbay'), icon: TypeIcon },
    { type: 'price', label: __('Price', 'productbay'), icon: DollarSignIcon },
    { type: 'button', label: __('Add to Cart', 'productbay'), icon: ShoppingCartIcon },
    { type: 'sku', label: __('SKU', 'productbay'), icon: HashIcon },
    { type: 'stock', label: __('Stock', 'productbay'), icon: PackageIcon },
    { type: 'date', label: __('Date', 'productbay'), icon: CalendarIcon },
    { type: 'summary', label: __('Description', 'productbay'), icon: FileTextIcon },
    { type: 'tax', label: __('Taxonomy', 'productbay'), icon: TagIcon },
    { type: 'cf', label: __('Custom Field', 'productbay'), icon: DatabaseIcon },
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
    elements: ColumnType[];
}

/**
 * ColumnItem Component
 * 
 * Renders a single draggable column card with settings.
 */
const ColumnItem: React.FC<ColumnItemProps> = ({ column, onRemove, onUpdate }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    /**
     * Get combined settings from column.settings
     */
    const combinedSettings: CombinedSettings = column.type === 'combined'
        ? {
            layout: (column.settings?.layout as 'inline' | 'stacked') || 'inline',
            elements: (column.settings?.elements as ColumnType[]) || [],
        }
        : { layout: 'inline', elements: [] };

    /**
     * Sortable hook for drag-and-drop
     */
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: column.id });

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
     * Handle combined layout change
     */
    const handleLayoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate({
            settings: {
                ...column.settings,
                layout: e.target.value as 'inline' | 'stacked',
            },
        });
    };

    /**
     * Toggle a sub-element in combined column
     */
    const handleToggleElement = (elementType: ColumnType) => {
        const currentElements = combinedSettings.elements;
        const isSelected = currentElements.includes(elementType);

        const newElements = isSelected
            ? currentElements.filter((el) => el !== elementType)
            : [...currentElements, elementType];

        onUpdate({
            settings: {
                ...column.settings,
                elements: newElements,
            },
        });
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'bg-white border border-gray-200 rounded-lg overflow-hidden transition-shadow',
                isDragging && 'shadow-lg ring-2 ring-blue-400 opacity-90',
                !isDragging && 'hover:border-gray-300'
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
                <span className="flex-shrink-0 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded" title={`Column type: ${column.type}`}>
                    {column.type}
                </span>

                {/* Combined Elements Count Badge */}
                {column.type === 'combined' && combinedSettings.elements.length > 0 && (
                    <span className="flex-shrink-0 text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                        {combinedSettings.elements.length} {
                            _n(
                                'element',
                                'elements',
                                combinedSettings.elements.length,
                                'productbay'
                            )
                        }
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
                    className="flex-shrink-0 bg-transparent p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-md cursor-pointer flex items-center hover:bg-gray-100"
                    aria-label={isExpanded ? __('Collapse settings', 'productbay') : __('Expand settings', 'productbay')}
                    title={isExpanded ? __('Collapse settings', 'productbay') : __('Expand settings', 'productbay')}
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

                    {/* Combined Column Settings */}
                    {column.type === 'combined' && (
                        <div className="space-y-3 pt-3 border-t border-gray-200">
                            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                {__('Combined Column Settings', 'productbay')}
                            </h4>

                            {/* Layout Selection */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    {__('Layout', 'productbay')}
                                </label>
                                <select
                                    value={combinedSettings.layout}
                                    onChange={handleLayoutChange}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {LAYOUT_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sub-Elements Selection */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                    {__('Elements to Include', 'productbay')}
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {COMBINABLE_COLUMN_TYPES.map(({ type, label, icon: Icon }) => {
                                        const isSelected = combinedSettings.elements.includes(type);
                                        return (
                                            <button
                                                key={type}
                                                onClick={() => handleToggleElement(type)}
                                                className={cn(
                                                    'flex items-center gap-2 px-3 py-2 text-sm rounded-md border transition-colors text-left',
                                                    isSelected
                                                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                                                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                                )}
                                            >
                                                <Icon className="w-4 h-4 flex-shrink-0" />
                                                <span className="flex-1 truncate">{label}</span>
                                                {isSelected && (
                                                    <CheckIcon className="w-4 h-4 flex-shrink-0 text-blue-600" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                                {combinedSettings.elements.length < 2 && (
                                    <p className="text-xs text-amber-600 mt-2">
                                        {__('Select at least two elements to include in this combined column.', 'productbay')}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Custom Field Settings */}
                    {column.type === 'cf' && (
                        <div className="space-y-3 pt-3 border-t border-gray-200">
                            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                {__('Custom Field Settings', 'productbay')}
                            </h4>

                            {/* Meta Key Input */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    {__('Meta Key', 'productbay')}
                                </label>
                                <input
                                    type="text"
                                    value={(column.settings?.metaKey as string) || ''}
                                    onChange={(e) => {
                                        onUpdate({
                                            settings: {
                                                ...column.settings,
                                                metaKey: e.target.value,
                                            },
                                        });
                                    }}
                                    placeholder={__('e.g., _weight, custom_field_name', 'productbay')}
                                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {__('Enter the product meta key to display.', 'productbay')}
                                </p>
                            </div>

                            {/* Quick Select Common Fields */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                    {__('Common Fields', 'productbay')}
                                </label>
                                <div className="flex flex-wrap gap-1">
                                    {COMMON_META_FIELDS.map(({ key, label }) => {
                                        const isSelected = (column.settings?.metaKey as string) === key;
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => {
                                                    onUpdate({
                                                        settings: {
                                                            ...column.settings,
                                                            metaKey: key,
                                                        },
                                                    });
                                                }}
                                                className={cn(
                                                    'px-2 py-1 text-xs rounded border transition-colors',
                                                    isSelected
                                                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                                )}
                                            >
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Prefix/Suffix Settings */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        {__('Prefix', 'productbay')}
                                    </label>
                                    <input
                                        type="text"
                                        value={(column.settings?.prefix as string) || ''}
                                        onChange={(e) => {
                                            onUpdate({
                                                settings: {
                                                    ...column.settings,
                                                    prefix: e.target.value,
                                                },
                                            });
                                        }}
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
                                        onChange={(e) => {
                                            onUpdate({
                                                settings: {
                                                    ...column.settings,
                                                    suffix: e.target.value,
                                                },
                                            });
                                        }}
                                        placeholder={__('e.g., kg', 'productbay')}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Fallback Value */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    {__('Fallback Value', 'productbay')}
                                </label>
                                <input
                                    type="text"
                                    value={(column.settings?.fallback as string) || ''}
                                    onChange={(e) => {
                                        onUpdate({
                                            settings: {
                                                ...column.settings,
                                                fallback: e.target.value,
                                            },
                                        });
                                    }}
                                    placeholder={__('e.g., N/A', 'productbay')}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {__('Shown when the meta field is empty.', 'productbay')}
                                </p>
                            </div>

                            {/* Warning if no meta key */}
                            {!column.settings?.metaKey && (
                                <p className="text-xs text-amber-600">
                                    {__('Please specify a meta key to display.', 'productbay')}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ColumnItem;
