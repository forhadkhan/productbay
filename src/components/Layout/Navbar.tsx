import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { routes, PATHS } from '@/utils/routes';
import { Button } from '@/components/ui/Button';
import { NavLink, useNavigate } from 'react-router-dom';
import { PlusIcon, MenuIcon, XIcon } from 'lucide-react';
import ProductBayLogo from '@/components/ui/ProductBayLogo';


/* =============================================================================
 * Navbar Component
 * =============================================================================
 * Main navigation bar with responsive design.
 * - Desktop: Horizontal navigation links with "Add New Table" button
 * - Mobile: Hamburger menu that toggles a dropdown menu
 * ============================================================================= */

const Navbar = () => {
	const navigate = useNavigate();

	/** Controls mobile menu visibility */
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const navLinks = routes.filter((route) => route.showInNav);

	/** Toggle mobile menu open/close state */
	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	/** Close mobile menu (used when navigating) */
	const closeMobileMenu = () => {
		setIsMobileMenuOpen(false);
	};

	return (
		<nav className="w-full bg-white shadow-sm border-b border-gray-200 relative">
			{/* Main navbar container */}
			<div className="py-3 px-6 h-16 flex justify-between items-center">
				{/* Logo / Brand */}
				<div className="flex items-center justify-content-center gap-2">
					<ProductBayLogo className="h-9 w-auto" />
				</div>

				{/* Desktop Navigation Links - hidden on mobile */}
				<div className="hidden md:flex items-center">
					<div className="flex space-x-2 mr-8">
						{navLinks.map((link) => (
							<NavLink
								key={link.path}
								to={link.path}
								className={({ isActive }) =>
									`flex items-center px-4 h-9 rounded-lg text-sm font-semibold transition-colors
									${isActive
										? 'bg-productbay-secondary text-gray-900'
										: 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
									}`
								}
							>
								{link.label}
							</NavLink>
						))}
					</div>

					{/* Create New Table Button */}
					<Button
						onClick={() => navigate(PATHS.NEW)}
						variant="outline"
						className="cursor-pointer px-4 py-2 rounded-lg border-productbay-primary text-productbay-primary hover:bg-blue-100/70 hover:text-blue-700 hover:border-blue-700 flex items-center justify-between"
					>
						<span className="font-semibold">{__('Add New Table', 'productbay')}</span>
						<div className="w-6 h-6 flex items-center justify-center p-0.5 bg-productbay-primary rounded-full ml-2">
							<PlusIcon
								size={12}
								className="text-white"
								strokeWidth={3}
							/>
						</div>
					</Button>
				</div>

				{/* Mobile Menu Toggle Button - visible only on mobile */}
				<button
					type="button"
					onClick={toggleMobileMenu}
					className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
					aria-label={isMobileMenuOpen ? __('Close menu', 'productbay') : __('Open menu', 'productbay')}
					aria-expanded={isMobileMenuOpen}
				>
					{isMobileMenuOpen ? (
						<XIcon size={24} />
					) : (
						<MenuIcon size={24} />
					)}
				</button>
			</div>

			{/* Mobile Dropdown Menu - slides down when open */}
			{isMobileMenuOpen && (
				<div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
					<div className="flex flex-col p-4 space-y-2">
						{/* Mobile Navigation Links */}
						{navLinks.map((link) => (
							<NavLink
								key={link.path}
								to={link.path}
								onClick={closeMobileMenu}
								className={({ isActive }) =>
									`flex items-center px-4 py-3 rounded-lg text-sm font-semibold transition-colors
									${isActive
										? 'bg-productbay-secondary text-gray-900'
										: 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
									}`
								}
							>
								{link.label}
							</NavLink>
						))}

						{/* Mobile Create New Table Button */}
						<Button
							onClick={() => {
								navigate(PATHS.NEW);
								closeMobileMenu();
							}}
							variant="outline"
							className="cursor-pointer w-full h-10 px-4 py-2 rounded-lg border-productbay-primary text-productbay-primary hover:bg-blue-50 hover:text-blue-700 hover:border-blue-700 flex items-center justify-center mt-2"
						>
							<span className="font-semibold">{__('Add New Table', 'productbay')}</span>
							<div className="w-6 h-6 flex items-center justify-center p-0.5 bg-productbay-primary rounded-full ml-2">
								<PlusIcon
									size={12}
									className="text-white"
									strokeWidth={3}
								/>
							</div>
						</Button>
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
