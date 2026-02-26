import React from 'react';
import { useTableStore } from '@/store/tableStore';
import { OptionsPanel } from '@/components/Table/panels/OptionsPanel';
import LivePreview from '@/components/Table/LivePreview';

/* =============================================================================
 * WizardStepOptions
 * =============================================================================
 * Step 4: Options configuration (search, pagination, cart settings)
 * with live preview side by side.
 * ============================================================================= */

const WizardStepOptions: React.FC = () => {
    const {
        settings,
        setFeatures,
        setPagination,
        setCart,
    } = useTableStore();

    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left: Options Config */}
            <div className="lg:col-span-3">
                <OptionsPanel
                    settings={settings}
                    setFeatures={setFeatures}
                    setPagination={setPagination}
                    setCart={setCart}
                />
            </div>

            {/* Right: Live Preview */}
            <div className="lg:col-span-2 min-w-0">
                <LivePreview className="sticky top-4" />
            </div>
        </div>
    );
};

export default WizardStepOptions;
