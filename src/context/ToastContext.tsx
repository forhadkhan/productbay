/**
 * ToastContext
 * 
 * Provides a global notification system for the application.
 * Allows components to trigger success, error, or info toasts.
 * 
 * @since 1.0.0
 */
import { ToastType } from '@/components/ui/Toast';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ToastData {
    id: string;
    title: string;
    description?: string;
    type?: ToastType;
    duration?: number;
}

interface ToastContextType {
    toasts: ToastData[];
    toast: (data: Omit<ToastData, 'id'>) => void;
    dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const toast = useCallback((data: Omit<ToastData, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { ...data, id }]);
    }, []);

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, toast, dismiss }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
