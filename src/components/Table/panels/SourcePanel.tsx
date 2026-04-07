import React from 'react';
import { cn } from '@/utils/cn';
import { __, _n, sprintf } from '@wordpress/i18n';
import { Tooltip } from '@/components/ui/Tooltip';
import { useTableStore } from '@/store/tableStore';
import { DataSource, SourceType, Product } from '@/types';
import { ConfirmButton } from '@/components/ui/ConfirmButton';
import { XIcon, PackageIcon, Trash2Icon } from 'lucide-react';
import SectionHeading from '@/components/Table/SectionHeading';
import { CardRadioGroup, CardRadioOption } from '@/components/ui/CardRadioGroup';

/* =============================================================================
 * SourcePanel Component
 * =============================================================================
 * Reusable panel for adjusting the data source configuration.
 * Accepts children to render context-specific selectors (like CategorySelector)
 * which might be coupled to specific stores in the Table Editor.
 * ============================================================================= */

/**
 * Source type options for CardRadioGroup
 */
const SOURCE_OPTIONS: CardRadioOption<SourceType>[] = [
	{
		value: 'all',
		label: __('All Products', 'productbay'),
		helpText: __('Display all published products from your store', 'productbay'),
	},
	{
		value: 'sale',
		label: __('On Sale', 'productbay'),
		helpText: __('Only products with active sale prices', 'productbay'),
	},
	{
		value: 'category',
		label: __('By Category', 'productbay'),
		helpText: __('Select specific product categories', 'productbay'),
	},
	{
		value: 'specific',
		label: __('Specific Products', 'productbay'),
		helpText: __('Hand-pick individual products', 'productbay'),
	},
];

export interface SourcePanelProps {
	source: DataSource;
	setSourceType: (type: SourceType) => void;
	className?: string;
	children?: React.ReactNode;
}

export const SourcePanel = ({ source, setSourceType, className, children }: SourcePanelProps) => {
	return (
		<div className={cn('w-full p-4 space-y-8', className)}>
			{/* =================================================================
			 * Section 1: Product Source Selection
			 * ================================================================= */}
			<section>
				<SectionHeading
					title={__('Product Source', 'productbay')}
					description={__('Choose which products to display', 'productbay')}
					isRequired={true}
				/>

				{/* Source type radio cards */}
				<CardRadioGroup
					name="source-type"
					options={SOURCE_OPTIONS}
					value={source.type}
					onChange={setSourceType}
					aria-label={__('Select product source', 'productbay')}
					className="grid grid-cols-1 md:grid-cols-2 gap-3"
					cardClassName="min-w-0"
				/>

				{/* Context-specific children (Stats, Selectors, etc.) */}
				{children && <div className="mt-6">{children}</div>}

				{/* Selected Products Summary (Moved from ProductSearch) */}
				<SelectedProductsSummary sourceType={source.type} />
			</section>
		</div>
	);
};

/**
 * Sub-component to display selected products for 'specific' source type
 */
const SelectedProductsSummary = ({ sourceType }: { sourceType: SourceType }) => {
	const { source, setSourceQueryArgs } = useTableStore();
	const { postIds: productIds = [], productObjects = {} } = source.queryArgs;

	if (sourceType !== 'specific' || productIds.length === 0) {
		return null;
	}

	const toggleProduct = (product: Product) => {
		const isSelected = productIds.includes(product.id);
		let nextIds = [...productIds];
		let nextObjects = { ...productObjects };

		if (isSelected) {
			nextIds = nextIds.filter((id) => id !== product.id);
			delete nextObjects[product.id];
		} else {
			nextIds.push(product.id);
			nextObjects[product.id] = product;
		}

		setSourceQueryArgs({
			postIds: nextIds,
			productObjects: nextObjects,
		});
	};

	const confirmRemoveAll = () => {
		setSourceQueryArgs({
			postIds: [],
			productObjects: {},
		});
	};

	return (
		<div className="mt-8 pt-6 border-t border-gray-100 animate-fade-in space-y-4">
			<SectionHeading
				title={__('Selected Products', 'productbay')}
				description={__('Currently hand-picked products for this table', 'productbay')}
			/>

			<div className="flex flex-wrap gap-2">
				{productIds.map((id) => {
					const product = productObjects[id];
					if (!product) return null;

					return (
						<div
							key={id}
							className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-sm border border-blue-200 group transition-all hover:border-blue-300"
						>
							<Tooltip
								content={sprintf(
									__('%1$s (ID: %2$s, SKU: %3$s)', 'productbay'),
									product.name,
									product.id.toString(),
									product.sku || __('N/A', 'productbay')
								)}
								className="bg-blue-800"
							>
								<span className="max-w-[180px] truncate block cursor-help font-medium">
									{product.name}
								</span>
							</Tooltip>
							<button
								onClick={() => toggleProduct(product)}
								title={sprintf(__('Remove "%s"', 'productbay'), product.name)}
								className="text-blue-400 hover:text-red-500 bg-transparent cursor-pointer p-0 m-0 flex items-center justify-center transition-colors"
							>
								<XIcon className="h-3.5 w-3.5 border-l border-blue-200 pl-1 ml-0.5" />
							</button>
						</div>
					);
				})}
			</div>

			{/* Product count and bulk actions */}
			<div className="flex items-center justify-between text-sm bg-gray-50 border border-gray-200 rounded-lg p-3">
				<div className="flex items-center gap-2 text-gray-700">
					<PackageIcon className="h-4 w-4 text-blue-500" />
					<span className="font-semibold">{productIds.length}</span>
					<span className="text-gray-600">
						{_n(
							'product selected',
							'products selected',
							productIds.length,
							'productbay'
						)}
					</span>
				</div>

				<ConfirmButton
					onConfirm={confirmRemoveAll}
					variant="ghost"
					size="sm"
					confirmMessage={sprintf(
						_n('Remove %d product?', 'Remove %d products?', productIds.length, 'productbay'),
						productIds.length
					)}
					className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 flex items-center gap-1.5 font-medium transition-colors"
				>
					<Trash2Icon className="h-4 w-4" />
					{__('Clear all', 'productbay')}
				</ConfirmButton>
			</div>
		</div>
	);
};
