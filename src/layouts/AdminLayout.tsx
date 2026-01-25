import React from 'react';

import Navbar from '../components/Layout/Navbar';
import { useWpMenuSync } from '../hooks/useWpMenuSync';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    // Sync React Router location with WP Admin Menu
    useWpMenuSync();

    return (
        <div className="productbay-app bg-wp-bg font-sans text-wp-text p-0 m-0">
            <Navbar />
            <main className="p-2 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
