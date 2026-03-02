import { __ } from '@wordpress/i18n';
import { WandSparklesIcon } from 'lucide-react';
import Navbar from '@/components/Layout/Navbar';
import { useTableStore } from '@/store/tableStore';
import React, { useState, useCallback, useEffect } from 'react';
import { useWpMenuSync } from '@/hooks/useWpMenuSync';
import { MinimalFooter } from '@/components/Layout/Footer';
import WizardDialog from '@/components/Wizard/WizardDialog';
import { useLocation } from 'react-router-dom';
import { apiFetch } from '@/utils/api';
import ProductBayIcon from '@/components/ui/ProductBayIcon';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
	// Sync React Router location with WP Admin Menu
	useWpMenuSync();
	const location = useLocation();

	// Wizard & Splash dialog state
	const [showWizard, setShowWizard] = useState(false);
	const [showSplash, setShowSplash] = useState(false);

	/**
	 * Open the wizard: reset the table store to defaults, then show the dialog.
	 */
	const handleOpenWizard = useCallback(() => {
		useTableStore.getState().resetStore();
		setShowWizard(true);
	}, []);

	// Auto-open wizard for first-time users visiting the home page
	useEffect(() => {
		// @ts-ignore
		const isFirstTime = window.productBaySettings?.isFirstTime;
		const isHome = location.pathname === '/' || location.pathname === '/tables' || location.pathname === '';

		if (isFirstTime && isHome) {
			// Show the splash screen first
			setShowSplash(true);

			// After 2.5 seconds, hide splash and open wizard
			setTimeout(() => {
				setShowSplash(false);
				handleOpenWizard();
			}, 2500);

			// Mark as onboarded in backend so it doesn't open on reload
			apiFetch('system/onboard', { method: 'POST' }).catch(console.error);

			// Update the global object so it doesn't trigger again during client-side navigation
			// @ts-ignore
			if (window.productBaySettings) window.productBaySettings.isFirstTime = false;
		}
	}, [location.pathname, handleOpenWizard]);

	/**
	 * Close the wizard and reset the store.
	 */
	const handleCloseWizard = useCallback(() => {
		setShowWizard(false);
		useTableStore.getState().resetStore();
	}, []);

	return (
		<div className="productbay-app bg-wp-bg font-sans text-wp-text p-0 m-0">
			<Navbar />
			<main className="p-2 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
				{children}
			</main>
			<MinimalFooter />

			{/* Floating Action Button — opens the wizard (hidden when wizard is open) */}
			{!showWizard && (
				<button
					className="fixed bottom-[20px] right-[20px] text-white rounded-full p-[12px] shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-[#EE00FF]/30 z-[100] cursor-pointer"
					style={{ background: 'linear-gradient(to bottom, #EE00FF, #3300B3)' }}
					onClick={handleOpenWizard}
					title={__('Open Create Table Wizard', 'productbay')}
				>
					<WandSparklesIcon size={24} />
				</button>
			)}

			{/* Wizard Dialog */}
			<WizardDialog isOpen={showWizard} onClose={handleCloseWizard} />

			{/* Welcome Splash Screen */}
			{showSplash && (
				<div className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-[#f0f0f1] animate-in fade-in duration-500">
					<div className="flex flex-col items-center justify-center animate-bounce-slow">
						<ProductBayIcon className="w-32 h-32 mb-6 shadow-2xl rounded-[28px]" />
						<h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
							{__('Welcome to ProductBay', 'productbay')}
						</h1>
						<p className="text-gray-500 mt-4 text-lg">
							{__('Getting everything ready for you...', 'productbay')}
						</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminLayout;
