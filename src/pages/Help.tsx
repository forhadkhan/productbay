import { __ } from '@wordpress/i18n';

/**
 * Help Page Component
 *
 * Displays system status and help/support information.
 */
const Help = () => {
	return (
		<div className="bg-white shadow rounded-lg p-6">
			<h1 className="text-2xl font-bold mb-4">{__('Help', 'productbay')}</h1>
			<p>{__('System status and help will be here.', 'productbay')}</p>
		</div>
	);
};

export default Help;
