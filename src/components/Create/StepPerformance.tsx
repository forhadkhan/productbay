import React from 'react';

interface StepProps {
	showValidation?: boolean;
}

const StepPerformance = ( { showValidation }: StepProps ) => {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between p-4 border rounded-lg">
				<div>
					<h3 className="font-medium">Lazy Load Images</h3>
					<p className="text-sm text-gray-500">
						Improve initial page load time.
					</p>
				</div>
				<input type="checkbox" className="toggle" defaultChecked />
			</div>
			<div className="flex items-center justify-between p-4 border rounded-lg">
				<div>
					<h3 className="font-medium">Cache Results</h3>
					<p className="text-sm text-gray-500">
						Cache query results for faster subsequent loads.
					</p>
				</div>
				<input type="checkbox" className="toggle" />
			</div>
		</div>
	);
};

export default StepPerformance;
