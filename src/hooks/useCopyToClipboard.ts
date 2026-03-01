import { __ } from '@wordpress/i18n';
import { useState, useCallback } from 'react';
import { useToast } from '@/context/ToastContext';

interface UseCopyToClipboardResult {
    isCopied: boolean;
    copy: (text: string, successMessage?: string) => Promise<boolean>;
}

/**
 * A reusable hook for copying text to the clipboard.
 * Includes a fallback for Safari/macOS or non-HTTPS environments
 * where navigator.clipboard might be undefined.
 * 
 * @since 1.0.0
 */
export const useCopyToClipboard = (): UseCopyToClipboardResult => {
    const [isCopied, setIsCopied] = useState(false);
    const { toast } = useToast();

    const copy = useCallback(
        async (text: string, successMessage?: string) => {
            let success = false;

            // Try the modern Clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
                try {
                    await navigator.clipboard.writeText(text);
                    success = true;
                } catch (error) {
                    console.warn('Clipboard API failed, trying fallback...', error);
                }
            }

            // Fallback for Safari/macOS in non-secure contexts
            if (!success) {
                try {
                    // Create a temporary textarea element
                    const textArea = document.createElement('textarea');
                    textArea.value = text;

                    // Move it off-screen
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    textArea.style.top = '-999999px';

                    document.body.appendChild(textArea);

                    // Select and copy
                    textArea.focus();
                    textArea.select();

                    success = document.execCommand('copy');

                    // Cleanup
                    textArea.remove();
                } catch (error) {
                    console.error('Fallback clipboard copy failed:', error);
                    success = false;
                }
            }

            if (success) {
                setIsCopied(true);
                toast({
                    title: __('Copied', 'productbay'),
                    description: successMessage || __('Text copied to clipboard', 'productbay'),
                    type: 'success',
                });

                // Reset the copied state after 2 seconds
                setTimeout(() => {
                    setIsCopied(false);
                }, 2000);

                return true;
            } else {
                toast({
                    title: __('Error', 'productbay'),
                    description: __('Failed to copy to clipboard. Please copy manually.', 'productbay'),
                    type: 'error',
                });
                return false;
            }
        },
        [toast]
    );

    return { isCopied, copy };
};
