import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { __ } from '@wordpress/i18n';
import { cn } from '@/utils/cn';
import { Button, ButtonProps } from './Button';

/**
 * Modal Component
 *
 * A reusable, modern modal dialog with header, body, and footer sections.
 * The modal is rendered into `#productbay-root` using React Portal and uses
 * fixed positioning to stay scoped within the plugin container.
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

    const container = document.getElementById(MODAL_CONTAINER_ID) || document.body;

    // Max width classes
    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    };

    // Helper to map ModalButton variant to Button variant
    const getButtonVariant = (variant: ModalButton['variant'] = 'primary'): ButtonProps['variant'] => {
        switch (variant) {
            case 'danger': return 'destructive';
            case 'success': return 'success';
            case 'secondary': return 'outline'; // Mapping secondary to outline for better contrast in new design
            default: return 'default';
        }
    };

    // Default secondary button
    const defaultSecondaryButton: ModalButton = {
        text: __('Cancel', 'productbay'),
        onClick: onClose,
        variant: 'secondary',
    };

    const secondaryBtn = secondaryButton || defaultSecondaryButton;

    return createPortal(
        <div
            className={cn(
                "fixed inset-0 z-[60000] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity animate-fade-in",
                "p-4" // Add padding to prevent touching edges on small screens
            )}
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className={cn(
                    "bg-white rounded-lg shadow-xl p-6 w-full mx-4 transform transition-all scale-100 animate-scale-in",
                    maxWidthClasses[maxWidth],
                    className
                )}
            >
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {title}
                </h3>

                <div className="text-gray-600 mb-6 text-sm leading-relaxed">
                    {children}
                </div>

                {(primaryButton || secondaryButton !== undefined) && (
                    <div className="flex justify-end gap-3">
                        {/* Secondary Button */}
                        <Button
                            variant={getButtonVariant(secondaryBtn.variant)}
                            onClick={secondaryBtn.onClick}
                            className={cn(secondaryBtn.variant === 'secondary' && "cursor-pointer bg-white border-gray-200 text-gray-700 hover:bg-gray-50")}
                        >
                            {secondaryBtn.icon && <span className="mr-2">{secondaryBtn.icon}</span>}
                            {secondaryBtn.text}
                        </Button>

                        {/* Primary Button */}
                        {primaryButton && (
                            <Button
                                variant={getButtonVariant(primaryButton.variant)}
                                onClick={primaryButton.onClick}
                                className="cursor-pointer"
                            >
                                {primaryButton.icon && <span className="mr-2">{primaryButton.icon}</span>}
                                {primaryButton.text}
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Keyboard hint (only shown if closeOnEsc is enabled) */}
            {closeOnEsc && (
                <p className="fixed bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70 pointer-events-none">
                    {__('To Close, Press', 'productbay')} <kbd className="mx-1 px-1.5 py-0.5 bg-black/40 rounded text-xs font-mono">Esc</kbd>
                </p>
            )}
        </div>,
        container
    );
};
