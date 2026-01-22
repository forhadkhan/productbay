import * as React from 'react';
import { cn } from '../../utils/cn';

/* =============================================================================
 * CardRadioGroup Component
 * =============================================================================
 * A reusable radio group component that displays options as selectable cards.
 * Each card shows a radio indicator, a label/title, and optional help text.
 *
 * Features:
 * - Fully accessible with proper ARIA attributes and keyboard navigation
 * - Visual feedback for selected/unselected states
 * - Flexible layout with responsive grid
 * - Customizable through className props
 * ============================================================================= */

/**
 * Represents a single option in the CardRadioGroup.
 */
export interface CardRadioOption<T extends string = string> {
    /** Unique value identifier for the option */
    value: T;
    /** Display label/title for the card */
    label: string;
    /** Optional help text displayed below the label */
    helpText?: string;
    /** Whether this option is disabled */
    disabled?: boolean;
}

/**
 * Props for the CardRadioGroup component.
 */
export interface CardRadioGroupProps<T extends string = string> {
    /** Array of options to display as selectable cards */
    options: CardRadioOption<T>[];
    /** Currently selected value */
    value: T;
    /** Callback fired when selection changes */
    onChange: (value: T) => void;
    /** Name attribute for the radio input group (for form submission) */
    name: string;
    /** Additional CSS classes for the container */
    className?: string;
    /** Additional CSS classes for individual cards */
    cardClassName?: string;
    /** Whether the entire group is disabled */
    disabled?: boolean;
    /** Accessible label for the radio group */
    'aria-label'?: string;
}

/**
 * CardRadioGroup renders a set of options as card-style radio buttons.
 *
 * The selected card displays with a highlighted background (blue) while
 * unselected cards have a neutral appearance with subtle borders.
 *
 * @example
 * ```tsx
 * const options = [
 *   { value: 'all', label: 'All Products', helpText: 'Include all products' },
 *   { value: 'specific', label: 'Specific Products', helpText: 'Select individual products' },
 * ];
 *
 * <CardRadioGroup
 *   name="product-filter"
 *   options={options}
 *   value={selected}
 *   onChange={setSelected}
 * />
 * ```
 */
function CardRadioGroup<T extends string = string>({
    options,
    value,
    onChange,
    name,
    className,
    cardClassName,
    disabled = false,
    'aria-label': ariaLabel,
}: CardRadioGroupProps<T>) {
    /**
     * Handles keyboard navigation within the radio group.
     * Arrow keys move focus and selection between options.
     */
    const handleKeyDown = (
        event: React.KeyboardEvent,
        currentIndex: number
    ) => {
        const enabledOptions = options.filter(
            (opt) => !opt.disabled && !disabled
        );
        const currentEnabledIndex = enabledOptions.findIndex(
            (opt) => opt.value === options[currentIndex].value
        );

        let newIndex: number | null = null;

        switch (event.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                event.preventDefault();
                newIndex =
                    (currentEnabledIndex + 1) % enabledOptions.length;
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                event.preventDefault();
                newIndex =
                    (currentEnabledIndex - 1 + enabledOptions.length) %
                    enabledOptions.length;
                break;
            default:
                return;
        }

        if (newIndex !== null) {
            const newOption = enabledOptions[newIndex];
            onChange(newOption.value);
            // Focus the newly selected radio button
            const radioElement = document.querySelector(
                `input[name="${name}"][value="${newOption.value}"]`
            ) as HTMLInputElement;
            radioElement?.focus();
        }
    };

    return (
        <div
            role="radiogroup"
            aria-label={ariaLabel}
            className={cn('flex flex-wrap gap-3', className)}
        >
            {options.map((option, index) => {
                const isSelected = value === option.value;
                const isDisabled = disabled || option.disabled;

                return (
                    <label
                        key={option.value}
                        className={cn(
                            /* Base card styles */
                            'relative flex flex-1 min-w-[180px] cursor-pointer rounded-lg border p-4 transition-all duration-200',
                            /* Selected state: blue background, white text */
                            isSelected && [
                                'border-blue-600 bg-blue-600 text-white',
                                'shadow-md',
                            ],
                            /* Unselected state: light background, dark text */
                            !isSelected && [
                                'border-gray-200 bg-gray-50 text-gray-900',
                                'hover:border-gray-300 hover:bg-gray-100',
                            ],
                            /* Disabled state */
                            isDisabled && [
                                'cursor-not-allowed opacity-50',
                                'hover:border-gray-200 hover:bg-gray-50',
                            ],
                            /* Focus-visible styles are handled on the input */
                            cardClassName
                        )}
                    >
                        {/* Visually hidden radio input for accessibility */}
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={isSelected}
                            onChange={() => !isDisabled && onChange(option.value)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            disabled={isDisabled}
                            className="sr-only peer"
                            aria-describedby={
                                option.helpText
                                    ? `${name}-${option.value}-help`
                                    : undefined
                            }
                        />

                        {/* Custom radio indicator circle */}
                        <span
                            className={cn(
                                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 mr-3 mt-0.5 transition-colors',
                                isSelected && 'border-white bg-transparent',
                                !isSelected && 'border-gray-400 bg-white'
                            )}
                            aria-hidden="true"
                        >
                            {/* Inner dot for selected state */}
                            {isSelected && (
                                <span className="h-2.5 w-2.5 rounded-full bg-white" />
                            )}
                        </span>

                        {/* Card content: label and help text */}
                        <div className="flex flex-col">
                            <span className="font-medium text-sm leading-tight">
                                {option.label}
                            </span>
                            {option.helpText && (
                                <span
                                    id={`${name}-${option.value}-help`}
                                    className={cn(
                                        'mt-1 text-xs leading-tight',
                                        isSelected
                                            ? 'text-blue-100'
                                            : 'text-gray-500'
                                    )}
                                >
                                    {option.helpText}
                                </span>
                            )}
                        </div>

                        {/* Focus ring indicator (visible on keyboard focus) */}
                        <span
                            className="absolute inset-0 rounded-lg ring-2 ring-blue-500 ring-offset-2 opacity-0 peer-focus-visible:opacity-100 pointer-events-none"
                            aria-hidden="true"
                        />
                    </label>
                );
            })}
        </div>
    );
}

CardRadioGroup.displayName = 'CardRadioGroup';

export { CardRadioGroup };
