import React, { useState, useEffect } from 'react';

export const Input = ({ placeholder, value, onChange, onClick, onBlur, disabled, label, flex }) => {
	return (
		<div className={`${flex} mb-3 pt-0`} onClick={onClick}>
				{label && 
					<span className="whitespace-nowrap text-xs font-semibold inline-block py-1 px-2 rounded text-indigo-600 bg-indigo-200 last:mr-0 mr-1 mb-2">
						{label}
					</span>
				}
				<input 
					className="h-8 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full cursor-pointer"
					type="text" 
				placeholder={placeholder} value={value} onChange={onChange} onBlur={onBlur} disabled={disabled}
				/>
			</div>
		
	)
}