import React from 'react';
import { __ } from '@wordpress/i18n';
import { useTableStore } from '@/store/tableStore';
import ColumnEditor from '@/components/Table/sections/ColumnEditor';
import { BulkSelectConfig } from '@/components/Table/sections/BulkSelectConfig';
import SectionHeading from '@/components/Table/SectionHeading';
import LivePreview from '@/components/Table/LivePreview';

/* =============================================================================
 * WizardStepColumns
 * =============================================================================
 * Step 2: Column selection with live preview.
 * Two-column layout: column editor on the left, live preview on the right.
 * ============================================================================= */

const WizardStepColumns: React.FC = () => {
    const {
        columns,
        addColumn,
        reorderColumns,
        removeColumn,
        updateColumn,
        settings,
        setFeatures,
    } = useTableStore();

    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left: Column Editor */}
            <div className="lg:col-span-3 space-y-6">
                <section className="px-2">
                    <SectionHeading
                        title={__('Table Columns', 'productbay')}
                        description={__('Configure which columns to display and their order', 'productbay')}
                        isRequired={true}
                    />
                    <ColumnEditor
                        columns={columns}
                        onAddColumn={addColumn}
                        onReorderColumns={reorderColumns}
                        onRemoveColumn={removeColumn}
                        onUpdateColumn={updateColumn}
                    />
                </section>

                <section className="px-2">
                    <BulkSelectConfig
                        value={settings.features.bulkSelect}
                        onChange={(config) => setFeatures({ bulkSelect: config })}
                    />
                </section>
            </div>

            {/* Right: Live Preview */}
            <div className="lg:col-span-2">
                <LivePreview className="sticky top-4" />
            </div>
        </div>
    );
};

export default WizardStepColumns;
