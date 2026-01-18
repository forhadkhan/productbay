import { useEffect } from 'react';
import { Button } from "../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from '../components/ui/Skeleton';
import { useSystemStore } from '../store/systemStore';
import { PATHS, WC_PRODUCTS_PATH } from '../utils/routes';
import { DatabaseIcon, PackageIcon, PlusIcon, PlayCircleIcon, DownloadIcon, UploadIcon, LifeBuoyIcon, SheetIcon } from 'lucide-react';

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

            {/* 
                Empty State: No Published Products Found
                Shown when the site has zero 'published' WooCommerce products.
                ProductBay requires published products to build and display tables.
            */}
            {!isLoading && status?.product_count === 0 && (
                <div className="bg-white p-6 rounded-xl flex flex-col md:flex-row items-center gap-6 mb-6 shadow-sm border border-orange-500">
                    <div className="p-4 rounded-2xl text-orange-500 shrink-0">
                        <PackageIcon size={32} />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-lg font-bold text-red-950 m-0 pb-1">No Published Products Found</h3>
                        <p className="text-gray-600 text-sm max-w-2xl">
                            <strong>ProductBay</strong> requires published <strong>WooCommerce</strong> products to build your tables.
                            <br />
                            We couldn't find any products in your WooCommerce store yet.
                            <br />
                            Create your first product to start building high-converting tables.
                        </p>
                    </div>
                    <div className="shrink-0">
                        <Button
                            variant="secondary"
                            className="cursor-pointer border border-green-500"
                            onClick={() => window.open(WC_PRODUCTS_PATH, '_blank')}
                        >
                            <PlusIcon size={18} className="mr-2" />
                            Add Products
                        </Button>
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
                            <p className="text-gray-500 text-sm">Published WooCommerce Products</p>
                            <p className="text-2xl font-bold text-gray-900">{status?.product_count}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                            <SheetIcon size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Active ProductBay Tables</p>
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
