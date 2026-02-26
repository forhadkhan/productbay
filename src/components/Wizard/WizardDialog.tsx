import React, { useState, useCallback } from 'react';
import { __ } from '@wordpress/i18n';
import { XIcon, ArrowRightIcon, ArrowLeftIcon, LoaderIcon } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useTableStore } from '@/store/tableStore';
import { useToast } from '@/context/ToastContext';
import { Stepper2 } from '@/components/ui/Stepper';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

import WizardStepSetup from './WizardStepSetup';
import WizardStepColumns from './WizardStepColumns';
import WizardStepDisplay from './WizardStepDisplay';
import WizardStepOptions from './WizardStepOptions';
import WizardStepFinish from './WizardStepFinish';

/* =============================================================================
 * WizardDialog
 * =============================================================================
 * Full-screen wizard dialog for guided table creation.
 * Orchestrates 5 steps: Setup → Columns → Display → Options → Finish.
 *
 * - Uses the existing Stepper component for progress indication
 * - Saves the table automatically when reaching the Finish step
 * - All state is managed via useTableStore (Zustand)
 * ============================================================================= */

/** Step labels for the stepper */
const WIZARD_STEPS = [
    __('Setup', 'productbay'),
    __('Columns', 'productbay'),
    __('Display', 'productbay'),
    __('Options', 'productbay'),
    __('Finish', 'productbay'),
];

/** Step subtitles shown below the main title */
const STEP_DESCRIPTIONS: Record<number, string> = {
    1: __('Name your table and choose a product source', 'productbay'),
    2: __('Select and configure the columns for your table', 'productbay'),
    3: __('Customize colors, layout, and typography', 'productbay'),
    4: __('Configure search, pagination, and cart options', 'productbay'),
    5: __('Your table is ready!', 'productbay'),
};

interface WizardDialogProps {
    /** Controls dialog visibility */
    isOpen: boolean;
    /** Callback to close the dialog */
    onClose: () => void;
}

const WizardDialog: React.FC<WizardDialogProps> = ({ isOpen, onClose }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [titleError, setTitleError] = useState<string | undefined>(undefined);
    const [isSaving, setIsSaving] = useState(false);

    const { tableTitle, saveTable, error } = useTableStore();
    const { toast } = useToast();

    /**
     * Validate and move to the next step.
     * On step 4 → 5: auto-save the table before showing the Finish screen.
     */
    const handleNext = useCallback(async () => {
        // Step 1 validation: table name is required
        if (currentStep === 1 && !tableTitle.trim()) {
            setTitleError(__('Table name is required.', 'productbay'));
            return;
        }

        // On the last config step, save before showing Finish
        if (currentStep === 4) {
            setIsSaving(true);
            const success = await saveTable();
            setIsSaving(false);

            if (success) {
                toast({
                    title: __('Success', 'productbay'),
                    description: __('Table saved successfully.', 'productbay'),
                    type: 'success',
                });
                setCurrentStep(5);
            } else {
                toast({
                    title: __('Error', 'productbay'),
                    description: error || __('Failed to save table.', 'productbay'),
                    type: 'error',
                });
            }
            return;
        }

        setCurrentStep((prev) => Math.min(prev + 1, 5));
    }, [currentStep, tableTitle, saveTable, error, toast]);

    /**
     * Move to the previous step.
     */
    const handleBack = useCallback(() => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    }, []);

    /**
     * Handle clicking a completed step in the stepper to navigate back.
     */
    const handleStepClick = useCallback(
        (stepIndex: number) => {
            const targetStep = stepIndex + 1;
            // Allow clicking on completed steps only (not future or the finish step)
            if (targetStep < currentStep && currentStep !== 5) {
                setCurrentStep(targetStep);
            }
        },
        [currentStep]
    );

    /**
     * Close the wizard and reset.
     */
    const handleClose = useCallback(() => {
        setCurrentStep(1);
        setTitleError(undefined);
        onClose();
    }, [onClose]);

    if (!isOpen) return null;

    const container = document.getElementById('productbay-root') || document.body;

    return createPortal(
        <div className="fixed inset-0 z-[60000] bg-black/65 flex items-center justify-center">
            <div className="relative max-w-7xl w-full max-h-[90vh] h-full overflow-y-auto flex flex-col bg-white rounded-lg border border-gray-200 shadow-xl mx-4">

                {/* ================================================================
			 * Header: Step Title + Close Button
			 * ================================================================ */}
                <div className="flex-shrink-0 border-b border-gray-200 bg-white">
                    {/* Top bar with close button */}
                    <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row gap-2 md:items-center">
                            <h2 className="text-lg font-bold text-gray-900 m-0">
                                {WIZARD_STEPS[currentStep - 1]}
                            </h2>
                            {/* Step description */}
                            <p className="md:border-l md:border-gray-200 md:pl-2 text-sm text-gray-500 m-0">
                                {STEP_DESCRIPTIONS[currentStep]}
                            </p>
                        </div>
                        {currentStep !== 5 && (
                            <button
                                onClick={handleClose}
                                title={__('Close wizard', 'productbay')}
                                aria-label={__('Close wizard', 'productbay')}
                                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-red-100 transition-colors cursor-pointer"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Stepper */}
                    <div className="px-6 pb-2">
                        <Stepper2
                            steps={WIZARD_STEPS}
                            currentStep={currentStep}
                            onStepClick={currentStep !== 5 ? handleStepClick : undefined}
                        />
                    </div>


                </div>

                {/* ================================================================
			 * Body: Step Content (scrollable)
			 * ================================================================ */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                    {currentStep === 1 && (
                        <WizardStepSetup
                            titleError={titleError}
                            onTitleErrorClear={() => setTitleError(undefined)}
                        />
                    )}
                    {currentStep === 2 && <WizardStepColumns />}
                    {currentStep === 3 && <WizardStepDisplay />}
                    {currentStep === 4 && <WizardStepOptions />}
                    {currentStep === 5 && <WizardStepFinish onClose={handleClose} />}
                </div>

                {/* ================================================================
			 * Footer: Navigation Buttons (hidden on Finish step)
			 * ================================================================ */}
                {currentStep !== 5 && (
                    <div className="flex-shrink-0 border-t border-gray-200 bg-white px-6 py-4">
                        <div className="flex items-center justify-between max-w-7xl mx-auto">
                            {/* Back Button */}
                            <div>
                                {currentStep > 1 && (
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        onClick={handleBack}
                                        className="cursor-pointer"
                                    >
                                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                        {__('Back', 'productbay')}
                                    </Button>
                                )}
                            </div>

                            {/* Next / Create Button */}
                            <Button
                                size="lg"
                                onClick={handleNext}
                                disabled={isSaving}
                                className={cn(
                                    'cursor-pointer min-w-[140px] flex items-center justify-center',
                                    isSaving && 'opacity-75 cursor-wait'
                                )}
                            >
                                {currentStep === 4 ? (
                                    <>
                                        {isSaving
                                            ? __('Creating...', 'productbay')
                                            : __('Create Table', 'productbay')
                                        }
                                        {isSaving ? (
                                            <LoaderIcon className="w-4 h-4 ml-2 animate-spin" />
                                        ) : (
                                            <ArrowRightIcon className="w-4 h-4 ml-2" />
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {__('Next', 'productbay')}
                                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>,
        container
    );
};

export default WizardDialog;
