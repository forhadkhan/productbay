import React from 'react';
import { __ } from '@wordpress/i18n';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2Icon, CopyIcon, ExternalLinkIcon, ArrowLeftIcon, ArrowRightIcon, CheckIcon } from 'lucide-react';
import { useTableStore } from '@/store/tableStore';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Button } from '@/components/ui/Button';
import { PATHS } from '@/utils/routes';
import { Confetti } from '@/components/ui/Confetti';

/* =============================================================================
 * WizardStepFinish
 * =============================================================================
 * Step 5: Success screen shown after table creation.
 * Designed to match the reference: large green checkmark, success message,
 * shortcode with copy button, and navigation buttons.
 * ============================================================================= */

interface WizardStepFinishProps {
    /** Callback to close the wizard dialog */
    onClose: () => void;
}

const WizardStepFinish: React.FC<WizardStepFinishProps> = ({ onClose }) => {
    const { tableId } = useTableStore();
    const { isCopied, copy: copyToClipboard } = useCopyToClipboard();
    const navigate = useNavigate();
    const [confettiKey, setConfettiKey] = React.useState(0);

    const shortcode = `[productbay id="${tableId}"]`;

    /**
     * Copy shortcode to clipboard
     */
    const handleCopy = () => {
        copyToClipboard(shortcode);
    };

    /**
     * Navigate to the table editor and close the wizard
     */
    const handleViewTable = () => {
        onClose();
        if (tableId) {
            navigate(PATHS.TABLE_EDITOR.replace(':id', tableId.toString()));
        }
    };

    /**
     * Navigate to tables list and close the wizard
     */
    const handleBackToDashboard = () => {
        onClose();
        navigate(PATHS.TABLES, { state: { refresh: Date.now() } });
    };

    return (
        <div className="flex flex-col items-center justify-center text-center py-8 px-4 max-w-lg mx-auto">
            <Confetti key={confettiKey} duration={5000} pieceCount={150} />

            {/* Success Checkmark */}
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <CheckCircle2Icon className="w-12 h-12 text-green-500" />
            </div>

            {/* Success Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {__('Table Created Successfully!', 'productbay')}
            </h2>

            {/* Description */}
            <p className="text-gray-500 mb-8">
                {__('Your ProductBay table is ready to be embedded on your website', 'productbay')}
            </p>

            {/* Shortcode Card */}
            <div className="w-full bg-white border border-gray-200 rounded-xl p-5 mb-8 shadow-sm">
                {/* Card Header */}
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-mono font-bold text-sm">&lt;/&gt;</span>
                    </div>
                    <div className="text-left">
                        <h3 className="text-sm font-semibold text-gray-900 m-0">
                            {__('Your Shortcode', 'productbay')}
                        </h3>
                        <p className="text-xs text-gray-500 m-0 mt-0.5">
                            {__('Copy and paste this code into any page or post', 'productbay')}
                        </p>
                    </div>
                </div>

                {/* Shortcode Display + Copy Button */}
                <div className="flex flex-col md:flex-row items-center gap-3">
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                        <code className="text-sm font-mono text-gray-800 bg-transparent select-all">
                            {shortcode}
                        </code>
                    </div>
                    <Button
                        size="default"
                        onClick={handleCopy}
                        className={`cursor-pointer text-white border-0 flex-shrink-0 transition-colors w-24 ${isCopied ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
                            }`}
                    >
                        {isCopied ? (
                            <>
                                <CheckIcon className="w-4 h-4 mr-1.5" />
                                {__('Copied!', 'productbay')}
                            </>
                        ) : (
                            <>
                                <CopyIcon className="w-4 h-4 mr-1.5" />
                                {__('Copy', 'productbay')}
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row items-center gap-4">
                <Button
                    size="lg"
                    onClick={handleViewTable}
                    className="cursor-pointer bg-green-500 hover:bg-green-600 font-medium text-white border-0 shiny-btn"
                >
                    {__('View/Edit this table', 'productbay')}
                    <ExternalLinkIcon className="w-4 h-4 ml-2" />
                </Button>
                <Button
                    size="lg"
                    variant="default"
                    onClick={handleBackToDashboard}
                    className="cursor-pointer border-0 font-medium shiny-btn"
                >
                    {__('Show all tables', 'productbay')}
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Button>
            </div>

            {/* Confetti */}
            <Button
                variant="outline"
                size="lg"
                onClick={() => setConfettiKey(prev => prev + 1)}
                className="mt-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
            >
                🎉
            </Button>
        </div>
    );
};

export default WizardStepFinish;
