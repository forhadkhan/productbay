import { RadioIcon, LoaderIcon, AlertCircleIcon, Maximize2Icon, XIcon } from 'lucide-react';
import { __ } from '@wordpress/i18n';
import { cn } from '@/utils/cn';
import { useTableStore } from '@/store/tableStore';
import { useDebounce } from '@/hooks/useDebounce';
import { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { apiFetch } from '@/utils/api';
import { Button } from '../ui/Button';

export interface LivePreviewProps {
    className?: string;
}

interface PreviewResponse {
    html: string;
}

/**
 * LivePreview Component
 *
 * Displays a live preview panel for table configuration.
 * Fetches server-side rendered HTML based on current store state.
 * Supports scaling down content to fit container and full-screen mode.
 */
const LivePreview = ({ className }: LivePreviewProps) => {
    // Select specific parts of the store to construct the payload
    // We use useTableStore() to get the whole state, but we only care about specific fields for the payload.
    // However, basic useTableStore() triggers re-render on ANY change.
    // To optimize, we can pick specific fields, but since we need almost everything (settings, style, columns, source),
    // subscribing to the whole store is acceptable for now, or we can rely on debouncing to prevent excessive API calls.
    const {
        tableId,
        tableTitle,
        tableStatus,
        source,
        columns,
        settings,
        style
    } = useTableStore();

    // Memoize the payload to avoid effect triggering on every render if deep values haven't changed
    // (Though structured objects like source/style are likely new references on every change anyway)
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
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Scaling State
    const [scale, setScale] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);
    const DESKTOP_WIDTH = 1200; // Standard desktop width to emulate

    // Effect to fetch preview when debounced payload changes
    useEffect(() => {
        let isMounted = true;

        const fetchPreview = async () => {
            setLoading(true);
            setError(null);

            try {
                // Determine API path
                // POST to productbay/v1/preview
                const response = await apiFetch<PreviewResponse>('preview', {
                    method: 'POST',
                    body: JSON.stringify({ data: debouncedPayload })
                });

                if (isMounted) {
                    if (response && typeof response.html === 'string') {
                        setHtml(response.html);
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

    // Handle Scaling
    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const { width } = containerRef.current.getBoundingClientRect();
                // Scale down if container is smaller than desktop width
                // If container is larger, we can keep scale at 1 or scale up (usually just 1)
                const newScale = width < DESKTOP_WIDTH ? width / DESKTOP_WIDTH : 1;
                setScale(newScale);
            }
        };

        updateScale(); // Initial call

        // Use ResizeObserver for responsive updates
        const observer = new ResizeObserver(updateScale);
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Helper to render content with dangerouslySetInnerHTML
    // Injected CSS ensures the table takes full width of the wrapper
    const renderContent = () => (
        <div className="w-full h-full [&_table]:w-full [&_.productbay-wrapper]:w-full" dangerouslySetInnerHTML={{ __html: html }} />
    );

    return (
        <div className={cn('w-full relative flex flex-col', className)}>
            {/* Header */}
            <div className="flex gap-2 items-center justify-between mb-0"> {/* Adjusted margin and alignment */}
                <div className="relative z-10 inline-flex items-center px-4 py-3 text-sm font-semibold bg-white rounded-t-lg border border-gray-200 border-b-white w-fit">
                    <RadioIcon className={cn("w-5 h-5 mr-2", loading ? "animate-pulse text-blue-500" : "")} />
                    {__('Live Preview', 'productbay')}
                    {loading && <span className="ml-2 text-xs text-blue-500 font-normal">({__('Updating...', 'productbay')})</span>}
                </div>
                {/* Header Actions - Positioned to align with tab style or just floating */}
                <div className="mb-px">
                    <Button
                        title={__('Full Screen', 'productbay')}
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsFullscreen(true)}
                        className="hover:bg-gray-100"
                    >
                        <Maximize2Icon className="w-5 h-5 text-gray-500" />
                    </Button>
                </div>
            </div>

            {/* Content Area */}
            <div className="relative -mt-px flex-1 min-h-[400px] bg-white rounded-b-lg rounded-tr-lg border border-gray-200 overflow-hidden">
                {/* 
                  Container for the preview content. 
                  We use a wrapper div to isolate styles if needed, though TableRenderer generates scoped styles.
                  The overflow-auto handles tables that are too wide.
                */}
                <div className="w-full h-full p-4 bg-gray-50/50 relative overflow-hidden">
                    {error ? (
                        <div className="flex flex-col items-center justify-center h-full text-red-500">
                            <AlertCircleIcon className="w-8 h-8 mb-2" />
                            <p>{error}</p>
                        </div>
                    ) : html ? (
                        // Wrapper for scaling
                        // We remove overflow-auto here because we are scaling to fit.
                        <div ref={containerRef} className="w-full h-full origin-top-left">
                            <div
                                style={{
                                    width: `${DESKTOP_WIDTH}px`, // Force desktop width
                                    transform: `scale(${scale})`,
                                    transformOrigin: 'top left',
                                    height: '100%' // Ensure it takes height for background
                                }}
                            >
                                {renderContent()}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            {loading ? <LoaderIcon className="w-8 h-8 animate-spin" /> : <p>{__('Loading preview...', 'productbay')}</p>}
                        </div>
                    )}
                </div>
            </div>

            {/* Full Screen Modal */}
            {isFullscreen && createPortal(
                <div className="fixed inset-0 z-[100000] bg-gray-100/95 backdrop-blur-sm flex flex-col animate-in fade-in duration-200" style={{ zIndex: 100000 }}>
                    {/* Full Screen Header */}
                    <div className="flex items-center justify-between bg-white px-6 py-4 shadow-sm border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <RadioIcon className="w-6 h-6 text-blue-600" />
                            <h2 className="text-lg font-bold text-gray-800">{__('Desktop Preview', 'productbay')}</h2>
                            <span className="text-sm text-gray-500 px-3 py-1 bg-gray-100 rounded-full">
                                {__('Standard View', 'productbay')}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={() => setIsFullscreen(false)}
                            className="hover:bg-red-50 hover:text-red-500"
                        >
                            <XIcon className="w-6 h-6" />
                            <span className="sr-only">{__('Close', 'productbay')}</span>
                        </Button>
                    </div>

                    {/* Full Screen Content */}
                    <div className="flex-1 overflow-auto p-8">
                        {/* Centered Container for the Table */}
                        <div className="max-w-[1280px] mx-auto bg-white min-h-[200px] shadow-lg rounded-lg p-8">
                            {html ? renderContent() : (
                                <div className="flex items-center justify-center h-64 text-gray-400">
                                    <LoaderIcon className="w-12 h-12 animate-spin" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default LivePreview;
