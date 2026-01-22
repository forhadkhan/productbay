import React from 'react';
import { useToast } from '../../context/ToastContext';
import { Toast } from './Toast';

export const Toaster: React.FC = () => {
    const { toasts, dismiss } = useToast();

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
            {toasts.map((t) => (
                <Toast
                    key={t.id}
                    id={t.id}
                    title={t.title}
                    description={t.description}
                    type={t.type}
                    duration={t.duration}
                    onDismiss={dismiss}
                />
            ))}
        </div>
    );
};
