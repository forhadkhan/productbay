import React, { useEffect } from 'react';
import { Check, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
    id: string;
    title: string;
    description?: string;
    type?: ToastType;
    duration?: number;
    onDismiss: (id: string) => void;
}

const icons = {
    success: <Check className="w-5 h-5 text-white" />,
    error: <XCircle className="w-5 h-5 text-white" />,
    info: <Info className="w-5 h-5 text-white" />,
    warning: <AlertTriangle className="w-5 h-5 text-white" />,
};

const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-amber-500',
};

export const Toast: React.FC<ToastProps> = ({
    id,
    title,
    description,
    type = 'info',
    duration = 5000,
    onDismiss,
}) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onDismiss(id);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [id, duration, onDismiss]);

    return (
        <div
            className={cn(
                'flex items-start gap-3 p-4 bg-white rounded-lg shadow-lg border border-gray-100 min-w-[320px] max-w-sm transition-all animate-in slide-in-from-right-full duration-300 relative pointer-events-auto'
            )}
            role="alert"
        >
            {/* Icon Box */}
            <div className={cn('flex-shrink-0 p-1 rounded-full', bgColors[type])}>
                {icons[type]}
            </div>

            {/* Content */}
            <div className="flex-1 mt-0.5">
                <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                {description && (
                    <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                        {description}
                    </p>
                )}
            </div>

            {/* Close Button */}
            <button
                onClick={() => onDismiss(id)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
            >
                <X size={18} />
            </button>
        </div>
    );
};
