import { __ } from '@wordpress/i18n';
import { WandSparklesIcon } from 'lucide-react';
import Navbar from '@/components/Layout/Navbar';
import { useTableStore } from '@/store/tableStore';
import React, { useState, useCallback } from 'react';
import { useWpMenuSync } from '@/hooks/useWpMenuSync';
import { MinimalFooter } from '@/components/Layout/Footer';
import WizardDialog from '@/components/Wizard/WizardDialog';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
	// Sync React Router location with WP Admin Menu
	useWpMenuSync();

	// Wizard dialog state
	const [showWizard, setShowWizard] = useState(false);

	/**
	 * Open the wizard: reset the table store to defaults, then show the dialog.
	 */
	const handleOpenWizard = useCallback(() => {
		useTableStore.getState().resetStore();
		setShowWizard(true);
	}, []);

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
		</div>
	);
};

export default AdminLayout;
