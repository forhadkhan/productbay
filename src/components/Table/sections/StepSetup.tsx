import { useTableStore } from '@/store/tableStore';
import { Input } from '@/components/ui/Input';
import { StepHeading } from './StepHeading';
import { __ } from '@wordpress/i18n';

export interface StepProps {
	showValidation?: boolean;
}

/**
 * StepSetup Component
 *
 * First step in table creation wizard.
 * Allows users to set a descriptive name for their table.
 */
const StepSetup = ({ showValidation }: StepProps) => {
	const { tableData, setTableData } = useTableStore();
	const hasError = showValidation && !tableData.title.trim();

	return (
		<div className="space-y-6 mb-auto">
			<StepHeading title={__('Table Name', 'productbay')} required />
			<Input
				type="text"
				value={tableData.title}
				onChange={(e) => setTableData({ title: e.target.value })}
				placeholder={__('e.g. Summer Sale Products', 'productbay')}
				error={hasError ? __('Table name is required', 'productbay') : undefined}
			/>
			{hasError && (
				<p className="text-sm text-red-500 mt-1">
					{__('Please enter a table name to continue.', 'productbay')}
				</p>
			)}
			{!hasError && (
				<p className="mt-1 text-sm text-gray-500">
					{__('Give your table a descriptive name for internal use.', 'productbay')}
				</p>
			)}
		</div>
	);
};

export default StepSetup;
