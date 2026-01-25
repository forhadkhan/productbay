import { StepHeading } from './StepHeading';

interface StepProps {
    showValidation?: boolean;
}

const StepDesign = ({ showValidation }: StepProps) => {
    return (
        <div className="grid grid-cols-2 gap-8 h-full">
            <div className="space-y-6 overflow-y-auto pr-4">
                <StepHeading title="Design Settings" />
                <div>
                    <label className="block text-sm font-medium mb-2">Border Color</label>
                    <div className="flex gap-2">
                        {['#e5e7eb', '#d1d5db', '#9ca3af', '#2563eb'].map(c => (
                            <button key={c} className="w-8 h-8 rounded-full border shadow-sm" style={{ backgroundColor: c }} />
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Header Background</label>
                    <div className="flex gap-2">
                        {['#f9fafb', '#f3f4f6', '#eff6ff', '#f0fdf4'].map(c => (
                            <button key={c} className="w-8 h-8 rounded-md border shadow-sm" style={{ backgroundColor: c }} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-gray-400">Live Preview Area</div>
            </div>
        </div>
    );
};

export default StepDesign;
