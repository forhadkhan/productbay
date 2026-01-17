import React from 'react';
import { cn } from '../../utils/cn';

interface StepHeadingProps {
    /**
     * The main title text or elements
     */
    title?: React.ReactNode;
    /**
     * Optional additional content (badges, icons, etc.)
     */
    children?: React.ReactNode;
    /**
     * Custom classes for styling
     */
    className?: string;
    /**
     * Whether to show a red asterisk indicating a required field
     */
    required?: boolean;
}

/**
 * A reusable heading component for wizard steps in the Table Creation process.
 * Standardizes typography and spacing across different steps.
 */
export const StepHeading: React.FC<StepHeadingProps> = ({
    title,
    children,
    className,
    required = false
}) => {
    return (
        <h3 className={cn(
            "font-bold text-blue-800 m-0 pb-6 flex items-center flex-wrap gap-2 leading-none",
            className
        )}>
            {title}
            {required && <span className="text-red-500 font-bold">*</span>}
            {children}
        </h3>
    );
};
