import React, { useState, useEffect } from 'react';
import { Button } from '../components/buttons'
import { Input } from '../components/inputs'
import { Label } from '../components/labels'
import { DataPicker } from '../components/dataPicker';
import { Report_Data } from '../../api/collections'
import toast from 'react-hot-toast';

export const ColumnToolBar = ({
	column, columnIndex, tableId, 
	handleColumnLabelChange, handleColumnPropertyChange,
	handleFormulaUpdate, handleFormulaRemoval, columnFormula,
	deleteColumn, userCollections
}) => {

	const [formulaString, setFormulaString] = useState('')
	const [formulaVariables, setFormulaVariables] = useState([])
	const [formulaValues, setFormulaValues] = useState([])
	const alphabet = "abcdefghijklmnopqrstuvwxyz"

	// preload data from loaded report structure
	useEffect(() => {
		if(columnFormula) {
			setFormulaString(columnFormula.expression)
			setFormulaValues(columnFormula.values)

			const mapVariableArray = columnFormula.values.map(value => {
				// TODO:
				const query = Report_Data.findOne({
					// "accountId" : "60958c98857a7b14acb156d9", TODO:
					"collection_name": value.collection_name
				})
				return {
					char: value.key, 
					collection_name: value.collection_name,
					keys: query ? Object.keys(query) : [],
					selectedKey: value.property,
					queryModifier: value.queryModifier
				}
			})
			setFormulaVariables(mapVariableArray)
		} else { // handles toggling between columns, if one has a formula and one does not
			setFormulaString('')
			setFormulaValues([])
			setFormulaVariables([])
		}
	}, [columnFormula])

	// if the formula string, or formula values change
	useEffect(() => {
		formulaVariables.forEach(variable => {
			if(!Array.from(formulaString).includes(variable.char)) {
				let redacted = formulaVariables.filter(item => item.char !== variable.char)
				setFormulaVariables(redacted);
			}
		})
		Array.from(formulaString).forEach(char => {
			if(alphabet.includes(char) && formulaVariables.filter(variable => variable.char === char).length === 0) {
				setFormulaVariables(oldArray => [...oldArray, { char: char, collection_name: null, keys: [], slectedKey: null, queryModifier: null }]);
			}
		})

	}, [formulaString, formulaValues])

	// If formula variable state changes
	useEffect(() => {
		const values = formulaVariables.map(variable => {
			return {
				key: variable.char,
				type: 'query', // TODO:
				operation: 'sum', // TODO: 
				collection_name: variable.collection_name || null,
				queryModifier: variable.queryModifier,
				// TODO:
				query: {
					// "accountId": "60958c98857a7b14acb156d9", // TODO:
					"collection_name": variable.collection_name
				},
				property: variable.selectedKey || null
			}
		})
		setFormulaValues(values)
	}, [formulaVariables])

	const handleSelectCollectionForVariable = (collection_name, i) => {
		// TODO: 
		const query = Report_Data.findOne({
			// "accountId" : "60958c98857a7b14acb156d9", TODO:
			"collection_name": collection_name
		})
		setFormulaVariables(prevState => {
			prevState[i].collection_name = collection_name
			prevState[i].keys = Object.keys(query)
			return [...prevState]
		});
	}

	const handleSelectedKey = (key, i) => {
		setFormulaVariables(prevState => {
			prevState[i].selectedKey = key
			return [...prevState]
		});
	}

	const handleSelectedQueryModifier = (key, i) => {
		setFormulaVariables(prevState => {
			prevState[i].queryModifier = key
			return [...prevState]
		});
		// we also need to corespond the query modifier to the column property
		handleColumnPropertyChange(tableId, columnIndex, key)
	}

	// NOTE: we must save formula by click for time being.
	// the way the data is passed back and forth, it prevent us from being able to 
	// update on click or type, and being able to toggle between columns, and have the data be accurate
	// if you call handleFormulaUpdate within the useEffect for [formulaString, formulaValues],
	// you'll see what I mean. 
	const saveFormula = () => {
		handleFormulaUpdate({ // update report structure here
			tableId: tableId, columnId: column.id, columnIndex: columnIndex,
			expression: formulaString, values: formulaValues
		})
		toast.success('Formula Saved!')
	}

	const removeFormula = () => {
		handleFormulaRemoval(tableId, columnIndex, column.id)
		handleColumnPropertyChange(tableId, columnIndex, '')
		setFormulaString('')
		setFormulaValues([])
		setFormulaVariables([])
		toast.success('Formula Removed!')
	}

	return (
		<>
			{/* Column type */}
			<div className="flex">
				<Label text={`Column Type:`} color={'indigo'}/>
				{formulaString && <Label text={'Formula'} color={'yellow'}/>}
				{column.property && <Label text={'Property'} color={'yellow'}/>}
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

			{/* Column property - if no formula */}
			{!formulaString &&
				<div className="mb-4">
					<Input 
						placeholder={'Enter column property'}
						label={"Column Property:"} 
						value={column.property} 
						onChange={(e) => handleColumnPropertyChange(tableId, columnIndex, e.target.value)}
						/>
				</div>
			}

			{/* formula - if no property*/}
			{!column.property && 
				<div className="mb-4">
					<Input 
						placeholder={'(2 * x) / y'}
						label={"Column Formula:"} 
						value={formulaString} 
						onChange={(e) => setFormulaString(e.target.value.toLowerCase())}
						/>
				</div>
			}

			{/* formula variables*/}
			{formulaVariables.map((variable, i) => {

				let label = `${variable.char}`
				if (variable.collection_name) label = `${variable.char} = ${variable.collection_name}`
				if (variable.selectedKey) label = `${variable.char} = ${variable.collection_name}.${variable.selectedKey}`

				return <div className="mb-4" key={i}>
					<Label text={label} color={'indigo'}/>
					{!variable.collection_name && userCollections.map((collection_name, y) => {
						return <Button key={y} onClick={() => handleSelectCollectionForVariable(collection_name, i)} text={collection_name} color="green" />
					})}
					{!variable.selectedKey && variable.keys.map((key, x) => {
						return <Button key={x} onClick={() => handleSelectedKey(key, i)} text={key} color="green"/>
					})}
				</div>
			})}

			{/* formula data query modifiers  */}
			{formulaVariables.map((variable, i) => {
				let label = `${variable.char} filter:`
				if(variable.queryModifier) label = `${variable.char} filter: ${variable.queryModifier}`

				return <div className="mb-4" key={i}>
					<Label text={label} color={'indigo'}/>
					{!variable.queryModifier && variable.keys.map((key, x) => {
						return <Button key={x} onClick={() => handleSelectedQueryModifier(key, i)} text={key} color="green"/>
					})}
				</div>
			})}
			
			{/* Save formula */}
			{formulaString && 
				<div className="flex">
					<Button onClick={() => saveFormula()} text={'Save Formula'} color="blue"/>
					<Button onClick={() => removeFormula()} text={'Remove Formula'} color="blue"/>
				</div>
			}
			

			{/* delete table */}
			<div>
				<Button onClick={() => deleteColumn(tableId, columnIndex)} text="Delete Column" color="red"/>
			</div>
			
		</>
	)
}