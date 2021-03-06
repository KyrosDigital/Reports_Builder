import React, { useState, useEffect } from 'react';

export const Button = ({onClick, text, color}) => {
	return (
		<button onClick={onClick}
			className={`flex bg-${color}-500 text-white active:bg-${color}-600 font-bold text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 cursor-pointer`} 
			type="button"
		>
		{text}
		</button>
	)
}