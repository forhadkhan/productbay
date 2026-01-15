import { Button } from "../ui/Button";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutGridIcon, PlusIcon } from "lucide-react";

import { routes, PATHS } from '../../utils/routes';

const Navbar = () => {
    const navigate = useNavigate();

    const navLinks = routes.filter(route => route.showInNav);

    return (
        <nav className="w-full bg-white shadow-sm border-b border-gray-200 py-4 px-6 flex justify-between items-center">
            {/* Logo / Brand */}
            <div className="flex items-center justify-content-center gap-2">
                <LayoutGridIcon size={20} strokeWidth={2.5} />
                <span className="text-xl font-bold text-wp-text tracking-tight">
                    Product<span className="font-normal">Bay</span>
                </span>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center">
                <div className="flex space-x-2 mr-6">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `   text-gray-600 font-medium hover:text-wp-btn transition-colors px-4 py-2 rounded-md 
                                    ${isActive ? "bg-gray-200" : "hover:bg-gray-100"
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </div>

                {/* Create Table Button */}
                <Button
                    onClick={() => navigate(PATHS.NEW)}
                    variant="default"
                    size="lg"
                    className="cursor-pointer"
                >
                    <PlusIcon size={18} className="mr-2" />
                    Create Table
                </Button>
            </div>
        </nav>
    );
};

export default Navbar;
