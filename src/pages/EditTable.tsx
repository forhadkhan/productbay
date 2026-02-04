import { useParams, useNavigate } from 'react-router-dom';
import { useTableStore } from '@/store/tableStore';
import { Stepper } from '@/components/ui/Stepper';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/utils/api';
import { PATHS } from '@/utils/routes';
import { __ } from '@wordpress/i18n';
import {
	SaveIcon,
	ChevronRightIcon,
	ChevronLeftIcon,
	LayoutIcon,
	ListIcon,
	DatabaseIcon,
	SettingsIcon,
	SearchIcon,
	PaletteIcon,
	ZapIcon,
	CheckCircleIcon,
} from 'lucide-react';

// Step Components
import StepSetup from '@/components/Table/sections/StepSetup';
import StepSource from '@/components/Table/sections/StepSource';
import StepSearch from '@/components/Table/sections/StepSearch';
import StepDesign from '@/components/Table/sections/StepDesign';
import StepColumns from '@/components/Table/sections/StepColumns';
import StepOptions from '@/components/Table/sections/StepOptions';
import StepPublish from '@/components/Table/sections/StepPublish';
import StepPerformance from '@/components/Table/sections/StepPerformance';

/**
 * Step configuration for table creation/editing wizard
 * Each step has an id, translatable label, icon, and component
 */
const STEPS = [
	{ id: 1, label: __('Setup', 'productbay'), icon: LayoutIcon, component: StepSetup },
	{ id: 2, label: __('Source', 'productbay'), icon: DatabaseIcon, component: StepSource },
	{ id: 3, label: __('Columns', 'productbay'), icon: ListIcon, component: StepColumns },
	{ id: 4, label: __('Options', 'productbay'), icon: SettingsIcon, component: StepOptions },
	{ id: 5, label: __('Search', 'productbay'), icon: SearchIcon, component: StepSearch },
	{ id: 6, label: __('Design', 'productbay'), icon: PaletteIcon, component: StepDesign },
	{ id: 7, label: __('Performance', 'productbay'), icon: ZapIcon, component: StepPerformance },
	{ id: 8, label: __('Publish', 'productbay'), icon: CheckCircleIcon, component: StepPublish },
];

/**
 * EditTable Page Component
 *
 * Wizard/tab interface for creating new tables or editing existing ones.
 * In wizard mode (no existing tables): shows step-by-step flow
 * In editor mode (existing tables): shows tab navigation
 */
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
		fetchSourceStats,
		sourceStats,
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
		// Step 1: Validate table title
		if (currentStep === 1 && !tableData.title.trim()) {
			setShowValidation(true);
			return;
		}

		// Step 2: Validate source selection
		if (currentStep === 2) {
			const { source_type, config } = tableData;

			// All products source requires at least one product in store
			if (
				source_type === 'all' &&
				(sourceStats['all']?.products || 0) === 0
			) {
				setShowValidation(true);
				return;
			}

			// Sale products source requires at least one sale product
			if (
				source_type === 'sale' &&
				(sourceStats['sale']?.products || 0) === 0
			) {
				setShowValidation(true);
				return;
			}

			// Category source requires at least one category selected
			if (
				source_type === 'category' &&
				(!config.categories || config.categories.length === 0)
			) {
				setShowValidation(true);
				return;
			}

			// Specific products source requires at least one product selected
			if (
				source_type === 'specific' &&
				(!config.products || config.products.length === 0)
			) {
				setShowValidation(true);
				return;
			}
		}

		setShowValidation(false);
		setStep(Math.min(8, currentStep + 1));
	};

	const handleSave = async () => {
		const success = await saveTable();
		if (success) {
			alert(__('Table saved successfully!', 'productbay'));
			navigate(PATHS.DASHBOARD);
		} else {
			alert(__('Failed to save table', 'productbay'));
		}
	};

	const isWizardMode = !id && (totalTables === 0 || totalTables === null);

	// Render Logic
	const CurrentStepComponent =
		STEPS.find((s) => s.id === currentStep)?.component || StepSetup;

	// --- Layout Components ---

	const WizardStepper = () => (
		<div className="max-w-4xl mx-auto mb-8 px-4">
			<div className="text-center mb-10">
				<h1 className="text-2xl font-bold text-slate-800">
					{id
						? __('Setup your Product Table', 'productbay')
						: __('Setup your first Product Table', 'productbay')
					}
				</h1>
			</div>
			<Stepper
				steps={STEPS.map((s) => s.label)}
				currentStep={currentStep}
				onStepClick={(index) => {
					const stepId = index + 1;
					// Allow navigation to previous completed steps
					if (stepId < currentStep) {
						setStep(stepId);
					}
				}}
			/>
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
		<div
			className={`min-h-[calc(100vh-100px)] -m-8 ${isWizardMode ? 'p-8' : 'bg-gray-50'
				}`}
		>
			{ /* Conditional Navigation */}
			{isWizardMode ? <WizardStepper /> : <TabNavigation />}

			{ /* Main Content Area */}
			<main
				className={`${isWizardMode ? 'max-w-4xl mx-auto' : 'p-8 max-w-7xl mx-auto'
					}`}
			>
				<div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 p-8 min-h-[500px] relative transition-all duration-500">
					{ /* Step Title for Editor Mode */}
					{!isWizardMode && (
						<div className="mb-6 pb-6 border-b border-gray-100 flex justify-between items-center">
							<h2 className="text-xl font-bold text-gray-800">
								{STEPS[currentStep - 1].label}
							</h2>
							<div className="flex gap-2">
								<button
									onClick={handleSave}
									className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 text-sm font-medium"
								>
									<SaveIcon size={16} /> {__('Save Changes', 'productbay')}
								</button>
							</div>
						</div>
					)}

					<div className="flex-1">
						<CurrentStepComponent
							showValidation={showValidation}
						/>
					</div>

					{ /* Wizard Footer Navigation */}
					{isWizardMode && (
						<div className="mt-8 pt-6 flex justify-between items-center">
							<Button
								onClick={() => {
									if (currentStep === 1)
										navigate(PATHS.DASHBOARD);
									else setStep(currentStep - 1);
								}}
								className="cursor-pointer"
								variant="outline"
								size="default"
							>
								{currentStep === 1 ? (
									<span className="flex items-center gap-2">
										<ChevronLeftIcon size={18} /> {__('Back to Dashboard', 'productbay')}
									</span>
								) : (
									<span className="flex items-center gap-2 ">
										<ChevronLeftIcon size={18} /> {__('Previous Step', 'productbay')}
									</span>
								)}
							</Button>

							{currentStep < 8 ? (
								<Button
									className="cursor-pointer"
									onClick={handleNext}
									variant="default"
									size="default"
								>
									<span className="flex items-center gap-2">
										{__('Next Step', 'productbay')}{' '}
										<ChevronRightIcon size={18} />
									</span>
								</Button>
							) : (
								<Button
									className="cursor-pointer"
									onClick={handleSave}
									variant="success"
									size="default"
								>
									<span className="flex items-center gap-2">
										<SaveIcon size={18} /> {__('Finish & Publish', 'productbay')}
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
