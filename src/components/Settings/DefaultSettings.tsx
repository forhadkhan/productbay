import { DefaultColumnsConfig } from '@/components/Table/sections/DefaultColumnsConfig';
import { BulkSelectConfig } from '@/components/Table/sections/BulkSelectConfig';
import { DisplayPanel } from '@/components/Table/panels/DisplayPanel';
import { OptionsPanel } from '@/components/Table/panels/OptionsPanel';
import { SourcePanel } from '@/components/Table/panels/SourcePanel';
import { __ } from '@wordpress/i18n';
import React from 'react';

interface DefaultSettingsProps {
	source: any;
	setSourceType: (type: any) => void;
	columns: any;
	setColumns: (cols: any) => void;
	tableSettings: any;
	setFeatures: (v: any) => void;
	style: any;
	setHeaderStyle: (v: any) => void;
	setBodyStyle: (v: any) => void;
	setButtonStyle: (v: any) => void;
	setLayoutStyle: (v: any) => void;
	setTypographyStyle: (v: any) => void;
	setHoverStyle: (v: any) => void;
	setPagination: (v: any) => void;
	setCart: (v: any) => void;
	setFilters: (v: any) => void;
}

/**
 * DefaultSettings Component
 *
 * Handles the "Default Configuration" tab in settings.
 * Allows setting global defaults for new tables (Source, Style, Functionality).
 */
const DefaultSettings: React.FC<DefaultSettingsProps> = ({
	source,
	setSourceType,
	columns,
	setColumns,
	tableSettings,
	setFeatures,
	style,
	setHeaderStyle,
	setBodyStyle,
	setButtonStyle,
	setLayoutStyle,
	setTypographyStyle,
	setHoverStyle,
	setPagination,
	setCart,
	setFilters,
}) => {
	return (
		<div className="space-y-10 p-6">
			<div className="max-w-4xl space-y-10">
				<div>
					<h2 className="text-lg font-bold text-gray-900 mb-2">
						{__('Default Source', 'productbay')}
					</h2>
					<p className="text-gray-500 mb-6">
						{__('Configure the default data source settings for new tables.', 'productbay')}
					</p>

					<SourcePanel
						source={source}
						setSourceType={setSourceType}
						className="border-none"
					/>
				</div>

				<hr className="border-b-2 border-gray-200" />

				<div className="flex flex-col gap-8">
					<div>
						<h2 className="text-lg font-bold text-gray-900 mb-2">
							{__('Default Columns', 'productbay')}
						</h2>
						<p className="text-gray-500 mb-6">
							{__('Configure the default columns for new tables.', 'productbay')}
						</p>
						<DefaultColumnsConfig columns={columns} onChange={setColumns} />
					</div>

					{/* Bulk Select Configuration */}
					<BulkSelectConfig
						value={tableSettings.features.bulkSelect}
						onChange={(config) => setFeatures({ bulkSelect: config })}
					/>
				</div>

				<hr className="border-b-2 border-gray-200" />

				<div>
					<h2 className="text-lg font-bold text-gray-900 mb-2">
						{__('Default Styling', 'productbay')}
					</h2>
					<p className="text-gray-500 mb-6">
						{__('Set the default look and feel for your tables.', 'productbay')}
					</p>
					<DisplayPanel
						style={style}
						setHeaderStyle={setHeaderStyle}
						setBodyStyle={setBodyStyle}
						setButtonStyle={setButtonStyle}
						setLayoutStyle={setLayoutStyle}
						setTypographyStyle={setTypographyStyle}
						setHoverStyle={setHoverStyle}
						className="border-none"
					/>
				</div>

				<hr className="border-b-2 border-gray-200" />

				<div>
					<h2 className="text-lg font-bold text-gray-900 mb-2">
						{__('Default Functionality', 'productbay')}
					</h2>
					<p className="text-gray-500 mb-6">
						{__(
							'Configure default features like sorting, pagination, and filters.',
							'productbay'
						)}
					</p>
					<OptionsPanel
						settings={tableSettings}
						setFeatures={setFeatures}
						setPagination={setPagination}
						setCart={setCart}
						setFilters={setFilters}
						className="border-none"
					/>
				</div>
			</div>
		</div>
	);
};

export default DefaultSettings;
