import React, { useState, useEffect } from 'react';
import { Button } from '../components/buttons'
import { Input } from '../components/inputs'
import { Label } from '../components/labels'
import { StrapiClientDataCollection } from '../../api/collections'

export const ColumnToolBar = ({column, columnIndex, tableId, handleColumnLabelChange, deleteColumn, userCollections}) => {

	const [formula, setFormula] = useState('')
	const [formulaVariables, setFormulaVariables] = useState([])
	const [hasIllegalChar, setHasIllegalChar] = useState(false)

	const numerics = '0123456789'
	const symbols = ["(", ")", "+", "-", "*", "/", ".", " "]
	const alphabet = "abcdefghijklmnopqrstuvwxyz"

	useEffect(() => {
		formulaVariables.forEach(variable => {
			if(!Array.from(formula).includes(variable.char)) {
				let redacted = formulaVariables.filter(item => item.char !== variable.char)
				setFormulaVariables(redacted);
			}
		})
		Array.from(formula).forEach(char => {
			if(alphabet.includes(char) && formulaVariables.filter(variable => variable.char === char).length === 0) {
				setFormulaVariables(oldArray => [...oldArray, {char: char, collectionName: null, keys: [], slectedKey: null}]);
			}
		})
	}, [formula])

	// useEffect(() => {
	// 	console.log(formulaVariables)
	// }, [formulaVariables])

	const handleSelectCollectionForVariable = (collectionName, i) => {
		const query = StrapiClientDataCollection.findOne({"userId" : "60958c98857a7b14acb156d9", "collectionName" : collectionName}, {fields : {"collectionName" : 1, "data" : 1}})
		setFormulaVariables(prevState => {
			prevState[i].collectionName = collectionName
			prevState[i].keys = Object.keys(query.data)
			return [...prevState]
		});
	}

	const handleSelectedKey = (key, i) => {
		setFormulaVariables(prevState => {
			prevState[i].selectedKey = key
			return [...prevState]
		});
	}

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
			{formulaVariables.map((variable, i) => {
				
				let label = `${variable.char}`
				if(variable.collectionName) label = `${variable.char} = ${variable.collectionName}`
				if(variable.selectedKey) label = `${variable.char} = ${variable.collectionName}.${variable.selectedKey}`

				return <div className="mb-4" key={i}>
					<Label text={label} color={'indigo'}/>
					{!variable.collectionName && userCollections.map((collection, y) => {
						return <Button key={y} onClick={() => handleSelectCollectionForVariable(collection.collectionName, i)} text={collection.collectionName} color="green"/>
					})}
					{!variable.selectedKey && variable.keys.map((key, x) => {
						return <Button key={x} onClick={() => handleSelectedKey(key, i)} text={key} color="green"/>
					})}
				</div>
			})}
			
			{/* delete table */}
			<div>
				<Button onClick={() => deleteColumn(column.id)} text="Delete Column" color="red"/>
			</div>
			
		</>
	)
}