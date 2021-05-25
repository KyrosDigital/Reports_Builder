import React, { createRef } from 'react'

export const Tooltip = ({ children, tooltipText }) => {
	const tipRef = createRef(null);
	function handleMouseEnter() {
		tipRef.current.style.opacity = 1;
		tipRef.current.style.marginLeft = "20px";
	}
	function handleMouseLeave() {
		tipRef.current.style.opacity = 0;
		tipRef.current.style.marginLeft = "10px";
	}
	return (
		<div
			className="relative flex items-center"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<div
				className="absolute whitespace-no-wrap bg-gradient-to-r from-indigo-900 to-indigo-500 text-white text-xs px-4 py-2 rounded flex items-center transition-all duration-150"
				style={{ bottom: "100%", opacity: 0 }}
				ref={tipRef}
			>
				<div
					className="bg-indigo-900 h-3 w-3 absolute "
					style={{ bottom: "-6px", transform: "rotate(45deg)" }}
				/>
				{tooltipText}
			</div>
			{children}
		</div>
	);
}