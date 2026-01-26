import React from 'react';

interface StepProps {
	showValidation?: boolean;
}

const StepOptions = ( { showValidation }: StepProps ) => {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between p-4 border rounded-lg">
				<div>
					<h3 className="font-medium">AJAX Loading</h3>
					<p className="text-sm text-gray-500">
						Load products without refreshing the page.
					</p>
				</div>
				<input type="checkbox" className="toggle" defaultChecked />
			</div>
			<div className="flex items-center justify-between p-4 border rounded-lg">
				<div>
					<h3 className="font-medium">Quantity Picker</h3>
					<p className="text-sm text-gray-500">
						Show quantity input next to add to cart.
					</p>
				</div>
				<input type="checkbox" className="toggle" />
			</div>
		</div>
	);
};

export default StepOptions;
