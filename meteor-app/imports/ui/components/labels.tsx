import React, { useState, useEffect } from 'react';

export const Label = ({text, color}) => {
	return (
		<>
			<div className="mb-3 pt-0">
				<span className={`text-xs font-semibold inline-block py-1 px-2 rounded text-${color}-600 bg-${color}-200 last:mr-0 mr-1 mb-2`}>
					{text}
				</span>
			</div>
		</>
		
	)
}