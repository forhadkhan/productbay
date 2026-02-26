import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Props for the Stepper component.
 */
interface StepperProps {
	/** Array of step labels to display */
	steps: string[];
	/** Current active step (1-indexed) */
	currentStep: number;
	/** Optional callback when a step is clicked. If provided, steps become interactive. */
	onStepClick?: (stepIndex: number) => void;
	/** Custom class names for internal elements */
	classNames?: {
		root?: string;
		column?: string;
		circle?: string;
		label?: string;
		barContainer?: string;
		bar?: string;
	};
}

/**
 * A horizontal stepper component with progress bars below each step.
 * Supports "completed", "active", and "pending" states.
 *
 * @example
 * <Stepper
 *   steps={['Setup', 'Source', 'Review']}
 *   currentStep={2}
 *   onStepClick={(i) => console.log(i)}
 * />
 */
export const Stepper: React.FC<StepperProps> = ({
	steps,
	currentStep,
	classNames,
	onStepClick,
}) => {
	return (
		<div className={cn('w-full py-4', classNames?.root)}>
			<div className="flex items-start w-full gap-2">
				{steps.map((step, index) => {
					const stepNum = index + 1;
					const isCompleted = stepNum < currentStep;
					const isActive = stepNum === currentStep;
					const isClickable = !!onStepClick;

					// Dynamic styles
					const circleState = isCompleted
						? 'bg-green-500 text-white'
						: isActive
							? 'bg-blue-600 text-white scale-110 shadow-md'
							: 'bg-gray-300 text-white';

					return (
						<div
							key={step}
							role={isClickable ? 'button' : 'presentation'}
							onClick={() =>
								isClickable &&
								onStepClick &&
								onStepClick(index)
							}
							className={cn(
								'group flex-1 flex flex-col items-center gap-1.5 p-2 rounded-xl transition-colors duration-200',
								isClickable &&
								'cursor-pointer hover:bg-gray-50',
								classNames?.column
							)}
						>
							{ /* Step Circle */}
							<div
								className={cn(
									'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm z-10',
									circleState,
									classNames?.circle
								)}
							>
								{isCompleted ? (
									<svg
										className="w-5 h-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={3}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M5 13l4 4L19 7"
										/>
									</svg>
								) : (
									<span className="text-base font-semibold">
										{stepNum
											.toString()
											.padStart(2, '0')}
									</span>
								)}
							</div>

							{ /* Step Label */}
							<div
								className={cn(
									'text-sm font-bold text-center leading-tight min-h-[40px] flex items-center transition-colors duration-200',
									isActive || isCompleted
										? 'text-gray-900'
										: 'text-gray-400',
									classNames?.label
								)}
							>
								{step}
							</div>

							{ /* Progress Bar Segment */}
							<div
								className={cn(
									'w-full h-1.5 rounded-full bg-gray-200 overflow-hidden',
									classNames?.barContainer
								)}
							>
								<div
									className={cn(
										'h-full transition-all duration-500 ease-in-out',
										isCompleted
											? 'bg-green-500 w-full'
											: 'bg-transparent w-0',
										classNames?.bar
									)}
								/>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

/**
 * An alternative horizontal stepper component that visually matches the requested design.
 * Features numbered/checked circles with connecting lines and labels below.
 */
export const Stepper2: React.FC<StepperProps> = ({
	steps,
	currentStep,
	classNames,
	onStepClick,
}) => {
	return (
		<div className={cn('w-full py-4 pb-8', classNames?.root)}>
			{/* Container needs space for absolute labels at the bottom */}
			<div className="flex items-center w-full justify-between relative px-2">
				{steps.map((step, index) => {
					const stepNum = index + 1;
					const isCompleted = stepNum < currentStep;
					const isActive = stepNum === currentStep;
					const isClickable = !!onStepClick;
					const isLast = index === steps.length - 1;

					return (
						<React.Fragment key={step}>
							{ /* Step Item */}
							<div className="relative flex flex-col items-center flex-shrink-0">
								{ /* Step Circle */}
								<div
									role={isClickable ? 'button' : 'presentation'}
									onClick={() =>
										isClickable &&
										onStepClick &&
										onStepClick(index)
									}
									className={cn(
										'w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm z-10 font-bold',
										isCompleted
											? 'bg-green-500 text-white'
											: isActive
												? 'bg-blue-600 text-white shadow-md'
												: 'bg-gray-200 text-gray-500',
										isClickable &&
										'cursor-pointer hover:opacity-90 hover:scale-105',
										classNames?.circle
									)}
								>
									{isCompleted ? (
										<svg
											className="w-6 h-6"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth={2.5}
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M5 13l4 4L19 7"
											/>
										</svg>
									) : (
										<span className="text-lg">{stepNum}</span>
									)}
								</div>

								{ /* Step Label (absolute below) */}
								<div
									className={cn(
										'absolute top-[3.25rem] text-sm font-semibold whitespace-nowrap',
										isCompleted
											? 'text-green-500'
											: isActive
												? 'text-blue-600'
												: 'text-gray-400',
										classNames?.label
									)}
								>
									{step}
								</div>
							</div>

							{ /* Connecting Line (except for the last item) */}
							{!isLast && (
								<div
									className={cn(
										'flex-1 h-[3px] mx-4 rounded-full transition-colors duration-500',
										isCompleted ? 'bg-green-500' : 'bg-gray-200',
										classNames?.bar
									)}
								/>
							)}
						</React.Fragment>
					);
				})}
			</div>
		</div>
	);
};
