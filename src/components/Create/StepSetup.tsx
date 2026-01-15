import { Input } from '../ui/Input';
import { useTableStore } from '../../store/tableStore';

export interface StepProps {
    showValidation?: boolean;
}

const StepSetup = ({ showValidation }: StepProps) => {
    const { tableData, setTableData } = useTableStore();
    const hasError = showValidation && !tableData.title.trim();

    return (
        <div className="space-y-6 mb-auto">
            <h3 className="font-bold text-blue-800 mb-2">
                Table Name <span className="text-red-500">*</span>
            </h3>
            <Input
                type="text"
                value={tableData.title}
                onChange={(e) => setTableData({ title: e.target.value })}
                placeholder="e.g. Summer Sale Products"
                error={hasError ? "Table name is required" : undefined}
            />
            {hasError && <p className="text-sm text-red-500 mt-1">Please enter a table name to continue.</p>}
            {!hasError && <p className="mt-1 text-sm text-gray-500">Give your table a descriptive name for internal use.</p>}
        </div>
    );
};

export default StepSetup;
