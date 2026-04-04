import { __ } from '@wordpress/i18n';

const AdvancedSettings = () => {
    return (
        <div className="space-y-6">
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mt-0 mb-4">
                    {__('Advanced Settings', 'productbay')}
                </h3>
                <p className="text-gray-500">{__('Settings will be available soon', 'productbay')}</p>
            </div>
        </div>
    )
}

export default AdvancedSettings;