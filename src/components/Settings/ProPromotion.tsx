import React from 'react';
import { __ } from '@wordpress/i18n';
import { Button } from '@/components/ui/Button';
import {
	Zap,
	Filter,
	Database,
	Layers,
	ExternalLink,
	CheckCircle2,
	LayoutGrid,
	MousePointer2,
	SlidersHorizontal,
	Key,
	CrownIcon
} from 'lucide-react';
import { PRODUCTBAY_LANDING_PAGE_URL } from '@/utils/routes';

/**
 * ProPromotion Component
 * 
 * Displays a premium promotion view for ProductBay Pro features.
 * Used in the Settings > License tab when Pro is not active.
 * 
 * @since 1.2.0
 */
const ProPromotion = () => {
	const features = [
		{
			icon: <Layers className="w-5 h-5 text-indigo-500" />,
			title: __('Variations Management', 'productbay'),
			description: __('Showcase product variations in a clean, high-converting table format with easy quantity management.', 'productbay')
		},
		{
			icon: <Filter className="w-5 h-5 text-blue-500" />,
			title: __('Advanced Filtering', 'productbay'),
			description: __('Empower shoppers with price range sliders and sophisticated filtering options to find products faster.', 'productbay')
		},
		{
			icon: <Database className="w-5 h-5 text-emerald-500" />,
			title: __('Import & Export', 'productbay'),
			description: __('Seamlessly migrate your table configurations and global settings between sites with JSON portability.', 'productbay')
		},
		{
			icon: <LayoutGrid className="w-5 h-5 text-purple-500" />,
			title: __('Grouped Product Support', 'productbay'),
			description: __('Full support for WooCommerce grouped products with inline selection and bulk add-to-cart.', 'productbay')
		},
		{
			icon: <MousePointer2 className="w-5 h-5 text-orange-500" />,
			title: __('Custom Column Logic', 'productbay'),
			description: __('Unlock more powerful column settings and data sources for ultimate control over your product data.', 'productbay')
		},
		{
			icon: <SlidersHorizontal className="w-5 h-5 text-pink-500" />,
			title: __('Price Slider Filter', 'productbay'),
			description: __('Add a professional dual-handle price range slider to your tables for effortless product discovery.', 'productbay')
		},
		{
			icon: <Zap className="w-5 h-5 text-yellow-500" />,
			title: __('Priority Support', 'productbay'),
			description: __('Get fast assistance from our expert team to help you optimize and troubleshoot your tables.', 'productbay'),
			fullWidth: true
		}
	];

	return (
		<div className="bg-white rounded-xl border border-indigo-600 overflow-hidden shadow-sm">
			{/* Hero Section */}
			<div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-8 md:p-12 overflow-hidden">
				{/* Background Decorative Elements */}
				<div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
				<div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />

				<div className="relative z-10 max-w-2xl">
					<div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-100 text-xs font-semibold uppercase tracking-wider mb-6">
						<CrownIcon className="w-3 h-3 mr-2" />
						{__('Premium Add-on', 'productbay')}
					</div>

					<h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
						{__('Supercharge Your Shop with ProductBay Pro', 'productbay')}
					</h2>

					<p className="text-lg text-indigo-100 mb-8 leading-relaxed opacity-90">
						{__('Take your WooCommerce store to the next level. Unlock variation modals, advanced filters, and professional management tools designed for high-volume stores.', 'productbay')}
					</p>

					<div className="flex flex-wrap gap-4">
						<Button
							size="lg"
							className="bg-white text-indigo-700 hover:bg-indigo-50 border-none cursor-pointer px-8 py-6 text-lg font-bold shadow-xl flex items-center gap-2 group"
							onClick={() => window.open(PRODUCTBAY_LANDING_PAGE_URL, '_blank')}
						>
							{__('Upgrade to Pro Now', 'productbay')}
							<ExternalLink className="w-5 h-5 transition-transform group-hover:translate-x-1" />
						</Button>
					</div>
				</div>
			</div>

			{/* License Info Box */}
			<div className="mx-4 md:mx-8 mt-8 border border-indigo-100 bg-indigo-50/50 rounded-lg p-5 flex items-start gap-4">
				<div className="p-2 w-10 h-10 flex items-center justify-center bg-productbay-brand text-white rounded-md shrink-0">
					<Key className="w-5 h-5" />
				</div>
				<div>
					<h4 className="text-gray-900 text-lg font-semibold mb-1">
						{__('Looking for your License Key?', 'productbay')}
					</h4>
					<p className="text-sm text-gray-600 leading-relaxed m-0">
						{__('Upon purchasing Pro, you will receive a key to enter right here on this page, which will securely activate your premium tools, enable automatic updates, and grant you priority support.', 'productbay')}
					</p>
				</div>
			</div>

			{/* Features Grid */}
			<div className="p-4 md:p-8 bg-white">
				<div className="text-center mb-10">
					<h3 className="text-2xl font-black text-gray-900 mb-2">
						{__('Why Go Pro?', 'productbay')}
					</h3>
					<p className="text-gray-500 text-md max-w-xl mx-auto">
						{__('Empower your customers to find, configure, and buy, faster than ever before.', 'productbay')}
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{features.map((feature, idx) => (
						<div
							key={idx}
							className={`bg-productbay-brand/5 p-6 rounded-xl border border-productbay-brand/25 hover:shadow-md transition-shadow ${feature.fullWidth ? 'lg:col-span-3 text-center' : ''}`}
						>
							<div className={`w-10 h-10 border border-productbay-brand/25 rounded-lg bg-white flex items-center justify-center mb-4 ${feature.fullWidth ? 'mx-auto' : ''}`}>
								{feature.icon}
							</div>
							<h4 className="text-lg font-bold text-gray-900 mb-2">
								{feature.title}
							</h4>
							<p className={`text-sm text-gray-600 leading-relaxed ${feature.fullWidth ? 'max-w-2xl mx-auto' : ''}`}>
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</div>

			{/* Trust / Bottom Banner */}
			<div className="p-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 bg-white">
				<div className="flex items-center gap-6">
					<div className="flex items-center text-gray-600 text-sm font-medium">
						<CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" />
						{__('No Hidden Fees', 'productbay')}
					</div>
					<div className="flex items-center text-gray-600 text-sm font-medium">
						<CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" />
						{__('Priority Support', 'productbay')}
					</div>
					<div className="flex items-center text-gray-600 text-sm font-medium">
						<CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" />
						{__('Regular Updates', 'productbay')}
					</div>
				</div>

				<button
					className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 text-sm bg-transparent border-none cursor-pointer"
					onClick={() => window.open(PRODUCTBAY_LANDING_PAGE_URL, '_blank')}
				>
					{__('Learn more about all Pro features', 'productbay')}
					<ExternalLink className="w-3 h-3" />
				</button>
			</div>
		</div>
	);
};

export default ProPromotion;
