import { RadioIcon, LoaderIcon, AlertCircleIcon, Maximize2Icon, XIcon, Monitor, Tablet, Smartphone } from 'lucide-react';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import ProductBayIcon from '@/components/ui/ProductBayIcon';
import { useTableStore } from '@/store/tableStore';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { Modal } from '@/components/ui/Modal';
import { apiFetch } from '@/utils/api';
import { __ } from '@wordpress/i18n';
import { cn } from '@/utils/cn';

export interface LivePreviewProps {
    className?: string;
}

interface PreviewResponse {
    html: string;
    cssUrl: string;
}

/**
 * Inline JS injected into the preview iframe.
 *
 * Handles:
 * - Bulk select: checkbox changes update the "Add to Cart" button text with
 *   the total count and price of selected products.
 * - Select all: toggles all product checkboxes.
 * - Add to Cart: sends a postMessage to the parent React app (which shows a toast).
 * - Auto-resize: posts the document height so the parent can resize the iframe.
 * - Link intercept: prevents navigation when clicking product links in the preview.
 */
const IFRAME_SCRIPT = `
<script>
(function() {
    var selectedProducts = {};

    /**
     * Recalculate selected count/total and update the bulk button text.
     */
    function updateBulkButton() {
        var btn = document.querySelector('.productbay-btn-bulk');
        if (!btn) return;

        var keys = Object.keys(selectedProducts);
        var count = keys.length;
        var total = 0;
        keys.forEach(function(k) { total += selectedProducts[k]; });

        if (count > 0) {
            btn.textContent = 'Add ' + count + ' item' + (count > 1 ? 's' : '') + ' for $' + total.toFixed(2);
            btn.disabled = false;
        } else {
            btn.innerHTML = '<span class="dashicons dashicons-cart"></span> Add to Cart';
            btn.disabled = true;
        }
    }

    /**
     * Post the current document height to the parent so it can resize the iframe.
     */
    function postHeight() {
        var h = document.documentElement.scrollHeight;
        window.parent.postMessage({ type: 'resize', height: h }, '*');
    }

    // --- Event Delegation ---
    document.addEventListener('change', function(e) {
        var target = e.target;

        // Select All checkbox
        if (target.classList.contains('productbay-select-all')) {
            var boxes = document.querySelectorAll('.productbay-select-product');
            for (var i = 0; i < boxes.length; i++) {
                boxes[i].checked = target.checked;
                var id = boxes[i].value;
                var price = parseFloat(boxes[i].getAttribute('data-price') || '0');
                if (target.checked) {
                    selectedProducts[id] = price;
                } else {
                    delete selectedProducts[id];
                }
            }
            updateBulkButton();
            return;
        }

        // Individual product checkbox
        if (target.classList.contains('productbay-select-product')) {
            var id = target.value;
            var price = parseFloat(target.getAttribute('data-price') || '0');
            if (target.checked) {
                selectedProducts[id] = price;
            } else {
                delete selectedProducts[id];
                // Uncheck "Select All" when any individual is unchecked
                var selectAll = document.querySelector('.productbay-select-all');
                if (selectAll) selectAll.checked = false;
            }
            updateBulkButton();
        }
    });

    // Add to Cart click — notify parent via postMessage
    document.addEventListener('click', function(e) {
        var btn = e.target.closest('.productbay-btn-bulk');
        if (btn) {
            e.preventDefault();
            if (Object.keys(selectedProducts).length === 0) return;
            var ids = Object.keys(selectedProducts);
            window.parent.postMessage({ type: 'addToCart', productIds: ids }, '*');
        }

        // Intercept all anchor clicks to prevent navigation inside the preview
        var anchor = e.target.closest('a');
        if (anchor) {
            e.preventDefault();
        }
    });

    // Auto-resize on load and on any DOM mutation
    window.addEventListener('load', postHeight);
    var observer = new MutationObserver(postHeight);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial height post after a short delay to ensure rendering is complete
    setTimeout(postHeight, 100);
})();
</script>
`;

/**
 * Build a complete HTML document string for the preview iframe.
 *
 * Combines:
 * - A CSS reset to avoid browser default inconsistencies
 * - The frontend stylesheet via <link> for base table styles
 * - The TableRenderer HTML output (which includes its own <style> block)
 * - The interactivity script for bulk select & postMessage communication
 *
 * @param html  - The rendered HTML from TableRenderer.php
 * @param cssUrl - The URL to the frontend.css stylesheet
 */
const buildSrcdoc = (html: string, cssUrl: string): string => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="${cssUrl}" />
    <style>
        /* Minimal reset so only our styles apply */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            font-size: 14px;
            color: #334155;
            background: transparent;
            padding: 16px;
            overflow-x: hidden;
        }
        /* Ensure the wrapper fills the iframe width */
        .productbay-wrapper { width: 100%; }
        table { width: 100%; }
    </style>
</head>
<body>
    ${html}
    ${IFRAME_SCRIPT}
