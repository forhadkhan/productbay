import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SaveIcon, ChevronRightIcon, ChevronLeftIcon, LayoutIcon, ListIcon, DatabaseIcon, SettingsIcon, SearchIcon, PaletteIcon, ZapIcon, CheckCircleIcon } from 'lucide-react';
import { apiFetch } from '../utils/api';
import { PATHS } from '../utils/routes';
import { Button } from '../components/ui/Button';
import { useTableStore } from '../store/tableStore';

// Step Components
import StepSetup from '../components/Create/StepSetup';
import StepSource from '../components/Create/StepSource';
import StepColumns from '../components/Create/StepColumns';
import StepOptions from '../components/Create/StepOptions';
import StepSearch from '../components/Create/StepSearch';
import StepDesign from '../components/Create/StepDesign';
import StepPerformance from '../components/Create/StepPerformance';
import StepPublish from '../components/Create/StepPublish';

const STEPS = [
    { id: 1, label: 'Setup', icon: LayoutIcon, component: StepSetup },
    { id: 2, label: 'Source', icon: DatabaseIcon, component: StepSource },
    { id: 3, label: 'Columns', icon: ListIcon, component: StepColumns },
    { id: 4, label: 'Options', icon: SettingsIcon, component: StepOptions },
    { id: 5, label: 'Search', icon: SearchIcon, component: StepSearch },
    { id: 6, label: 'Design', icon: PaletteIcon, component: StepDesign },
    { id: 7, label: 'Performance', icon: ZapIcon, component: StepPerformance },
    { id: 8, label: 'Publish', icon: CheckCircleIcon, component: StepPublish },
];

const EditTable = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Zustand Store
    const {
        currentStep,
        setStep,
        loadTable,
        saveTable,
        resetStore,
        tableData,
        fetchSourceStats
    } = useTableStore();

    const [totalTables, setTotalTables] = useState<number | null>(null);
    const [showValidation, setShowValidation] = useState(false);

    // Initial load logic
    useEffect(() => {
        resetStore(); // Reset store on mount

        if (id) {
            loadTable(parseInt(id));
        }

        const checkTableCount = async () => {
            if (!id) {
                try {
                    const status = await apiFetch<any>('system/status');
                    setTotalTables(status.table_count);
                } catch (e) {
                    console.error(e);
                    // Fallback to wizard if check fails or returns 0
                    setTotalTables(0);
                }
            }
        };
        checkTableCount();

        /**
         * Preload source statistics for 'all' and 'sale' sources
         * 
         * Similar to category preloading, this ensures statistics are ready
         * before the user selects these sources, providing instant display.
         * Stats are fetched in parallel with other initialization.
         */
        fetchSourceStats('all');
        fetchSourceStats('sale');
    }, [id]);

    const handleNext = () => {
        if (currentStep === 1 && !tableData.title.trim()) {
            setShowValidation(true);
            return;
        }

        setShowValidation(false);
        setStep(Math.min(8, currentStep + 1));
    };

    const handleSave = async () => {
        const success = await saveTable(id);
        if (success) {
            alert('Table saved successfully!');
            navigate(PATHS.DASHBOARD);
        } else {
            alert('Failed to save table');
        }
    };

    const isWizardMode = !id && (totalTables === 0 || totalTables === null);

    // Render Logic
    const CurrentStepComponent = STEPS.find(s => s.id === currentStep)?.component || StepSetup;

    // --- Layout Components ---

    const WizardStepper = () => (
        <div className="max-w-4xl mx-auto mb-8 px-4">
            <div className="text-center mb-10">
                <h1 className="text-2xl font-bold text-slate-800">Setup your {id ? '' : 'first '}Product Table</h1>
            </div>
            <div className="flex justify-between relative px-2">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 -mt-3" />
                {STEPS.map((step, index) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;
                    return (
                        <div key={step.id} className="relative z-0 group text-center flex-1">
                            <button
                                onClick={() => isCompleted && setStep(step.id)}
                                disabled={!isCompleted && !isActive}
                                className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto transition-all border-2
                                    ${isActive
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-110'
                                        : isCompleted
                                            ? 'bg-green-500 border-green-500 text-white cursor-pointer'
                                            : 'bg-white border-gray-300 text-gray-400'
                                    }`}
                            >
                                {isCompleted ? <CheckCircleIcon size={18} /> : <span>{step.id}</span>}
                            </button>
                            <div className={`mt-2 text-xs font-medium uppercase tracking-wide transition-colors ${isActive ? 'text-blue-600 font-bold' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                                {step.label}
                            </div>
                            {/* Progress Bar Segment */}
                            {index !== STEPS.length - 1 && (
                                <div
                                    className={`absolute top-5 left-1/2 w-full h-0.5 -z-10 transition-all duration-300 origin-left
                                        ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const TabNavigation = () => (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-20 px-8 flex items-center gap-1 shadow-sm overflow-x-auto">
            {STEPS.map((step) => {
                const isActive = currentStep === step.id;
                const Icon = step.icon;
                return (
                    <button
                        key={step.id}
                        onClick={() => setStep(step.id)}
                        className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                            ${isActive
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <Icon size={16} />
                        {step.label}
                    </button>
                );
            })}
        </div>
    );

    return (
        <div className={`min-h-[calc(100vh-100px)] -m-8 ${isWizardMode ? 'p-8' : 'bg-gray-50'}`}>

            {/* Conditional Navigation */}
            {isWizardMode ? <WizardStepper /> : <TabNavigation />}

            {/* Main Content Area */}
            <main className={`${isWizardMode ? 'max-w-4xl mx-auto' : 'p-8 max-w-7xl mx-auto'}`}>
                <div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 p-8 min-h-[500px] relative transition-all duration-500">

                    {/* Step Title for Editor Mode */}
                    {!isWizardMode && (
                        <div className="mb-6 pb-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">{STEPS[currentStep - 1].label}</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 text-sm font-medium"
                                >
                                    <SaveIcon size={16} /> Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex-1">
                        <CurrentStepComponent showValidation={showValidation} />
                    </div>

                    {/* Wizard Footer Navigation */}
                    {isWizardMode && (
                        <div className="mt-8 pt-6 flex justify-between items-center">
                            <Button
                                onClick={() => {
                                    if (currentStep === 1) navigate(PATHS.DASHBOARD);
                                    else setStep(currentStep - 1);
                                }}
                                variant="outline"
                                size="default"
                            >
                                {currentStep === 1 ? (
                                    <span className="flex items-center gap-2">
                                        <ChevronLeftIcon size={18} /> Back to Dashboard
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <ChevronLeftIcon size={18} /> Previous Step
                                    </span>
                                )}
                            </Button>

                            {currentStep < 8 ? (
                                <Button
                                    onClick={handleNext}
                                    variant="default"
                                    size="default"
                                >
                                    <span className="flex items-center gap-2">
                                        Next Step <ChevronRightIcon size={18} />
                                    </span>
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSave}
                                    variant="success"
                                    size="default"
                                >
                                    <span className="flex items-center gap-2">
                                        <SaveIcon size={18} /> Finish & Publish
                                    </span>
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default EditTable;
