import React, { useRef } from 'react';
import { cn } from '@/utils/cn';
import { __ } from '@wordpress/i18n';

interface ColorPickerProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

/**
 * ColorPicker Component
 * 
 * Renders a color preview circle and "Edit Color" text.
 * Triggers a hidden native color picker on click.
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, className }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        inputRef.current?.click();
    };

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <div
                className="w-8 h-8 rounded-full border border-gray-200 shadow-sm cursor-pointer transition-transform hover:scale-105"
                style={{ backgroundColor: value }}
                onClick={handleClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        handleClick();
                    }
                }}
                aria-label={__('Pick color', 'productbay')}
            />
            <button
                type="button"
                onClick={handleClick}
                className="text-sm text-blue-500 hover:text-blue-600 font-medium hover:underline bg-transparent border-0 p-0 cursor-pointer"
            >
                {__('Edit Color', 'productbay')}
            </button>
            <input
                ref={inputRef}
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="sr-only"
                aria-hidden="true"
            />
        </div>
    );
};
