import React from 'react';

import Navbar from '../components/Layout/Navbar';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="productbay-app bg-wp-bg min-h-screen font-sans text-wp-text">
            <Navbar />
            <main className="p-8 max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