</body>
</html>
`;

const DEVICE_WIDTHS = {
    desktop: 1200,
    tablet: 768,
    mobile: 375,
};

/**
 * LivePreview Component
 *
 * Displays a live preview panel for table configuration.
 * Fetches server-side rendered HTML based on current store state and renders
 * it inside an iframe for complete CSS isolation from the admin panel.
 *
 * Features:
 * - Iframe-based rendering: only TableRenderer styles and frontend.css apply
 * - Interactive bulk select: updates product count & total price
 * - Toast notification on "Add to Cart" click (no redirect)
 * - Auto-resizing iframe height
 * - Full-screen modal support
 * - Device switcher (Desktop, Tablet, Mobile)
 * - Responsive scaling for smaller containers
 */
const LivePreview = ({ className }: LivePreviewProps) => {
    const {
        tableId,
        tableTitle,
        tableStatus,
        source,
        columns,
        settings,
        style
    } = useTableStore();

    const { toast } = useToast();

    // Memoize the payload to avoid effect triggering on every render
    const payload = useMemo(() => ({
        id: tableId,
        title: tableTitle,
        status: tableStatus,
        source,
        columns,
        settings,
        style
    }), [tableId, tableTitle, tableStatus, source, columns, settings, style]);

    // Debounce the payload to avoid flooding the API
    const debouncedPayload = useDebounce(payload, 500);

    const [html, setHtml] = useState<string>('');
    const [cssUrl, setCssUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Iframe height tracking (auto-resize based on content)
    const [iframeHeight, setIframeHeight] = useState(400);

    // Scaling State
    const [scale, setScale] = useState(1);
    const [activeDevice, setActiveDevice] = useState<keyof typeof DEVICE_WIDTHS>('desktop');
    const containerRef = useRef<HTMLDivElement>(null);

    // Effect to fetch preview when debounced payload changes
    useEffect(() => {
        let isMounted = true;

        const fetchPreview = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await apiFetch<PreviewResponse>('preview', {
                    method: 'POST',
                    body: JSON.stringify({ data: debouncedPayload })
                });

                if (isMounted) {
                    if (response && typeof response.html === 'string') {
                        setHtml(response.html);
                        if (response.cssUrl) setCssUrl(response.cssUrl);
                    } else {
                        throw new Error('Invalid response format');
                    }
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'Failed to load preview');
                    console.error('Preview Error:', err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchPreview();

        return () => {
            isMounted = false;
        };
    }, [debouncedPayload]);

    /**
     * Listen for postMessage events from the preview iframe.
     * Handles:
     * - 'resize': auto-resize iframe height to match content
     * - 'addToCart': show a toast notification (no redirect)
     */
    const handleMessage = useCallback((event: MessageEvent) => {
        const data = event.data;
        if (!data || typeof data !== 'object') return;

        if (data.type === 'resize' && typeof data.height === 'number') {
            setIframeHeight(data.height);
        }

        if (data.type === 'addToCart' && Array.isArray(data.productIds)) {
            const count = data.productIds.length;
            toast({
                title: __('Preview Only', 'productbay'),
                description: `${count} product${count > 1 ? 's' : ''} would be added to cart. Save and use the shortcode to enable real Add to Cart.`,
                type: 'info',
                duration: 4000,
            });
        }
    }, [toast]);

    useEffect(() => {
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [handleMessage]);

    // Handle Scaling for the inline (non-fullscreen) preview
    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const { width } = containerRef.current.getBoundingClientRect();
                const targetWidth = DEVICE_WIDTHS[activeDevice];
                const newScale = width < targetWidth ? width / targetWidth : 1;
                setScale(newScale);
            }
        };

        updateScale();

        const observer = new ResizeObserver(updateScale);
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [activeDevice]);

    // Build the srcdoc string for the iframe (memoized to avoid re-renders)
    const srcdoc = useMemo(() => {
        if (!html || !cssUrl) return '';
        return buildSrcdoc(html, cssUrl);
    }, [html, cssUrl]);

    /**
     * Render the isolated iframe preview.
     * Uses srcdoc to inject a complete HTML document with only the frontend
     * stylesheet and TableRenderer output — no admin/Tailwind CSS leaks.
     *
     * @param fullWidth - If true, renders at full width (for fullscreen modal)
     */
    const renderIframe = (fullWidth = false) => {
        const targetWidth = DEVICE_WIDTHS[activeDevice];

        return (
            <iframe
                srcDoc={srcdoc}
                title={__('Table Preview', 'productbay')}
                style={{
                    width: fullWidth ? (activeDevice === 'desktop' ? '100%' : `${targetWidth}px`) : `${targetWidth}px`,
                    height: `${iframeHeight + 32}px`, // +32px for body padding
                    border: 'none',
                    display: 'block',
                    margin: fullWidth ? '0 auto' : '0',
                    ...(fullWidth ? {} : {
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                    }),
                }}
                sandbox="allow-scripts"
            />
        );
    };

    /**
     * Renders the device selection toggle buttons.
     */
    const DeviceSwitcher = ({ showLabels = false }: { showLabels?: boolean }) => (
        <div className="flex items-center gap-0.5 bg-gray-100 p-1 rounded-md border border-gray-200">
            <button
                onClick={() => setActiveDevice('desktop')}
                className={cn(
                    "flex items-center gap-2 p-1 px-2 rounded transition-colors cursor-pointer",
                    activeDevice === 'desktop' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                )}
                title={__('Desktop View', 'productbay')}
            >
                <Monitor className="w-3.5 h-3.5" />
                {showLabels && <span className="text-[10px] font-bold uppercase tracking-wider">{__('Desktop', 'productbay')}</span>}
            </button>
            <button
                onClick={() => setActiveDevice('tablet')}
                className={cn(
                    "flex items-center gap-2 p-1 px-2 rounded transition-colors cursor-pointer",
                    activeDevice === 'tablet' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                )}
                title={__('Tablet View', 'productbay')}
            >
                <Tablet className="w-3.5 h-3.5" />
                {showLabels && <span className="text-[10px] font-bold uppercase tracking-wider">{__('Tablet', 'productbay')}</span>}
            </button>
            <button
                onClick={() => setActiveDevice('mobile')}
                className={cn(
                    "flex items-center gap-2 p-1 px-2 rounded transition-colors cursor-pointer",
                    activeDevice === 'mobile' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                )}
                title={__('Mobile View', 'productbay')}
            >
                <Smartphone className="w-3.5 h-3.5" />
                {showLabels && <span className="text-[10px] font-bold uppercase tracking-wider">{__('Mobile', 'productbay')}</span>}
            </button>
        </div>
    );

    return (
        <div className={cn('w-full relative flex flex-col', className)}>
            {/* Header */}
            <div className="flex gap-2 items-center justify-between mb-0">
                <div className="relative z-10 inline-flex items-center px-4 py-3 text-sm font-semibold bg-white rounded-t-lg border border-gray-200 border-b-white w-fit">
                    <RadioIcon className={cn("w-5 h-5 mr-2", loading ? "animate-pulse text-blue-500" : "")} />
                    {__('Live Preview', 'productbay')}
                </div>
                {/* Header Actions */}
                <div className="mb-px flex items-center gap-3">
                    <DeviceSwitcher />
                    <Button
                        title={__('Full Screen', 'productbay')}
                        variant="ghost"
                        onClick={() => setIsFullscreen(true)}
                        className="hover:bg-gray-100 cursor-pointer p-2"
                    >
                        <Maximize2Icon className="w-5 h-5 text-gray-500" />
                    </Button>
                </div>
            </div>

            {/* Content Area */}
            <div className="relative -mt-px flex-1 min-h-[400px] bg-white rounded-b-lg rounded-tr-lg border border-gray-200 overflow-hidden">
                <div className="w-full h-full p-4 bg-gray-50/50 relative overflow-hidden">
                    {error ? (
                        <div className="flex flex-col items-center justify-center h-full text-red-500">
                            <AlertCircleIcon className="w-8 h-8 mb-2" />
                            <p>{error}</p>
                        </div>
                    ) : srcdoc ? (
                        /* Wrapper for scaling — iframe renders at DESKTOP_WIDTH then scales down */
                        <div ref={containerRef} className="w-full h-full origin-top-left">
                            {renderIframe()}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            {loading ? <LoaderIcon className="w-8 h-8 animate-spin" /> : <p>{__('Loading preview...', 'productbay')}</p>}
                        </div>
                    )}
                </div>
            </div>

            {/* Full Screen Modal */}
            <Modal
                isOpen={isFullscreen}
                onClose={() => setIsFullscreen(false)}
                fullScreen
                hideFooter
                header={(
                    <div className="flex items-center justify-between bg-white px-6 py-4 mt-8 shadow-sm border-b border-gray-200">
                        {/* Title and Icon */}
                        <div className="flex items-center gap-3 flex-1">
                            <RadioIcon className="w-6 h-6 text-blue-600" />
                            <h2 className="text-lg font-bold text-gray-800 m-0">{__('Table Preview', 'productbay')}</h2>
                        </div>

                        {/* Centered Device Switcher */}
                        <div className="flex-1 flex justify-center">
                            <DeviceSwitcher showLabels />
                        </div>

                        {/* Close Button */}
                        <div className="flex-1 flex justify-end">
                            <Button
                                variant="ghost"
                                onClick={() => setIsFullscreen(false)}
                                className="bg-transparent hover:bg-red-50 cursor-pointer p-2 rounded-full"
                            >
                                <XIcon className="w-6 h-6" />
                                <span className="sr-only">{__('Close', 'productbay')}</span>
                            </Button>
                        </div>
                    </div>
                )}
            >
                <div className="bg-gray-100/95 backdrop-blur-sm min-h-full p-2 md:p-4 xl:p-6 flex flex-col">
                    {/* Centered Container for the Table */}
                    <div className="max-w-[1280px] w-full mx-auto bg-white min-h-[200px] rounded-lg p-2 xl:p-4">
                        {srcdoc ? renderIframe(true) : (
                            <div className="flex items-center justify-center h-64 text-gray-400">
                                <ProductBayIcon className="animate-pulse size-12" />
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default LivePreview;
