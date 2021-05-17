import React, { useState, useEffect } from 'react';

export const Button = ({onClick, text, color}) => {
	return (
		<button onClick={onClick}
			className={`bg-${color}-500 text-white active:bg-${color}-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`} 
			type="button"
		>
		{text}
		</button>
	)
}