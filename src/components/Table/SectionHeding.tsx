import { cn } from '@/utils/cn';

interface SectionHedingProps {
    title: string;
    description?: string;
    className?: string;
    isRequired?: boolean;
}

export const SectionHeding = ({
    title,
    description,
    className,
    isRequired = false,
}: SectionHedingProps) => {
    return (
        <div className={cn("", className)}>
            <h2 className="text-lg font-semibold text-gray-900 mt-0 mb-1">
                {title}
                {isRequired && <span className="text-red-500 ml-1">*</span>}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
                {description}
            </p>
        </div>
    );
};

export default SectionHeding;