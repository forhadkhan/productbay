import React from 'react';
import { useTableStore } from '@/store/tableStore';
import { OptionsPanel } from '@/components/Table/panels/OptionsPanel';

/* =============================================================================
 * TabOptions Component
 * =============================================================================
 * Wrapper around OptionsPanel that connects it to the table store.
 * ============================================================================= */

const TabOptions: React.FC = () => {
    const {
        settings,
        setFeatures,
        setPagination,
        setCart,
    } = useTableStore();

    return (
        <OptionsPanel
            settings={settings}
            setFeatures={setFeatures}
            setPagination={setPagination}
            setCart={setCart}
        />
    );
};

export default TabOptions;