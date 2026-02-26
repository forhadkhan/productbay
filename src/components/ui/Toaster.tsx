import React from 'react';
import { Toast } from './Toast';
import { useToast } from '../../context/ToastContext';

export const Toaster: React.FC = () => {
    const { toasts, dismiss } = useToast();

    return (
        <div className="fixed bottom-4 right-4 z-[99999] flex flex-col-reverse gap-3 pointer-events-none">
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
