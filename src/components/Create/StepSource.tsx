import React from 'react';
import { useTableStore } from '../../store/tableStore';

interface StepProps {
    showValidation?: boolean;
}

const StepSource = ({ showValidation }: StepProps) => {
    const { tableData, setTableData } = useTableStore();

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Products Source</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['all', 'category', 'specific'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setTableData({ source_type: type })}
                            className={`p-4 border rounded-lg text-left transition-all ${tableData.source_type === type
                                ? 'border-blue-500 ring-2 ring-blue-50 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                }`}
                        >
                            <div className="font-semibold capitalize text-gray-900">{type === 'all' ? 'All Products' : type}</div>
                            <div className="text-sm text-gray-500 mt-1">
                                {type === 'all' && 'Display all published products from your store.'}
                                {type === 'category' && 'Select specific categories or tags to display.'}
                                {type === 'specific' && 'Manually select individual products.'}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {tableData.source_type === 'category' && (
                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm border border-yellow-200">
                    Category Selection Component will go here.
                </div>
            )}
            {tableData.source_type === 'specific' && (
                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm border border-yellow-200">
                    Product Search Component will go here.
                </div>
            )}
        </div>
    );
};

export default StepSource;
