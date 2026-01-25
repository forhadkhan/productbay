import React from 'react';

interface StepProps {
    showValidation?: boolean;
}

const StepSearch = ({ showValidation }: StepProps) => {
    return (
        <div className="space-y-6">
            <div className="p-4 border rounded-lg">
                <label className="block text-sm font-medium mb-2">Default Sort Order</label>
                <select className="w-full border-gray-300 rounded-md">
                    <option>Newest First</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Name: A to Z</option>
                </select>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                    <h3 className="font-medium">Enable Search Box</h3>
                    <p className="text-sm text-gray-500">Allow users to search within the table.</p>
                </div>
                <input type="checkbox" className="toggle" defaultChecked />
            </div>
        </div>
    );
};

export default StepSearch;
