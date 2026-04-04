/**
 * Alert component for displaying contextual feedback messages.
 * @param props.children - Mandatory. Content of the alert.
 * @param props.variant - Optional. Visual style: 'default' | 'destructive' | 'warning' | 'success'.
 * @returns A styled feedback box with optional title and description.
 */
export * from './Alert';

/**
 * Interactive button with multiple variants and sizes.
 * @param props.children - Mandatory. Button label or icon.
 * @param props.variant - Optional. Visual style: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'success'.
 * @param props.size - Optional. Size: 'default' | 'sm' | 'xs' | 'lg' | 'icon'.
 * @param props.asChild - Optional. If true, renders the child component with button styles.
 * @returns A consistent, accessible button element.
 */
export * from './Button';

/**
 * Radio group component that renders options as selectable cards.
 * @param props.options - Mandatory. Array of { value, label, helpText, disabled }.
 * @param props.value - Mandatory. Currently selected value.
 * @param props.onChange - Mandatory. Change handler callback.
 * @param props.name - Mandatory. HTML name attribute for the group.
 * @returns A list of interactive cards for single-choice selection.
 */
export * from './CardRadioGroup';

/**
 * Professional Sketch-inspired color picker.
 * @param props.onChange - Mandatory. Callback with the new color string.
 * @param props.value - Optional. Initial color value (Hex, RGB, or HSL).
 * @param props.showAlpha - Optional. Whether to show the opacity slider.
 * @param props.showPresets - Optional. Whether to show color swatches.
 * @returns A comprehensive color selection interface with format switching.
 */
export * from './ColorPicker';

/**
 * Visual celebration component that renders falling colorful pieces.
 * @param props.duration - Optional. Total time in MS before unmounting.
 * @param props.pieceCount - Optional. Number of confetti pieces to generate.
 * @returns A temporary full-screen animation overlay.
 */
export * from './Confetti';

/**
 * Button that displays a confirmation popover before executing an action.
 * @param props.onConfirm - Mandatory. Action to execute on user confirmation.
 * @param props.children - Mandatory. Trigger button content.
 * @param props.confirmMessage - Optional. Text to show in the confirmation popover.
 * @param props.onCancel - Optional. Callback when user cancels.
 * @returns A safe-action button that prevents accidental clicks.
 */
export * from './ConfirmButton';

/**
 * Suite of components for building accessible dropdown menus.
 * Includes: DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, etc.
 * @returns A contextual menu system with keyboard and click-outside support.
 */
export * from './DropdownMenu';

/**
 * Inline editable text that transforms from static text to an input field on click.
 * @param props.value - Mandatory. The current text value.
 * @param props.onChange - Mandatory. Callback when value is saved.
 * @param props.placeholder - Optional. Text shown when empty.
 * @param props.error - Optional. Validation error message.
 * @returns A dual-mode component for fast inline data editing.
 */
export * from './EditableText';

/**
 * Styled HTML input element with built-in error states.
 * @param props.error - Optional. Boolean or string error message for visual feedback.
 * @returns A consistent text input field for forms.
 */
export * from './Input';

/**
 * Centered overlay dialog with header, body, and footer.
 * @param props.isOpen - Mandatory. Controls visibility.
 * @param props.onClose - Mandatory. Callback to close the modal.
 * @param props.children - Mandatory. Content of the modal body.
 * @param props.title - Optional. Header text.
 * @param props.primaryButton - Optional. Config for the main action button.
 * @returns A high-level dialog rendered via React Portal.
 */
export * from './Modal';

/**
 * ProductBay brand icon as an SVG.
 * @param props.className - Optional. CSS classes for sizing and coloring.
 * @returns A vector representation of the brand icon.
 */
export * from './ProductBayIcon';

/**
 * Full ProductBay brand logo with text as an SVG.
 * @param props.className - Optional. CSS classes for layout.
 * @returns The complete brand logo vector.
 */
export * from './ProductBayLogo';

/**
 * Badge indicating a feature requires ProductBay Pro.
 * @param props.size - Optional. Size: 'default' | 'sm'.
 * @returns A styled "PRO" pill badge.
 */
export * from './ProBadge';

/**
 * Wrapper that gates features behind ProductBay Pro.
 * Shows an informational modal when Pro is not active.
 * @param props.children - Mandatory. The clickable element to gate.
 * @param props.featureName - Mandatory. Feature name shown in the modal.
 * @param props.description - Optional. Custom description for the modal body.
 * @returns A click-intercepting wrapper or pass-through when Pro is active.
 */
export * from './ProFeatureGate';

/**
 * Custom alternative to the native HTML select element.
 * @param props.options - Mandatory. List of select options.
 * @param props.onChange - Mandatory. Selection change handler.
 * @param props.value - Optional. Currently selected value.
 * @param props.placeholder - Optional. Placeholder text.
 * @returns A styled, accessible dropdown selection interface.
 */
export * from './Select';

/**
 * Pulsing placeholder box for showing content loading states.
 * @param props.className - Optional. Classes for sizing (e.g., 'w-10 h-10').
 * @returns A subtle animated loading indicator.
 */
export * from './Skeleton';

/**
 * Progress indicator for multi-step workflows.
 * @param props.steps - Mandatory. Array of step labels.
 * @param props.currentStep - Mandatory. Current active step (1-indexed).
 * @param props.onStepClick - Optional. Makes steps interactive for navigation.
 * @returns A horizontal progress tracking bar.
 */
export * from './Stepper';

/**
 * Navigable interface for switching between different content views.
 * @param props.tabs - Mandatory. List of tab objects { value, label, icon }.
 * @param props.value - Mandatory. Current active tab.
 * @param props.onChange - Mandatory. Tab switch handler.
 * @returns A tabbed navigation system and associated content container.
 */
export * from './Tabs';

/**
 * Individual transient notification message.
 * @param props.id - Mandatory. Unique identifier.
 * @param props.title - Mandatory. Short summary of the notification.
 * @param props.onDismiss - Mandatory. Handler for removing the toast.
 * @param props.type - Optional. Style: 'success' | 'error' | 'info' | 'warning'.
 * @returns A single floating notification card.
 */
export * from './Toast';

/**
 * Region container for displaying multiple transient toast notifications.
 * @returns A fixed-position stacking area for the application's notifications.
 */
export * from './Toaster';

/**
 * A switch-like interface for boolean settings.
 * @param props.label - Optional. Text to show next to the switch.
 * @param props.size - Optional. Size variants: 'xs' | 'sm' | 'default' | 'lg'.
 * @returns A functional toggle switch based on native checkbox behavior.
 */
export * from './Toggle';

/**
 * Floating descriptive text shown when hovering or focusing an element.
 * @param props.content - Mandatory. Information to display inside the tooltip.
 * @param props.children - Mandatory. Trigger element that will show the tooltip.
 * @param props.position - Optional. Alignment: 'top' | 'bottom' | 'left' | 'right'.
 * @returns An accessible hover-state context provider.
 */
export * from './Tooltip';
