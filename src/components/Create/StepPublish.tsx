import React from 'react';
import { SaveIcon, CheckCircleIcon } from 'lucide-react';
import { useTableStore } from '../../store/tableStore';
import { useNavigate, useParams } from 'react-router-dom';
import { PATHS } from '../../utils/routes';

interface StepProps {
    showValidation?: boolean;
}

const StepPublish = ({ showValidation }: StepProps) => {
    const { saveTable } = useTableStore();
    const navigate = useNavigate();
    const { id } = useParams();

    const handleSave = async () => {
        const success = await saveTable(id);
        if (success) {
            alert('Table saved successfully!');
            navigate(PATHS.DASHBOARD);
        } else {
            alert('Failed to save table');
        }
    };

    return (
        <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready to Publish!</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Your table is configured and ready to go. Click the button below to save and get your shortcode.
            </p>
            <button
                onClick={handleSave}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors inline-flex items-center gap-2"
            >
                <SaveIcon size={20} />
                Publish Table
            </button>
        </div>
    );
};

export default StepPublish;
