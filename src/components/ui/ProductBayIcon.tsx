import React from 'react';

interface ProductBayIconProps extends React.SVGProps< SVGSVGElement > {
	className?: string;
}

const ProductBayIcon: React.FC< ProductBayIconProps > = ( {
	className,
	...props
} ) => {
	return (
		<svg
			width="64"
			height="64"
			viewBox="0 0 64 64"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={ className }
			{ ...props }
		>
			<rect width="64" height="64" rx="16" fill="#F05C2A" />
			<path
				d="M42.0227 13.4282C46.7355 13.4282 50.5558 17.2487 50.5559 21.9614V42.228C50.5559 46.9409 46.7355 50.7612 42.0227 50.7612H21.7561C17.0433 50.7612 13.2229 46.9408 13.2229 42.228V21.9614C13.223 17.2487 17.0434 13.4283 21.7561 13.4282H42.0227ZM29.2258 46.4946H42.0227C44.3791 46.4946 46.2893 44.5844 46.2893 42.228V31.0278H29.2258V46.4946ZM17.4895 42.228C17.4895 44.5844 19.3997 46.4946 21.7561 46.4946H24.9592V31.0278H17.4895V42.228ZM29.2258 26.7612H46.2893V21.9614C46.2892 19.6051 44.3791 17.6948 42.0227 17.6948H29.2258V26.7612ZM21.7561 17.6948C19.3998 17.6949 17.4896 19.6051 17.4895 21.9614V26.7612H24.9592V17.6948H21.7561Z"
				fill="white"
			/>
		</svg>
	);
};

export const Icon = ProductBayIcon;
export default ProductBayIcon;
