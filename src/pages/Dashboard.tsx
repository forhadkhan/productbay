import { useEffect } from 'react';
import { PATHS } from '../utils/routes';
import { Button } from "../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useSystemStore } from '../store/systemStore';
import { Skeleton } from '../components/ui/Skeleton';
import { AlertCircleIcon, DatabaseIcon, PackageIcon, PlusIcon, PlayCircleIcon, DownloadIcon, UploadIcon, LifeBuoyIcon, ChevronRightIcon } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    // Use the system store instead of local state
    const { status, fetchStatus, error } = useSystemStore();

    useEffect(() => {
        // Fetch fresh data on mount (background update if data exists)
        fetchStatus();
    }, [fetchStatus]);

    if (error) {
        return <div className="p-4 bg-red-50 text-red-600 rounded-lg">Error: {error}</div>;
    }

    // Determine loading state for skeleton (only if no data yet)
    const isLoading = !status;


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            </div>

            {/* Warning: No Products */}
            {!isLoading && status?.product_count === 0 && (
                <div className="bg-wp-info border-l-4 border-yellow-400 p-4 rounded-r-lg flex items-start gap-3">
                    <AlertCircleIcon className="text-yellow-600 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-yellow-800">No Published Products Found</h3>
                        <p className="text-yellow-700 text-sm mt-1">
                            ProductBay could not find any 'published' WooCommerce products on your site. ProductBay cannot display products in tables without published products.
                        </p>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            {isLoading ? (
                // LOADING SKELETON
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                            <Skeleton className="h-12 w-12 rounded-lg" />
                            <div className="space-y-2 w-full">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-8 w-16" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : status?.table_count === 0 ? (
                /* Welcome Hero */
                <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center animate-fade-in">
                    <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                        <PlusIcon size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to ProductBay</h2>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                        Get started by creating your first product table. It takes less than 2 minutes to significantly improve your conversion rate.
                    </p>
                    <Button
                        onClick={() => navigate(PATHS.NEW)}
                        className="cursor-pointer"
                        variant="default"
                        size="lg"
                    >
                        <PlusIcon size={20} className="mr-2" />
                        Create First Table
                    </Button>
                </div>
            ) : (
                /* Stats Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="bg-purple-50 p-3 rounded-lg text-purple-600">
                            <PackageIcon size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Published Products</p>
                            <p className="text-2xl font-bold text-gray-900">{status?.product_count}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                            <DatabaseIcon size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Active Tables</p>
                            <p className="text-2xl font-bold text-gray-900">{status?.table_count}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Info Cards Grid - Always Visible (Static content doesn't need loading state) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Getting Started */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4 text-gray-800">
                        <PlayCircleIcon className="text-blue-500" />
                        <h3 className="font-bold">Getting Started</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                        Watch our quick video guide or read the documentation to master ProductBay in minutes.
                    </p>
                    <div className="flex gap-3 text-sm">
                        <a href="#" className="text-blue-600 hover:underline underline-offset-4">Watch Video</a>
                        <span className="text-gray-300">|</span>
                        <a href="#" className="text-blue-600 hover:underline underline-offset-4">Documentation</a>
                    </div>
                </div>

                {/* Data Management */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4 text-gray-800">
                        <DatabaseIcon className="text-green-500" />
                        <h3 className="font-bold">Data Management</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                        Import or export your table configurations for backup or migration.
                    </p>
                    <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded text-sm hover:bg-gray-50 text-gray-600 transition-colors">
                            <UploadIcon size={14} /> Import
                        </button>
                        <button
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded text-sm hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={isLoading || status?.table_count === 0}
                        >
                            <DownloadIcon size={14} /> Export
                        </button>
                    </div>
                </div>

                {/* Feedback */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4 text-gray-800">
                        <LifeBuoyIcon className="text-orange-500" />
                        <h3 className="font-bold">Help & Support</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                        Need help? Have a feature request? We'd love to hear from you.
                    </p>
                    <Link to="/help" className="text-blue-600 hover:underline underline-offset-4 text-sm font-medium">
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;
