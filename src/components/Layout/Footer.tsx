import { PRODUCTBAY_DOCUMENTATION_URL, PRODUCTBAY_LANDING_PAGE_URL, PRODUCTBAY_SUPPORT_URL, PRODUCTBAY_VIDEO_GUIDE_URL } from "@/utils/routes";
import { LifeBuoyIcon, PlayCircleIcon } from "lucide-react";
import ProductBayIcon from "@/components/ui/ProductBayIcon";
import { __ } from '@wordpress/i18n';

export const MinimalFooter = () => {
    return (
        <footer className="my-6">
            {/* Divider */}
            <div className="relative py-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-wp-bg px-4">
                        <ProductBayIcon className="size-10 grayscale" />
                    </span>
                </div>
            </div>

            {/* Links */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a className="hover:underline underline-offset-4" href={PRODUCTBAY_LANDING_PAGE_URL} target="_blank" rel="noopener noreferrer">
                    {__('ProductBay', 'productbay')}
                </a>
                <span className="hidden sm:inline text-gray-700">&#9678;</span>
                <a className="hover:underline underline-offset-4" href={PRODUCTBAY_DOCUMENTATION_URL} target="_blank" rel="noopener noreferrer">
                    {__('Documentation', 'productbay')}
                </a>
                <span className="hidden sm:inline text-gray-700">&#9678;</span>
                <a className="hover:underline underline-offset-4" href={PRODUCTBAY_SUPPORT_URL} target="_blank" rel="noopener noreferrer">
                    {__('Support', 'productbay')}
                </a>
            </div>
        </footer>
    );
}

export const Footer = () => {
    return (
        <footer className="mt-6">
            {/* Divider */}
            <div className="relative py-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-wp-bg px-4">
                        <ProductBayIcon className="size-10 grayscale" />
                    </span>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
                { /* Guides */}
                <section className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3 mb-4 text-gray-800">
                        <PlayCircleIcon className="text-blue-500" />
                        <h3 className="font-bold">{__('Guides', 'productbay')}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                        {__('Watch our quick video guide or read the documentation to master ProductBay in minutes.', 'productbay')}
                    </p>
                    <div className="flex gap-3 text-sm">
                        <a
                            href={PRODUCTBAY_VIDEO_GUIDE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline underline-offset-4"
                        >
                            {__('Watch Video', 'productbay')}
                        </a>
                        <span className="text-gray-300">|</span>
                        <a
                            href={PRODUCTBAY_DOCUMENTATION_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline underline-offset-4"
                        >
                            {__('Documentation', 'productbay')}
                        </a>
                    </div>
                </section>

                { /* Feedback */}
                <section className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3 mb-4 text-gray-800">
                        <LifeBuoyIcon className="text-orange-500" />
                        <h3 className="font-bold">{__('Help & Support', 'productbay')}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                        {__("Need help? Have a feature request? We'd love to hear from you.", 'productbay')}
                    </p>
                    <a
                        href={PRODUCTBAY_SUPPORT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline underline-offset-4 text-sm font-medium"
                    >
                        {__('Contact Support', 'productbay')}
                    </a>
                </section>
            </div>
        </footer>
    );
};

export default Footer;