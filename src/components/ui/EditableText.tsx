import { useState, useRef, useEffect, useCallback, KeyboardEvent, MouseEvent } from 'react';
import { CheckIcon, PenLineIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * =====================================================================
 * EditableText Component
 * =====================================================================
 * An inline editable text input component that displays as text until clicked,
 * then transforms into an editable input field. Features include:
 * - Click-to-edit functionality with visual feedback
 * - Save on Enter key, cancel on Escape key
 * - Auto-save on blur (focus loss)
 * - Auto-growing width based on content length
 * - Hover underline feedback for better UX
 * - Error state display with custom styling
 * - Disabled state support
 * - Edit/Check icon toggle button with tooltip
 * =====================================================================
 */

export interface EditableTextProps {
    /**
     * Current value of the input. Supports null/undefined for empty states.
     */
    value: string | null | undefined;

    /**
     * Callback fired when the value is saved (on Enter, blur, or check button click).
     * Only called if the value has actually changed.
     */
    onChange: (value: string) => void;

    /**
     * Placeholder text shown when input is empty.
     * @default "Click to edit..."
     */
    placeholder?: string;

    /**
     * Additional CSS classes for the root container.
     */
    className?: string;

    /**
     * When true, the input is read-only and cannot be edited.
     * @default false
     */
    disabled?: boolean;

    /**
     * Error message to display below the input.
     * When truthy, applies error styling to the input border.
     */
    error?: string;

    /**
     * Granular className overrides for sub-elements.
     * Allows customization of specific parts of the component.
     */
    classNames?: {
        /** Root container element */
        root?: string;
        /** Text display mode styles */
        text?: string;
        /** Input editing mode styles */
        input?: string;
        /** Icon button wrapper */
        iconButton?: string;
        /** Icon element itself */
        icon?: string;
    };
}

/**
 * EditableText - A text field that displays as static text until clicked for editing.
 *
 * Usage:
 * ```tsx
 * <EditableText
 *   value={name}
 *   onChange={(newName) => setName(newName)}
 *   placeholder="Enter name..."
 *   error={nameError}
 * />
 * ```
 *
 * Keyboard shortcuts:
 * - Enter: Save changes and exit edit mode
 * - Escape: Discard changes and exit edit mode
 */
export const EditableText = ({
    value,
    error,
    onChange,
    classNames,
    className = '',
    disabled = false,
    placeholder = 'Click to edit...',
}: EditableTextProps) => {
    // Track whether the input is currently in edit mode
    const [isEditing, setIsEditing] = useState(false);

    // Local state to hold the current input value during editing
    // This allows us to only trigger onChange when the value actually changes
    const [localValue, setLocalValue] = useState(value ?? '');

    // Reference to the input element for programmatic focus control
    const inputRef = useRef<HTMLInputElement>(null);

    /**
     * Sync local state when the prop value changes externally.
     * This ensures the component stays in sync with parent state updates.
     */
    useEffect(() => {
        setLocalValue(value ?? '');
    }, [value]);

    /**
     * Save the current local value if it has changed from the original.
     * Exits edit mode and blurs the input.
     */
    const handleSave = useCallback(() => {
        // Only trigger onChange if the value actually changed
        if (localValue !== (value ?? '')) {
            onChange(localValue);
        }
        setIsEditing(false);
        inputRef.current?.blur();
    }, [localValue, value, onChange]);

    /**
     * Handle keyboard events for save (Enter) and cancel (Escape).
     */
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                // Save changes on Enter
                handleSave();
            } else if (e.key === 'Escape') {
                // Revert to original value and exit edit mode on Escape
                setLocalValue(value ?? '');
                setIsEditing(false);
                inputRef.current?.blur();
            }
        },
        [handleSave, value]
    );

    /**
     * Enter edit mode when the input receives focus.
     * Respects the disabled state.
     */
    const handleFocus = useCallback(() => {
        if (!disabled) {
            setIsEditing(true);
        }
    }, [disabled]);

    /**
     * Auto-save when the input loses focus.
     */
    const handleBlur = useCallback(() => {
        handleSave();
    }, [handleSave]);

    /**
     * Handle click on the edit/save button.
     * Toggles between focusing the input and saving changes.
     */
    const handleButtonClick = useCallback(
        (e: MouseEvent) => {
            e.stopPropagation();
            if (isEditing) {
                handleSave();
            } else {
                inputRef.current?.focus();
            }
        },
        [isEditing, handleSave]
    );

    return (
        <div>
            { /* Main container with input and icon button */}
            <div
                className={cn(
                    'group flex items-center gap-2',
                    className,
                    classNames?.root
                )}
            >
                { /* Input field - styled as transparent text that transforms to editable input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    readOnly={disabled}
                    placeholder={placeholder}
                    // Dynamic width based on content length, with fallback to placeholder length
                    style={{
                        width: `${Math.max(localValue.length, placeholder.length) + 2}ch`,
                    }}
                    className={cn(
                        // Base styles: transparent background, minimal styling
                        'bg-transparent shadow-none',
                        'text-[#1e1e1e] font-bold text-xl leading-8',
                        'px-1 py-0.5',
                        // Width constraints to prevent layout issues
                        'min-w-[100px] max-w-full',
                        // Border styling: only bottom border, others transparent
                        'border-t-0 border-l-0 border-r-0 border-b-2 rounded-none',
                        'focus:outline-none',
                        'transition-all duration-200',
                        'placeholder:italic',
                        // Error state: red border, otherwise show hover underline
                        error
                            ? 'border-red-500'
                            : 'border-transparent focus:border-blue-500 group-hover:border-blue-300',
                        // Cursor styles based on edit/disabled state
                        !isEditing && 'cursor-pointer',
                        disabled && 'cursor-not-allowed opacity-60',
                        // Apply mode-specific custom classes
                        isEditing ? classNames?.input : classNames?.text
                    )}
                />

                { /* Edit/Save button - only shown when not disabled */}
                {!disabled && (
                    <button
                        type="button"
                        // Prevent blur on mousedown so click event fires properly
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={handleButtonClick}
                        title={isEditing ? 'Save' : 'Edit'}
                        className={cn(
                            'flex items-center justify-center p-1 rounded-md bg-transparent hover:bg-white transition-colors cursor-pointer',
                            isEditing
                                ? 'text-blue-400 hover:text-blue-700'
                                : 'text-gray-400 hover:text-gray-700',
                            classNames?.iconButton
                        )}
                        aria-label={isEditing ? 'Done' : 'Edit'}
                    >
                        {isEditing ? (
                            <CheckIcon
                                className={cn('size-5', classNames?.icon)}
                            />
                        ) : (
                            <PenLineIcon
                                className={cn('size-5', classNames?.icon)}
                            />
                        )}
                    </button>
                )}
            </div>

            { /* Error message display */}
            {error && (
                <span className="text-red-500 text-sm mt-1">{error}</span>
            )}
        </div>
    );
};

EditableText.displayName = 'EditableText';

export default EditableText;
