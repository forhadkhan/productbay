import React from 'react';
import { __ } from '@wordpress/i18n';
import { cn } from '@/utils/cn';
import { useTableStore } from '@/store/tableStore';
import { Toggle } from '@/components/ui/Toggle';
import {
    PaletteIcon,
    TypeIcon,
    TableIcon,
    ShoppingCartIcon,
} from 'lucide-react';

/* =============================================================================
 * TabDisplay Component
 * =============================================================================
 * Provides styling controls for table appearance:
 * - Header styles (background, text color, font size)
 * - Body styles (background, text, alternating rows, borders)
 * - Button styles (background, text, border radius, icon)
 * 
 * Uses the tableStore style actions to update configuration.
 * ============================================================================= */

/**
 * Color input component with label and preview
 */
interface ColorInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

const ColorInput: React.FC<ColorInputProps> = ({ label, value, onChange, className }) => (
    <div className={cn('flex flex-col gap-1', className)}>
        <label className="text-xs font-medium text-gray-700">{label}</label>
        <div className="flex items-center gap-2">
            <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0.5"
            />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#000000"
                className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 font-mono"
            />
        </div>
    </div>
);

/**
 * Section header component for consistent styling
 */
interface SectionHeaderProps {
    icon: React.ElementType;
    title: string;
    description?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon: Icon, title, description }) => (
    <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Icon className="w-5 h-5" />
        </div>
        <div>
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            {description && (
                <p className="text-xs text-gray-500 mt-0.5">{description}</p>
            )}
        </div>
    </div>
);

/**
 * TabDisplay Component
 * 
 * Renders styling controls for the product table.
 */
const TabDisplay: React.FC = () => {
    const {
        style,
        setHeaderStyle,
        setBodyStyle,
        setButtonStyle,
    } = useTableStore();

    return (
        <div className="space-y-8">
            {/* Header Styles Section */}
            <section className="bg-white border border-gray-200 rounded-lg p-5">
                <SectionHeader
                    icon={TableIcon}
                    title={__('Header Styles', 'productbay')}
                    description={__('Customize the appearance of table header row', 'productbay')}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ColorInput
                        label={__('Background Color', 'productbay')}
                        value={style.header.bgColor}
                        onChange={(color) => setHeaderStyle({ bgColor: color })}
                    />
                    <ColorInput
                        label={__('Text Color', 'productbay')}
                        value={style.header.textColor}
                        onChange={(color) => setHeaderStyle({ textColor: color })}
                    />
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-700">
                            {__('Font Size', 'productbay')}
                        </label>
                        <select
                            value={style.header.fontSize}
                            onChange={(e) => setHeaderStyle({ fontSize: e.target.value })}
                            className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="12px">{__('Small (12px)', 'productbay')}</option>
                            <option value="14px">{__('Medium (14px)', 'productbay')}</option>
                            <option value="16px">{__('Large (16px)', 'productbay')}</option>
                            <option value="18px">{__('Extra Large (18px)', 'productbay')}</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Body Styles Section */}
            <section className="bg-white border border-gray-200 rounded-lg p-5">
                <SectionHeader
                    icon={TypeIcon}
                    title={__('Body Styles', 'productbay')}
                    description={__('Customize the appearance of table rows and cells', 'productbay')}
                />

                <div className="space-y-4">
                    {/* Color row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ColorInput
                            label={__('Background Color', 'productbay')}
                            value={style.body.bgColor}
                            onChange={(color) => setBodyStyle({ bgColor: color })}
                        />
                        <ColorInput
                            label={__('Text Color', 'productbay')}
                            value={style.body.textColor}
                            onChange={(color) => setBodyStyle({ textColor: color })}
                        />
                        <ColorInput
                            label={__('Border Color', 'productbay')}
                            value={style.body.borderColor}
                            onChange={(color) => setBodyStyle({ borderColor: color })}
                        />
                    </div>

                    {/* Alternating rows */}
                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <label className="text-sm font-medium text-gray-900">
                                    {__('Alternating Row Colors', 'productbay')}
                                </label>
                                <p className="text-xs text-gray-500">
                                    {__('Use different background for even rows', 'productbay')}
                                </p>
                            </div>
                            <Toggle
                                checked={style.body.rowAlternate}
                                onChange={(e) => setBodyStyle({ rowAlternate: e.target.checked })}
                            />
                        </div>

                        {style.body.rowAlternate && (
                            <ColorInput
                                label={__('Alternate Row Color', 'productbay')}
                                value={style.body.altBgColor}
                                onChange={(color) => setBodyStyle({ altBgColor: color })}
                                className="max-w-xs"
                            />
                        )}
                    </div>
                </div>
            </section>

            {/* Button Styles Section */}
            <section className="bg-white border border-gray-200 rounded-lg p-5">
                <SectionHeader
                    icon={ShoppingCartIcon}
                    title={__('Button Styles', 'productbay')}
                    description={__('Customize Add to Cart and action buttons', 'productbay')}
                />

                <div className="space-y-4">
                    {/* Button colors */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ColorInput
                            label={__('Background Color', 'productbay')}
                            value={style.button.bgColor}
                            onChange={(color) => setButtonStyle({ bgColor: color })}
                        />
                        <ColorInput
                            label={__('Text Color', 'productbay')}
                            value={style.button.textColor}
                            onChange={(color) => setButtonStyle({ textColor: color })}
                        />
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-700">
                                {__('Border Radius', 'productbay')}
                            </label>
                            <select
                                value={style.button.borderRadius}
                                onChange={(e) => setButtonStyle({ borderRadius: e.target.value })}
                                className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="0">{__('None (Square)', 'productbay')}</option>
                                <option value="4px">{__('Small (4px)', 'productbay')}</option>
                                <option value="8px">{__('Medium (8px)', 'productbay')}</option>
                                <option value="12px">{__('Large (12px)', 'productbay')}</option>
                                <option value="9999px">{__('Pill (Full)', 'productbay')}</option>
                            </select>
                        </div>
                    </div>

                    {/* Button icon */}
                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-700">
                                {__('Button Icon', 'productbay')}
                            </label>
                            <select
                                value={style.button.icon}
                                onChange={(e) => setButtonStyle({ icon: e.target.value })}
                                className="max-w-xs px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="cart">{__('🛒 Cart', 'productbay')}</option>
                                <option value="plus">{__('➕ Plus', 'productbay')}</option>
                                <option value="bag">{__('🛍️ Bag', 'productbay')}</option>
                                <option value="none">{__('No Icon', 'productbay')}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Preview Section (Coming Soon) */}
            <section className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-5">
                <div className="flex items-center justify-center text-gray-500">
                    <PaletteIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm">
                        {__('Live preview coming soon...', 'productbay')}
                    </span>
                </div>
            </section>
        </div>
    );
};

export default TabDisplay;
