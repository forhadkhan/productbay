import React from 'react';
import { NavLink } from 'react-router-dom';

import { routes } from '../../utils/routes';

const Navbar = () => {
    const navLinks = routes.filter(route => route.showInNav);

    return (
        <nav className="bg-white shadow-md border-b border-gray-200 px-8 py-4 flex justify-between items-center">
            {/* Logo / Brand */}
            <div className="font-medium text-2xl text-blue-600 tracking-wide hover:text-blue-700 transition-colors">
                Product<span className='font-bold '>Bay</span>
            </div>

            {/* Navigation Links */}
            <div className="flex space-x-6">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            `text-gray-700 font-medium hover:text-blue-600 transition-colors ${isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : ""
                            }`
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default Navbar;
