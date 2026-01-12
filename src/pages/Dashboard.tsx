import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '../utils/routes';
import { apiFetch } from '../utils/api';
import { AlertCircle, Database, Package, Plus } from 'lucide-react';

interface SystemStatus {
    wc_active: boolean;
    product_count: number;
    table_count: number;
    version: string;
}

const Dashboard = () => {
    const [status, setStatus] = useState<SystemStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const data = await apiFetch<SystemStatus>('system/status');
                setStatus(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStatus();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading system status...</div>;
    }

    if (error) {
        return <div className="p-4 bg-red-50 text-red-600 rounded-lg">Error: {error}</div>;
    }

    if (!status) return null;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

            {/* Warning: No Products */}
            {status.product_count === 0 && (
                <div className="bg-wp-info border-l-4 border-yellow-400 p-4 rounded-r-lg flex items-start gap-3">
                    <AlertCircle className="text-yellow-600 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-yellow-800">No Published Products Found</h3>
                        <p className="text-yellow-700 text-sm mt-1">
                            ProductBay could not find any 'published' WooCommerce products on your site.
                            ProductBay cannot display products in tables without published products.
                        </p>
                    </div>
                </div>
            )}

            {/* Welcome State: No Tables */}
            {status.table_count === 0 ? (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                        <Plus size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to ProductBay</h2>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                        Get started by creating your first product table. It takes less than 2 minutes significantly improve your conversion rate.
                    </p>
                    <Link
                        to={PATHS.NEW}
                        className="inline-flex items-center gap-2 bg-wp-btn hover:bg-wp-btn-hover text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        <Plus size={20} />
                        Create First Table
                    </Link>
                </div>
            ) : (
                /* Stats Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="bg-purple-50 p-3 rounded-lg text-purple-600">
                            <Package size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Published Products</p>
                            <p className="text-2xl font-bold text-gray-900">{status.product_count}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                            <Database size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Active Tables</p>
                            <p className="text-2xl font-bold text-gray-900">{status.table_count}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Dashboard;
