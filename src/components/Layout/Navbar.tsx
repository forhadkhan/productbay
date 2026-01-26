import { Button } from '../ui/Button';
import { PlusIcon } from 'lucide-react';
import ProductBayLogo from '../ui/ProductBayLogo';
import { NavLink, useNavigate } from 'react-router-dom';

import { routes, PATHS } from '../../utils/routes';

const Navbar = () => {
	const navigate = useNavigate();

	const navLinks = routes.filter((route) => route.showInNav);

	return (
		<nav className="w-full bg-white shadow-sm border-b border-gray-200 py-3 px-6 h-16 flex justify-between items-center">
			{ /* Logo / Brand */}
			<div className="flex items-center justify-content-center gap-2">
				<ProductBayLogo className="h-9 w-auto" />
			</div>

			{ /* Navigation Links */}
			<div className="flex items-center">
				<div className="flex space-x-2 mr-8">
					{navLinks.map((link) => (
						<NavLink
							key={link.path}
							to={link.path}
							className={({ isActive }) =>
								`   flex items-center px-4 h-9 rounded-lg text-sm font-semibold transition-colors
                                    ${isActive
									? 'bg-productbay-secondary text-gray-900'
									: 'text-gray-500 hover:text-gray-900'
								}`
							}
						>
							{link.label}
						</NavLink>
					))}
				</div>

				{ /* Create New Table Button */}
				<Button
					onClick={() => navigate(PATHS.NEW)}
					variant="outline"
					className="cursor-pointer w-[152px] h-10 px-4 py-2 rounded-lg border-productbay-primary text-productbay-primary hover:bg-blue-50 hover:text-blue-700 hover:border-blue-700 flex items-center justify-between"
				>
					<span className="font-semibold">Add New Table</span>
					<div className="w-6 h-6 flex items-center justify-center p-0.5 bg-productbay-primary rounded-full flex items-center justify-center ml-2">
						<PlusIcon
							size={12}
							className="text-white"
							strokeWidth={3}
						/>
					</div>
				</Button>
			</div>
		</nav>
	);
};

export default Navbar;
