import { NavLink, useNavigate } from "react-router-dom";
import { LayoutGrid, Plus } from "lucide-react";

import { routes } from '../../utils/routes';

const Navbar = () => {
    const navigate = useNavigate();

    const navLinks = routes.filter(route => route.showInNav);

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
            {/* Logo / Brand */}
            <div className="flex items-center gap-2">
                <div className="bg-wp-btn p-1.5 rounded-lg text-white">
                    <LayoutGrid size={20} strokeWidth={2.5} />
                </div>
                <span className="text-xl font-bold text-wp-text tracking-tight">
                    Product<span className="font-normal">Bay</span>
                </span>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
                <div className="flex space-x-6 mr-4">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `text-gray-600 font-medium hover:text-wp-btn transition-colors ${isActive ? "text-wp-btn border-b-2 border-wp-btn pb-1" : ""
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </div>

                <button
                    onClick={() => navigate(routes.find(r => r.path === '/new')?.path || '/new')}
                    className="bg-wp-btn hover:bg-wp-btn-hover text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors"
                >
                    <Plus size={18} />
                    Create Table
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
