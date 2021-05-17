import React, { useState, useEffect } from 'react';
import { Button } from '../components/buttons'
import { Input } from '../components/inputs'
import { Label } from '../components/labels'

export const ColumnToolBar = ({column, columnIndex, tableId, handleColumnLabelChange, deleteColumn}) => {

	const [formula, setFormula] = useState('')
	const [formulaVariables, setFormulaVariables] = useState([])
	const [hasIllegalChar, setHasIllegalChar] = useState(false)

	const numerics = '0123456789'
	const symbols = ["(", ")", "+", "-", "*", "/", ".", " "]
	const alphabet = "abcdefghijklmnopqrstuvwxyz"

	useEffect(() => {
		formulaVariables.forEach(char => {
			if(!Array.from(formula).includes(char)) {
				let redacted = formulaVariables.filter(item => item !== char)
				setFormulaVariables(redacted);
			}
		})
		Array.from(formula).forEach(char => {
			if(alphabet.includes(char) && !formulaVariables.includes(char)) {
				setFormulaVariables(oldArray => [...oldArray, char]);
			}
		})
	}, [formula])

	return (
		<>
			{/* Column type */}
			<div className="flex">
				<Label text={`Column Type:`} color={'indigo'}/>
				{formula && <Label text={'Formula'} color={'yellow'}/>}
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

			{/* formula */}
			<div className="mb-4">
				<Input 
					placeholder={'(2 * x) / y'}
					label={"Column Formula:"} 
					value={formula} 
					onChange={(e) => setFormula(e.target.value)}
					/>
			</div>

			{/* formula variables*/}
			{formulaVariables.map(variable => {
					return <div className="mb-4">
					<Label text={`${variable} =`} color={'indigo'}/>
				</div>
			})}
			
			{/* delete table */}
			<div>
				<Button onClick={() => deleteColumn(column.id)} text="Delete Column" color="red"/>
			</div>
			
		</>
	)
}