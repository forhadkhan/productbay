import { __ } from '@wordpress/i18n';
import { memo, useState } from 'react';
import { RotateCcwIcon } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { Skeleton } from '@/components/ui/Skeleton';
import { useSettingsStore } from '@/store/settingsStore';

interface ClearDataOptionsProps {
    loading: boolean;
}

/**
 * ClearDataOptions Component
 *
 * Settings section for completely resetting plugin data to default state.
 */
const ClearDataOptions = memo(({ loading }: ClearDataOptionsProps) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const { resetSettings, saving } = useSettingsStore();
    const { toast } = useToast();

    const handleReset = async () => {
        try {
            const result = await resetSettings();
            const deletedCount = result?.deleted_tables ?? 0;
            toast({
                title: __('Factory Reset Complete', 'productbay'),
                description: deletedCount > 0
                    ? `${deletedCount} ${deletedCount === 1 ? __('table', 'productbay') : __('tables', 'productbay')} ${__('deleted. All data has been reset to factory defaults. Reloading...', 'productbay')}`
                    : __('All data has been reset to factory defaults. Reloading...', 'productbay'),
                type: 'success',
            });
            setShowConfirmModal(false);
            setConfirmText('');

            // Reload after a brief delay so the user can see the toast
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            toast({
                title: __('Reset Failed', 'productbay'),
                description: __('Failed to reset plugin data. Please try again.', 'productbay'),
                type: 'error',
            });
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="p-6">
                <div className="h-7 w-40 bg-gray-200 rounded animate-pulse mb-6" />
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                    <div className="space-y-2">
                        <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <Skeleton className="h-10 w-32 rounded" />
                </div>
            </div>
        );
    }

    // Render the clear data options
    return (
        <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mt-0 mb-4">
                {__('Clear Data', 'productbay')}
            </h3>
            <div className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg">
                <div>
                    <span className="font-medium text-red-800">
                        {__('Reset to Factory Defaults', 'productbay')}
                    </span>
                    <p className="text-sm text-red-600 mt-1">
                        {__('This will permanently delete all saved tables, settings, styles, and configurations — restoring the plugin to its freshly installed state.', 'productbay')}
                    </p>
                </div>
                {/* Reset button */}
                <Button
                    variant="destructive"
                    onClick={() => setShowConfirmModal(true)}
                    disabled={saving}
                    title={__('Reset all data of ProductBay', 'productbay')}
                    className="flex-shrink-0 cursor-pointer"
                >
                    {__('Reset Data', 'productbay')}
                    <RotateCcwIcon className="w-4 h-4 ml-2" />
                </Button>
            </div>

            {/* Reset confirmation modal */}
            <Modal
                isOpen={showConfirmModal}
                onClose={() => {
                    setShowConfirmModal(false);
                    setConfirmText('');
                }}
                title={__('Reset All Plugin Data?', 'productbay')}
                maxWidth="sm"
                closeOnBackdropClick={true}
                primaryButton={{
                    text: saving ? __('Resetting...', 'productbay') : __('Yes, Reset Everything', 'productbay'),
                    onClick: handleReset,
                    variant: 'danger',
                    icon: <RotateCcwIcon className="w-4 h-4" />,
                    disabled: saving || confirmText !== 'RESET',
                }}
                secondaryButton={{
                    text: __('Cancel', 'productbay'),
                    onClick: () => {
                        setShowConfirmModal(false);
                        setConfirmText('');
                    },
                    variant: 'secondary',
                    disabled: saving
                }}
            >
                <div className="space-y-4">
                    <p className="text-gray-800 font-medium m-0">
                        {__('This action is irreversible.', 'productbay')}
                    </p>
                    <p className="text-gray-600 m-0 text-sm">
                        {__('This will delete all your saved tables and reset every setting to factory defaults. The plugin will return to its freshly installed state. This cannot be undone.', 'productbay')}
                    </p>
                    <div className="pt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {/* translators: %s is the word RESET */}
                            {__('Type "RESET" to confirm:', 'productbay')}
                        </label>
                        <Input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder={__('RESET', 'productbay')}
                            className="w-full"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
});

export default ClearDataOptions;
