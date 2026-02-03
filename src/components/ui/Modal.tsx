import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { __ } from '@wordpress/i18n';
import { cn } from '@/utils/cn';

/**
 * Modal Component
 *
 * A reusable, modern modal dialog with header, body, and footer sections.
 * The modal is rendered into `#productbay-root` using React Portal and uses
 * absolute positioning to stay scoped within the plugin container.
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirm Action"
 * >
 *   <p>Are you sure you want to proceed?</p>
 * </Modal>
 * ```
 *
 * @example With custom buttons
 * ```tsx
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Delete Item"
 *   primaryButton={{
 *     text: "Delete",
 *     onClick: handleDelete,
 *     variant: "danger"
 *   }}
 *   secondaryButton={{
 *     text: "Cancel",
 *     onClick: () => setIsOpen(false)
 *   }}
 * >
 *   <p>This action cannot be undone.</p>
 * </Modal>
 * ```
 */

export interface ModalButton {
    /** Button text */
    text: string;
    /** Click handler */
    onClick: () => void;
    /** Button style variant */
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    /** Optional icon to show before text */
    icon?: React.ReactNode;
}

export interface ModalProps {
    /** Controls modal visibility */
    isOpen: boolean;
    /** Callback when modal should close */
    onClose: () => void;
    /** Modal title shown in header */
    title: string;
    /** Modal container class */
    className?: string;
    /** Modal content (can be text, HTML, or React components) */
    children: React.ReactNode;
    /** Primary action button (right side) */
    primaryButton?: ModalButton;
    /** Secondary action button (left side, defaults to Cancel) */
    secondaryButton?: ModalButton;
    /** Maximum width of modal */
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
    /** Whether clicking backdrop closes modal (default: true) */
    closeOnBackdropClick?: boolean;
    /** Whether pressing ESC closes modal and shows hint (default: true) */
    closeOnEsc?: boolean;
}

/** Default container ID for portal rendering */
const MODAL_CONTAINER_ID = 'productbay-root';

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    className,
    children,
    primaryButton,
    secondaryButton,
    maxWidth = 'md',
    closeOnEsc = true,
    closeOnBackdropClick = true,
}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Handle ESC key to close modal (only if closeOnEsc is enabled)
    useEffect(() => {
        if (!closeOnEsc) return;

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose, closeOnEsc]);

    // Handle backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    // Early return if modal is closed or container doesn't exist
    if (!isOpen) return null;

    const container = document.getElementById(MODAL_CONTAINER_ID);
    if (!container) return null;

    // Max width classes
    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    };

    // Button variant styles
    const getButtonStyles = (
        variant: ModalButton['variant'] = 'primary'
    ) => {
        const base =
            'px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2 cursor-pointer';

        const variants = {
            primary: 'bg-blue-600 text-white hover:bg-blue-700/90',
            secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200/90',
            danger: 'bg-red-600 text-white hover:bg-red-700/90',
            success: 'bg-green-600 text-white hover:bg-green-700/90',
        };

        return cn(base, variants[variant]);
    };

    // Default secondary button
    const defaultSecondaryButton: ModalButton = {
        text: 'Cancel',
        onClick: onClose,
        variant: 'secondary',
    };

    const secondaryBtn = secondaryButton || defaultSecondaryButton;

    return createPortal(
        // Modal Parent Container (uses absolute positioning within #productbay-root)
        <div
            className="absolute inset-0 z-45 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-fade-in"
            onClick={handleBackdropClick}
        >
            { /* Modal Content */}
            <div
                ref={modalRef}
                className={cn(
                    'bg-white rounded-lg shadow-xl w-full animate-scale-in border border-gray-200',
                    className,
                    maxWidthClasses[maxWidth]
                )}
            >
                { /* Header */}
                <div className="px-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-800 m-0">
                        {title}
                    </h3>
                </div>

                { /* Body */}
                <div className="px-6 py-4 text-gray-700">{children}</div>

                { /* Footer */}
                {(primaryButton || secondaryButton !== undefined) && (
                    <div className="flex items-center justify-end gap-3 px-6 py-4 rounded-b-lg">
                        { /* Secondary Button (Left) */}
                        <button
                            onClick={secondaryBtn.onClick}
                            className={getButtonStyles(secondaryBtn.variant)}
                        >
                            {secondaryBtn.icon}
                            {secondaryBtn.text}
                        </button>

                        { /* Primary Button (Right) */}
                        {primaryButton && (
                            <button
                                onClick={primaryButton.onClick}
                                className={getButtonStyles(
                                    primaryButton.variant
                                )}
                            >
                                {primaryButton.icon}
                                {primaryButton.text}
                            </button>
                        )}
                    </div>
                )}
            </div>

            { /* Keyboard hint (only shown if closeOnEsc is enabled) */}
            {closeOnEsc && (
                <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
                    {__('To close this modal, press', 'productbay')}
                    <kbd className="mx-1 px-1.5 py-0.5 bg-black/40 rounded text-xs font-mono">Esc</kbd>
                </p>
            )}
        </div>,
        container
    );
};
