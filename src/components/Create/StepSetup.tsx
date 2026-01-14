import React from 'react';
import { Input } from '../ui/Input';
import { useTableStore } from '../../store/tableStore';

const StepSetup = () => {
    const { tableData, setTableData } = useTableStore();

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Table Name</label>
                <Input
                    type="text"
                    value={tableData.title}
                    onChange={(e) => setTableData({ title: e.target.value })}
                    placeholder="e.g. Summer Sale Products"
                />
                <p className="mt-1 text-sm text-gray-500">Give your table a descriptive name for internal use.</p>
            </div>
        </div>
    );
};

export default StepSetup;
