import { RadioIcon } from 'lucide-react';
import { __ } from '@wordpress/i18n';
import { cn } from '@/utils/cn';

export interface LivePreviewProps {
    className?: string;
}

/**
 * LivePreview Component
 *
 * Displays a live preview panel for table configuration.
 * Shows how the table will look with current settings.
 */
const LivePreview = ({ className }: LivePreviewProps) => {
    return (
        <div className={cn('w-full relative', className)}>
            {/* Header - positioned to overlap content border */}
            <div className="relative z-10 inline-flex items-center px-4 py-3 text-sm font-semibold bg-white rounded-t-lg border border-gray-200 border-b-white">
                <RadioIcon className="w-5 h-5 mr-2" />
                {__('Live Preview', 'productbay')}
            </div>
            {/* Content - border-top is hidden under header */}
            <div className="relative -mt-px px-4 py-3 text-sm font-medium bg-white rounded-b-lg rounded-tr-lg border border-gray-200">
                <p>{__('Live Preview Content', 'productbay')}</p>
            </div>
        </div>
    );
};

export default LivePreview;
