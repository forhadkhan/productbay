
import { RadioIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface LivePreviewProps {
    className?: string;
}

const LivePreview = ({ className }: LivePreviewProps) => {
    return (
        <div className={cn('w-full relative', className)}>
            {/* Header - positioned to overlap content border */}
            <div className="relative z-10 inline-flex items-center px-4 py-3 text-sm font-semibold bg-white rounded-t-lg border border-gray-200 border-b-white">
                <RadioIcon className="w-5 h-5 mr-2" />
                Live Preview
            </div>
            {/* Content - border-top is hidden under header */}
            <div className="relative -mt-px px-4 py-3 text-sm font-medium bg-white rounded-b-lg rounded-tr-lg border border-gray-200">
                <p>Live Preview Content</p>
            </div>
        </div>
    );
};

export default LivePreview;
