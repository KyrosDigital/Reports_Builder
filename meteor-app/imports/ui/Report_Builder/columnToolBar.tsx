import React, { useState, useEffect } from 'react';
import { Button } from '../components/buttons'
import { Input } from '../components/inputs'
import { Label } from '../components/labels'

export const ColumnToolBar = ({column, columnIndex, tableId, handleColumnLabelChange, deleteColumn}) => {

	const [formula, setFormula] = useState('')

	return (
		<>
			{/* Column type */}
			<div className="flex">
				<Label text={`Column Type:`} color={'indigo'}/>
			</div>

			{/* Column label */}
			<div className="mb-4">
				<Input 
					placeholder={'Enter column header'}
					label={"Column Header:"} 
					value={column.label} 
					onChange={(e) => handleColumnLabelChange(tableId, columnIndex, e.target.value)}
					/>
			</div>

			{/* Add formula */}
			<div className="mb-4">
				<Input 
					placeholder={'(2 * x) / y'}
					label={"Column Formula:"} 
					value={formula} 
					onChange={(e) => setFormula(e.target.value)}
					/>
			</div>
			
			{/* delete table */}
			<div>
				<Button onClick={() => deleteColumn(column.id)} text="Delete Column" color="red"/>
			</div>
			
		</>
	)
}