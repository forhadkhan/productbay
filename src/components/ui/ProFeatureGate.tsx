/**
 * ProFeatureGate Component
 *
 * Wraps any clickable element to gate it behind ProductBay Pro.
 * - When Pro IS active: renders children normally (zero overhead).
 * - When Pro is NOT active: intercepts clicks and shows an informational modal.
 *
 * @since 1.2.0
 */
import { __ } from '@wordpress/i18n';
import { CrownIcon } from 'lucide-react';
import { useState, ReactNode } from 'react';
import { Modal } from '@/components/ui/Modal';
import { PRODUCTBAY_LANDING_PAGE_URL } from '@/utils/routes';

interface ProFeatureGateProps {
	/** The clickable element(s) to gate. */
	children: ReactNode;
	/** Feature name shown in the modal title. */
	featureName?: string;
	/** Optional custom description for the modal body. */
	description?: string;
}

/**
 * Check if ProductBay Pro is active.
 */
const isProActive = (): boolean => {
	return !!(window as any).productBaySettings?.proVersion;
};

export const ProFeatureGate = ({ children, featureName, description }: ProFeatureGateProps) => {
	const [showModal, setShowModal] = useState(false);

	// When Pro is active, render children with no wrapper
	if (isProActive()) {
		return <>{children}</>;
	}

	return (
		<>
			{/* Intercept click on the gated element */}
			<div
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					setShowModal(true);
				}}
				className="contents cursor-pointer"
			>
				{children}
			</div>

			{/* Pro Required Modal */}
			<Modal
				isOpen={showModal}
				onClose={() => setShowModal(false)}
				title={featureName ? featureName : ''}
				maxWidth="sm"
				primaryButton={{
					text: __('Get Pro', 'productbay'),
					onClick: () => {
						window.open(PRODUCTBAY_LANDING_PAGE_URL, '_blank');
						setShowModal(false);
					},
				}}
				secondaryButton={{
					text: __('Later', 'productbay'),
					onClick: () => setShowModal(false),
					variant: 'secondary',
				}}
			>
				<div className="flex flex-col items-center text-center py-2">
					<div className="w-16 h-16 bg-[#f05c2a]/10 flex items-center justify-center rounded-full mb-4 shrink-0">
						<CrownIcon className="w-8 h-8 text-[#f05c2a]" />
					</div>
					<p className="text-gray-700 font-bold mb-2 text-base">
						{__('This feature requires ProductBay Pro', 'productbay')}{' '}
					</p>
					<p className="text-gray-500 text-sm m-0">
						{description || (
							<>
								{__('Upgrade to ProductBay Pro to unlock this feature and many more.', 'productbay')}
							</>
						)}
					</p>
				</div>
			</Modal>
		</>
	);
};

export default ProFeatureGate;
